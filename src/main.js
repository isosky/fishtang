import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import VueRouter from 'vue-router'
import FishTang from './components/FishTang.vue'
import FA from './components/FundAnalysis.vue'
import axios from 'axios'

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.config.productionTip = false

const routes = [{
  path: '/FishTang',
  component: FishTang
},
{
  path: '/FA',
  component: FA
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
