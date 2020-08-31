<template>
  <div id="buttonText">
    <v-btn
      :style="{ background: btnColor, width: btnWidth + 'em', height: btnHeight + 'em',
                color: '#FFF'}"
    >
      {{ btnText }}
    </v-btn>
  </div>
</template>

<script>
export default {
  data() {
    return {
      btnText: '123123',
      btnWidth: 2,
      btnHeight: 2,
      btnColor: '#fda085',
    };
  },
};
</script>

<style scoped>
#buttonText {
    width: fit-content;
    height: fit-content;
}
</style>
