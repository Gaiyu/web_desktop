<template>
	<img id="wallpaper" :class="[ DeskWallpaper.get() ]" />
</template>
<script setup lang='ts'>
import { DeskWallpaper } from '@/utils/desk_wallpaper.ts'
DeskWallpaper.push('mars')
DeskWallpaper.push('moon')
DeskWallpaper.push('milky-way')
DeskWallpaper.push('space')
</script>
<style scoped lang="scss">
#wallpaper {
	@extend .non-selectable;
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	width: 100%;
	height: 100%;
	z-index: $wallpaper-zindex;
	background-size: cover;
	-webkit-background-size: cover;
	-moz-background-size: cover;
	-o-background-size: cover;
}

.milky-way {
	background: url('~@/assets/wallpaper/milky-way.jpg') center no-repeat;
}

.moon {
	background: url('~@/assets/wallpaper/moon.jpg') center no-repeat;
}

.space {
	background: url('~@/assets/wallpaper/space.png') center no-repeat;
}

.mars {
	background: url('~@/assets/wallpaper/mars.png') center no-repeat;
}
</style>
