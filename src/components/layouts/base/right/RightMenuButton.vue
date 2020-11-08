<template>
  <div class="btn-right-menu" v-ripple @click="route">
    <img class="btn-image" :src="image">
    <span class="btn-text">{{ text }}</span>
  </div>
</template>

<script>
const activities = ['writing', 'mindmap', 'quiz-game', 'drawing'];

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
  methods: {
    route() {
      if (activities.some((a) => this.$route.path.includes(a))) this.$router.replace(this.url);
      else this.$router.push(this.url);
    },
  },
};
</script>

<style scoped>
.btn-right-menu {
  width: 6vw;
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
