<template>
  <div style="height:0px;">
    <v-dialog
      v-model="dialogOfChild"
      max-width="500px"
    >
      <v-card>
        <v-card-title> {{ messageOfChild }}</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
  
          <v-btn
            color="green darken-1"
            text
            @click="dialogOfChild = false"
          >
            확인
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
    props:['messageOfChild', 'dialogOfChild'],
    name: 'Dialog',
    data () {
        return {
        }
    },
    methods: {
    },
    watch: {
      dialogOfChild: function (){
        this.$emit("dialogChangedValue", this.dialogOfChild)
      }
    },
}
</script>

<style>

</style>