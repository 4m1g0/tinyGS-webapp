<template>
  <div class="user">
  <v-container>
    <v-layout row wrap v-if="user">
      <!-- description -->
      <v-flex mt-4 ml-4 xs12 class="grey--text text--darken-1"> 
        <h1 class="heading">User Console</h1>
      </v-flex>
      <v-flex pa-4 xs12 sm6 class="grey--text text--darken-1"> 
        <v-card flat class="mr-5 my-3 pa-2 grey--text text--darken-3">
          <v-card-text class="grey--text text--darken-3 mx-auto">
            We are still working on this component ;)
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex pa-4 xs12 sm6 class="grey--text text--darken-1"> 
        <v-card flat class="mr-5 my-3 pa-4 grey--text text--darken-3">
          <v-card-text class="grey--text text--darken-3 mx-auto">
            We are still working on this component ;)
          </v-card-text>
        </v-card>
      </v-flex>
      
  
      <!-- Stations -->
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
  components: {
    Station
  },
  data() {
    return {
      user: true,
      stations: null
    }
  },
  beforeMount(){
    this.getStations()
  },
  methods:{
    async getStations() {
      if (!localStorage.userId)
        return;

      const { data } = await axios.get(`https://api.tinygs.com/v1/stations?userId=${localStorage.userId}`);
      console.log(data);
      this.stations = data;
    }
  }
}
</script>

<style>

</style>