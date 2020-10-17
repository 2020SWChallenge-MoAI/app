<template>
  <router-link class="btn-right-menu" :to="url" v-ripple>
    <img class="btn-image" :src="image">
    <span class="btn-text">{{ text }}</span>
  </router-link>
</template>

<script>
export default {
  props: {
    text: {
      default: '버튼',
      type: String,
    },
    image: {
      default: '',
      type: String,
    },
    url: {
      default: '',
      type: String,
    },
  },
};
</script>

<style scoped>
.btn-right-menu {
  width: 6vw;
  display: block;
  overflow: hidden;
  border-radius: 1vw;
}

.btn-right-menu:hover,
.btn-right-menu:active,
.btn-right-menu:visited,
.btn-right-menu:link {
  text-decoration: none;
  color: black;
}

.btn-image {
  width: 6vw;
  height: 6vw;
}

.btn-text {
  font-size: 1.2vw;
}
</style>
