<template>
<div>
    <v-container class="d-flex justify-center mb-6">
    <v-btn class="ma-2" x-large color="warning" dark>퀴즈게임</v-btn>
    <v-btn class="ma-2" x-large color="primary" dark @click="mindmapClicked">마인드맵</v-btn>
    </v-container>
</div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    mindmapClicked() {
      var router = this.$router;
      router.push({ name: 'MindMap' , params: { bookId: this.$route.params.bookId}});
    }
  },
}
</script>

<style>

</style>