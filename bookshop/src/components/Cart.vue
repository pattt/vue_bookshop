<template>
  <div>
    <router-link :to="{ name: 'BookList' }">to book list</router-link>
    <v-data-table :items="cart.items"
                  hide-actions
                  class="elevation-1">
      <template slot="items" slot-scope="props">
        <td class="text-xs-center">{{ props.item.book_name }}</td>
        <td class="text-xs-center">{{ props.item.book_description }}</td>
        <td class="text-xs-center">
          <del v-if="props.item.discount_tax">{{ props.item.book_price }}</del>
          {{ props.item.book_price - (props.item.book_price / 100 * props.item.discount_tax)  }}
        </td>
        <td class="text-xs-center">-{{+props.item.discount_tax}}%</td>
        <td class="text-xs-center">
          <v-select :items="[1,2,3,4,5]" v-model="props.item.num" class="num"></v-select>
        </td>
        <td class="text-xs-center"><v-btn @click="remove(props.item)" >Remove</v-btn></td>
      </template>
    </v-data-table>

    <div v-if="user">User Discount: {{user.discount_tax}}% Total: {{total}}</div>
    <v-btn @click="buy" >Buy</v-btn>
  </div>


</template>

<script>
  import axios from '../api/bookShopApi'
  export default {
    computed: {
      cart () {
        return this.$store.getters.mcart
      },
      user () {
        return this.$store.getters.user
      },
      total () {
        return this.$store.getters.mcart.count && String(this.$store.getters.mcart)
      }
    },
    methods: {
      remove (book) {
        this.$store.commit('removeFromCart', book)
      },
      async buy () {
        let order = this.$store.getters.mcart.map(book => { return {id: book.book_id, count: book.num} })
        let token = sessionStorage.getItem('token')
        let {data: {success}} = await axios.put('order', {book: order}, {headers: {token}})
        if (success) {
          this.$store.dispatch('dropCart')
        }
      }
    }
  }
</script>

<style scoped>
.num {
  width: 60px;
}
</style>
