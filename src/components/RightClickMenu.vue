<template>
	<table
		id="main"
		:style="{
			left: props.menu.align_right ? auto : props.menu.x + 'px',
			right: props.menu.align_right ? props.menu.x + 'px' : auto,
			top: props.menu.y + 'px'
		}"
		border="0"
		cellpadding="3"
	>
		<tr
			v-for="cmd in props.menu.cmd_list"
			:key="cmd"
			@click="onMenuClick(cmd)"
		>
			<td class="cmd-icon">
				<i :class="cmd.icon" />
			</td>
			<td class="cmd-title">
				<i>{{ cmd.title }}</i>
			</td>
		</tr>
	</table>
</template>

<script setup lang='ts'>
import { defineProps } from 'vue'
import { Command, CmdType } from '@/utils/menu.ts'
const props = defineProps(['menu'])

function onMenuClick(cmd: Command) {
	if (CmdType.ExecFunc == cmd.type) {
		if (cmd.exec)
			cmd.exec()
	}
	props.menu.hide()
}
</script>

<style scoped lang="scss">
#main {
	@extend .non-selectable;
	position: absolute;
	left: auto;
	top: auto;
	color: $menu-color;
	background-color: $menu-bgcolor;
	z-index: $menu-zindex;
	/*text-align: right;*/
}

tr:hover td {
	color: $menu-hover-color;
	background-color: $menu-hover-bgcolor;
}

td {
	white-space: nowrap;
}

.cmd-icon {
	text-align: right;
}

.cmd-title {
	text-align: left;
	min-width: 100px;
}
</style>
