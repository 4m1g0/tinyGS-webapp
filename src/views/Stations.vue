<template>
  <div class="stations">
    <!--<h1 class="subheading grey--text">Currently active stations</h1>-->
    <v-container>
      <v-layout row wrap v-if="stations">
        <v-flex xs12 sm12 pa-4>
          <div v-for="(station, i) in stations" :key="i"> 
            <v-card flat :class="`pa-7 clickable ${(station.status ? 'online' : 'offline')}`" :to="`/station/${station.name}@${station.userId}`">
              <v-layout row wrap>
                <v-flex xs12 sm12 md12 lg3 xl2>
                  <h3 class="caption grey--text">Station Name</h3>
                  <div ><strong>{{station.name}}</strong></div>
                </v-flex>
                <v-flex xs6 sm4 md3 lg2 xl1>
                  <div class="caption grey--text text-center">Listening</div>
                  <div class="text-center">{{station.satellite}}</div>
                </v-flex>
                <v-flex xs6 sm4 md3 lg1 xl1>
                  <div class="caption grey--text text-center">Version</div>
                  <div class="text-center">{{station.version}}</div>
                </v-flex>
                <v-flex xs6 sm4 md3 lg1 xl1>
                  <div class="caption grey--text text-center">Last seen</div>
                  <div class="text-center">{{dateSince(station.lastSeen)}}</div>
                </v-flex>
                <v-flex xs6 sm4 md3 lg1 xl1>
                  <div class="caption grey--text text-center">Auto tunning</div>
                  <div class="text-center"><v-icon>{{station.remoteTune?"mdi-check":"mdi-cancel"}}</v-icon></div>
                </v-flex>
                <v-flex xs6 sm4 md3 lg1 xl1>
                  <div class="caption grey--text text-center">Test mode</div>
                  <div class="text-center"><v-icon>{{station.test?"mdi-alert-outline":""}}</v-icon></div>
                </v-flex>
                <v-flex xs6 sm4 md3 lg1 xl1>
                  <div class="caption grey--text text-center">Confirmed packets</div>
                  <div class="text-center">{{station.confirmedPackets}}</div>
                </v-flex>
                
              </v-layout>
            </v-card>
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
import moment from 'moment'

export default {
  name:"Stations",
  components: {

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
    },
    dateSince(time) {
      console.log(time)
      return moment(time).fromNow()
    },
  }
  
}
</script>

<style>
.online {
  border-left: 4px solid green !important;
}

.offline {
  border-left: 4px solid red !important;
}

</style>