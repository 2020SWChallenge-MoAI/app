<template>
  <div id="toolbar">
    <v-app-bar color='' dark="dark">
      <v-app-bar-nav-icon @click.stop="changeNav"></v-app-bar-nav-icon>
      <v-toolbar-title>Title</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon @click="gotoBack">mdi-keyboard-backspace</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon @click="gotoHome">mdi-home</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-app-bar>
  </div>
</template>

<script>

  export default {
    name: 'Toolbar',

    data () {
      return {
          nav: false,
      }
    },
    methods: {
        changeNav() {
          this.$emit('navChange');
        },
        gotoHome() {
          var router = this.$router;
          router.replace({ name: 'Home'});
        },
        gotoBack() {
          var router = this.$router;
          router.go(-1);
        },
    },
  }
</script>

<style scoped>
#toolbar{
  position: fixed;
  left:0;
  right:0;
  top:0;
  z-index:30;
}
</style>