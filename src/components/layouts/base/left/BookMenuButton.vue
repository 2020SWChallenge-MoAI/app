<template>
  <div class="btn-book-menu" v-ripple>
    <img
      class="btn-image"
      v-auth-image="image"
    >
    <span class="btn-text">{{ text }}</span>
  </div>
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
  },
};
</script>

<style scoped>
.btn-book-menu {
  width: 6vw;
  height: 6vw;
  overflow: hidden;
  border-radius: 1vw;
}

.btn-image {
  width: 6vw;
}
</style>
