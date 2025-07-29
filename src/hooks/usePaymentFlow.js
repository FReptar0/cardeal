import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { encryptId } from '@/utils/encryption';
import { registrarReservaEnTSD } from '@/utils/tsdIntegration';

/**
 * Custom hook to manage the complete payment flow
 * Handles both online and counter payment processes
 */
export const usePaymentFlow = ({
  selectedCar,
  selectedInsurance, 
  selectedExtras,
  searchData,
  discount,
  calculateTotal
}) => {
  const router = useRouter();
  const { jwt, login } = useAuth();
  
  const [submitting, setSubmitting] = useState(false);
  const [submittingOnline, setSubmittingOnline] = useState(false);

  const processGuestBooking = useCallback(async (formData, isOnline) => {
    const contactName = formData.fullName;
    const contactEmail = formData.email;
    const contactPhone = formData.phone;

    // Register with TSD first
    const tsdResponse = await registrarReservaEnTSD({
      bookingId: null,
      contactName,
      selectedCar,
      selectedInsurance,
      selectedExtras,
      searchData,
    });

    if (!tsdResponse.success || !tsdResponse.confirmNum) {
      throw new Error(
        tsdResponse.error || "No se pudo registrar la reserva en TSD. Intenta de nuevo."
      );
    }

    // Create guest booking
    const response = await fetch("/api/bookings/createGuest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        selectedCar,
        selectedInsurance,
        selectedExtras,
        searchData,
        contactName,
        contactEmail,
        contactPhone,
        paid: false,
        paidOnline: isOnline,
        discount,
        tsdConfirmNum: tsdResponse.confirmNum,
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Error al crear la pre-reserva");
    }

    return result;
  }, [selectedCar, selectedInsurance, selectedExtras, searchData, discount]);

  const processRegisteredUserBooking = useCallback(async (formData, isOnline, token, contactData) => {
    // Create booking for registered user
    const response = await fetch("/api/bookings/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        selectedCar,
        selectedInsurance,
        selectedExtras,
        searchData,
        contactName: contactData.contactName,
        contactEmail: contactData.contactEmail,
        contactPhone: contactData.contactPhone,
        paid: false,
        paidOnline: isOnline,
        discount,
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Error al crear la pre-reserva");
    }

    return result;
  }, [selectedCar, selectedInsurance, selectedExtras, searchData, discount]);

  const processRegistration = useCallback(async (formData) => {
    // Register new user
    const registerResponse = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const registerResult = await registerResponse.json();
    if (!registerResponse.ok) {
      throw new Error(registerResult.message);
    }

    toast.success("Usuario registrado");

    // Login the new user
    const loginResponse = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        email: formData.email, 
        password: formData.password 
      }),
    });

    const loginResult = await loginResponse.json();
    if (!loginResponse.ok) {
      throw new Error("Error al iniciar sesión");
    }

    await login(loginResult.token);
    return loginResult.token;
  }, [login]);

  const processOnlinePayment = useCallback(async (bookingId, token) => {
    const order = String(bookingId);
    const reference = `${order}-${Date.now()}`;
    const amount = calculateTotal(true);

    const paymentResponse = await fetch("/api/create-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order,
        reference,
        amount,
        node: process.env.NEXT_PUBLIC_MP_NODE,
        concept: process.env.NEXT_PUBLIC_MP_CONCEPT,
      }),
    });

    if (!paymentResponse.ok) {
      const error = await paymentResponse.json();
      
      // Delete booking if payment initialization fails
      await fetch(`/api/bookings/${bookingId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      
      throw new Error(`Error iniciando pago: ${error.message}`);
    }

    const { action, fields } = await paymentResponse.json();
    
    // Create and submit payment form
    const form = document.createElement("form");
    form.method = "POST";
    form.action = action;
    form.target = "_top";
    
    Object.entries(fields).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });
    
    document.body.appendChild(form);
    form.submit();
  }, [calculateTotal]);

  const processCounterPayment = useCallback(async (bookingId, contactName, token) => {
    const tsdResponse = await registrarReservaEnTSD({
      bookingId,
      contactName,
      selectedCar,
      selectedInsurance,
      selectedExtras,
      searchData,
    });

    if (!tsdResponse.success) {
      throw new Error(
        tsdResponse.error || "La reserva fue registrada localmente, pero falló en TSD."
      );
    }

    if (tsdResponse.confirmNum) {
      await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ confirmNum: tsdResponse.confirmNum }),
      });
    }
  }, [selectedCar, selectedInsurance, selectedExtras, searchData]);

  const executePaymentFlow = useCallback(async (formData, isOnline, registeredMode, tokenIsInvalid, userData) => {
    const setSubmittingState = isOnline ? setSubmittingOnline : setSubmitting;
    setSubmittingState(true);

    try {
      let bookingResult;
      let token = jwt;
      let contactName, contactEmail, contactPhone;

      if (!registeredMode) {
        // Guest booking flow
        bookingResult = await processGuestBooking(formData, isOnline);
        const encryptedId = encryptId(bookingResult.bookingId);
        router.push(`/confirm/${encryptedId}`);
        return;
      }

      // Registered user flow
      let justRegistered = false;
      if (tokenIsInvalid) {
        token = await processRegistration(formData);
        justRegistered = true;
      }

      // Set contact data
      contactName = justRegistered ? formData.fullName : userData.fullName;
      contactEmail = justRegistered ? formData.email : userData.email;
      contactPhone = justRegistered ? formData.phone : userData.phone;

      // Create booking
      bookingResult = await processRegisteredUserBooking(
        formData, 
        isOnline, 
        token, 
        { contactName, contactEmail, contactPhone }
      );

      // Handle payment flow
      if (isOnline) {
        await processOnlinePayment(bookingResult.bookingId, token);
        return;
      } else {
        await processCounterPayment(bookingResult.bookingId, contactName, token);
      }

      // Redirect to confirmation
      const encryptedId = encryptId(bookingResult.bookingId);
      router.push(`/confirm/${encryptedId}`);

    } catch (error) {
      console.error('Payment flow error:', error);
      toast.error(error.message || "Error de conexión");
    } finally {
      setSubmittingState(false);
    }
  }, [
    jwt, 
    router, 
    processGuestBooking, 
    processRegisteredUserBooking, 
    processRegistration,
    processOnlinePayment,
    processCounterPayment
  ]);

  return {
    submitting,
    submittingOnline,
    executePaymentFlow
  };
};