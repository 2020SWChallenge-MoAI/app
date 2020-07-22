<template>
  <div style="width:100%; height:80%;">
      <div id="roomlist">
      </div>
      <v-btn id="btnAttend" color="success" dark @click="btnClicked">참가하기</v-btn>
  </div>
</template>

<script>
export default {
    data () {
        return {
        }
    },
    methods: {
        btnClicked() {
        var router = this.$router;
        router.push({ name: '' , params: { bookId: this.$route.params.bookId}});
        },
    },
}
</script>

<style scoped>
#roomlist{
    width: 80%;
    height: 90%;
    margin-top:3%;
    margin-left: 10%;
    border:3px solid green;
}
#btnAttend {
    width:40%;
    margin-top:3%;
    margin-left:30%;

}
</style>