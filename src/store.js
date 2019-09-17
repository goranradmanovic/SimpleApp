import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'

Vue.use(Vuex)
const vuexPersist = new VuexPersist({key: 'borded-app', storage: window.localStorage})

export default new Vuex.Store({
  state: {
    data: []
  },
  mutations: {
    //Set vuex data property
    setStoreData(state, presistData) {
      state.data.push(presistData);
    },

    //Delete Single table row
    deleteSingleStoredData(state, id) {
      let filteredData = state.data.filter(obj => {
        return obj.key != id;
      });

      state.data = filteredData;
    },

    //Delete all data
    deleteAllStoredData(state) {
      state.data = [];
    }
  },
  actions: {
    //Get persisted data from frontend
    getPersistedData(context, data) {
      context.commit('setStoreData', data);
    },

    deleteSinglePersistedData(context, rowId) {
      context.commit('deleteSingleStoredData', rowId);
    },

    deleteAllPersistedData(context) {
      context.commit('deleteAllStoredData');
    },

  },
  getters: {
    presistantData(state) {
      return state.data;
    }
  },
  plugins: [vuexPersist.plugin] //Vuex plugin for storing data in localStorage
})
