<template>
<div>
    <v-container class="d-flex justify-center mb-6" style="width:100%; height:100%;">
    <v-btn id="btnL" v-if="clicked" color="warning" dark @click="quizClicked">퀴즈게임</v-btn>
    <v-btn id="btnS" v-if="!clicked" color="warning" dark @click="friendClicked">친구와 하기</v-btn>
    <v-btn id="btnS" v-if="!clicked" color="warning" dark @click="botClicked">Bot과 하기</v-btn>
    <v-btn id="btnL" color="primary" dark @click="mindmapClicked">마인드맵</v-btn>
    </v-container>
</div>
</template>

<script>
export default {
  data () {
    return {
      clicked: true,
    }
  },
  methods: {
    mindmapClicked() {
      var router = this.$router;
      router.replace({ name: 'MindMap' , params: { bookId: this.$route.params.bookId}});
    },
    quizClicked() {
      this.clicked = !this.clicked;
    },
    friendClicked() {
      var router = this.$router;
      router.replace({name: 'GameWF'});
    },
    botClicked() {
      var router = this.$router;
      router.replace({name: 'GameWB', params: { bookId: this.$route.params.bookId}});
    },
  },
}
</script>

<style scoped>
#btnL {
  width: 300px;
  height: 100px;
  margin:20px
}
#btnS {
  width: 130px;
  height: 100px;
  margin:20px;
}
</style>