<template>
  <div>
    <v-container class="d-flex justify-center mb-6">
    <router-link to="/book" style="textDecoration: none" ><v-btn class="ma-2" x-large color="warning" dark>책 읽기</v-btn></router-link>
    <router-link to="/activity" style="textDecoration: none" ><v-btn class="ma-2" x-large color="primary" dark>활동하기</v-btn></router-link>
    <router-link to="/activityList" style="textDecoration: none" ><v-btn class="ma-2" x-large color="success" dark>활동보기</v-btn></router-link>
    </v-container>
  </div>
</template>

<script>
export default {
  
}
</script>

<style scoped>
</style>
