import CryptoJS from "crypto-js";


const encryptData = (data:any) => {
    let key:string = process.env.ENCRYPTION_KEY || "key";
	var encryptedData = CryptoJS.AES.encrypt(data, key).toString();
	
	return encryptedData;
}

const decryptData = (data:any) => {
    let key:string = process.env.ENCRYPTION_KEY || "key";
	var bytes = CryptoJS.AES.decrypt(data, key);
	var decryptedData = bytes.toString(CryptoJS.enc.Utf8);
	
	return decryptedData;
}

export { encryptData, decryptData };
