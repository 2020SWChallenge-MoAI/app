<template>
  <v-overlay
    color="#fff"
    absolute
    opacity="0.8"
    z-index="99"
    :dark="false"
    :light="true"
    class="finish-overlay"
  >
    <div>
      <img
        v-if="success"
        src="@/assets/img/layouts/character-correct.png"
      >
      <img
        v-if="!success"
        src="@/assets/img/layouts/character-wrong.png"
      >
      <h1>{{ message }}</h1>
      <slot />
    </div>
  </v-overlay>
</template>

<script>
export default {
  props: ['message', 'success'],
};
</script>

<style lang="scss" scoped>
.finish-overlay {
  img {
    width: 20vw;
  }
  div {
    display: flex;
    flex-flow: column;
    text-align: center;
    align-items: center;

    & > *:not(:last-child) {
      margin-bottom: 2vh;
    }
  }
}
</style>
