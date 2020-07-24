<template>
  <div style="margin-top: 10%;">
    <div class="d-flex justify-space-around mb-6">
    <router-link to="/book" style="textDecoration: none" ><v-btn id="btn" class="ma-2" x-large color="warning" dark>책 읽기</v-btn></router-link>
    <router-link to="/activity" style="textDecoration: none" ><v-btn id="btn" class="ma-2" x-large color="primary" dark>활동하기</v-btn></router-link>
    <router-link to="/activityList" style="textDecoration: none" ><v-btn id="btn" class="ma-2" x-large color="success" dark>활동보기</v-btn></router-link>
    </div>
  </div>
</template>

<script>
export default {
  
}
</script>

<style scoped>
#btn {
  width: 300px;
  height: 150px;
}
</style>
