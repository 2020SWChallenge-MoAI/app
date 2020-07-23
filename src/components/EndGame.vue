<template>
  <div>
        <div class="gameEndMessage">게임이 종료되었습니다</div>
        <v-btn class="submitbtn" color="success" @click="backbtnClicked" style="margin-top: 5%;">로비로 돌아가기</v-btn>
    </div>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    methods: {
        backbtnClicked() {
            this.$emit('parentBack', true)
        },
    }
}
</script>

<style scoped>
.gameEndMessage {
    text-align: center;
    font-size: 40px;
    margin-top: 10%;
}
.submitbtn {
    width: 60%;
    margin-top: 1%;
    margin-left: 20%;
}
</style>