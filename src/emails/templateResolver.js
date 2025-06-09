import verificationTemplate from './templates/verification';
import resetPasswordTemplate from './templates/resetPassword';

export function getEmailData(templateId, data) {
    switch (templateId) {
        case "verify-account":
            try {
                validateData(data);
                console.log('Datos validados correctamente para la plantilla de verificación de cuenta');
            } catch (error) {
                console.error('Error de validación:', error.message);
                throw new Error('Datos inválidos para la plantilla de verificación de cuenta: ' + error);
            }
            return {
                subject: 'Verificación de cuenta',
                template: verificationTemplate(data)
            };
        case "reset-password":
            try {
                validateData(data);
                console.log('Datos validados correctamente para la plantilla de restablecimiento de contraseña');
            } catch (error) {
                console.error('Error de validación:', error.message);
                throw new Error('Datos inválidos para la plantilla de restablecimiento de contraseña: ' + error);
            }
            return {
                subject: 'Solicitud de restablecimiento de contraseña',
                template: resetPasswordTemplate(data)
            };
        default:
            throw new Error('Plantilla no encontrada');
    }
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
