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
		<el-col :span="3">
			<el-button icon="el-icon-user"
				@click.left.stop="switchUserSheet()"
			>
				{{ account }}
			</el-button>
		</el-col>
	</el-row>
</template>

<script setup lang='ts'>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Application } from '@/utils/application.ts'
import { Menu, Command } from '@/utils/menu.ts'
import { DockingDesktop } from '@/docking/desktop.ts'
import { Session } from '@/docking/session.ts'

const router = useRouter()
const account = ref('')
const user_sheet_menu = reactive(new Menu())

Command.regExec(user_sheet_menu, '账号设置', 'el-icon-user', openUserSetting)
Command.regExec(user_sheet_menu, '退出', 'el-icon-bicycle', logout)
Command.regExec(user_sheet_menu, '重启', 'el-icon-refresh-right', reboot)
Command.regExec(user_sheet_menu, '关机', 'el-icon-switch-button', poweroff)

function onLogout() {
	account.value = Session.current_account()
	router.push('/')
}

function openUserSetting() {
	console.log('openUserSetting')
}

function logout() {
	DockingDesktop.logout(onLogout)
}

function reboot() {
	console.log('reboot')
}

function poweroff() {
	console.log('poweroff')
}

function switchUserSheet() {
	if (user_sheet_menu.visibled)
		user_sheet_menu.hide()
	else
		user_sheet_menu.show(0, 41, true)
}

function onBarButtonClick(app: Application) {
	if (app.focused)
		app.switchMinimize()
	else {
		app.unMinimize()
		app.focus()
	}
}

function onLoginSuccess() {
	account.value = Session.current_account()
}

function onLoginFailed() {
	router.push('/')
}

onMounted(() => {
	DockingDesktop.login(onLoginSuccess, onLoginFailed)
})
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
