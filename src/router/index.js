import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Satellites from '../views/Satellites.vue'
import Satellite from '../views/Satellite.vue'
import Packet from '../views/Packet.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/stations',
    name: 'Stations',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Stations.vue')
  },
  {
    path: '/satellites',
    name: 'Satellites',
    component: Satellites
  },
  {
    path: '/satellite/:name',
    name: 'Satellite',
    component: Satellite
  },
  {
    path: '/packet/:id',
    name: 'Packet',
    component: Packet
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
