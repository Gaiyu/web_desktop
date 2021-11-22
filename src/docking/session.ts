import axios from 'axios'
import CryptoJS from 'crypto-js'
import { RsaOAEP } from '@/utils/rsa_oaep.ts'
import { AesCBCPkcs7 } from '@/utils/aes_cbc_pkcs7.ts'

export class Session {
	readonly account: string
	readonly id: string
	readonly token: string
	readonly key: AesCBCPkcs7
	private sn: number

	static current: Session | null = null

	static logout() :void {
		Session.current = null
	}

	constructor(account: string, id: string, token: string, key: string) {
		this.account = account
		this.id = id
		this.token = token
		this.key = new AesCBCPkcs7(key)
		this.sn = 1
		Session.current = this
	}

	request_sn() :string {
		return this.key.encrypt(`{"token":"${this.token}","number":${this.sn++}}`)
	}
}

export interface OnAuthCallback {
	(session: LoginSession) :void
}

export class LoginSession {
	session_id: string | null
	aes_key: string | null
	token: string | null
	readonly account: string
	private passwd: string | null
	private on_success: OnAuthCallback
	private on_failure: OnAuthCallback
	private tmp_key: AesCBCPkcs7 | null
	private pub_key: RsaOAEP | null

	constructor(account: string, success: OnAuthCallback, failed: OnAuthCallback) {
		this.account = account
		this.on_success = success
		this.on_failure = failed
		this.session_id = null
		this.passwd = null
		this.aes_key = null
		this.tmp_key = null
		this.pub_key = null
		this.token = null
	}

	good_value(val: string | null) :boolean {
		return ((null != val) && (val.length > 0))
	}

	random_string(num: number): string {
		return CryptoJS.lib.WordArray.random(num).toString(CryptoJS.enc.Hex)
	}

	auth(passwd: string) :void {
		this.passwd = passwd
		axios.post('/login', {
			account: this.account
		}).then((response: any) => {
			this.setup_session_id(response)
		}).catch((error: any) => {
			this.on_failure(this)
		})
	}

	private setup_session_id(response: any) :void {
		if (null == this.passwd) {
			this.on_failure(this)
			return
		}

		this.session_id = response.data.i
		const passwd_hash = CryptoJS.SHA256(this.passwd).toString(CryptoJS.enc.Hex)
		const passwd_hash_head = passwd_hash.substr(0, 16)
		const db_kok = CryptoJS.SHA256(passwd_hash_head).toString(CryptoJS.enc.Hex)
		const kok = CryptoJS.SHA256(db_kok + this.session_id).toString(CryptoJS.enc.Hex)
		const key = JSON.parse(new AesCBCPkcs7(kok).decrypt(response.data.k))
		this.pub_key = new RsaOAEP(key.n, key.e)
		const tmp_key = this.random_string(32)
		this.tmp_key = new AesCBCPkcs7(tmp_key)

		if (this.pub_key.verify(response.data.k, response.data.s))
			axios.post('/login/' + this.session_id, {
				auth: this.pub_key.encrypt(`{"passwd":"${this.passwd}","key":"${tmp_key}"}`)
			}).then((response: any) => {
				this.setup_aes_key(response)
			}).catch((error: any) => {
				this.on_failure(this)
			})
		else
			this.on_failure(this)
	}

	private setup_aes_key(response: any) :void {
		if ((null != this.tmp_key) && (null != this.pub_key) && this.pub_key.verify(response.data.k, response.data.s)) {
			this.aes_key = this.tmp_key.decrypt(response.data.k)
			this.token = new AesCBCPkcs7(this.aes_key).decrypt(response.data.t)
			if (this.good_value(this.session_id) && this.good_value(this.aes_key) && this.good_value(this.token)) {
				this.on_success(this)
				return
			}
		}
		this.on_failure(this)
	}
}
