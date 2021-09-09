<template>
	<BaseWindow
		:app="prop.task"
	>
		<template #body>
			<!--div id="main">
				This is a file brower window
			</div-->
		</template>
	</BaseWindow>
</template>
<script setup lang='ts'>
import { defineProps } from 'vue'
import BaseWindow from '@/components/BaseWindow.vue'
const prop = defineProps(['task'])
</script>
<style scoped lang="scss">
#main {
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 20%;
	background-color: white;
}
</style>
