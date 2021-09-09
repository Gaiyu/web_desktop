<template>
	<div id="main">
		<span style='font-size:20px'>{{time_now}}</span>
		<br>
		<span style='font-size:15px'>{{date_now}}</span>
	</div>
</template>

<script setup lang='ts'>
import { ref, onMounted, onUnmounted } from 'vue'

const time_now = ref('')
const date_now = ref('')
var timer
Date.prototype.format = function(fmt) {
	var days = ["日", "一", "二", "三", "四", "五", "六"]
	var o = {
		"M+" : this.getMonth()+1,
		"d+" : this.getDate(),
		"h+" : this.getHours(),
		"m+" : this.getMinutes(),
		"s+" : this.getSeconds(),
		"q+" : Math.floor((this.getMonth()+3)/3),
		"S"  : this.getMilliseconds(),
		"E"  : '星期' + days[this.getDay()]
	}

	if(/(y+)/.test(fmt))
		fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length))

	for(var k in o)
		if(new RegExp("("+ k +")").test(fmt))
			fmt = fmt.replace (RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)))

	return fmt
}

function update() {
	var d = new Date()
	time_now.value = d.format("hh:mm:ss")
	date_now.value = d.format("yyyy/MM/dd E")
}

onMounted(() => {
	timer = setInterval(update, 1000)
})

onUnmounted(() => {
	clearInterval(timer)
})

</script>

<style scoped lang="scss">
#main {
	@extend .non-selectable;
	color: $ft;
	position: absolute;
	top: 85%;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: $clock-zindex;
}
</style>
