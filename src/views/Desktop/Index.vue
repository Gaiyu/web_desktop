<template>
	<div id="desktop">
		<Wallpaper
			@click.left="onLeftClick()"
			@click.right.prevent="onDeskRightClick($event)"
		/>
		<Taskbar
			@click.left="onLeftClick()"
			@click.right.prevent="onTaskbarRightClick($event)"
		/>
		<Clock
			@click.left="onLeftClick()"
			@click.right.prevent="onDeskRightClick($event)"
		/>
		<div
			v-for="app in Application.list"
			:key="app"
		>
			<FileBrowser
				v-if="AppType.FileBrowser === app.type"
				v-show="false === app.minimized"
				:task="app"
			/>
			<ControlPanel
				v-else-if="AppType.ControlPanel === app.type"
				v-show="false === app.minimized"
				:task="app"
			/>
			<AppMarket
				v-else-if="AppType.AppMarket === app.type"
				v-show="false === app.minimized"
				:task="app"
			/>
			<ResourceDownloader
				v-else-if="AppType.ResourceDownloader === app.type"
				v-show="false === app.minimized"
				:task="app"
			/>
			<Help
				v-else-if="AppType.Help === app.type"
				v-show="false === app.minimized"
				:task="app"
			/>
			<Docker
				v-else-if="AppType.Docker === app.type"
				v-show="false === app.minimized"
				:task="app"
			/>
			<DLNA
				v-else-if="AppType.DLNA === app.type"
				v-show="false === app.minimized"
				:task="app"
			/>
			<Setting
				v-else-if="AppType.Setting === app.type"
				v-show="false === app.minimized"
				:task="app"
			/>
		</div>
		<div
			v-for="icon in DeskIcon.list"
			:key="icon"
		>
			<Icon :deskicon="icon" />
		</div>

		<div
			v-for="m in Menu.list"
			:key="m"
		>
			<RightClickMenu
				:menu="m"
				v-show="m.visibled"
			/>
		</div>
	</div>
</template>

<script setup lang='ts'>
import { onMounted, onUnmounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Menu, Command } from '@/utils/menu.ts'
import { Application, AppType, DeskIcon } from '@/utils/application.ts'
import { DeskWallpaper } from '@/utils/desk_wallpaper.ts'
import { Session } from '@/docking/session.ts'
import { DockingDesktop } from '@/docking/desktop.ts'

import Wallpaper from '@/views/Desktop/Wallpaper.vue'
import Taskbar from '@/views/Desktop/Taskbar.vue'
import Clock from '@/views/Desktop/Clock.vue'
import Icon from '@/views/Desktop/Icon.vue'
import RightClickMenu from '@/components/RightClickMenu.vue'

import FileBrowser from '@/views/FileBrowser/Index.vue'
import ControlPanel from '@/views/ControlPanel/Index.vue'
import AppMarket from '@/views/AppMarket/Index.vue'
import ResourceDownloader from '@/views/ResourceDownloader/Index.vue'
import Help from '@/views/Help/Index.vue'
import Docker from '@/views/Docker/Index.vue'
import DLNA from '@/views/DLNA/Index.vue'
import Setting from '@/views/Setting/Index.vue'

const desk_right_menu = reactive(new Menu())
const taskbar_right_menu = reactive(new Menu())

Command.regExec(desk_right_menu, '刷新', 'el-icon-refresh', updateIcons)
Command.regExec(desk_right_menu, '下一个桌面背景', 'el-icon-picture-outline', DeskWallpaper.next)
Command.regExec(desk_right_menu, '设置', 'el-icon-setting', openSetting)

Command.regExec(desk_right_menu, 'test', 'el-icon-setting', openTest)

Command.regExec(taskbar_right_menu, '关闭所有窗口', 'el-icon-close', closeAllWindows)
Command.regExec(taskbar_right_menu, '显示所有窗口', 'el-icon-plus', normalizeAllWindows)
Command.regExec(taskbar_right_menu, '最小化所有窗口', 'el-icon-minus', minimizeAllWindows)

const router = useRouter()

function openTest() {
	if (null != Session.current) {
		console.log(Session.current.account)
		console.log(Session.current.key.encrypt("123"))
	}
}

function openSetting() {
	Application.open(AppType.Setting, '设置', 'el-icon-setting')
}

function closeAllWindows() {
	Application.closeAll()
}

function normalizeAllWindows() {
	Application.normalizeAll()
}

function minimizeAllWindows() {
	Application.minimizeAll()
}

function onLeftClick() {
	DeskIcon.multi_unfocus()
	Menu.hide()
}

function onDeskRightClick(e: MouseEvent) {
	desk_right_menu.show(e.clientX, e.clientY)
}

function onTaskbarRightClick(e: MouseEvent) {
	taskbar_right_menu.show(e.clientX, e.clientY)
}

function updateIcons() {
	for (let i = 0; i < DeskIcon.list.length; i++)
		if (DeskIcon.list[i].update)
			DeskIcon.list[i].update()
}

function onLoginSuccess() {
	DeskIcon.setup()
	window.onresize = updateIcons
}

function onLoginFailed() {
	router.push('/')
}

onMounted(() => {
	DockingDesktop.login(onLoginSuccess, onLoginFailed)
})

onUnmounted(() => {
	window.onresize = null
})
</script>

<style scoped lang="scss">
#desktop {
	background-color: $bg;
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: $desktop-zindex;
	overflow: hidden;
}
</style>
