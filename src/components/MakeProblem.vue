<template>
  <div>
        <div class="selectType">
            <center><v-btn class="selectbtn" color="primary" @click="type1">객관식 문제</v-btn>
            <v-btn class="selectbtn" color="primary" @click="type2">주관식 문제</v-btn></center>
        </div>
        <div class="Problem">
            <div v-if="Ptype == 0">
                <div><textarea v-model="MPQ" @input="inputChange" class="prob" placeholder="  질문을 입력해주세요."></textarea> 
                <v-btn class="checkbtn" :color="btnColor" @click="checkQuestion">검사하기</v-btn></div>

                <label><div class="ex"><input v-model="MPA" type="radio" name="one" value="1"><input v-model="MPEList[0]" class="multi_ex" placeholder="1번 보기를 입력해주세요."></div></label>
                <label><div class="ex"><input v-model="MPA" type="radio" name="one" value="2"><input v-model="MPEList[1]" class="multi_ex" placeholder="2번 보기를 입력해주세요."></div><br></label>
                <label><div class="ex"><input v-model="MPA" type="radio" name="one" value="3"><input v-model="MPEList[2]" class="multi_ex" placeholder="3번 보기를 입력해주세요."></div></label>
                <label><div class="ex"><input v-model="MPA" type="radio" name="one" value="4"><input v-model="MPEList[3]" class="multi_ex" placeholder="4번 보기를 입력해주세요."></div></label>
            </div>

            <div v-if="Ptype == 1">
                <textarea v-model="MPQ" @input="inputChange" class="prob" placeholder="  질문을 입력해주세요."></textarea> <v-btn class="checkbtn" :color="btnColor" @click="checkQuestion">검사하기</v-btn>
                <input v-model="MPA" class="short_answer" placeholder="정답을 입력해주세요.">
            </div>
        </div>

        <v-btn class="submitbtn" color="success" @click="questionSubmitClicked()">제출하기</v-btn>
        <Dialog :messageOfChild="message" :dialogOfChild="dialog" @dialogChangedValue="dialogChange"/>
    </div>
</template>

<script>
import Dialog from './Dialog.vue';
import axios from 'axios';
export default {
    props: ['bookId'],
    components: {
        Dialog,
    },
    data () {
        return {
            Ptype: -1,
            Ftype: 0,
            MPQ: '',
            MPA: '',
            MPEList: ['', '', '', ''],

            ifSubmitProb: false,

            QOK: false,
            AOK: false,

            message: '',
            dialog: false,

            idididid: -1,
            btnColor: 'error',
        }
    },
    methods: {
        type1() {
            this.Ptype = 0
        },
        type2() {
            this.Ptype = 1
        },
        questionSubmitClicked() {
            if (this.MPQ == '') {
                this.message = '문제를 입력해주세요.'
                this.dialog = true
            }
            else if (this.Ptype == 0){
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
                    else {
                        axios
                            .post('api/qna/verify-answer/', {
                                "book_id": this.bookId,
                                "question": this.MPQ,
                                "question_type": this.Ptype,
                                "user_options": this.MPEList,
                                "user_answer": this.MPA,
                            })
                            .then(res => {
                                this.AOK = res.data.valid
                                console.log(res.data.valid)

                                if (!this.AOK) {
                                    this.message = '정답을 다시 생각해보세요.'
                                    this.dialog = true
                                }

                                else {
                                    this.Ftype = (this.Ftype + 1) % 2
                                    this.ifSubmitProb = true
                                    this.curAction = (this.curAction + 1) % 2
                                    this.$emit('childFtype', this.Ftype)
                                    this.$emit('parentTimeStop')
                                }
                            })
                            .catch(err => {
                                console.log(err)
                            })
                    }
                }
            }
            else if (this.Ptype == 1) {
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
                        axios
                            .post('api/qna/verify-answer/', {
                                "book_id": this.bookId,
                                "question": this.MPQ,
                                "question_type": this.Ptype,
                                "user_options": [],
                                "user_answer": this.MPA,
                            })
                            .then(res => {
                                this.AOK = res.data.valid
                                console.log(res.data.valid)
                                if (!this.AOK) {
                                    this.message = '정답을 다시 생각해보세요.'
                                    this.dialog = true
                                }
                                else {
                                    this.Ftype = (this.Ftype + 1) % 2
                                    this.ifSubmitProb = true
                                    this.curAction = (this.curAction + 1) % 2
                                    this.$emit('childFtype', this.Ftype)
                                    this.$emit('parentTimeStop')
                                }
                            })
                            .catch(err => {
                                console.log(err)
                            })
                    }
                }
            }
        },
        dialogChange(dialog) {
            this.dialog = dialog
        },
        checkQuestion() {
            axios
                .post('/api/qna/verify-question/', {
                    "book_id": this.bookId,
                    "question": this.MPQ,
                })
                .then(res => {
                    this.QOK = res.data.valid
                    if (this.QOK == true) this.btnColor = 'success';
                })
                .catch(err => {
                    console.log(err)
                })
        },
        inputChange() {
            this.QOK = false
            this.btnColor = 'error'
        },
    },
}
</script>

<style scoped>
.Problem {
    height: 60%;
    width: 90%;
    margin-left: 5%;
    border:2px solid blue;
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
</style>