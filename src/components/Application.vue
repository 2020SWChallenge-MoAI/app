<template>
  <div>
      <Toolbar @navChange="showNav"/>
      <v-app>
        <Navigation :navOfChild="nav" />

          <v-content class="main">
            <router-view/>
          </v-content>

      </v-app>
  </div>
</template>

<script>
import Toolbar from './Toolbar.vue';
import Navigation from './Navigation.vue';

  export default {
    components: {
        Toolbar, Navigation,
    },
    name: 'Application',
    data () {
      return {
          nav : false,
          extend: false,
      }
    },

    methods: {
        showNav() {
            this.nav = !this.nav;
        },
    },

  }
</script>
<style scoped>
.marginExtended {
  margin-left: 256px;
}

.main {
  border:1px solid red;
}
</style>