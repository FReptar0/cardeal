import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY; 

function base64ToBase64Url(base64) {
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlToBase64(base64url) {
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return base64;
}

export function encryptId(id) {
  if (!SECRET_KEY) throw new Error("SECRET_KEY is not defined");
  const ciphertext = CryptoJS.AES.encrypt(id, SECRET_KEY).toString();
  return base64ToBase64Url(ciphertext);
}

// Desencriptar usando AES + base64url
export function decryptId(encryptedId) {
  if (!SECRET_KEY) throw new Error("SECRET_KEY is not defined");
  const base64 = base64UrlToBase64(encryptedId);
  const bytes = CryptoJS.AES.decrypt(base64, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}