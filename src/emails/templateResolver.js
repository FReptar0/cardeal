import verificationTemplate from './templates/verification';
import resetPasswordTemplate from './templates/resetPassword';

const templates = {
    "verify-account": {
        subject: 'Verificación de cuenta',
        templateFn: verificationTemplate,
    },
    "reset-password": {
        subject: 'Solicitud de restablecimiento de contraseña',
        templateFn: resetPasswordTemplate,
    },
};

export function getEmailData(templateId, data) {
    const tpl = templates[templateId];
    if (!tpl) {
        throw new Error('Plantilla no encontrada');
    }
    try {
        validateData(data);
        console.log(`Datos validados correctamente para la plantilla ${templateId}`);
    } catch (error) {
        console.error('Error de validación:', error.message);
        throw new Error(`Datos inválidos para la plantilla ${templateId}: ` + error);
    }
    return {
        subject: tpl.subject,
        template: tpl.templateFn(data)
    };
}

function validateData(data) {
    if (!data || typeof data !== 'object') {
        throw new Error('Los datos deben ser un objeto');
    }
    if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
        throw new Error('El nombre es obligatorio y debe ser una cadena no vacía');
    }
    if (!data.url || typeof data.url !== 'string' || !data.url.trim()) {
        throw new Error('El enlace es obligatorio y debe ser una cadena no vacía');
    }
}
