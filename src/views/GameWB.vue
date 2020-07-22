<template>
<div style="height: 100%; width: 100%;">
    <center style="height: 100%; width: 100%;">
    <div style="height: 100%; width:80%;">
        <div class="user userM">MyName</div>
        <span class="vsText">V.S.</span>
        <div class="user userC">Computer</div>

        <v-btn id="startbtn" color="primary" @click="startbtnClicked">게임시작</v-btn>
    </div>
    </center>
</div>
</template>

<script>
export default {
    data () {
        return {
        }
    },
    methods: {
        startbtnClicked() {
            var router = this.$router;
            router.replace({ name: 'Game' , params: { bookId: this.$route.params.bookId}});
        },
    },
}
</script>

<style scoped>
.user {
    text-align:center;
    margin-left: 10%;
    margin-right:10%;
    margin-top: 8%;
}
.userM {
    float:left;
    width: 25%;
    height: 40%;
    border:3px solid black;
}
.userC {
    float:right;
    width: 25%;
    height: 40%;
    border:3px solid black;
}
.vsText {
    display:inline-block;
    margin-top: 20%;
    font-size:30px;
    font-weight:700;
}
#startbtn {
    margin-top:18%;
    width:60%;
    height:5%;
}
</style>