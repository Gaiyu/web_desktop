import axios from 'axios'
import { Session } from '@/docking/session.ts'

export interface RequestCallback {
	() :void
}

export class DockingDesktop {

	static login(success: RequestCallback, failed: RequestCallback) :void {
		if (null != Session.current) {
			axios.post('/desktop/' + Session.current.id, {
				sn: Session.current.request_sn()
			}).then((response: any) => {
				success()
			}).catch((error: any) => {
				failed()
			})
		} else
			failed()
	}

	static logout(onlogout: RequestCallback) :void {
		if (null != Session.current)
			axios.post('/desktop/' + Session.current.id + '/logout', {
				sn: Session.current.request_sn()
			}).then((response: any) => {
				Session.logout()
				onlogout()
			}).catch((error: any) => {
				Session.logout()
				onlogout()
			})
	}
}
