import NodeRSA from 'node-rsa'

export class RsaOAEP {
	private public_key: NodeRSA

	constructor(hex_n: string, int_e: number) {
		this.public_key = new NodeRSA().importKey({
			n: Buffer.from(hex_n, 'hex'),
			e: int_e
		}, 'components-public')

		this.public_key.setOptions({
			signingScheme:'pss-sha1',
			encryptionScheme:'pkcs1_oaep'
		})
	}

	encrypt(plaintext: string) :string {
		return this.public_key.encrypt(plaintext, 'base64')
	}

	verify(data: string, signature: string) :boolean {
		return this.public_key.verify(data, Buffer.from(signature, 'base64'))
	}
}
