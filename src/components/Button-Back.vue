<template>
  <div>
    <link
      href="https://fonts.googleapis.com/css?family=Material+Icons"
      rel="stylesheet"
    >
    <v-icon :style="{fontSize: iconSize + 'em', color:'#fda085'}">
      arrow_back_bold
    </v-icon>
  </div>
</template>

<script>
export default {
  data() {
    return {
      iconSize: 4,
    };
  },
};
</script>

<style>

</style>
