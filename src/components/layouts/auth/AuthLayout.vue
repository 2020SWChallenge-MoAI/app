<template>
  <div id="container">
    <div id="content">
      <slot />
      <div class="button-area">
        <slot name="buttons" />
      </div>
    </div>
  </div>
</template>

<style scoped>
#container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(180deg, #a6d6cd 0%, rgba(166, 214, 205, 0) 100%),
    url('../../../assets/img/layouts/background.svg') center bottom/contain no-repeat;
  background-size: contain;
}

#content {
  width: 40vw;
  background: #ffffff;
  padding: 3vw;
  border-radius: 2vw;
  text-align: center;
  box-shadow: 0 0 2vw rgba(0, 0, 0, 0.3);
}

.button-area {
  display: flex;
  justify-content: center;
}

.button-area > *:not(:last-child) {
  margin-right: 2vw;
}
</style>
