<template>
  <div class="wrapper">
    <v-img
      :src="imageSrc"
      width="100%"
      cover
      gradient="to top, #ffffffbb, #ffffffbb"
    />
    <div class="description">
      {{ content.description }}
    </div>
  </div>
</template>

<script>
export default {
  props: ['work'],
  data() {
    return {
      imageSrc: '',
    };
  },
  computed: {
    content() {
      return JSON.parse(this.work.content);
    },
  },
  watch: {
    work() {
      this.loadWork();
    },
  },
  created() {
    this.loadWork();
  },
  methods: {
    async loadWork() {
      this.imageSrc = await this.$store.dispatch('downloadBookMainImage', {
        bid: this.work.bid,
        rank: this.content.rank,
      });
    },
  },
};
</script>

<style scoped>
.wrapper {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    background: #fffdf2;
    width: 100%;
    height: 100%;
}

.description {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  padding: 2vw;
  word-wrap: break-word;
}
</style>
