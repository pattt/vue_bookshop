import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import _ from 'lodash'
import Cart from '../dao/Cart'
import config from 'Config'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    books: [],
    book: null,
    isLoggedIn: false,
    genres: [],
    authors: [],
    mcart: new Cart(),
    user: null,
    spinner: false
  },
  mutations: {
    set (state, {type, data}) {
      state[type] = data
    },
    setCart (state, items) {
      state.mcart.items = items
    },
    addToCart (state) {
      let item = state.book
      item._num = 1
      Object.defineProperty(item, 'num', {
        get () { return this._num },
        set (y) { this._num = y; sessionStorage.setItem('cart', JSON.stringify([...state.mcart])); location.reload() }
      })
      state.mcart.items = [...state.mcart.items, item]
      Cart.saveCart(state.mcart)
    },
    removeFromCart (state, item) {
      state.mcart.items = [...state.mcart].filter(v => v.book_id !== item.book_id)
      Cart.saveCart(state.mcart)
    }
  },
  actions: {
    async booklist ({commit}) {
      try {
        let {data: {data: res}} = await axios.get(config.api_url + 'getBooks')
        commit('set', {type: 'books', data: res})
      } catch (e) {

      }
    },
    async getBook ({commit}, {id}) {
      try {
        let {data: {data: res}} = await axios.get(config.api_url + 'getBookById/' + id)
        commit('set', {type: 'book', data: res})
      } catch (e) {

      }
    },
    async genres ({commit}) {
      try {
        let {data: {data: res}} = await axios.get(config.api_url + 'getGenres')
        commit('set', {type: 'genres', data: res})
      } catch (e) {

      }
    },
    async authors ({commit}) {
      try {
        let {data: {data: res}} = await axios.get(config.api_url + 'getAuthors')
        commit('set', {type: 'authors', data: res})
      } catch (e) {

      }
    },
    async login ({commit, dispatch}, {payload}) {
      let token = null
      if (_.isString(payload.login) && _.isString(payload.password)) {
        try {
          let response = await axios.post(config.api_url + 'auth', {login: payload.login, password: payload.password})
          token = _.get(response, 'data.data.token')
          if (token) {
            dispatch('getuser', {token: token})
          }
        } catch (e) {
          token = null
        }
        if (token) {
          sessionStorage.setItem('token', token)
          commit('set', {type: 'isLoggedIn', data: true})
        }
      }
    },
    async getuser ({commit, getters}, {token}) {
      let user = null
      if (_.isString(token)) {
        try {
          let response = await axios.get(config.api_url + 'user', {headers: {'token': token}})
          user = _.get(response, 'data.data')
        } catch (e) {
          user = null
        }
        if (_.isObject(user)) {
          commit('set', {type: 'user', data: user})
          getters.mcart.discount = user.discount_tax
        }
      }
    },
    logout ({ commit }) {
      commit('set', {type: 'isLoggedIn', data: false})
      sessionStorage.removeItem('token')
    },
    addToCart ({ commit }) {
      commit('addToCart')
    },
    init ({ commit, getters, dispatch }) {
      let token = sessionStorage.getItem('token')
      if (token) {
        commit('set', {type: 'isLoggedIn', data: true})
        dispatch('getuser', {token: token})
        let cart = Cart.loadCart()
        cart.forEach(item => {
          Object.defineProperty(item, 'num', {
            get () { return this._num },
            set (y) { this._num = y; Cart.saveCart(getters.mcart) }
          })
        })
        commit('setCart', cart)
      }
    },
    dropCart ({commit}) {
      commit('setCart', [])
    }
  },
  getters: {
    books (state) {
      return state.books
    },
    book (state) {
      return state.book
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
    },
    user (state) {
      return state.user
    }
  }
})

export default store
