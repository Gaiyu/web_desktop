import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Login from '@/views/Login/Index.vue'
import Desktop from '@/views/Desktop/Index.vue'

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: 'Login',
		component: Login
	},
	{
		path: '/desktop',
		name: 'Desktop',
		component: Desktop
	}
]

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
})

export default router
