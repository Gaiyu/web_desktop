import { customRef, Ref } from 'vue'

export default function debouncedRef<T>(value: T, delay = 10) : Ref<T> {
	let timeout: number
	return customRef((track, trigger) => {
		return {
			get() {
				track()
				return value
			},
			set(newValue: T) {
				clearTimeout(timeout)
				timeout = window.setTimeout(() => {
					value = newValue
					trigger()
				}, delay)
			}
		}
	})
}
