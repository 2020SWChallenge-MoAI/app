<template>
  <div class='divCan'>
    <Canvas />
  </div>
</template>

<script>
import Canvas from '../components/CanvasNew.vue';

export default {
  components: {
    Canvas,
  },

};
</script>

<style>
html {
  width: 100%;
  height: 100%;
  min-width: 100%;
  min-height: 100%;
  max-width: 100%;
  max-height: 100%;
}
body {
  width: 100%;
  height: 100%;
  min-width: 100%;
  min-height: 100%;
  max-width: 100%;
  max-height: 100%;
}
.divCan {
  margin: 0;
  width: 100%;
  height: 100%;
  min-width: 100%;
  min-height: 100%;
  max-width: 100%;
  max-height: 100%;
}
</style>
