<template>
  <v-app>
    <v-layout wrap>
      <v-toolbar>
        <v-toolbar-side-icon @click.stop="leftside = !leftside"></v-toolbar-side-icon>
        <v-toolbar-title>BookShop %)</v-toolbar-title>
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
          <v-layout>
        <login></login></v-layout>
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
  export default {
    components: {
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
          { title: 'Books', icon: 'question_answer', link: '/' },
          { title: 'Cart', icon: 'question_answer', link: '/cart' },
          { title: 'Registration', icon: 'question_answer', link: '/registration' }
        ]
      }
    },
    methods: {
      goto (link) {
        this.$router.push(link)
      }
    },
    mounted () {
      this.$store.dispatch('init')
    }
  }

</script>
