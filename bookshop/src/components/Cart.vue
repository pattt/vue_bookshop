<template>
  <div>
    <router-link :to="{ name: 'BookList' }">to book list</router-link>
    <v-data-table :items="cart"
                  hide-actions
                  class="elevation-1">
      <template slot="items" slot-scope="props">
        <td class="text-xs-center">{{ props.item.book_name }}</td>
        <td class="text-xs-center">{{ props.item.book_description }}</td>
        <td class="text-xs-center">{{ props.item.book_price }}</td>
        <td class="text-xs-center">
          <v-select :items="[1,2,3,4,5]" v-model="props.item.num" class="num"></v-select>
        </td>
        <td class="text-xs-center"><v-btn @click="remove(props.item)" >Remove</v-btn></td>
      </template>
    </v-data-table>



  </div>


</template>

<script>
  export default {
    computed: {
      cart () {
        return this.$store.getters.mcart
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
