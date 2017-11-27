<template>
  <div>
    <v-select
      v-bind:items="[{genre_id:null, genre_name: 'All'}].concat(genres)"
      v-model="genre"
      label="Select Genre"
      class="input-group--focused"
      item-value="genre_id"
      item-text="genre_name"
    ></v-select>
    <v-select
      v-bind:items="[{author_id:null, author_name: 'All'}].concat(authors)"
      v-model="author"
      label="Select Author"
      class="input-group--focused"
      item-value="author_id"
      item-text="author_name"
    ></v-select>
    <v-data-table :items="books"
                  v-bind:headers="headers"
                  hide-actions
                  class="elevation-1">
      <template slot="items" slot-scope="props">
        <td class="text-xs-center">{{ props.item.book_name }}</td>
        <td class="text-xs-center">{{ props.item.authors.map( q => q.author_name).join(', ') }}</td>
        <td class="text-xs-center">{{ props.item.genres.map( q => q.genre_name).join(', ') }}</td>
        <td class="text-xs-center">{{ props.item.book_description }}</td>
        <td class="text-xs-center">
          <del v-if="props.item.discount_tax">{{ props.item.book_price }}</del>
          {{ props.item.book_price - (props.item.book_price / 100 * props.item.discount_tax)  }}
        </td>
        <td class="text-xs-center">{{ +props.item.discount_tax }}%</td>
        <td><router-link :to="{ name: 'book', params: {id: props.item.book_id} }" class="nav-item nav-link">Details</router-link></td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
  export default {
    name: 'booklist',
    data () {
      return {
        headers: [
          { text: 'Book', value: 'book_name', align: 'center' },
          { text: 'Author', value: 'authors', align: 'center' },
          { text: 'Genre', value: 'genres', align: 'center' },
          { text: 'Description', value: 'book_description', align: 'center', sortable: false },
          { text: 'Price', value: 'book_price', align: 'center' },
          { text: 'Discount', value: 'discount_tax', align: 'center' }
        ],
        genre: null,
        author: null
      }
    },
    computed: {
      books () {
        let books = this.$store.getters.books
        if (this.genre) {
          books = books.filter(book => book.genres.find(genre => genre.genre_id === this.genre))
        }
        if (this.author) {
          books = books.filter(book => book.authors.find(author => author.author_id === this.author))
        }
        return books
      },
      genres () {
        return this.$store.getters.genres
      },
      authors () {
        return this.$store.getters.authors
      }
    },
    mounted () {
      if (this.books.length === 0) {
        this.$store.dispatch('booklist')
      }
      if (this.genres.length === 0) {
        this.$store.dispatch('genres')
      }
      if (this.authors.length === 0) {
        this.$store.dispatch('authors')
      }
    }
  }
</script>
