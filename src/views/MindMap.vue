<template>
<div id="outside">
    <div id="top">
    <span id="bookname">{{ this.$route.params.bookId }}</span>

    <span id="submitbtn">
    <v-btn class="ma-2" x-large color="primary">제출하기</v-btn>
    </span>
    </div>

    <hr>
    <div id="mindmap"></div>
</div>
</template>

<script>
export default {

}
</script>

<style>
#outside{
    width: 100%;
    height: 100%;
}
#top {
    width: 100%;
}
#submitbtn{
    text-align: right;
}
#mindmap {
    border: 4px solid blue;
    width: 90%;
    height: 80%;
    margin-left: 5%;
    margin-top: 5%;
}
#bookname {
    font-size: 40px;
    vertical-align: middle;
}
</style>