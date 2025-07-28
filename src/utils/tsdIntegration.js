export const registrarReservaEnTSD = async ({
  bookingId,
  contactName,
  selectedCar,
  selectedInsurance,
  selectedExtras,
  searchData,
}) => {
  try {
    const res = await fetch("/api/bookings/registerReservation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pickupLocationId: searchData.pickupLocation?.id,
        returnLocationId: searchData.sameOffice
          ? searchData.pickupLocation?.id
          : searchData.returnLocation?.id,
        pickupDateTime: `${searchData.pickupDate} ${searchData.pickupTime}`,
        returnDateTime: `${searchData.returnDate} ${searchData.returnTime}`,
        classCode: selectedCar?.abbreviation,
        unitNumber: selectedCar?.unitNumber,
        renterFirst: contactName.split(" ")[0],
        renterLast: contactName.split(" ").slice(1).join(" "),
        extrasCodes: Object.values(selectedExtras)
          .filter((extra) => extra.cantidad > 0)
          .map((extra) => ({
            id: extra.id,
            cantidad: extra.cantidad,
          })),
        insuranceCode: selectedInsurance?.code || "",
        rateId: selectedCar?.rateId,
      }),
    });

    const tsdJson = await res.json();

    if (!res.ok) {
      throw new Error(tsdJson.message || "Error en la reserva con TSD");
    }

    return {
      success: true,
      confirmNum: tsdJson.PRE?.TRNXML?.ConfirmNum || null,
    };
  } catch (err) {
    console.error("❌ Error registrando en TSD:", err.message);
    return { success: false, error: err.message };
  }
};