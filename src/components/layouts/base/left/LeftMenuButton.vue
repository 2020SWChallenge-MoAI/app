<template>
  <div
    v-ripple="{class: 'btn-active'}"
    class="btn-left-menu"
    :color="color"
    :style="{ 'background-color': color }"
  >
    <v-icon
      v-if="icon"
      color="white"
      class="btn-image"
    >
      {{ icon }}
    </v-icon>
    <img
      v-if="image"
      class="btn-image"
      :src="image"
    >
    <span class="btn-text">{{ text }}</span>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      default: null,
      type: String,
    },
    image: {
      default: null,
      type: String,
    },
    icon: {
      default: null,
      type: String,
    },
    color: {
      default: '#83b1b1',
      type: String,
    },
  },
};
</script>

<style scoped>
.btn-left-menu {
  width: 6vw;
  height: 6vw;
  overflow: hidden;
  border-radius: 1vw;
  text-align: center;
  padding: 1vw;
  color: white;
  box-shadow: none;
}

.btn-image {
  height: 3vw;
  font-size: 2.5vw;
  display: inline-block;
}

.btn-text {
  display: block;
  font-size: 1vw;
}
</style>
