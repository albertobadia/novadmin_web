import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    site_title: "HPSJ Laboratorio",
    api_url: "https://server.novadmin.dynu.net/",
    title: "",
    force_show_title: false,
    now_traffic: ""
  },
  mutations: {
    set_title(state, title){
      state.title = title
    },
    set_force_show_title(state, show){
      state.force_show_title = show
    },
    set_now_traffic(state, traffic){
      state.now_traffic = traffic
    }
  },
  actions: {
  },
  modules: {
  }
})
