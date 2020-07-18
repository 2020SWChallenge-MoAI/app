<template>
  <div>
      <Toolbar @navChange="showNav"/>
      <v-app>
        <Navigation :navOfChild="nav"  @navState="marginState" />
        
        <div id="main" :class="{ marginExtended: extend }" :style="{margin: 'margin_left'}">

          <div class="btn">
            <v-btn x-large color="warning" dark>책 읽기</v-btn>
            <v-btn x-large color="primary" dark>활동하기</v-btn>
            <v-btn x-large color="success" dark>활동보기</v-btn>
          </div>

        </div>

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
          nav : true,
          extend: true,
      }
    },

    methods: {
        showNav() {
            this.nav = !this.nav;
        },

        marginState(drawer) {
          this.extend = drawer;
          if (window.innerWidth < 1265) {
            this.extend = false;
          }
        },
    },

  }
</script>
<style scoped>
.marginExtended {
  margin-left: 256px;
}

#main {
  width: 100%;
  height: 100%;
}

.btn {
  
}
</style>