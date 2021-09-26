import { createRouter, createWebHashHistory } from 'vue-router'
import login from '../components/Login/login.vue'
import home from '../views/home'
import welcome from '../components/Welcome/welcome'
import users from '../components/asideList/users'
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: login
  },
  {
    path: '/home',
    name: 'Home',
    component: home,
    redirect: '/welcome',
    children:[
      {
      path: '/welcome',
      name: 'Welcome',
      component: welcome,
      },
      {
        path: '/users',
        name: 'Users',
        component: users,
      }

    ]
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
