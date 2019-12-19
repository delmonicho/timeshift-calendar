import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    events: []
  },
  mutations: {
    setEvents(state, payload) {
      state.events = payload;
    }
  },
  actions: {}
});
