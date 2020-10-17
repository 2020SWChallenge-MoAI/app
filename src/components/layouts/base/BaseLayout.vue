<template>
  <div id="container">
    <div id="left-column">
      <slot name="left" />
    </div>
    <div id="mid-column">
      <slot />
    </div>
    <div id="right-column">
      <div id="menu-title">MENU</div>
      <div id="menu-items">
        <slot name="right" />
      </div>
    </div>
  </div>
</template>

<style scoped>
#container {
  width: 100vw;
  height: 100vh;
  padding: 2vw;
  display: flex;
  background: linear-gradient(180deg, #a6d6cd 0%, rgba(166, 214, 205, 0) 100%),
    url('../../../assets/background-forest.svg') center bottom/contain no-repeat;
  background-size: contain;
  box-sizing:border-box;
}

#container > *:not(:last-child) {
  margin-right: 2vw;
}

#left-column {
  display: flex;
  position: relative;
  flex-flow: column;
  width: 6vw;
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
