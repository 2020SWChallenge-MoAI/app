<template>
  <div class="btn-book-menu">
    <v-img
      class="btn-image"
      :src="book.thumbnail"
      width="6vw"
      height="6vw"
      v-ripple
    >
      <template v-slot:placeholder>
        <v-row
          class="fill-height ma-0"
          align="center"
          justify="center"
        >
          <v-progress-circular
            indeterminate
            color="grey lighten-5"
          />
        </v-row>
      </template>
    </v-img>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['book'],
};
</script>

<style scoped>
.btn-book-menu {
  width: 6vw;
  height: 6vw;
  overflow: hidden;
  border-radius: 1vw;
  background: #83b1b1;
  transform: translateZ(0);
}

.btn-image {
  width: 6vw;
}

.progress-bar {
  justify-self: center;
  align-self: center;
}
</style>
