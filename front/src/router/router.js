import { createRouter, createWebHistory } from 'vue-router'

import MainPage from "../components/MainPage.vue"
import LoginPage from "../components/LoginPage.vue"
import RegisterPage from "../components/RegisterPage.vue"


const routes = [
    {
        path:'/',
        component: MainPage
    },
    {
        path:'/login',
        component: LoginPage
    },
    {
        path:'/register',
        component: RegisterPage
    }
]

const router = createRouter({
    routes,
    history: createWebHistory(import.meta.env.BASE_URL)
})

export default router