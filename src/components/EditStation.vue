<template>
  <v-dialog max-width="800px">
    <template v-slot:activator="{ on }">
      <v-btn class="mt-2 success" slot="activator" v-on="on">Edit</v-btn>
    </template>
    
    <v-card>
      <v-card-title><h2>Edit station parameters</h2></v-card-title>
      <v-card-text class="text-center">
        <p>Here you can configure the parameters of your station. Currently only predefined satellite configurations are supported but we are working on the full parameter list!</p>
        <v-select v-model="satellite" :items="satellites" label="Satellite"></v-select>
        <v-btn color="primary">Send</v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
const axios = require("axios");

export default {
  name: "EditStation",
  data(){
    return {
      satellite: '',
      satellites: null
    }
  },
  beforeMount() {
    this.getSatellites();
  },
  methods: {
    async getSatellites() {
      const { data } = await axios.get(`https://api.tinygs.com/v1/satellites/?active=true`);
      console.log("test")
      console.log(data);
      
      this.satellites = data.map(x => x.name);
    },
  }
}
</script>

<style>

</style>