<template>
  <div>
    <v-app-bar color='' dark="dark">
      <v-app-bar-nav-icon @click.stop="changeNav"></v-app-bar-nav-icon>
      <v-toolbar-title>Title</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-heart</v-icon>
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
        }
    },
  }
</script>

<style scoped>
</style>