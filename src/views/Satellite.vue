<template>
<div class="satellite">
  <v-container>
    <v-layout row wrap v-if="satellite">
      <!-- description -->
      <v-flex pa-4 mt-2 xs12 sm6 class="grey--text text--darken-1"> 
        <h1 class="heading">{{ satellite.displayName }}</h1>
        <p v-html="satellite.description"></p>
        <ul>
          <li><strong>Status:</strong> {{satellite.status}}</li>
          <li><strong>Launch Date:</strong> {{formatLaunchDate(satellite.launchDate)}}</li>
        </ul>
        <v-card flat class="mr-5 my-3 pa-4 grey--text text--darken-3" style="overflow:auto;white-space: nowrap;">
          <h3>TLEs</h3>
          <v-card-text class="grey--text text--darken-3 mx-auto">
            {{satellite.tle[0]}}<br>
            {{satellite.tle[1]}}<br>
            {{satellite.tle[2]}}
          </v-card-text>
        </v-card>
        <!-- Telemetry -->
        <v-card v-if="satellite.lastTelemetry" flat class="mr-5 my-3 pa-4 grey--text text--darken-3">
          <h2>Last telemetry</h2>
          <v-card-text class="grey--text text--darken-3 mx-auto">
            <NorbiTelemetry :data="satellite.lastTelemetry"/>
          </v-card-text>
        </v-card>
      </v-flex>
      <!-- images -->
      <v-flex pa-4 mt-2 xs12 sm6 class="grey--text text--darken-1">
        <v-layout row wrap>
          <v-flex xs12 md6 v-for="image in satellite.images" :key="image">
              <v-card class="ma-2">
                <v-img :src="image" height="300px"></v-img>
              </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
      
      <!-- chart -->
      <!--<v-flex pa-4 mt-2 xs12 sm6 class="grey--text text--darken-1">
        <line-chart height="200" width="400" v-if="datacollection" :chart-data="datacollection" :options="options"></line-chart>
        <button @click="fillData()">Randomize</button>
      </v-flex>-->
      <!-- Packets -->
      <v-flex xs12 sm12 pa-4 v-if="packets && packets.length > 0">
        <div  v-for="packet in packets" :key="packet.id"> 
          <v-card flat class="pa-7 clickable" :to="`/packet/${packet.id}`">
            <!--<NorbiPacket :packet="packet"/>-->
            <component v-bind:is="getComponent(packet.satellite)" :packet="packet"></component>
          </v-card>
          <v-divider></v-divider>
        </div>
      </v-flex>
      <v-flex xs12 sm12 pa-4 v-else>
        <div class="text-center grey--text text--darken-3">
          No packets yet.
        </div>
      </v-flex>
    </v-layout>
    <div v-else> <!-- loading spinner -->
      <v-row class="fill-height ma-16" align="center" justify="center">
        <v-progress-circular indeterminate color="grey"></v-progress-circular>
      </v-row>
    </div>
  </v-container>
</div>
</template>

<script>
const axios = require("axios");
//import LineChart from '../charts/LineChart.js'
import NorbiTelemetry from '../components/telemetry/NorbiTelemetry.vue'
import NorbiPacket from '../components/packets/NorbiPacket.vue'
import UndefinedPacket from '../components/packets/UndefinedPacket.vue'
import moment from 'moment'

export default {
  name: "Satellite",
  components: {
    //LineChart,
    NorbiTelemetry,
    NorbiPacket,
    UndefinedPacket
  },
  data() {
    return {
      satellite: null,
      packets: null,
      datacollection: null,
      options: {
        scales: {
            xAxes: [{
                type: 'time',
                distribution: 'series'
            }]
        }
    }
    }
  },
  beforeMount() {
    this.getSatellite()
    this.getPackets()
    this.fillData()
  },
  methods: {
    async getSatellite() {
      const { data } = await axios.get(`https://api.tinygs.com/v1/satellite/${this.$route.params.name}`);
      console.log(data);
      this.satellite = data;
    },
    async getPackets() {
      const { data } = await axios.get(`https://api.tinygs.com/v1/packets?satellite=${this.$route.params.name}`);
      console.log(data);
      this.packets = data;
    },
    fillData () {
      this.datacollection = {
        //labels: [this.d, this.getRandomInt(), this.getRandomInt(), this.getRandomInt()],
        data: [
          {
              x: new Date(),
              y: 1
          }, {
              t: new Date(),
              y: 10
          }
        ]
      }
    },
    getRandomInt () {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5
    },
    getComponent(sat) {
      if (["NorbiPacket"].includes(`${sat}Packet`)) {
        return `${sat}Packet`
      }
      else {
        return "UndefinedPacket"
      }
    },
    formatLaunchDate(date){
      return moment(date).format('lll');
    }
  }
}
</script>

<style>

.clickable:hover {
  right: -1px;
}
</style>