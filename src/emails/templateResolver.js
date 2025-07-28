import verificationTemplate from './templates/verification';
import resetPasswordTemplate from './templates/resetPassword';
import reservationInfoTemplate from './templates/reservationInfo';
import crmContactTemplate from './templates/crmContact';

const templates = {
    "verify-account": {
        subject: 'Verificación de cuenta',
        templateFn: verificationTemplate,
    },
    "reset-password": {
        subject: 'Solicitud de restablecimiento de contraseña',
        templateFn: resetPasswordTemplate,
    },
    "reservation-info": {
        subject: 'Información de tu reserva',
        templateFn: reservationInfoTemplate,
    },
    "crm-contact": {
        subject: 'Nuevo contacto empresarial',
        templateFn: crmContactTemplate,
    },
};

export function getEmailData(templateId, data) {
    const tpl = templates[templateId];
    if (!tpl) {
        throw new Error('Plantilla no encontrada');
    }
    try {
        validateData(data, templateId);
    } catch (error) {
        console.error('Error de validación:', error.message);
        throw new Error(`Datos inválidos para la plantilla ${templateId}: ` + error);
    }
    return {
        subject: tpl.subject,
        template: tpl.templateFn(data)
    };
}

function validateData(data, templateId) {
    if (!data || typeof data !== 'object') {
        throw new Error('Los datos deben ser un objeto');
    }
    // Validación flexible según plantilla
    if (templateId === 'crm-contact') {
        if (!data.nombre || typeof data.nombre !== 'string' || !data.nombre.trim()) {
            throw new Error('El nombre es obligatorio y debe ser una cadena no vacía');
        }
        if (!data.email || typeof data.email !== 'string' || !data.email.trim()) {
            throw new Error('El email es obligatorio y debe ser una cadena no vacía');
        }
        if (!data.telefono || typeof data.telefono !== 'string' || !data.telefono.trim()) {
            throw new Error('El teléfono es obligatorio y debe ser una cadena no vacía');
        }
        if (!data.nombreEmpresa || typeof data.nombreEmpresa !== 'string' || !data.nombreEmpresa.trim()) {
            throw new Error('El nombre de la empresa es obligatorio y debe ser una cadena no vacía');
        }
        // rfc y mensaje son opcionales
    }
    if (data.name !== undefined && (typeof data.name !== 'string' || !data.name.trim())) {
        throw new Error('El nombre es obligatorio y debe ser una cadena no vacía');
    }
    if (data.url !== undefined && (typeof data.url !== 'string' || !data.url.trim())) {
        throw new Error('El enlace es obligatorio y debe ser una cadena no vacía');
    }
}
