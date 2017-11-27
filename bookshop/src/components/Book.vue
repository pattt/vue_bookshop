<template>
  <div>
    <v-container>
{{bookSelected}}<br><br><br><br><br><br><br><br><br><br><br><br>
    <v-btn @click="addToCartWithRedirect">add to cart</v-btn>
      </v-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'book',
  methods: {
    ...mapActions(['getBook', 'addToCart']),
    addToCartWithRedirect () {
      this.addToCart()
      this.$router.push({name: 'cart'})
    }
  },
  mounted () {
    this.getBook({id: this.$route.params.id})
  },
  computed: mapGetters({
    'bookSelected': 'book'
  })
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
