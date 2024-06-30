import { createRouter, createWebHistory } from 'vue-router'

import MainPage from "../components/MainPage.vue"

const routes = [
    {
        path:'/',
        component: MainPage
    }
]

const router = createRouter({
    routes,
    history: createWebHistory(import.meta.env.BASE_URL)
})

export default router