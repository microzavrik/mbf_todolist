import { createRouter, createWebHistory } from 'vue-router'

import MainPage from "../components/MainPage.vue"
import LoginPage from "../components/LoginPage.vue"
import RegisterPage from "../components/RegisterPage.vue"
import PanelPage from "../components/PanelPage.vue" 


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
    },
    {
        path:'/panel',
        component: PanelPage
    }
]

const router = createRouter({
    routes,
    history: createWebHistory(import.meta.env.BASE_URL)
})

export default router