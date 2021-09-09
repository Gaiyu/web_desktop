<template>
	<el-container
		class="base-window"
		:style="{
			left: x + 'px',
			top: y + 'px',
			width: w + 'px',
			height: h + 'px',
			'z-index': props.app.zindex
		}"
	>
		<el-header
			class="title-bar"
			@mousedown.left="onTitleBarClick($event)"
			@mouseup.left="onTitleBarRelease()"
			:class="{
				'titlebar-focused': props.app.focused
			}"
		>
			<i
				id="div-icon"
				:class="[
					props.app.icon,
					props.app.focused ? 'black' : 'darkgray'
				]"
			>&nbsp;</i>
			<i>{{ props.app.title }}</i>
			<div class="window-control">
				<i class="el-icon-minus button" @click="onMinimize()" />
				<i class="el-icon-plus button" @click="toggleMaximize()" />
				<i class="el-icon-close button" @click="onClose()" />
			</div>
		</el-header>
		<el-container
			class='window-body'
			@mousedown.self.left.stop="onWindowBodyClick()"
		>
			<slot name="body" />
		</el-container>
		<div
			class="resize-bar"
			v-for="direction in directions"
			v-show="props.app.focused"
			:key="direction"
			:class="[ direction ]"
			@mousedown.left.self="startResize(direction)"
		/>
	</el-container>
</template>

<script setup lang='ts'>
import { ref, defineProps, onMounted } from 'vue'
import debouncedRef from '@/utils/debounce_ref.ts'
import { WindowStartPos } from '@/utils/application.ts'

const props = defineProps(['app'])
const directions = ['left', 'left-top', 'left-bottom', 'right', 'right-top', 'right-bottom', 'top', 'bottom']
const resize_direction = ref('')
const x = debouncedRef(100)
const y = debouncedRef(100)
const w = debouncedRef(450)
const h = debouncedRef(350)
const dx = ref(0)
const dy = ref(0)

var ox = 0
var oy = 0
var ow = 0
var oh = 0

onMounted(() => {
	x.value = WindowStartPos.getX(w.value)
	y.value = WindowStartPos.getY(h.value)
	ox = x.value
	oy = y.value
	ow = w.value
	oh = h.value
	props.app.focus()
})

function onTitleBarClick(e: MouseEvent) {
	if (props.app.focused) {
		dx.value = e.clientX - x.value
		dy.value = e.clientY - y.value
		document.addEventListener('mousemove', moveWindow)
	} else 
		props.app.focus()
}

function moveWindow(e: MouseEvent) {
	x.value = e.clientX - dx.value
	y.value = e.clientY - dy.value
}

function onTitleBarRelease() {
	document.removeEventListener('mousemove', moveWindow)
}

function onWindowBodyClick() {
	props.app.focus()
}

function onClose() {
	props.app.close()
}

function onMinimize() {
	props.app.minimize()
	props.app.unfocus()
	/*
	x.value = ox
	y.value = oy
	w.value = ow
	h.value = oh
	*/
}

function toggleMaximize() {
	if (props.app.maximized) {
		props.app.unMaximize()
		x.value = ox
		y.value = oy
		w.value = ow
		h.value = oh
	} else {
		props.app.maximize()
		ox = x.value
		oy = y.value
		ow = w.value
		oh = h.value
		let taskbar_height = 41
		x.value = 0
		y.value = taskbar_height
		w.value = document.documentElement.clientWidth
		h.value = document.documentElement.clientHeight - taskbar_height
	}
}

function onResizing(e: MouseEvent) {
	switch(resize_direction.value) {
		case 'left':
			resizeLeft(e)
			break
		case 'left-top':
			resizeLeftTop(e)
			break
		case 'left-bottom':
			resizeLeftBottom(e)
			break
		case 'right':
			resizeRight(e)
			break
		case 'right-top':
			resizeRightTop(e)
			break
		case 'right-bottom':
			resizeRightBottom(e)
			break
		case 'top':
			resizeTop(e)
			break
		case 'bottom':
			resizeBottom(e)
			break
	}
}

function stopResize() {
	document.removeEventListener('mousemove', onResizing)
	document.removeEventListener('mouseup', stopResize)
}

function startResize(direction) {
	resize_direction.value = direction
	document.addEventListener('mouseup', stopResize)
	document.addEventListener('mousemove', onResizing)
}

function resizeDY(e: MouseEvent) :number {
	let dy = 0
	if (e.clientY >= document.documentElement.clientHeight)
		dy = document.documentElement.clientHeight
	else if (e.clientY >= 0)
		dy = e.clientY
	return dy
}

function resizeDX(e: MouseEvent) :number {
	let dx = 0
	if (e.clientX >= document.documentElement.clientWidth)
		dx = document.documentElement.clientWidth
	else if (e.clientX >= 0)
		dx = e.clientX
	return dx
}

function resizeLeft(e: MouseEvent) {
	let dx = resizeDX(e)
	w.value = w.value + x.value - dx
	x.value = dx
}

function resizeRight(e: MouseEvent) {
	let dx = resizeDX(e)
	w.value = w.value + dx - (x.value + w.value)
}

function resizeTop(e: MouseEvent) {
	let dy = resizeDY(e)
	h.value = h.value + y.value - dy
	y.value = dy
}

function resizeBottom(e: MouseEvent) {
	let dy = resizeDY(e)
	h.value = h.value + dy - (y.value + h.value)
}

function resizeLeftTop(e: MouseEvent) {
	resizeLeft(e)
	resizeTop(e)
}

function resizeLeftBottom(e: MouseEvent) {
	resizeLeft(e)
	resizeBottom(e)
}

function resizeRightTop(e: MouseEvent) {
	resizeRight(e)
	resizeTop(e)
}

function resizeRightBottom(e: MouseEvent) {
	resizeRight(e)
	resizeBottom(e)
}
</script>

<style scoped lang="scss">
.base-window {
	@extend .non-selectable;
	position: absolute;
	left: 100px;
	top: 100px;
	width: 650px;
	height: 450px;
	background-color: $tr;
	box-shadow: $shadow;

	.titlebar-focused {
		color: $titlebar-focused-color;
		background-color: $titlebar-focused-bgcolor;
	}
}

.window-body {
	right: 0;
	bottom: 0;
	left: 0;
	position: absolute;
	top: $title-height;
	width: 100%;
	color: $window-color;
	background-color: $window-bgcolor;
}

.title-bar {
	color: $titlebar-color;
	background-color: $titlebar-bgcolor;
	text-align: left;
	line-height: $title-height;
	height: $title-height;
	width: 100%;
	cursor: default;
}

.window-control {
	position: absolute;
	right: 0;
	top: 0;
	height: $title-height;

	.button {
		margin: 5px;
		cursor: pointer;
		/*
		height: 5px;
		width:5px;
		min-height: 0px;
		min-width: 0px;
		*/
	}
}

.resize-bar {
	position: absolute;
}

.left {
	left: 0;
	top: 0;
	height: 100%;
	width: $resize-bar-pixels;
	cursor: w-resize;
}

.left-top {
	top: 0;
	left: 0;
	width: $resize-bar-pixels * 2;
	height: $resize-bar-pixels * 2;
	cursor: nw-resize;
}

.left-bottom {
	left: 0;
	bottom: 0;
	width: $resize-bar-pixels * 2;
	height: $resize-bar-pixels * 2;
	cursor: sw-resize;
}

.right {
	right: 0;
	bottom: 0;
	height: 100%;
	width: $resize-bar-pixels;
	cursor: e-resize;
}

.right-top {
	top: 0;
	right: 0;
	width: $resize-bar-pixels * 2;
	height: $resize-bar-pixels * 2;
	cursor: ne-resize;
}

.right-bottom {
	right: 0;
	bottom: 0;
	width: $resize-bar-pixels * 2;
	height: $resize-bar-pixels * 2;
	cursor: se-resize;
}

.top {
	left: 0;
	top: 0;
	width: 100%;
	height: $resize-bar-pixels;
	cursor: n-resize;
}

.bottom {
	right: 0;
	bottom: 0;
	width: 100%;
	height: $resize-bar-pixels;
	cursor: s-resize;
}

#div-icon {
	display: inline-block;
	margin: 0 auto;
	height: $title-height - 4;
	width: $title-height - 4;
}
</style>
