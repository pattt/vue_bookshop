import Vue from 'vue'
import Vuex from 'vuex'
import axios from '../api/bookShopApi'
import _ from 'lodash'
import Cart from '../dao/Cart'
import SessionStorage from '../dao/SessionStorage'

Vue.use(Vuex)

const sessionProvider = new SessionStorage()

const store = new Vuex.Store({
  state: {
    books: [],
    book: null,
    isLoggedIn: false,
    genres: [],
    authors: [],
    mcart: {},
    user: null
  },
  mutations: {
    set (state, {type, data}) {
      state[type] = data
    },
    setCart (state, items) {
      state.mcart = items
    },
    addToCart (state) {
      state.mcart = Cart.addToCart(state.mcart, state.book)
    },
    removeFromCart (state, {id}) {
      state.mcart = Cart.removeFromCart(state.mcart, id)
    },
    updateBookNum (state, {id, num}) {
      state.mcart = Cart.updateBookNum(state.mcart, id, num)
    }
  },
  actions: {
    async booklist ({commit}) {
      try {
        let {data: {data: books}} = await axios.get('getBooks')
        commit('set', {type: 'books', data: books})
      } catch (e) {

      }
    },
    async getBook ({commit}, {id}) {
      try {
        let {data: {data: book}} = await axios.get(`getBookById/${id}`)
        commit('set', {type: 'book', data: book})
      } catch (e) {

      }
    },
    addToCart ({ commit, state }) {
      commit('addToCart')
      Cart.saveCart(state.mcart, sessionProvider)
    },
    async genres ({commit}) {
      try {
        let {data: {data: genres}} = await axios.get('getGenres')
        commit('set', {type: 'genres', data: genres})
      } catch (e) {

      }
    },
    async authors ({commit}) {
      try {
        let {data: {data: authors}} = await axios.get('getAuthors')
        commit('set', {type: 'authors', data: authors})
      } catch (e) {

      }
    },
    removeBook ({ commit, state }, id) {
      commit('removeFromCart', {id})
      Cart.saveCart(state.mcart, sessionProvider)
    },
    changeNumBook ({ commit, state }, {id, num}) {
      commit('updateBookNum', {id, num})
      Cart.saveCart(state.mcart, sessionProvider)
    },
    async buy () {
      let order = this.$store.getters.mcart.map(book => { return {id: book.book_id, count: book.num} })
      let token = sessionStorage.getItem('token')
      let {data: {success}} = await axios.put('order', {book: order}, {headers: {token}})
      if (success) {
        this.$store.dispatch('dropCart')
      }
    },
    async login ({commit, dispatch}, creds) {
      let token = null
      if (_.isObject(creds)) {
        try {
          let response = await axios.post('auth', creds)
          token = _.get(response, 'data.data.token')
          if (token) {
            dispatch('getuser', token)
          }
        } catch (e) {
          token = null
        }
        if (token) {
          sessionProvider.set('token', token)
          commit('set', {type: 'isLoggedIn', data: true})
        }
      }
    },
    async getuser ({commit, state}, token) {
      let user = null
      if (token) {
        try {
          let response = await axios.get('user', {headers: {'token': token}})
          user = _.get(response, 'data.data')
        } catch (e) {
          user = null
        }
        if (_.isObject(user)) {
          commit('set', {type: 'user', data: user})
          state.mcart.discount = user.discount_tax
        }
      }
    },
    logout ({ commit }) {
      commit('set', {type: 'isLoggedIn', data: false})
      sessionProvider.remove('token')
    },
    init ({ commit, getters, dispatch }) {
      let token = sessionProvider.get('token')
      const cart = Cart.loadCart(sessionProvider)

      if (token) {
        commit('set', {type: 'isLoggedIn', data: true})
        dispatch('getuser', token)
      } else {
        commit('set', {type: 'isNotLoggedIn', data: true})
      }
      commit('setCart', cart)
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
      return Cart.processToArray(state.mcart)
    },
    user (state) {
      return state.user
    },
    totalCart (state) {
      return Cart.totalCart(state.mcart)
    }
  }
})

export default store
