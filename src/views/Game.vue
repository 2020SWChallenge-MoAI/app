<template>
<div style="width: 100%; height: 85%;">
    <div style="margin-top: 5%;">
        <span class="username" style="float:left;">Username</span>
        <span class="clock">{{ time }}</span>
        <span class="username" style="float: right;">BOT</span>
    </div>
    <div class="container">
        <MakeProblem v-if="Ftype == 0" style="width:100%; height: 100%;" :bookId="bookId" @parentTimeStop="timeStop" @childFtype="getFtype"/>

        <SolveProblem v-if="Ftype == 1" style="width:100%; height: 100%;" :bookId="bookId" @parentTimeStop="timeStop" @childFtype="getFtype" @myPoint="getMyPoint"/>

        <EndGame v-if="Ftype == 2" style="width:100%; height: 100%;" :myPoint="mypoint" @parentBack="backbtnClicked"/>
    </div>
</div>
</template>

<script>
import Dialog from '../components/Dialog.vue';
import axios from 'axios';
import MakeProblem from '../components/MakeProblem.vue';
import SolveProblem from '../components/SolveProblem.vue';
import EndGame from '../components/EndGame.vue';

export default {
    components: {
        Dialog, MakeProblem, SolveProblem, EndGame,
    },
    data () {
        return {
            time: 100,
            Ftype: 0,
            bookId: this.$route.params.bookId,

            gameFinish: false,
            mypoint: false,
        }
    },
    created() {
        this.start()
    },
    watch: {
        gameFinish: function() {
            var router = this.$router;
            router.replace({name: 'GameWB', params: { bookId: this.$route.params.bookId}});
        }
    },
    methods: {
        getFtype(f) {
            this.Ftype = f;
        },
        start() {
            this.polling = setInterval( () => {
                this.time--
                if (this.time <= 0) this.timeOver()
            }, 1000)
        },
        timeOver() {
            if (this.Ftype == 0) {
                this.message = '문제를 제출하지 않았습니다.'
                this.dialog = true
                this.Ftype = (this.Ftype + 1) % 2
                this.curAction = (this.curAction + 1) % 2
            }
            else if(this.Ftype == 1) {
                this.message = '정답을 제출하지 않았습니다.'
                this.dialog = true
                this.Ftype = 2
                this.curAction = 2
            }
            else {
                this.gameFinish = true
            }
            this.timeStop()
        },
        timeStop() {
            clearInterval(this.polling)
            this.time = 100
            this.start()
        },
        backbtnClicked(b) {
            this.gameFinish = b
        },
        getMyPoint(p) {
            this.mypoint = p
        },
    },
    beforeDestroy() {
        clearInterval(this.polling)
    }
}
</script>

<style scoped>
.clock {
    float:center;
    margin-left:4%;
}
.container {
    height: 70%;
    width: 80%;
    margin-left:10%;
    margin-top: 3%;
    border:3px solid green;
}
.username {
    margin-left: 20%;
    margin-right: 20%;
    width: 5%;
}
</style>