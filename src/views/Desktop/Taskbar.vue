<template>
	<el-row class="bar">
		<el-col :span="1"><el-button icon="el-icon-house" @click="Application.toggleMinimize()"></el-button></el-col>
		<el-col :span="18">
			<el-row class="app-bar">
				<el-col :span="3" v-for="app in Application.list" :key="app">
					<el-button
						:class="{
							minimized: app.minimized,
							focused: app.focused
						}"
						@click="onBarButtonClick(app)"
					>
						<i :class="app.icon" />
						{{app.title}}
					</el-button>
				</el-col>
			</el-row>
		</el-col>
		<el-col :span="1"><el-button icon="el-icon-chat-dot-round"></el-button></el-col>
		<el-col :span="1"><el-button icon="el-icon-map-location"></el-button></el-col>
		<el-col :span="3"><el-button icon="el-icon-user">admin</el-button></el-col>
	</el-row>
</template>

<script setup lang='ts'>
import { Application } from '@/utils/application.ts'

function onBarButtonClick(app: Application) {
	if (app.focused)
		app.switchMinimize()
	else {
		app.unMinimize()
		app.focus()
	}
}
</script>

<style scoped lang="scss">
.app-bar {
	width: 100%;
	max-height: $taskbar-height;
	overflow-y: auto;
	overflow-x: hidden;

	.el-button {
		width: 100%;
		height: 100%;
	}

	.minimized {
		box-shadow: $shadow;
		border: 2px;
		height: $taskbar-height - 6;
		color: black;
	}
}

.bar {
	background-color: $htr;
	width: 100%;
	min-height: $taskbar-height;
	position: absolute;
	top: 0;
	left: 0;
	z-index: $taskbar-zindex;
}
.el-button {
	background-color: $tr;
	border: none;
	color: $ft;
	text-overflow: ellipsis;
	overflow: hidden;
}

.el-button:focus:not(.el-button:hover) {
	@extend .el-button;
}
</style>
