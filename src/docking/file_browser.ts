import axios from 'axios'
import { WebSocket } from 'ws'
import { Session } from '@/docking/session.ts'

export interface MessageCallback {
	(data: string) :void
}

export interface StatusCallback {
	() :void
}

export class DockingFileBrowser {
	private client: WebSocket | null
	private readonly on_open: StatusCallback
	private readonly on_close: StatusCallback
	private readonly on_message: MessageCallback

	constructor(on_open: StatusCallback, on_message: MessageCallback, on_close: StatusCallback) {
		this.on_open = on_open
		this.on_message = on_message
		this.on_close = on_close

		if (null != Session.current) {
			uri = '/dir/' + Session.current.id
			this.client = new WebSocket(uri)
		} else
			this.client = null
	}

	xx() :void {
		sn: Session.current.request_sn()
		this.client.send('{"op":"xx"}')
	}

	ls() :void {
	}

	rm() :void {
	}

	cp() :void {
	}
}
