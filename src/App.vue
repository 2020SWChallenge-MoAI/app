<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script>
export default {
  components: {},
  mounted() {
    const viewheight = window.innerHeight;
    const viewport = document.querySelector('meta[name=viewport]');
    viewport.setAttribute('content', `width=device-width,height=${viewheight},initial-scale=1.0,user-scalable=no`);
  },
};
</script>

<style>
@font-face {
  font-family: 'Hanna';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_seven@1.0/BMHANNAPro.woff')
    format('woff');
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: 'Tmoney';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-07@1.0/TmoneyRoundWindExtraBold.woff')
    format('woff');
  font-weight: normal;
  font-style: normal;
}

* {
  font-family: 'Tmoney';
}
</style>
