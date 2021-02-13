<template>
  <v-dialog max-width="800px">
    <template v-slot:activator="{ on }">
      <v-btn class="mt-2 success" slot="activator" v-on="on">Edit parameters</v-btn>
    </template>
    
    <v-card>
      <v-card-title><h2>Edit station parameters</h2></v-card-title>
      <v-card-text></v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "EditStation"
}
</script>

<style>

</style>