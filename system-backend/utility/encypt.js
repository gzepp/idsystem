import CryptoJS from "crypto-js";

// Encryption function
export default function encrypt(data, secretKey) {
  const key = CryptoJS.enc.Base64.parse(secretKey);
  const iv = CryptoJS.lib.WordArray.random(16);

  const ciphertext = CryptoJS.AES.encrypt(data, key, {
    iv: iv,
    mode: CryptoJS.mode.CFB,
    padding: CryptoJS.pad.Pkcs7,
  });

  const encryptedData = ciphertext.toString();

  return {
    iv: iv.toString(),
    encryptedData,
  };
}
