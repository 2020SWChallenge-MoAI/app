<template>
  <v-sheet
    :elevation="5"
    class="main-image"
    :width="width"
  >
    <v-img
      contain
      :src="src"
      @load="loaded = true"
    >
      <template v-slot:placeholder>
        <v-row
          class="fill-height ma-0"
          align="center"
          justify="center"
        >
          <v-progress-circular
            indeterminate
            color="grey darken-5"
          />
        </v-row>
      </template>
    </v-img>
  </v-sheet>
</template>

<script>
export default {
  props: ['src', 'width', 'height'],
  data() {
    return {
      loaded: false,
    };
  },
};
</script>

<style scoped>
.main-image {
  border: 1vw solid white;
  border-radius: 1vw;
}
</style>
