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
      let cart = sessionStorage.getItem('cart') || '[]'
      cart = JSON.parse(cart)
      item._num = 1
      Object.defineProperty(item, 'num', {
        get: function () { return this._num },
        set: function (y) { this._num = y; alert('qw'); sessionStorage.setItem('cart', JSON.stringify(state.mcart)) }
      })
      cart.push(item)
      state.mcart = cart
      sessionStorage.setItem('cart', JSON.stringify(cart))
    },
    removeFromCart (state, item) {
      let cart = sessionStorage.getItem('cart') || '[]'
      cart = JSON.parse(cart)
      cart = cart.filter(v => v.book_id !== item.book_id)
      state.mcart = cart
      sessionStorage.setItem('cart', JSON.stringify(cart))
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
    },
    init ({ commit, state }) {
      let token = sessionStorage.getItem('token')
      if (token) {
        commit('set', {type: 'isLoggedIn', items: true})
        let cart = sessionStorage.getItem('cart') || '[]'
        cart = JSON.parse(cart)
        cart.forEach(item => {
          Object.defineProperty(item, 'num', {
            get () { return this._num },
            set (y) { this._num = y; sessionStorage.setItem('cart', JSON.stringify(state.mcart)) }
          })
        })
        commit('set', {type: 'mcart', items: cart})
      }
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
