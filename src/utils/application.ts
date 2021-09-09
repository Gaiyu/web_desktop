import { reactive } from 'vue'

export const enum AppType {
	EmptyWindow = 0,
	FileBrowser,
	ControlPanel,
	AppMarket,
	ResourceDownloader,
	Help,
	Docker,
	DLNA,
	Setting
}

export class Application {
	static list:Array<Application> = reactive([])
	static readonly focused_zindex: number = 2
	static readonly default_zindex: number = 1
	static all_minimized = false

	readonly type: AppType
	minimized: boolean
	maximized: boolean
	title: string
	icon: string
	focused: boolean
	zindex: number

	constructor(type: AppType, title: string, icon: string) {
		this.minimized = false
		this.maximized = false
		this.focused = false
		this.zindex = Application.default_zindex
		this.title = title
		this.icon = icon
		this.type = type
		Application.list.push(this)
	}

	static open(type: AppType, title: string, icon: string) :Application {
		return new Application(type, title, icon)
	}

	static closeAll() :void {
		Application.list.length = 0
	}

	static normalizeAll() :void {
		for (let i = 0; i < Application.list.length; i++)
			Application.list[i].unMinimize()
		Application.all_minimized = false
	}

	static minimizeAll() :void {
		for (let i = 0; i < Application.list.length; i++)
			Application.list[i].minimize()
		Application.all_minimized = true
	}

	static toggleMinimize() :void {
		if (Application.all_minimized)
			Application.normalizeAll()
		else
			Application.minimizeAll()
	}

	close() :void {
		Application.list.splice(Application.list.lastIndexOf(this), 1)
	}

	switchMinimize() :void {
		if (this.minimized)
			this.unMinimize()
		else
			this.minimize()
    }

	maximize() :void {
		this.maximized = true
	}

	unMaximize() :void {
		this.maximized = false
	}

	minimize() :void {
		this.minimized = true
	}

	unMinimize() :void {
		this.minimized = false
	}

	focus() :void {
		if (this.focused)
			return
		for (let i = 0; i < Application.list.length; i++) {
			Application.list[i].focused = false
			Application.list[i].zindex = Application.default_zindex
		}
		this.focused = true
		this.zindex = Application.focused_zindex
	}

	unfocus() :void {
		this.zindex = Application.default_zindex
		this.focused = false
	}
}

export class WindowStartPos {
	static x = 100
	static y = 100

	static getX(w: number) :number {
		if (document.documentElement.clientWidth < (WindowStartPos.x + 25 + w))
			WindowStartPos.x = 100
		return WindowStartPos.x += 25
	}

	static getY(h: number) :number {
		if (document.documentElement.clientHeight < (WindowStartPos.y + 10 + h))
			WindowStartPos.y = 100
		return WindowStartPos.y += 10
	}
}

export class DeskIconStartPos {
	static readonly icon_margin_size = 110
	static readonly icon_size = 100
	static readonly icon_offset = (DeskIconStartPos.icon_margin_size - DeskIconStartPos.icon_size) / 2
	static readonly taskbar_height = 41

	row: number
	column: number

	constructor(row: number, column: number) {
		this.row = row
		this.column = column
	}

	static calculate(icon_id: number) :DeskIconStartPos {
		const rows = Math.floor((document.documentElement.clientHeight - DeskIconStartPos.taskbar_height) / DeskIconStartPos.icon_margin_size)
		const column = Math.floor(icon_id / rows) + 1
		const row = rows + 1 - (rows * column - icon_id)
		return new DeskIconStartPos(row, column)
	}

	x() :number {
		return this.column * DeskIconStartPos.icon_margin_size - DeskIconStartPos.icon_size + DeskIconStartPos.icon_offset
	}

	y() :number {
		return DeskIconStartPos.taskbar_height + this.row * DeskIconStartPos.icon_margin_size - DeskIconStartPos.icon_size + DeskIconStartPos.icon_offset
	}
}

export interface IconUpdateFunc {
	() :void
}

export class DeskIcon {
	static list:Array<DeskIcon> = reactive([])
	static established = false

	isicon: boolean
	focused: boolean
	name: string
	icon: string
	type: AppType
	update: IconUpdateFunc | null

	constructor(type: AppType, name: string, icon: string, isicon: boolean) {
		this.name = name
		this.icon = icon
		this.type = type
		this.focused = false
		this.isicon = isicon
		this.update = null
		DeskIcon.list.push(this)
	}

	static setup() :void {
		if (DeskIcon.established)
			return
		DeskIcon.established = true
		DeskIcon.add(AppType.FileBrowser, "文件管理", "el-icon-folder")
		DeskIcon.add(AppType.ControlPanel, "控制面板", "el-icon-set-up")
		DeskIcon.add(AppType.AppMarket, "应用市场", "el-icon-goods")
		DeskIcon.add(AppType.ResourceDownloader, "资源下载器", "el-icon-download")
		DeskIcon.add(AppType.Help, "帮助", "el-icon-help")
		DeskIcon.add(AppType.Docker, "Docker", 'icon-docker', false)
		DeskIcon.add(AppType.DLNA, "DLNA多媒体服务器", 'icon-dlna', false)
	}

	static add(type: AppType, name: string, icon: string, isicon = true) :void {
		new DeskIcon(type, name, icon, isicon)
	}

	static del(type: AppType) :void {
		for (let i = 0; i < DeskIcon.list.length; i++)
			if (type === DeskIcon.list[i].type) {
				DeskIcon.list.splice(i, 1)
				break
			}
	}

	static multi_unfocus() :void {
		for (let i = 0; i < DeskIcon.list.length; i++)
			DeskIcon.list[i].focused = false
	}

	multi_focus() :void {
		if (!this.focused)
			this.focused = true
	}

	focus() :void {
		if (this.focused)
			return
		this.focused = true
		for (let i = 0; i < DeskIcon.list.length; i++)
			if (this !== DeskIcon.list[i])
				DeskIcon.list[i].focused = false
	}

	open() :void {
		Application.open(this.type, this.name, this.icon)
	}

	id() :number {
		return DeskIcon.list.lastIndexOf(this) 
	}

	set_update_func(func: IconUpdateFunc) :void {
		this.update = func
	}
}
