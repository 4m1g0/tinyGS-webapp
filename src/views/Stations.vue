<template>
  <div class="stations">
    <v-container>
      <v-layout row wrap v-if="stations">
        <v-flex xs12 sm12 pa-4>
          <div v-for="station in stations" :key="`${station.name}@${station.userId}`"> 
            <Station :station="station"/>
            <v-divider></v-divider>
          </div>
        </v-flex>
      </v-layout>
      <v-row v-else class="fill-height ma-0" align="center" justify="center">
        <v-progress-circular indeterminate color="grey"></v-progress-circular>
      </v-row>
    </v-container>
  </div>
</template>

<script>
const axios = require("axios");
import Station from '../components/Station.vue'

export default {
  name:"Stations",
  components: {
    Station
  },
  data() {
    return {
      stations: null
    }
  },
  beforeMount(){
    this.getStations()
  },
  methods:{
    async getStations() {
      const { data } = await axios.get("https://api.tinygs.com/v1/stations");
      console.log(data);
      this.stations = data;
    }
  }
  
}
</script>

<style>


</style>