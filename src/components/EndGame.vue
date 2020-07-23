<template>
  <div>
        <div class="gameEndMessage">게임이 종료되었습니다</div>
        <div>
            <span>username: {{ my }}</span>
            <span>computer: {{ computer }}</span>
        </div>
        <v-btn class="submitbtn" color="success" @click="backbtnClicked" style="margin-top: 5%;">로비로 돌아가기</v-btn>
    </div>
</template>

<script>
export default {
    props: ['myPoint'],
    data() {
        return {
            my: '',
            computer: '',
        }
    },
    methods: {
        backbtnClicked() {
            this.$emit('parentBack', true)
        },
    },
    mounted() {
        if(this.myPoint == true) this.my = '정답';
        else this.my = '오답';
    },
}
</script>

<style scoped>
.gameEndMessage {
    text-align: center;
    font-size: 40px;
    margin-top: 5%;
}
.submitbtn {
    width: 60%;
    margin-top: 1%;
    margin-left: 20%;
}
</style>