<template>
<div style="width: 100%; height: 85%;">
    <div style="margin-top: 5%;">
        <span class="username" style="float:left;">Username</span>
        <span class="clock">{{ time }}</span>
        <span class="username" style="float: right;">BOT</span>
    </div>
    <div v-if="Ftype == 0" class="setProblem">
        <div class="selectType">
            <center><v-btn class="selectbtn" color="primary" @click="type1">객관식 문제</v-btn>
            <v-btn class="selectbtn" color="primary" @click="type2">주관식 문제</v-btn></center>
        </div>
        <div class="Problem">
            <div v-if="Ptype == 1">
                <div><textarea v-model="MPQ" class="prob" placeholder="  질문을 입력해주세요."></textarea> 
                <v-btn class="checkbtn" color="error" @click="checkQuestion">검사하기</v-btn></div>

                <label><div class="ex"><input v-model="MPA" type="radio" name="one" value="1"><input v-model="MPEList[0]" class="multi_ex" placeholder="1번 보기를 입력해주세요."></div></label>
                <label><div class="ex"><input v-model="MPA" type="radio" name="one" value="2"><input v-model="MPEList[1]" class="multi_ex" placeholder="2번 보기를 입력해주세요."></div><br></label>
                <label><div class="ex"><input v-model="MPA" type="radio" name="one" value="3"><input v-model="MPEList[2]" class="multi_ex" placeholder="3번 보기를 입력해주세요."></div></label>
                <label><div class="ex"><input v-model="MPA" type="radio" name="one" value="4"><input v-model="MPEList[3]" class="multi_ex" placeholder="4번 보기를 입력해주세요."></div></label>
            </div>

            <div v-if="Ptype == 2">
                <textarea v-model="MPQ" class="prob" placeholder="  질문을 입력해주세요."></textarea> <v-btn class="checkbtn" color="error" @click="checkQuestion">검사하기</v-btn>
                <input v-model="MPA" class="short_answer" placeholder="정답을 입력해주세요.">
            </div>
        </div>

        <v-btn class="submitbtn" color="success" @click="questionSubmitClicked()">제출하기</v-btn>
    </div>

    <div v-if="Ftype == 1" class="solveProblem">
        <center><div class="solveprob">문제 : {{ EnPQ }}</div></center>
        <div v-if="EnPtype == 1">
            <label><div class="enpex"><input v-model="ENPA" type="radio" name="one" value="1">  {{ EnPEList[0] }}</div></label>
            <label><div class="enpex"><input v-model="ENPA" type="radio" name="one" value="2">  {{ EnPEList[1] }}</div><br></label>
            <label><div class="enpex"><input v-model="ENPA" type="radio" name="one" value="3" style="margin-top: 5%;">  {{ EnPEList[2] }}</div></label>
            <label><div class="enpex"><input v-model="ENPA" type="radio" name="one" value="4">  {{ EnPEList[3] }}</div></label>
        </div>

        <div v-if="EnPtype == 2">
            <input v-model="ENPA" class="short_answer" placeholder="정답을 입력해주세요.">
        </div>

        <v-btn class="submitbtn" color="success" @click="answerSubmitClicked" style="margin-top: 5%;">제출하기</v-btn>
    </div>

    <div v-if="Ftype == 2" class="solveProblem">
        <div class="gameEndMessage">게임이 종료되었습니다</div>
        <v-btn class="submitbtn" color="success" @click="backbtnClicked" style="margin-top: 5%;">로비로 돌아가기</v-btn>
    </div>

    <Dialog :messageOfChild="message" :dialogOfChild="dialog" @dialogChangedValue="dialogChange"/>
</div>
</template>

<script>
import Dialog from '../components/Dialog.vue';

export default {
    components: {
        Dialog,
    },
    data () {
        return {
            time: 10,
            Ptype: 0,
            Ftype: 0,
            MPQ: '',
            MPA: '',
            MPEList: ['', '', '', ''],
            EnPtype: 1,
            EnPQ: '예시 문제입니다.',
            EnPEList: ['example1', 'example2', 'example3', 'example4'],
            EnPA: '',

            ifSubmitProb: false,
            ifSubmitAnsw: false,
            curAction: 0,
            gameFinish: false,

            QOK: false,
            AOK: false,

            message: '',
            dialog: false,
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
        start() {
            this.polling = setInterval( () => {
                this.time--
                if (this.time <= 0) this.timeOver()
            }, 1000)
        },
        timeOver() {
            if (this.curAction == 0) {
                if (!this.ifSubmitProb) {
                    this.message = '문제를 제출하지 않았습니다.'
                    this.dialog = true
                    this.Ftype = (this.Ftype + 1) % 2
                    this.curAction = (this.curAction + 1) % 2
                }
            }
            else if(this.curAction == 1) {
                if (!this.ifSubmitAnsw) {
                    this.message = '정답을 제출하지 않았습니다.'
                    this.dialog = true
                    this.Ftype = 2
                    this.curAction = 2
                }
            }
            else {
                this.timeStop
                this.gameFinish = true
            }
            this.timeStop()
        },
        timeStop() {
            clearInterval(this.polling)
            this.time = 10
            this.start()
        },
        type1() {
            this.Ptype = 1
        },
        type2() {
            this.Ptype = 2
        },
        questionSubmitClicked() {
            if (this.MPQ == '') {
                this.message = '문제를 입력해주세요.'
                this.dialog = true
            }
            else if (this.Ptype == 1){
                if (this.MPEList[0] == '' || this.MPEList[1] == '' || this.MPEList[2] == '' || this.MPEList[3] == '') {
                    this.message = '보기를 입력해주세요.'
                    this.dialog = true
                }
                else if (this.MPA == '') {
                    this.message = '정답을 선택해주세요.'
                    this.dialog = true
                }
                else {
                    if (!this.QOK) {
                        this.message = '문제를 다시 생각해보세요.'
                        this.dialog = true
                    }
                    else if (!this.AOK) {
                        this.message = '정답을 다시 생각해보세요.'
                        this.dialog = true
                    }
                    else {
                        this.Ftype = (this.Ftype + 1) % 2
                        this.ifSubmitProb = true
                        this.curAction = (this.curAction + 1) % 2
                        this.timeStop()
                    }
                }
            }
            else if (this.Ptype == 2) {
                if (this.MPA == '') {
                    this.message = '정답을 입력해주세요.'
                    this.dialog = true
                }
                else {
                    if (!this.QOK) {
                        this.message = '문제를 다시 생각해보세요.'
                        this.dialog = true
                    }
                    else if (!this.AOK) {
                        this.message = '정답을 다시 생각해보세요.'
                        this.dialog = true
                    }
                    else {
                        this.Ftype = (this.Ftype + 1) % 2
                        this.ifSubmitProb = true
                        this.curAction = (this.curAction + 1) % 2
                        this.timeStop()
                    }
                }
            }
        },
        answerSubmitClicked() {
            this.Ftype = 2
            this.ifSubmitAnsw = true
            this.curAction = 2
            this.timeStop()
        },
        backbtnClicked() {
            this.gameFinish = true
        },
        dialogChange(dialog) {
            this.dialog = dialog
        },
        checkQuestion() {
            this.QOK = !this.QOK
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
.setProblem {
    height: 60%;
    width: 80%;
    margin-left:10%;
    margin-top: 5%;
    border:3px solid green;
}
.solveProblem {
    height: 60%;
    width: 80%;
    margin-left:10%;
    margin-top: 5%;
    border:3px solid green;
}
.username {
    margin-left: 20%;
    margin-right: 20%;
    width: 5%;
}
.Problem {
    height: 60%;
    width: 90%;
    margin-left: 5%;
    border:2px solid blue;
}
.selectType {
}
.selectbtn {
    margin-top: 3%;
    margin-bottom: 3%;
    margin-left: 10%;
    margin-right: 10%;
    width: 20%;
}
.prob{
    width: 60%;
    border:1px solid black;
    margin-left: 10%;
    margin-top: 3%;
}
.checkbtn{
    margin-left: 10%;
    vertical-align: middle;
    margin-bottom: 5%;
}
.multi_ex{
    width: 38%;
    border: 1px solid black;
    margin-left: 2%;
    margin-right: 5%;
    margin-top: 2%;
}
.ex {
    display:inline;
    margin-left: 2%;
}
.short_answer {
    width: 80%;
    border: 1px solid black;
    margin-left: 10%;
    margin-top: 2%;
    height:50px;
}
.submitbtn {
    width: 60%;
    margin-top: 1%;
    margin-left: 20%;
}
.solveprob {
    width: 80%;
    text-align: left;
    font-size: 30px;
    font-weight: bold;
    margin-top: 5%;
    margin-bottom: 5%;
}
.enpex {
    display:inline;
    font-size: 20px;
    margin-left: 10%;
}
.enpex input {
    margin-left: 15%;
}
.gameEndMessage {
    text-align: center;
    font-size: 40px;
    margin-top: 10%;
}
</style>