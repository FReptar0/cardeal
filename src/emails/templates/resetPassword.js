export default function resetPasswordTemplate({ name, url }) {
    return `
    <html>
      <body style="font-family: Arial, sans-serif;">
        <h1>Reestablecer contraseña</h1>
        <p>Hola ${name},</p>
        <p>Para cambiar tu contraseña, haz click en el siguiente enlace:</p>
        <a href="${url}">Cambiar contraseña</a>
      </body>
    </html>
  `;
}
