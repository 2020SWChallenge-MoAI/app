<template>
  <div class="wrapper">
    <main-image
      :src="imageSrc"
      width="80%"
      class="main-image"
    />
    <div class="description">
      {{ content.description }}
    </div>
  </div>
</template>

<script>
import MainImage from './MainImage.vue';

export default {
  components: {
    MainImage,
  },
  props: ['work'],
  data() {
    return {
      imageSrc: '',
      content: JSON.parse(this.work.content),
    };
  },
  async created() {
    this.imageSrc = await this.$store.dispatch('downloadBookMainImage', {
      bid: this.work.bid,
      rank: this.content.rank,
    });
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
}

.description {
  width: 80%;
  line-height: 4vh;
  margin-top: 4vh;
  background: repeating-linear-gradient(
    rgb(255, 253, 242) 0px,
    rgb(255, 253, 242) calc(4vh - 3px),
    rgb(131, 177, 177) 4vh
  );
}
</style>
