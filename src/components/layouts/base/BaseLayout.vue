<template>
  <div id="container">
    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <div id="left-column" class="column">
      <slot name="left" />
      <recent-book-items v-if="recentBooks" />
    </div>
    <div id="mid-column" class="column">
      <slot />
    </div>
    <div id="right-column" class="column">
      <div id="menu-title">MENU</div>
      <div id="menu-items">
        <slot name="right" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    recentBooks: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    loading() {
      return this.$store.state.loading;
    },
  },
};
</script>

<style scoped>
#container {
  width: 100vw;
  height: 100vh;
  padding: 2vw;
  display: flex;
  background: linear-gradient(180deg, #a6d6cd 0%, rgba(166, 214, 205, 0) 100%),
    url('../../../assets/background-forest.svg') center bottom/contain no-repeat;
  background-size: contain;
}

#container > .column:not(:last-child) {
  margin-right: 2vw;
}

#left-column {
  display: flex;
  position: relative;
  flex-flow: column;
  width: 6vw;
}

#left-column > *:not(:last-child) {
  margin-bottom: 1vh;
}

#mid-column {
  display: flex;
  position: relative;
  flex-flow: column;
  width: 78vw;
  height: 100%;
}

#right-column {
  display: flex;
  position: relative;
  flex-flow: column;
  width: 8vw;
}

#menu-title {
  text-align: center;
  font-size: 2vh;
  margin: 1vh 0 1vh 0;
  color: #ffffff;
}

#menu-items {
  display: flex;
  flex-flow: column;
  flex-grow: 1;
  text-align: center;
  border-radius: 1vw;
  padding: 1vw;
  background: rgba(255, 253, 242, 0.6);
}
</style>
