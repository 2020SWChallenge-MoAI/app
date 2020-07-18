<template>
<div>
    <v-navigation-drawer
        v-model="drawer"
        color="grey darken-1"
        left="true"
        absolute
        dark
        :disable-resize-watcher="resize"
    >
        <v-list
          dense
          nav
          class="py-0"
        >
            <v-list-item two-line :class="'px-0'">
              <v-list-item-avatar>
                <img src="../assets/logo.png">
              </v-list-item-avatar>
  
              <v-list-item-content>
                <v-list-item-title>Username</v-list-item-title>
                <v-list-item-subtitle>Subtext</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
  
            <v-divider></v-divider>
  
            <v-list-item
              v-for="item in items"
              :key="item.title"
              link
            >
              <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>
  
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</div>
</template>

<script>
export default {
    name:'navigation',

    props:['navOfChild'],
    data () {
    return {
      drawer: true,
      items: [
        { title: 'Dashboard', icon: 'mdi-view-dashboard' },
        { title: 'Photos', icon: 'mdi-image' },
        { title: 'About', icon: 'mdi-help-box' },
      ],
      resize:true,
    }
  },
  methods:{
  },
  watch:{
      navOfChild: function(newVal, oldVal) {
        this.drawer = !this.drawer
      },
      drawer: function(newVal, oldVal) {
        this.$emit('navState', this.drawer);
      }
  },

}
</script>

<style>

</style>