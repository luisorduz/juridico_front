import Vue from 'vue'
import '@babel/polyfill'
import 'mutationobserver-shim'
import './Utils/fliter'
import App from './App.vue'
import router from './router'
import store from './store'
import Raphael from 'raphael/raphael'
import './plugins'
import './registerServiceWorker'
import i18n from './i18n'
import VueSweetalert2 from 'vue-sweetalert2'
// import VueFormWizard from 'vue-form-wizard'
import 'sweetalert2/dist/sweetalert2.min.css'
import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:8000/api'
var token = localStorage.getItem('token')
if (token) {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
}

global.Raphael = Raphael
Vue.config.productionTip = false
Vue.use(VueSweetalert2)
/* Vue.use(VueFormWizard) */

let vm = new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')

window.vm = vm
