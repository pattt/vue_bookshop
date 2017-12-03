<template>
  <div>
    <router-link :to="{ name: 'BookList' }">to book list</router-link>
    <v-data-table :items="items"
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
          <v-select :items="[1,2,3,4,5]" v-model="props.item.num" @change="changeNumBook({id: props.item.book_id, num: $event})" class="num"></v-select>
        </td>
        <td class="text-xs-center"><v-btn @click="removeBook(props.item.book_id)">Remove</v-btn></td>
      </template>
    </v-data-table>

    <div v-if="user">User Discount: {{user.discount_tax}}% Total: {{totalCart}}</div>
    <v-btn v-if="totalCart > 0" @click="buy">Buy</v-btn>
  </div>


</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    computed: mapGetters({
      'items': 'mcart',
      'user': 'user',
      'totalCart': 'totalCart'
    }),
    methods: mapActions(['removeBook', 'changeNumBook', 'buy'])
  }
</script>

<style scoped>
.num {
  width: 60px;
}
</style>
