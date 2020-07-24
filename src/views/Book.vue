<template>
  <div>
    <BookList @bookId="getBookId" @bookTitle="getBookTitle"/>
  </div>
</template>

<script>
import BookList from '../components/BookList.vue';

export default {
  components: {
    BookList,
  },
  data () {
    return {
      bookid: 0,
      booktitle: '',
    }
  },
  methods: {
    getBookId(id) {
      this.bookid = id;
    },
    getBookTitle(title) {
      this.booktitle = title;
      var router = this.$router;
      router.push({ name: 'Reading' , params: { bookId: this.bookid, bookTitle: this.booktitle }});
    }   
  },
}
</script>

<style scoped>

</style>