<template>
  <div>
    <v-container class="d-flex justify-center mb-6">
        <v-col cols="12">
          <v-row>
            <v-card
              v-for="n in 12"
              :key="n"
              class="ma-6 pa-14"
              outlined
              tile
            >
              Column
            </v-card>
          </v-row>
        </v-col>
    </v-container>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>