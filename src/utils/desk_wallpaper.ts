import { ref } from 'vue'

export class DeskWallpaper {
	static list:Array<DeskWallpaper> = []
	static id = ref(0)
	name: string

	constructor(name: string) {
		this.name = name
		DeskWallpaper.list.push(this)
	}

	static push(name: string) :void {
		new DeskWallpaper(name)
	}

	static get() :string {
		return DeskWallpaper.list[DeskWallpaper.id.value].name
	}

	static next() :void {
		if (DeskWallpaper.list.length > 0)
			if (++DeskWallpaper.id.value >= DeskWallpaper.list.length)
				DeskWallpaper.id.value = 0
	}
}
