import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    site_title: "HPSJ Laboratorio",
    api_url: "https://server.novadmin.dynu.net/",
    title: "",
    title_show: true,
  },
  mutations: {
    set_title(state, title){
      state.title = title
    },
    title_show(state, show){
      state.title_show = show
    }
  },
  actions: {
  },
  modules: {
  }
})
