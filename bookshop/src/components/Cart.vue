<template>
  <div>
    <router-link :to="{ name: 'BookList' }">to book list</router-link>
    {{cart}}

    <v-data-table :items="cart"
                  hide-actions
                  class="elevation-1">
      <template slot="items" slot-scope="props">
        <td class="text-xs-center">{{ props.item.book_name }}</td>
        <td class="text-xs-center">{{ props.item.book_description }}</td>
        <td class="text-xs-center">{{ props.item.book_price }}</td>
      </template>
    </v-data-table>



  </div>


</template>

<script>
  export default {
    computed: {
      cart () {
        console.log(this.$store.getters.mcart)
        return this.$store.getters.mcart
      }
    }
  }
</script>
