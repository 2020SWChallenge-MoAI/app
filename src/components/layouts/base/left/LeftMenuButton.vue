<template>
  <div class="btn-left-menu" color="#83b1b1" v-ripple="{class: 'btn-active'}">
    <v-icon color="white" class="btn-image" v-if="icon">{{ icon }}</v-icon>
    <img class="btn-image" v-if="image" :src="image">
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
  background: #83b1b1;
  color: white;
  box-shadow: none;
}

.btn-left-menu:active, .btn-left-menu.active {
  background-color: #668d8d;
}

.btn-image {
  height: 3vw;
  display: inline-block;
}

.btn-text {
  display: block;
  font-size: 1vw;
}
</style>
