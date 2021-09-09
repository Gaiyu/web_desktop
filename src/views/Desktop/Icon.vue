<template>
	<div
		id="main"
		:style="{
			left: x + 'px',
			top: y + 'px',
			width: DeskIconStartPos.icon_size + 'px',
			height: DeskIconStartPos.icon_size + 'px'
		}"
		:class="{
			focused: props.deskicon.focused
		}"
		@click="props.deskicon.focus(), Menu.hide()"
		@dblclick="props.deskicon.open(), Menu.hide()"
		@click.right.prevent="onRightClick($event)" 
	>
		<div
			v-if="props.deskicon.isicon"
			id="icon-div"
		>
			<i :class="props.deskicon.icon" />
		</div>
		<div
			v-else
			id="div-icon"
			:class="props.deskicon.icon"
		/>
		<span>{{ props.deskicon.name }}</span>
	</div>
</template>
<script setup lang='ts'>
import { defineProps, ref, onMounted, reactive } from 'vue'
import { Menu, Command } from '@/utils/menu.ts'
import { DeskIconStartPos } from '@/utils/application.ts'

const props = defineProps(['deskicon'])
const x = ref(0)
const y = ref(0)
const right_menu = reactive(new Menu())

Command.regExec(right_menu, '打开', 'el-icon-top-right', open)

function open() {
	props.deskicon.open()
}

function onRightClick(e: MouseEvent) {
	right_menu.show(e.clientX, e.clientY)
}

function update() {
	let pos:DeskIconStartPos = DeskIconStartPos.calculate(props.deskicon.id())
	x.value = pos.x()
	y.value = pos.y()
}

onMounted(() => {
	update()
	props.deskicon.set_update_func(update)
})

</script>
<style scoped lang="scss">
#main {
	@extend .non-selectable;
	position: absolute;
	z-index: $icon-zindex;
	text-align: center;
	overflow: hidden;
}
#icon-div {
	font-size:40px;
	text-align: center;
	font-size:40px;
}
#div-icon {
	margin: 0 auto;
	width:45%;
	height: 45%;
}
.focused {
	background-color: $bhtr;
}
</style>
