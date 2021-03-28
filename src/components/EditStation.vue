<template>
  <v-dialog v-model="modal" max-width="800px">
    <template v-slot:activator="{ on }">
      <v-btn class="mt-2 success" slot="activator" v-on="on">Edit</v-btn>
    </template>
    
    <v-card>
      <v-card-title><h2>Edit station parameters</h2></v-card-title>
      <v-card-text class="text-center">
        <p>Here you can configure the parameters of your station. Currently only predefined satellite configurations are supported but we are working on the full parameter list!</p>
        <v-form>
          <v-select v-model="satellite" :items="satellites" label="Select a satellite"></v-select>
          <v-text-field v-model="config" label="OR Write your own config"></v-text-field>
          <v-btn @click="send()" color="primary">Send</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
const axios = require("axios");

export default {
  name: "EditStation",
  props: [
    "station",
    "modemConf"
  ],
  data(){
    return {
      modal: null,
      satellite: '',
      config: '',
      satellites: null
    }
  },
  beforeMount() {
    this.getSatellites();
  },
  methods: {
    async getSatellites() {
      const { data } = await axios.get(`https://api.tinygs.com/v1/satellites/?status=Supported`);
      console.log(data);
      
      this.satellites = data.map(x => x.name);
    },
    async send() {
      let params = {
        satellite: this.satellite,
        config: this.config
      }
      let config = {
        headers: {
          sessionToken: localStorage.sessionToken,
          userId: localStorage.userId
        }
      }
      console.log(this.modemConf);
      try {
        await axios.post(`https://api.tinygs.com/v1/station/${this.station}`, params, config);
      } catch (err) {
        console.log(JSON.stringify(err))
      }
      this.$emit("sent");
      this.modal = false
    }
  }
}
</script>

<style>

</style>