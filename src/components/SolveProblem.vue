<template>
  <div>
        <center><div class="solveprob">문제 : {{ EnPQ }}</div></center>
        <div v-if="EnPtype == 1">
            <label><div class="enpex"><input v-model="EnPA" type="radio" name="one" value="1">  {{ EnPEList[0] }}</div></label>
            <label><div class="enpex"><input v-model="EnPA" type="radio" name="one" value="2">  {{ EnPEList[1] }}</div><br></label>
            <label><div class="enpex"><input v-model="EnPA" type="radio" name="one" value="3" style="margin-top: 5%;">  {{ EnPEList[2] }}</div></label>
            <label><div class="enpex"><input v-model="EnPA" type="radio" name="one" value="4">  {{ EnPEList[3] }}</div></label>
        </div>

        <div v-if="EnPtype == 2">
            <input v-model="EnPA" class="short_answer" placeholder="정답을 입력해주세요.">
        </div>

        <v-btn class="submitbtn" color="success" @click="answerSubmitClicked" style="margin-top: 5%;">제출하기</v-btn>
        <Dialog :messageOfChild="message" :dialogOfChild="dialog" @dialogChangedValue="dialogChange"/>
    </div>
</template>

<script>
import Dialog from '../components/Dialog.vue';
import axios from 'axios';

export default {
    props: ['bookId'],
    components: {
        Dialog,
    },
    data () {
        return {
            Ftype: 0,
            EnPtype: 1,
            EnPQ: '예시 문제입니다.',
            EnPEList: ['example1', 'example2', 'example3', 'example4'],
            EnPA: '',

            message: '',
            dialog: false,

            idididid: -1,
        }
    },
    methods: {
        answerSubmitClicked() {
            if (this.EnPA == '') {
                this.message = '정답을 입력해주세요.'
                this.dialog = true
            }
            else {

                axios
                .post('', {
                    "bookId": this.bookId,
                    "problem": this.MPQ,
                })
                .then(res => {
                    console.log(this.idididid)
                    this.idididid = res["data"].id
                    console.log(this.idididid)
                    console.log(res)
                })
                .catch(err => {
                    console.log(err)
                })

                this.Ftype = 2
                this.ifSubmitAnsw = true
                //this.timeStop()
                this.$emit('childFtype', this.Ftype)
                this.$emit('parentTimeStop')
                this.$emit('myPoint', true)
            }
        },
        dialogChange(dialog) {
            this.dialog = dialog
        },
    },
    created() {
        axios
            .get('api/qna/random/'+this.bookId, {
            })
            .then(res => {
                console.log(this.res)
            })
            .catch(err => {
                console.log(err)
        })
    }
}
</script>

<style scoped>
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