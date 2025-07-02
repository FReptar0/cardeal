export default function crmContactTemplate({ nombre, email, telefono, nombreEmpresa, rfc, mensaje }) {
  return `
  <!DOCTYPE html>
  <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <title>Nuevo contacto CRM</title>
    </head>
    <body style="margin:0; padding:0; background-color:#f4f4f4;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f4f4; padding:40px 0;">
        <tr>
          <td align="center">
            <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
              <tr>
                <td style="padding: 30px 0; text-align:center; background-color:#ffffff;">
                  <img src="https://www.qardeal.com.mx/logos/Qardeal_logo_completo_color.png" 
                       alt="Qardeal" 
                       width="160" 
                       style="display:block; margin:0 auto;" />
                </td>
              </tr>
              <tr><td style="height:20px;"></td></tr>
              <tr>
                <td style="padding: 0 40px; text-align:center;">
                  <h2 style="margin:0; color:#333333; font-family:Arial, sans-serif; font-size:22px;">
                    Nuevo contacto desde el formulario empresarial
                  </h2>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 40px;">
                  <p style="margin:0; color:#555555; font-family:Arial, sans-serif; font-size:16px; line-height:1.5;">
                    <strong>Nombre:</strong> ${nombre}<br/>
                    <strong>Email:</strong> ${email}<br/>
                    <strong>Teléfono:</strong> ${telefono}<br/>
                    <strong>Empresa:</strong> ${nombreEmpresa}<br/>
                    <strong>RFC:</strong> ${rfc || 'No proporcionado'}<br/>
                    <strong>Mensaje:</strong> ${mensaje || 'Sin mensaje adicional'}
                  </p>
                </td>
              </tr>
              <tr>
                <td style="background-color:#fafafa; padding:20px 40px; text-align:center; color:#999999; font-family:Arial, sans-serif; font-size:12px;">
                  © ${new Date().getFullYear()} Qardeal. Todos los derechos reservados.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
}
