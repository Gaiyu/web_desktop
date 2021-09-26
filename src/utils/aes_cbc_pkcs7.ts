import CryptoJS from 'crypto-js'

export class AesCBCPkcs7 {
	key: CryptoJS.lib.WordArray
	iv: CryptoJS.lib.WordArray

	constructor(passwd: string) {
		const passwd_hash = CryptoJS.SHA256(passwd).toString()
		this.key = CryptoJS.enc.Utf8.parse(passwd_hash.substr(0, 32))
		this.iv = CryptoJS.enc.Utf8.parse(passwd_hash.substr(32, 16))
	}

	decrypt(base64_ciphertext: string) :string {
		return CryptoJS.AES.decrypt(
			base64_ciphertext,
			this.key,
			{ iv: this.iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
		).toString(CryptoJS.enc.Utf8)
	}

    encrypt(plaintext: string) :string {
		return CryptoJS.enc.Base64.stringify(
			CryptoJS.AES.encrypt(
				CryptoJS.enc.Utf8.parse(plaintext),
				this.key,
				{ iv: this.iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
			).ciphertext
		)
	}
}
