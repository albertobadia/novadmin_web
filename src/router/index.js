import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'clientes',
    component: function () {
      return import(/* webpackChunkName: "clientes" */ '../views/Clientes.vue')
    }
  },
  {
    path: '/multiping',
    name: 'multiping',
    component: function () {
      return import(/* webpackChunkName: "multiping" */ '../views/Multiping.vue')
    }
  },
  {
    path: '/cliente/:pk',
    name: 'cliente',
    component: function () {
      return import(/* webpackChunkName: "cliente" */ '../views/Cliente.vue')
    }
  },
  {
    path: '/reclamos',
    name: 'reclamos',
    component: function () {
      return import(/* webpackChunkName: "reclamos" */ '../views/Reclamos.vue')
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
