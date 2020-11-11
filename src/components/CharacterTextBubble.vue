<template>
  <div class="character-tooltip">
    <div class="character-tooltip-text">
      {{ tooltip }}
    </div>
    <img
      class="character-tooltip-image"
      src="@/assets/img/views/activity/writing/intro-character.png"
    >
  </div>
</template>

<script>
export default {
  props: ['tooltip'],
};
</script>

<style scoped>
.character-tooltip {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: absolute;
  bottom: 0;
  right: 3vw;
}

.character-tooltip-text {
  position: relative;
  background: #f0ebd7;
  border-radius: 1vw;
  overflow-wrap: anywhere;
  font-size: 1.2em;
  padding: 2vh;
}

.character-tooltip-text:after {
  content: '';
  position: absolute;
  right: 0;
  top: 4vh;
  width: 0;
  height: 0;
  border: 1em solid transparent;
  border-left-color: #f0ebd7;
  border-right: 0;
  border-top: 0;
  margin-top: -0.5em;
  margin-right: -1em;
}

.character-tooltip-image {
  height: 20vh;
}
</style>
