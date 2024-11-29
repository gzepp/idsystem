import React, { useState } from "react";

function Testpages() {
  const [inputData, setInputData] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [encryptedData, setEncryptedData] = useState("");
  const [decryptedData, setDecryptedData] = useState("");

  const handleEncrypt = async () => {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(inputData);
      const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(secretKey),
        "AES-GCM",
        true,
        ["encrypt"]
      );
      const encrypted = await crypto.subtle.encrypt(
        {
          name: "AES-GCM",
        },
        key,
        data
      );
      setEncryptedData(new TextDecoder().decode(encrypted));
    } catch (error) {
      console.error("Encryption error:", error);
    }
  };

  const handleDecrypt = async () => {
    try {
      const decoder = new TextDecoder();
      const encrypted = decoder.encode(encryptedData);
      const key = await crypto.subtle.importKey(
        "raw",
        decoder.encode(secretKey),
        "AES-GCM",
        true,
        ["decrypt"]
      );
      const decrypted = await crypto.subtle.decrypt(
        {
          name: "AES-GCM",
        },
        key,
        encrypted
      );
      setDecryptedData(new TextDecoder().decode(decrypted));
    } catch (error) {
      console.error("Decryption error:", error);
    }
  };

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Enter data to encrypt"
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Enter secret key"
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)}
        />
      </div>
      <button onClick={handleEncrypt}>Encrypt</button>
      <button onClick={handleDecrypt}>Decrypt</button>
      <div>
        <p>Encrypted Data: {encryptedData}</p>
        <p>Decrypted Data: {decryptedData}</p>
      </div>
    </div>
  );
}

export default Testpages;
