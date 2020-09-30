import Vue from 'vue'
import Vuex from 'vuex'
import feathersVuex from 'feathers-vuex'
import feathers from './server' // This would typically be feathers

const app = feathers()

// #################### feathers-vuex ####################
const { service, FeathersVuex } = feathersVuex(app, { idField: 'id' })

Vue.use(Vuex)
Vue.use(FeathersVuex)

const store = new Vuex.Store({
  plugins: [
    service('todos', {})
    /* auth({ userService: 'users' }) */
  ]
})

export default store