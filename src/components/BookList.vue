<template>
  <div>
    <v-container class="d-flex justify-space-around mb-6">
        <v-col cols="12">
          <v-row>
            <v-card
              v-for="book in books"
              :key="book.id"
              :style="{border: '1px solid black', textAlign: 'center'}"
              class="book_list ma-6 pa-14"
              outlined
              width=240px
              height="200px"
              @click="bookClicked(book.id, book.title)"
            >
            {{ book.title }}
            </v-card>
          </v-row>
        </v-col>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data () {
    return {
      books: []
    }
  },
  methods: {
    bookClicked(bid, btitle) {
        this.$emit('bookId', bid)
        this.$emit('bookTitle', btitle)
    },
  },
  created() {
    axios
      .get("api/books/", {
      })
      .then(res => {
        this.books = res.data
      })
      .catch(err => {
        console.log(err)
      })
  },
}
</script>

<style scoped>
</style>