import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Satellites from '../views/Satellites.vue'
import Satellite from '../views/Satellite.vue'
import Packet from '../views/Packet.vue'
import Packets from '../views/Packets.vue'
import Station from '../views/Station.vue'
import User from '../views/User.vue'
import AprilFools from '../views/AprilFools.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Home - TinyGS'
    }
  },
  {
    path: '/stations',
    name: 'Stations',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Stations.vue'),
    meta: {
      title: 'Stations - TinyGS'
    }
  },
  {
    path: '/satellites',
    name: 'Satellites',
    component: Satellites,
    meta: {
      title: 'Satellites - TinyGS'
    }
  },
  {
    path: '/satellite/:name',
    name: 'Satellite',
    component: Satellite,
    meta: {
      title: 'Satellite - TinyGS'
    }
  },
  {
    path: '/packet/:id',
    name: 'Packet',
    component: Packet,
    meta: {
      title: 'Packet View - TinyGS'
    }
  },
  {
    path: '/packets',
    name: 'Packets',
    component: Packets,
    meta: {
      title: 'Last received packets - TinyGS'
    }
  },
  {
    path: '/station/:id',
    name: 'Station',
    component: Station,
    meta: {
      title: 'Station Console - TinyGS'
    }
  },
  {
    path: '/user/:id',
    name: 'User',
    component: User,
    meta: {
      title: 'User Console - TinyGS'
    }
  },
  {
    path: '/april/:id',
    name: 'AprilFools',
    component: AprilFools,
    meta: {
      title: 'April Fools - TinyGS'
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, _, next) => {
  document.title = to.meta.title
  next()
})

export default router
