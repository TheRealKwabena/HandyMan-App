import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import LoginPage from './views/LoginPage.vue'
// import ProfilePage from './views/ProfilePage.vue'
import ClientSignUp from './views/ClientSignUp.vue'
import FindHandyMenPage from './views/FindHandyMenPage.vue'
import ClientProfilePage from './views/ClientProfilePage.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'start',
      component: LoginPage
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage
    },
    {
      path: '/account/:accountId',
      name: 'home',
      component: Home
    },
    {
      path: '/signup',
      name: 'signup',
      component: ClientSignUp
    },
    {
      path: '/findhandymenpage',
      name: 'findhandymenpage',
      component: FindHandyMenPage
    },
    {
      path: '/account/profile/:accountId',
      name: 'clientprofilepage',
      component: ClientProfilePage
    }
  ]
})
