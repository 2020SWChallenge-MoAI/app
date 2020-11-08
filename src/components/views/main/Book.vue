<template>
  <div class="book">
    <v-img :src="book.thumbnail">
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
    <div
      v-if="clicked"
      class="book-click-overlay"
    >
      <div class="book-click-overlay-icon">
        <v-icon>mdi-book-open-page-variant</v-icon>
      </div>
      <span class="book-click-overlay-text">독서 시작하기</span>
    </div>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['book', 'clicked'],
};
</script>

<style scoped>
.book {
  height: 22vh;
  width: 18vh;
  border-radius: 1vw;
  box-shadow: 0px 15px 10px 0px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  position: relative;
  background: #83b1b1;
  transform: translateZ(0);
}

.book-click-overlay {
  position: absolute;
  top: 0;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  gap: 1vw;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  text-align: center;
}

.book-click-overlay-text {
  font-size: 2vh;
}
</style>
