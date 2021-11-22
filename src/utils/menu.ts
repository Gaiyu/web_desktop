import { reactive } from 'vue'

export const enum CmdType {
	ExecFunc = 0,
	SubMenu
}

export interface CmdExecFunc {
	() :void
}

export class Command {
	type: CmdType
	title: string
	icon: string
	enabled: boolean
	visibled: boolean
	exec: CmdExecFunc | null
	sub_menu: Menu | null

	constructor(type: CmdType, title: string, icon: string, exec: CmdExecFunc | null, sub_menu: Menu | null) {
		this.type = type
		this.title = title
		this.icon = icon
		this.exec = exec
		this.sub_menu = sub_menu
		this.enabled = true
		this.visibled = true
	}

	static regExec(menu: Menu, title: string, icon: string, exec: CmdExecFunc | null) :void {
		menu.push(new Command(CmdType.ExecFunc, title, icon, exec, null))
	}

	static regSub(menu: Menu, title: string, icon: string, sub_menu: Menu | null) :void {
		menu.push(new Command(CmdType.SubMenu, title, icon, null, sub_menu))
	}
}

export class Menu {
	static list: Array<Menu> = reactive([])

	readonly father_menu: Menu | null
	cmd_list: Array<Command>
	visibled: boolean
	align_right: boolean
	x: number
	y: number

	constructor(father_menu: Menu | null = null) {
		this.father_menu = father_menu
		this.cmd_list = []
		this.visibled = false
		this.align_right = false
		this.x = 0
		this.y = 0
		Menu.list.push(this)
	}

	static hide() :void {
		for (let i = 0; i < Menu.list.length; i++) {
			Menu.list[i].hide()
		}
	}

	hide() :void {
		this.visibled = false
	}

	show(x: number, y: number, align_right = false) :void {
		if (null === this.father_menu)
			Menu.hide()
		this.x = x
		this.y = y
		this.visibled = true
		this.align_right = align_right
	}

	push(cmd: Command) :Menu {
		this.cmd_list.push(cmd)
		return this
	}
}
