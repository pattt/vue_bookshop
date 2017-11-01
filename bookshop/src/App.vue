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
      this.$store.dispatch('init')
    }
  }

</script>
