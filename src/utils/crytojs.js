const AES = require('crypto-js');
const key = AES.enc.Utf8.parse("0123456789ASDFGH"); //十六位十六进制数作为密钥
const iv = AES.enc.Utf8.parse("ASDFGH0123456789"); //十六位十六进制数作为密钥偏移量

// 加密
export function encrypt(word) {
  const src = AES.enc.Utf8.parse(word);
  const encrypted = AES.AES.encrypt(src, key, {
    iv,
    mode: AES.mode.CBC,
    padding: AES.pad.Pkcs7,
  });
  return encrypted.ciphertext.toString().toUpperCase();
}

// 解密
export function decrypt(word) {
  const encryptedHexStr = AES.enc.Hex.parse(word);
  const src = AES.enc.Base64.stringify(encryptedHexStr);
  const decrypt = AES.AES.decrypt(src, key, {
    iv,
    mode: AES.mode.CBC,
    padding: AES.pad.Pkcs7,
  });
  const decryptedStr = decrypt.toString(AES.enc.Utf8);
  return decryptedStr.toString();
}
