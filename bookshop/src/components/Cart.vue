<template>
  <div>
    <router-link :to="{ name: 'BookList' }">to book list</router-link>
    <v-data-table :items="cart"
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

    <div v-if="user">User Discount: {{user.discount_tax}} Total: {{total}}</div>

  </div>


</template>

<script>
  export default {
    computed: {
      cart () {
        return this.$store.getters.mcart
      },
      user () {
        return this.$store.getters.user
      },
      total () {
        return this.$store.getters.mcart
          .map(book => book.discount_tax ? book.book_price * (1 - book.discount_tax / 100) : book.book_price)
          .reduce((a, i) => +a + +i) * (1 - this.user.discount_tax / 100)
      }
    },
    methods: {
      remove (book) {
        this.$store.commit('removeFromCart', book)
      }
    }
  }
</script>

<style scoped>
.num {
  width: 60px;
}
</style>
