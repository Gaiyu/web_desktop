<template>
	<div class='background'>
		<div id='main'>
			<h1>LOGIN</h1>
			<el-input v-model="account" placeholder="account"></el-input>
			<el-input v-model="passwd" placeholder="passwd" show-password></el-input>
			<el-button type="primary" icon="el-icon-check" v-on:click="onLoginButtonClick()">Login</el-button>
		</div>
	</div>
</template>

<script setup lang='ts'>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Session, LoginSession } from '@/docking/session.ts'

const account = ref('')
const passwd = ref('')
const router = useRouter()

function onAuthSuccess(session: LoginSession) {
	new Session(session.account, session.session_id, session.token, session.aes_key)
	router.push({name: 'Desktop'})
}

function onAuthFailed(session: LoginSession) {
	alert('onAuthFailed')
}

function onLoginButtonClick() {
	const session = new LoginSession(account.value, onAuthSuccess, onAuthFailed)
	session.auth(passwd.value)
}

</script>

<style scoped lang="scss">
#main {
	color: $ft;
	background-color: $md;
	box-shadow: $shadow;
	border-radius: 20px;
	background-repeat:no-repeat;
	text-align: center;
	width: 30%;
	min-width: 200px;
	max-height:220px;
	margin: auto;
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
}
.h1 {
	max-height:37px;
}
.el-input {
	width: 90%;
	box-shadow: $shadow;
	margin: 2px;
	max-height:41px;
}
.el-button {
	width: 90%;
	background-color: $bg;
	max-height:41px;
	box-shadow: $shadow;
	margin: 2px;
}
</style>
