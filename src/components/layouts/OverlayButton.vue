<template>
  <v-btn
    dark
    rounded
    depressed
    x-large
    color="#668d8d"
    class="overlay-button"
  >
    {{ text }}
  </v-btn>
</template>

<script>
export default {
  props: ['text'],
};
</script>

<style scoped>
.overlay-button {
  margin-bottom:2vh;
}
</style>
