import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import VueRouter from 'vue-router'
import FishTang from './components/FishTang.vue'
import FA from './components/FundAnalysis.vue'
import FI from './components/FundIndustry.vue'
import FS from './components/FundSummary.vue'
import FS_hist from './components/FundSummary_hist.vue'
import syssetting from './components/syssetting.vue'
import axios from 'axios'

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.config.productionTip = false

const routes = [{
    path: '/FishTang',
    component: FishTang
  },
  {
    path: '/FS',
    component: FS
  },
  {
    path: '/FS_hist',
    component: FS_hist
  },
  {
    path: '/FI',
    component: FI
  },
  {
    path: '/FA',
    component: FA
  },
  {
    path: '/syssetting',
    component: syssetting
  }
]

const router = new VueRouter({
  routes
})

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

axios.defaults.baseURL = 'http://localhost:5000';
// axios.defaults.baseURL = 'http://101.42.152.129:5000';

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')