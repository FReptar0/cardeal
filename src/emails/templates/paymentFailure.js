export default function paymentFailureTemplate({ 
  userName, 
  reservationId, 
  carInfo, 
  paymentAmount, 
  paymentError, 
  alternativePaymentUrl,
  supportUrl 
}) {
  return `
  <!DOCTYPE html>
  <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <title>Problema con tu Pago - Qardeal</title>
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
              
              <!-- Error Icon -->
              <tr>
                <td align="center" style="padding: 0 40px;">
                  <div style="width:60px; height:60px; background-color:#f44336; border-radius:50%; margin:0 auto 20px; display:flex; align-items:center; justify-content:center;">
                    <span style="color:white; font-size:30px; font-weight:bold;">⚠</span>
                  </div>
                </td>
              </tr>
              
              <tr>
                <td style="padding: 0 40px; text-align:center;">
                  <h2 style="margin:0; color:#333333; font-family:Arial, sans-serif; font-size:24px;">
                    Problema con tu Pago
                  </h2>
                </td>
              </tr>
              
              <tr>
                <td style="padding: 10px 40px; text-align:center;">
                  <p style="margin:0; color:#555555; font-family:Arial, sans-serif; font-size:16px; line-height:1.5;">
                    Hola <strong>${userName}</strong>,<br/><br/>
                    Hemos detectado un problema al procesar el pago de tu reserva <strong>#${reservationId}</strong>.
                  </p>
                </td>
              </tr>
              
              <!-- Reservation Details -->
              <tr>
                <td style="padding: 20px 40px;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f8f9fa; border-radius:6px; padding:20px;">
                    <tr>
                      <td style="color:#333; font-family:Arial, sans-serif; font-size:14px; font-weight:bold; padding-bottom:10px;">
                        Detalles de tu Reserva:
                      </td>
                    </tr>
                    <tr>
                      <td style="color:#666; font-family:Arial, sans-serif; font-size:14px; line-height:1.5;">
                        <strong>Vehículo:</strong> ${carInfo.name}<br/>
                        <strong>Categoría:</strong> ${carInfo.category}<br/>
                        <strong>Monto del Pago:</strong> $${paymentAmount} MXN<br/>
                        <strong>Motivo del Error:</strong> ${paymentError}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <tr>
                <td style="padding: 10px 40px; text-align:center;">
                  <p style="margin:0; color:#555555; font-family:Arial, sans-serif; font-size:16px; line-height:1.5;">
                    <strong>¿Qué puedes hacer?</strong><br/>
                    Tu reserva está <em>temporalmente en espera</em>. Puedes completar el pago o elegir pagar en mostrador.
                  </p>
                </td>
              </tr>
              
              <!-- Action Buttons -->
              <tr>
                <td align="center" style="padding: 20px 40px;">
                  <table role="presentation" cellspacing="0" cellpadding="0">
                    <tr>
                      <td style="padding-right: 10px;">
                        <a href="${alternativePaymentUrl}"
                           style="
                             display:inline-block;
                             background-color:#f57c00;
                             color:#ffffff;
                             text-decoration:none;
                             font-family:Arial, sans-serif;
                             font-size:14px;
                             font-weight:bold;
                             padding:12px 20px;
                             border-radius:6px;
                           ">
                          Reintentar Pago
                        </a>
                      </td>
                      <td style="padding-left: 10px;">
                        <a href="${supportUrl}"
                           style="
                             display:inline-block;
                             background-color:#6c757d;
                             color:#ffffff;
                             text-decoration:none;
                             font-family:Arial, sans-serif;
                             font-size:14px;
                             font-weight:bold;
                             padding:12px 20px;
                             border-radius:6px;
                           ">
                          Contactar Soporte
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Alternative Payment Info -->
              <tr>
                <td style="padding: 20px 40px;">
                  <div style="background-color:#e3f2fd; border-left:4px solid #2196f3; padding:15px; border-radius:4px;">
                    <p style="margin:0; color:#1565c0; font-family:Arial, sans-serif; font-size:14px; line-height:1.5;">
                      <strong>💡 Opción Alternativa:</strong><br/>
                      También puedes elegir pagar directamente en mostrador al recoger tu vehículo. 
                      Esta opción no requiere pago anticipado.
                    </p>
                  </div>
                </td>
              </tr>
              
              <tr>
                <td style="background-color:#fafafa; padding:20px 40px; text-align:center; color:#999999; font-family:Arial, sans-serif; font-size:12px;">
                  Si tienes alguna pregunta, no dudes en contactarnos.<br/>
                  Este correo se envió automáticamente, por favor no respondas directamente.<br/>
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