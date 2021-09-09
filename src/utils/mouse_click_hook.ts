import { onMounted, onUnmounted, Ref } from 'vue'
import debouncedRef from '@/utils/debounce_ref.ts'

export const enum MouseButton {
	None = -1,
	Left = 0,
	Middle = 1,
	Right = 2
}

export type MouseDownState = {
	ctrl: Ref<boolean>,
	shift: Ref<boolean>,
	button: Ref<MouseButton>
}

export type MousePoint = {
	x: Ref<number>,
	y: Ref<number>
}

export type MousePosition = {
	up: MousePoint,
	down: MousePoint,
	move: MousePoint,
	ds: MouseDownState
}

export default function mousePositionHook() : MousePosition {
	const pos = <MousePosition> {
		up: {
			x: debouncedRef(0),
			y: debouncedRef(0)
		},
		down: {
			x: debouncedRef(0),
			y: debouncedRef(0)
		},
		move: {
			x: debouncedRef(0),
			y: debouncedRef(0)
		},
		ds: {
			ctrl: debouncedRef(false),
			shift: debouncedRef(false),
			button: debouncedRef(MouseButton.None)
		}
	}

	const onUpEvent = (e: MouseEvent) => {
		document.removeEventListener('mousemove', onMoveEvent)
		pos.up.x.value = e.clientX
		pos.up.y.value = e.clientY
		pos.ds.ctrl.value = false
		pos.ds.shift.value = false
		pos.ds.button.value = MouseButton.None
	}

	const onDownEvent = (e: MouseEvent) => {
		console.log('onDownEvent')
		pos.down.x.value = e.clientX
		pos.down.y.value = e.clientY
		pos.ds.ctrl.value = e.ctrlKey
		pos.ds.shift.value = e.shiftKey
		switch(e.button) {
			case 0:
				document.addEventListener('mousemove', onMoveEvent)
				pos.ds.button.value = MouseButton.Left
				break
			case 1:
				pos.ds.button.value = MouseButton.Middle
				break
			case 2:
				pos.ds.button.value = MouseButton.Right
				break
			default:
				pos.ds.button.value = MouseButton.None
				break
		}
	}

	const onMoveEvent = (e: MouseEvent) => {
		pos.move.x.value = e.clientX
		pos.move.y.value = e.clientY
		pos.ds.ctrl.value = e.ctrlKey
		pos.ds.shift.value = e.shiftKey
	}

	onMounted(() => {
		document.addEventListener('mouseup', onUpEvent)
		document.addEventListener('mousedown', onDownEvent)
	})

	onUnmounted(() => {
		document.removeEventListener('mouseup', onUpEvent)
		document.removeEventListener('mousedown', onDownEvent)
	})

	return pos
}

