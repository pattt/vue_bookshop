import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import _ from 'lodash'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    books: [],
    isLoggedIn: false,
    genres: [],
    authors: [],
    mcart: []
  },
  mutations: {
    set (state, {type, items}) {
      state[type] = items
    },
    addToCart (state, item) {
      let cart = localStorage.getItem('cart') || '[]'
      cart = JSON.parse(cart)
      cart.push(item)
      state.mcart = cart
      localStorage.setItem('cart', JSON.stringify(cart))
    }
  },
  actions: {
    async booklist ({commit}) {
      try {
        let {data: {data: res}} = await axios.get('http://localhost:8008/api/getBooks')
        commit('set', {type: 'books', items: res})
      } catch (e) {

      }
    },
    async genres ({commit}) {
      try {
        let {data: {data: res}} = await axios.get('http://localhost:8008/api/getGenres')
        commit('set', {type: 'genres', items: res})
      } catch (e) {

      }
    },
    async authors ({commit}) {
      try {
        let {data: {data: res}} = await axios.get('http://localhost:8008/api/getAuthors')
        commit('set', {type: 'authors', items: res})
      } catch (e) {

      }
    },
    async login ({commit, dispatch}, creds) {
      let token = null
      if (_.isObject(creds)) {
        try {
          let response = await axios.post('http://localhost:8008/api/auth', creds)
          console.log(response)
          token = _.get(response, 'data.data.token')
        } catch (e) {

        }
        if (token) {
          sessionStorage.setItem('token', token)
          commit('set', {type: 'isLoggedIn', items: true})
        }
      }
    },
    logout ({ commit }) {
      commit('set', {type: 'isLoggedIn', items: false})
      sessionStorage.removeItem('token')
    }
  },
  getters: {
    books (state) {
      return state.books
    },
    genres (state) {
      return state.genres
    },
    authors (state) {
      return state.authors
    },
    isLoggedIn (state) {
      return state.isLoggedIn
    },
    mcart (state) {
      return state.mcart
    }
  }
})

export default store
