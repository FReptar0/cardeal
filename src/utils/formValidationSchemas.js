import * as yup from "yup";
import differenceInYears from "date-fns/differenceInYears";

const baseNameValidation = yup
  .string()
  .required("El nombre completo es obligatorio")
  .test(
    "has-lastname",
    "Debes ingresar al menos un nombre y un apellido",
    (value) => {
      if (!value) return false;
      const parts = value.trim().split(/\s+/);
      return parts.length >= 2 && parts[1].length > 0;
    }
  );

const baseBirthDateValidation = yup
  .date()
  .typeError(
    "Por favor, ingresa una fecha válida en el formato correcto (YYYY-MM-DD)"
  )
  .required("La fecha de nacimiento es obligatoria")
  .test(
    "is-adult",
    "Debes tener al menos 18 años para registrarte",
    (value) => {
      if (
        !value ||
        Object.prototype.toString.call(value) !== "[object Date]" ||
        isNaN(value.getTime())
      ) {
        return false;
      }
      return differenceInYears(new Date(), new Date(value)) >= 18;
    }
  );

const basePasswordValidation = yup
  .string()
  .required("La contraseña es obligatoria")
  .min(8, "Debe contener al menos 8 caracteres")
  .matches(/[a-z]/, "Debe contener al menos una letra minúscula")
  .matches(/[A-Z]/, "Debe contener al menos una letra mayúscula")
  .matches(/\d/, "Debe contener al menos un número");

export const createGuestSchema = () => {
  return yup.object().shape({
    fullName: baseNameValidation,
    phone: yup.string().required("El teléfono es obligatorio"),
    email: yup
      .string()
      .email("Correo inválido")
      .required("El correo es obligatorio"),
    confirmEmail: yup
      .string()
      .oneOf([yup.ref("email"), null], "Los correos no coinciden")
      .required("Confirma el correo electrónico"),
    birthDate: baseBirthDateValidation,
    terms: yup.boolean().oneOf([true], "Debes aceptar los términos"),
    privacy: yup
      .boolean()
      .oneOf([true], "Debes aceptar la política de privacidad"),
  });
};

export const createRegisteredSchema = (tokenIsInvalid) => {
  const baseSchema = {
    terms: yup.boolean().oneOf([true], "Debes aceptar los términos"),
    privacy: yup
      .boolean()
      .oneOf([true], "Debes aceptar la política de privacidad"),
  };

  if (tokenIsInvalid) {
    return yup.object().shape({
      ...baseSchema,
      fullName: baseNameValidation,
      phone: yup.string().required("El teléfono es obligatorio"),
      email: yup
        .string()
        .email("Correo inválido")
        .required("El correo es obligatorio"),
      birthDate: baseBirthDateValidation,
      password: basePasswordValidation,
      confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], "Las contraseñas no coinciden")
        .required("Confirma la contraseña"),
    });
  }

  return yup.object().shape(baseSchema);
};