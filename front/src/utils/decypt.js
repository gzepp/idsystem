import CryptoJS from "crypto-js";
import { secretKey } from "../constant";

// Decryption function
export function decrypt(encryptedData, iv) {
  const key = CryptoJS.enc.Base64.parse(secretKey);
  const decryptedData = CryptoJS.AES.decrypt(encryptedData, key, {
    iv: CryptoJS.enc.Hex.parse(iv),
    mode: CryptoJS.mode.CFB,
    padding: CryptoJS.pad.Pkcs7,
  });

  return decryptedData.toString(CryptoJS.enc.Utf8);
}
