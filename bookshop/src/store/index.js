import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import _ from 'lodash'
import Cart from '../dao/Cart'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    books: [],
    isLoggedIn: false,
    genres: [],
    authors: [],
    mcart: new Cart(),
    user: null
  },
  mutations: {
    set (state, {type, items}) {
      state[type] = items
    },
    setCart (state, items) {
      state.mcart.items = items
    },
    addToCart (state, item) {
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
          token = _.get(response, 'data.data.token')
          if (token) {
            dispatch('getuser', token)
          }
        } catch (e) {
          token = null
        }
        if (token) {
          sessionStorage.setItem('token', token)
          commit('set', {type: 'isLoggedIn', items: true})
        }
      }
    },
    async getuser ({commit, getters}, token) {
      let user = null
      if (token) {
        try {
          let response = await axios.get('http://localhost:8008/api/user', {headers: {'token': token}})
          user = _.get(response, 'data.data')
        } catch (e) {
          user = null
        }
        if (_.isObject(user)) {
          commit('set', {type: 'user', items: user})
          getters.mcart.discount = user.discount_tax
        }
      }
    },
    logout ({ commit }) {
      commit('set', {type: 'isLoggedIn', items: false})
      sessionStorage.removeItem('token')
    },
    init ({ commit, getters, dispatch }) {
      let token = sessionStorage.getItem('token')
      if (token) {
        commit('set', {type: 'isLoggedIn', items: true})
        dispatch('getuser', token)
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
