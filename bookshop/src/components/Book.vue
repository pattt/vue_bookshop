<template>
  <div>
    <router-link :to="{ name: 'BookList'}" class="nav-item nav-link">to book list</router-link>
{{book}}
    <v-btn @click="addToCart">add to cart</v-btn>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'book',
  data () {
    return {
      book: {}
    }
  },
  methods: {
    addToCart () {
      this.$store.commit('addToCart', this.book)
      this.$router.push({name: 'cart'})
    }
  },
  async mounted () {
    try {
      let {data: {data: res}} = await axios.get('http://localhost:8008/api/getBookById/' + this.$route.params.id)
      this.book = res
    } catch (e) {

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
