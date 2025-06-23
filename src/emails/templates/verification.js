export default function verificationTemplate({ name, url }) {
  return `
  <!DOCTYPE html>
  <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <title>Verificación de Cuenta</title>
    </head>
    <body style="margin:0; padding:0; background-color:#f4f4f4;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f4f4; padding:40px 0;">
        <tr>
          <td align="center">
            <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
              
              <!-- Logo -->
              <tr>
                <td style="padding: 30px 0; text-align:center; background-color:#ffffff;">
                  <img src="https://www.qardeal.com.mx/logos/Qardeal_logo_completo_color.png" 
                       alt="Qardeal" 
                       width="160" 
                       style="display:block; margin:0 auto;" />
                </td>
              </tr>
              
              <!-- Espacio -->
              <tr><td style="height:20px;"></td></tr>
              
              <!-- Encabezado de agradecimiento -->
              <tr>
                <td style="padding: 0 40px; text-align:center;">
                  <h2 style="margin:0; color:#333333; font-family:Arial, sans-serif; font-size:24px;">
                    ¡Gracias por registrarte, ${name}!
                  </h2>
                </td>
              </tr>
              
              <!-- Texto instructivo -->
              <tr>
                <td style="padding: 10px 40px; text-align:center;">
                  <p style="margin:0; color:#555555; font-family:Arial, sans-serif; font-size:16px; line-height:1.5;">
                    Para verificar tu cuenta, haz clic en el siguiente botón:
                  </p>
                </td>
              </tr>
              
              <!-- Botón de verificación -->
              <tr>
                <td align="center" style="padding: 20px 40px 40px;">
                  <a href="${url}"
                     style="
                       display:inline-block;
                       background-color:#10906a;
                       color:#ffffff;
                       text-decoration:none;
                       font-family:Arial, sans-serif;
                       font-size:16px;
                       font-weight:bold;
                       padding:12px 24px;
                       border-radius:6px;
                     ">
                    Verificar mi cuenta
                  </a>
                </td>
              </tr>

              <!-- Pie de página -->
              <tr>
                <td style="background-color:#fafafa; padding:20px 40px; text-align:center; color:#999999; font-family:Arial, sans-serif; font-size:12px;">
                  Si no solicitaste este correo, puedes ignorarlo.<br/>
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
