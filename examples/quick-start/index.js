// Report issues here https://bit.ly/2uYOZ7t
import Vue from 'vue'
import App from './App'
import store from './store'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

Vue.use(VueMaterial) // make it look pretty

export default new Vue({
  el: '#app',
  store,
  components: { App },
  template: '<App/>'
})