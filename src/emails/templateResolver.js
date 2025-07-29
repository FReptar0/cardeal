import verificationTemplate from './templates/verification';
import resetPasswordTemplate from './templates/resetPassword';
import reservationInfoTemplate from './templates/reservationInfo';
import crmContactTemplate from './templates/crmContact';
import paymentFailureTemplate from './templates/paymentFailure';

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
    "payment-failure": {
        subject: 'Problema con tu pago - Qardeal',
        templateFn: paymentFailureTemplate,
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
    
    // Validación para payment-failure
    if (templateId === 'payment-failure') {
        if (!data.userName || typeof data.userName !== 'string' || !data.userName.trim()) {
            throw new Error('El nombre de usuario es obligatorio');
        }
        if (!data.reservationId || typeof data.reservationId !== 'string' || !data.reservationId.trim()) {
            throw new Error('El ID de reserva es obligatorio');
        }
        if (!data.carInfo || typeof data.carInfo !== 'object') {
            throw new Error('La información del vehículo es obligatoria');
        }
        if (!data.paymentAmount || typeof data.paymentAmount !== 'number') {
            throw new Error('El monto del pago es obligatorio');
        }
        if (!data.alternativePaymentUrl || typeof data.alternativePaymentUrl !== 'string') {
            throw new Error('La URL de pago alternativo es obligatoria');
        }
        if (!data.supportUrl || typeof data.supportUrl !== 'string') {
            throw new Error('La URL de soporte es obligatoria');
        }
    }
    
    // Validación para reservation-info
    if (templateId === 'reservation-info') {
        if (!data.url || typeof data.url !== 'string' || !data.url.trim()) {
            throw new Error('La URL de reserva es obligatoria');
        }
    }
    
    if (data.name !== undefined && (typeof data.name !== 'string' || !data.name.trim())) {
        throw new Error('El nombre es obligatorio y debe ser una cadena no vacía');
    }
    if (data.url !== undefined && (typeof data.url !== 'string' || !data.url.trim())) {
        throw new Error('El enlace es obligatorio y debe ser una cadena no vacía');
    }
}
