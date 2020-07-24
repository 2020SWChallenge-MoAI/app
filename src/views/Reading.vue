<template>
  <BookFrame :bookId="bookId"/>
</template>

<script>
import BookFrame from '../components/BookFrame';

export default {
    components: {
        BookFrame,
    },
    data() {
      return {
        bookId: this.$route.params.bookId
      }
    }
}
</script>

<style scoped>

</style>