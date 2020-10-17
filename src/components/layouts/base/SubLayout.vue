<template>
  <base-layout>
    <template v-slot:left>
      <left-menu-button
        text="뒤로가기"
        icon="mdi-arrow-left"
        @click.native="$router.back()"
      />
      <slot name="left" />
      <recent-book-items />
    </template>
    <template v-slot:right>
      <right-menu-items />
      <slot name="right" />
    </template>
    <div id="content">
      <slot />
    </div>
  </base-layout>
</template>

<style scoped>
#content {
  position: relative;
  flex: 1;
  display: flex;
  flex-flow: column;
  width: 100%;
  background: rgba(255, 253, 242, 0.6);
  border-radius: 1vw;
  overflow: hidden;
}
</style>
