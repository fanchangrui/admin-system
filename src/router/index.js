import { createRouter, createWebHashHistory } from 'vue-router'
/*import login from '../components/Login/login.vue'
import home from '../views/home'
import welcome from '../components/Welcome/welcome'
import users from '../components/asideList/users'
import rights from '../components/Power/rights'
import roles from '../components/Power/roles'
import cate from "../components/Goods/cate";
import params from "../components/Goods/params";
import goods from "../components/Goods/list";
import add from "../components/Goods/add";
import order from "../components/Order/order";
import report from "../components/Report/report";*/
const login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Login/login')
const home = () => import(/* webpackChunkName: "login_home_welcome" */ '../views/home')
const welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Welcome/welcome')

const users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/asideList/users')
const rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/Power/rights')
const roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/Power/roles')

const cate = () => import(/* webpackChunkName: "Cate_Params" */ '../components/Goods/cate')
const params = () => import(/* webpackChunkName: "Cate_Params" */ '../components/Goods/params')

const goods = () => import(/* webpackChunkName: "GoodsList_Add" */ '../components/Goods/list')
const add = () => import(/* webpackChunkName: "GoodsList_Add" */ '../components/Goods/add')

const order = () => import(/* webpackChunkName: "Order_Report" */ '../components/Order/order')
const report = () => import(/* webpackChunkName: "Order_Report" */ '../components/Report/report')
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
    redirect: '/users',
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
      },
      {
        path: '/rights',
        name: 'Rights',
        component: rights,
      },
      {
        path: '/roles',
        name: 'Roles',
        component: roles,
      },
      {
        path: '/categories',
        name: 'Categories',
        component: cate,
      },
      {
        path: '/params',
        name: 'Params',
        component: params,
      },
      {
        path: '/goods',
        name: 'goods',
        component: goods,
      },
      {
        path: '/goods/add',
        name: 'goodsAdd',
        component: add,
      },
      {
        path: '/orders',
        name: 'Order',
        component: order,
      },
      {
        path: '/reports',
        name: 'reports',
        component: report,
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
