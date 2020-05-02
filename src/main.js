import Vue from 'vue'
import './plugins/axios'
import Chartkick from 'vue-chartkick'
import Chart from 'chart.js'
import vueFilterPrettyBytes from 'vue-filter-pretty-bytes'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import VueCookies from 'vue-cookies'

Vue.config.productionTip = false

Vue.use(VueCookies)
Vue.$cookies.config('30d')
Vue.use(Chartkick.use(Chart))
Vue.use(vueFilterPrettyBytes)

new Vue({
  router,
  store,
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')
