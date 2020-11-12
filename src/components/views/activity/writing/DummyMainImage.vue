<template>
  <v-sheet
    :elevation="5"
    class="main-image"
    :width="width"
    :height="height"
  />
</template>

<script>
export default {
  props: ['width', 'height'],
};
</script>

<style scoped>
.main-image {
  border: 1vw solid white;
  border-radius: 1vw;
  opacity: 0.5;
}
</style>
