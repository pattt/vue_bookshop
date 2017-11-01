<template>
  <v-app>
    <login></login>
    <router-view></router-view>
  </v-app>
</template>

<script>
  import BookList from './components/BookList'
  import Login from './components/Login'
  export default {
    components: {
      booklist: BookList,
      login: Login
    },
    mounted () {
      let token = sessionStorage.getItem('token')
      if (token) {
        this.$store.commit('set', {type: 'isLoggedIn', items: true})
        let cart = localStorage.getItem('cart') || '[]'
        cart = JSON.parse(cart)
        this.$store.commit('set', {type: 'mcart', items: cart})
      }
    }
  }

</script>
