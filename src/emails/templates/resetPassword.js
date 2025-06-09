export default function resetPasswordTemplate({ name, link }) {
    return `
    <html>
      <body style="font-family: Arial, sans-serif;">
        <h1>Reestablecer contraseña</h1>
        <p>Hola ${name},</p>
        <p>Para cambiar tu contraseña, haz click en el siguiente enlace:</p>
        <a href="${link}">Cambiar contraseña</a>
      </body>
    </html>
  `;
}
