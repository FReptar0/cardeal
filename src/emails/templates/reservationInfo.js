export default function reservationInfoTemplate({ 
  url, 
  userName = 'Cliente', 
  reservationId, 
  stage = 'online', 
  carInfo, 
  rentalDates, 
  locationInfo, 
  paymentInfo, 
  totalAmount 
}) {
  return `
  <!DOCTYPE html>
  <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <title>Información de tu Reserva</title>
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
                  <h2 style="margin:0; color:#333333; font-family:Arial, sans-serif; font-size:24px;">
                    ${stage === 'online' ? '¡Tu reserva ha sido confirmada!' : '¡Tu reserva ha sido registrada!'}
                  </h2>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 40px; text-align:center;">
                  <p style="margin:0; color:#555555; font-family:Arial, sans-serif; font-size:16px; line-height:1.5;">
                    Hola <strong>${userName}</strong>,<br/><br/>
                    ${stage === 'online' 
                      ? 'Tu pago ha sido procesado exitosamente y tu reserva está confirmada.' 
                      : 'Tu reserva ha sido registrada y podrás pagar directamente en mostrador.'}
                    <br/><br/>
                    <strong>Número de Reserva:</strong> #${reservationId || 'Pendiente'}
                  </p>
                </td>
              </tr>
              
              <!-- Reservation Details -->
              ${reservationId ? `
              <tr>
                <td style="padding: 20px 40px;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f8f9fa; border-radius:6px; padding:20px;">
                    <tr>
                      <td style="color:#333; font-family:Arial, sans-serif; font-size:16px; font-weight:bold; padding-bottom:15px; border-bottom:1px solid #dee2e6;">
                        Detalles de tu Reserva
                      </td>
                    </tr>
                    ${carInfo ? `
                    <tr>
                      <td style="padding:10px 0;">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                          <tr>
                            <td style="color:#666; font-family:Arial, sans-serif; font-size:14px; width:30%; vertical-align:top;">
                              <strong>Vehículo:</strong>
                            </td>
                            <td style="color:#333; font-family:Arial, sans-serif; font-size:14px;">
                              ${carInfo.name}<br/>
                              <span style="color:#666; font-size:12px;">${carInfo.category}</span>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    ` : ''}
                    ${rentalDates ? `
                    <tr>
                      <td style="padding:10px 0;">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                          <tr>
                            <td style="color:#666; font-family:Arial, sans-serif; font-size:14px; width:30%; vertical-align:top;">
                              <strong>Fechas:</strong>
                            </td>
                            <td style="color:#333; font-family:Arial, sans-serif; font-size:14px;">
                              <strong>Recogida:</strong> ${rentalDates.pickup}<br/>
                              <strong>Devolución:</strong> ${rentalDates.return}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    ` : ''}
                    ${locationInfo ? `
                    <tr>
                      <td style="padding:10px 0;">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                          <tr>
                            <td style="color:#666; font-family:Arial, sans-serif; font-size:14px; width:30%; vertical-align:top;">
                              <strong>Ubicaciones:</strong>
                            </td>
                            <td style="color:#333; font-family:Arial, sans-serif; font-size:14px;">
                              <strong>Recogida:</strong> ${locationInfo.pickup}<br/>
                              <strong>Devolución:</strong> ${locationInfo.return}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    ` : ''}
                    ${totalAmount ? `
                    <tr>
                      <td style="padding:15px 0 0 0; border-top:1px solid #dee2e6;">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                          <tr>
                            <td style="color:#666; font-family:Arial, sans-serif; font-size:14px; width:30%; vertical-align:top;">
                              <strong>Total:</strong>
                            </td>
                            <td style="color:#10906a; font-family:Arial, sans-serif; font-size:16px; font-weight:bold;">
                              $${totalAmount} MXN
                            </td>
                          </tr>
                          <tr>
                            <td colspan="2" style="color:#666; font-family:Arial, sans-serif; font-size:12px; padding-top:5px;">
                              ${stage === 'online' ? 'Pagado en línea' : 'A pagar en mostrador'}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    ` : ''}
                  </table>
                </td>
              </tr>
              ` : ''}
              
              <!-- Payment Status -->
              <tr>
                <td style="padding: 20px 40px;">
                  <div style="background-color:${stage === 'online' ? '#e8f5e8' : '#fff3cd'}; border-left:4px solid ${stage === 'online' ? '#4caf50' : '#ffc107'}; padding:15px; border-radius:4px;">
                    <p style="margin:0; color:${stage === 'online' ? '#2e7d32' : '#856404'}; font-family:Arial, sans-serif; font-size:14px; line-height:1.5;">
                      <strong>${stage === 'online' ? '✅ Pago Completado' : '💳 Pago en Mostrador'}</strong><br/>
                      ${stage === 'online' 
                        ? 'Tu pago ha sido procesado exitosamente. Tu reserva está completamente confirmada.' 
                        : 'Podrás realizar el pago directamente en la sucursal al momento de recoger tu vehículo.'}
                    </p>
                  </div>
                </td>
              </tr>
              
              <tr>
                <td style="padding: 10px 40px; text-align:center;">
                  <p style="margin:0; color:#555555; font-family:Arial, sans-serif; font-size:16px; line-height:1.5;">
                    Puedes consultar todos los detalles y el estado actualizado de tu reserva:
                  </p>
                </td>
              </tr>
              
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
                    Ver mi reserva
                  </a>
                </td>
              </tr>
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
