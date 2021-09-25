import { createRouter, createWebHashHistory } from 'vue-router'
import login from '../components/Login/login.vue'
import home from '../components/Home/home'
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: login
  },
  {
    path: '/home',
    name: 'Home',
    component: home
  },
  {
    path: '/',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
router.beforeEach((to,from,next) =>{
  if(to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) return  next('/login')
  next()
})

export default router
