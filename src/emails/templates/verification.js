export default function verificationTemplate({ name, url }) {
    return `
    <html>
      <body style="font-family: Arial, sans-serif;">
        <h1>Verificación de Identidad</h1>
        <p>Hola ${name},</p>
        <p>Para verificar tu identidad, haz click en el siguiente enlace:</p>
        <a href="${url}">Verificar Identidad</a>
      </body>
    </html>
  `;
}
