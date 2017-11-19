<template>
  <v-app>
    <v-layout wrap>
      <v-toolbar>
        <v-toolbar-side-icon @click.stop="leftside = !leftside"></v-toolbar-side-icon>
        <v-toolbar-title>BookShop %)</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items v-if="isLoggedIn">
          <router-link :to="{ name: 'cart'}" tag="button">
          <v-btn flat>
            <v-icon>shopping_cart</v-icon>
            {{cart.count}}
            ({{String(cart)}})
          </v-btn>
          </router-link>
        </v-toolbar-items>

      </v-toolbar>

      <v-navigation-drawer light absolute temporary v-model="leftside">

        <v-list class="pt-0" dense>
          <v-divider></v-divider>
          <v-list-tile v-for="item in items" :key="item.title" @click="goto(item.link)">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>

        <v-container>
          <login></login>
        </v-container>

      </v-navigation-drawer>


      <main>
        <router-view></router-view>
      </main>
    </v-layout>
  </v-app>
</template>

<script>
  import BookList from './components/BookList'
  import Login from './components/Login'
  import VToolbar from 'vuetify/es5/components/VToolbar/VToolbar'
  import VNavigationDrawer from 'vuetify/es5/components/VNavigationDrawer/VNavigationDrawer'
  import VIcon from 'vuetify/es5/components/VIcon/VIcon'
  export default {
    components: {
      VIcon,
      VNavigationDrawer,
      VToolbar,
      booklist: BookList,
      login: Login
    },
    data () {
      return {
        leftside: null,
        items: [
          { title: 'Home', icon: 'dashboard', link: '/' },
          { title: 'About', icon: 'question_answer', link: '' },
          { title: 'Books', icon: 'book', link: '/' },
          { title: 'Cart', icon: 'shopping_cart', link: '/cart' },
          { title: 'Registration', icon: 'tag_faces', link: '/registration' }
        ]
      }
    },
    methods: {
      goto (link) {
        this.$router.push(link)
      }
    },
    computed: {
      isLoggedIn () {
        return this.$store.getters.isLoggedIn
      },
      cart () {
        return this.$store.getters.mcart
      }
    },
    mounted () {
      this.$store.dispatch('init')
    }
  }

</script>
