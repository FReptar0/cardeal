import verificationTemplate from './templates/verification';
import resetPasswordTemplate from './templates/resetPassword';

export function getEmailTemplate(templateId, data) {
    switch (templateId) {
        case 1:
            return {
                subject: 'Verificación de cuenta',
                template: verificationTemplate(data)
            };
        case 2:
            return {
                subject: 'Solicitud de restablecimiento de contraseña',
                template: resetPasswordTemplate(data)
            };
        default:
            throw new Error('Plantilla no encontrada');
    }
}
