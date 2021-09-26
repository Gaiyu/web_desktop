import NodeRSA from 'node-rsa'

export class RsaOAEP {
	public_key: NodeRSA

	constructor(base64_n: string, base64_e: string) {
		this.public_key = new NodeRSA().importKey({
			n: Buffer.from(base64_n, 'base64').toString(),
			e: Buffer.from(base64_e, 'base64').toString()
		}, 'components-public')

		this.public_key.setOptions({
			signingScheme:'pss-sha1',
			encryptionScheme:'pkcs1_oaep'
		})
	}

	encrypt(plaintext: string) :string {
		return this.public_key.encrypt(plaintext, 'base64')
	}

	verify(plaintext: string, signature: string) :boolean {
		return this.public_key.verify(plaintext, signature, 'utf-8', 'base64')
	}
}
