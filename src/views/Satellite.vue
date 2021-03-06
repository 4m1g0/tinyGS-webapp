<template>
<div class="satellite">
  <v-container v-if="satellite">
    <v-layout row wrap>
      <!-- column 1 -->
      <v-flex pa-4 mt-2 xs12 sm6 class="grey--text text--darken-1"> 
        <!-- description -->
        <h1 class="heading">{{ satellite.displayName }}</h1>
        <p v-html="satellite.longDescription"></p>
        <ul>
          <li><strong>Status:</strong> {{satellite.status}}</li>
          <li><strong>Launch Date:</strong> {{formatLaunchDate(satellite.launchDate)}}</li>
        </ul>
        <v-card v-if="satellite.tle && satellite.tle.length == 3" flat class="mr-5 my-3 pa-4 grey--text text--darken-3" style="overflow:auto;white-space: nowrap;">
          <h3>TLEs</h3>
          <v-card-text class="grey--text text--darken-3 mx-auto">
            <pre>
{{satellite.tle[0]}}
{{satellite.tle[1]}}
{{satellite.tle[2]}}
            </pre>
          </v-card-text>
        </v-card>
        <!-- Telemetry -->
        <v-card v-if="satellite.lastTelemetry && satellite.webTemplate" flat class="mr-5 my-3 pa-4 grey--text text--darken-3">
          <h2>Last telemetry</h2>
          <v-card-text class="grey--text text--darken-3 mx-auto">
            <DynamicTemplate :packet="lastTelemetry" :customTemplate="satellite.webTemplate" />
          </v-card-text>
        </v-card>


      </v-flex>

      <!-- Column 2 -->
      <v-flex pa-4 mt-2 xs12 sm6 class="grey--text text--darken-1">
        <!-- satvis -->
        <v-card flat class="mr-5 my-3 pa-2 grey--text text--darken-3" style="min-height:500px;">
          <iframe id="satvis-frame" allowtransparency="true" :src="`https://viewer.tinygs.com/?elements=Point,Label,Orbit,Sensor-cone,Ground-station-link&layers=OfflineHighres&tags=TinyGS&sat=${satellite.displayName}`" class="satvis" :class="{'satvis-fullScreen': satvisFullScreen, 'satvis-normal': !satvisFullScreen}"></iframe>
          <div class="credits-satvis">Powered by <a href="https://github.com/Flowm/satvis">Satvis</a> (MIT)</div>
          <v-btn @click="satvisFullScreen = !satvisFullScreen" class="mr-2" :class="{'fullScreen-btn-fullScreen': satvisFullScreen, 'fullScreen-btn-normal': !satvisFullScreen}" icon>
            <v-img contain transition="fade-transition" max-height="60" src="../assets/fullScren-but.png" />
          </v-btn>
        </v-card>

        <!-- images -->
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
    </v-layout>
      <!-- Packets -->
      
      <!--<h3>Packet list</h3>-->
    <v-divider class="mt-6"></v-divider>
    <div class="pa-4" v-if="packets && packets.length > 0">
      <div  v-for="packet in packets" :key="packet.id"> 
        <PacketRow :packet="packet" :customTemplate="customTemplates[packet.satellite]" />
        <v-divider></v-divider>
      </div>
    </div>
    <div class="pa-4" v-else>
      <div class="text-center grey--text text--darken-3">
        No packets yet.
      </div>
    </div>
  </v-container>
  <div v-else> <!-- loading spinner -->
    <v-row class="fill-height ma-16" align="center" justify="center">
      <v-progress-circular indeterminate color="grey"></v-progress-circular>
    </v-row>
  </div>
  
</div>
</template>

<script>
const axios = require("axios");
//import LineChart from '../charts/LineChart.js'
import PacketRow from '../components/PacketRow.vue'
import moment from 'moment'
import DynamicTemplate from '../components/DynamicTemplate.vue'

export default {
  name: "Satellite",
  components: {
    //LineChart,
    PacketRow,
    DynamicTemplate
  },
  data() {
    return {
      satellite: null,
      packets: null,
      customTemplates: null,
      datacollection: null,
      satvisFullScreen: false,
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
    //this.fillData()
  },
  methods: {
    async getSatellite() {
      const { data } = await axios.get(`https://api.tinygs.com/v1/satellite/${this.$route.params.name}`);
      console.log(data);
      this.satellite = data;
      document.title = `${this.satellite.displayName} satellite - TinyGS`
    },
    async getPackets() {
      const { data } = await axios.get(`https://api.tinygs.com/v2/packets?satellite=${this.$route.params.name}`);
      console.log(data);
      this.customTemplates = data.templates;
      this.packets = data.packets;

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
    formatLaunchDate(date){
      return moment(date).format('lll');
    }
  },
  computed: {
    lastTelemetry(){ // adaptor to use last telemetry as if it were a full packet
      if (this.satellite && this.satellite.lastTelemetry)
        return {parsed:this.satellite.lastTelemetry};
      return null;
    }
  }
}
</script>

<style>

.clickable:hover {
  right: -1px;
}

.credits-satvis {
  position: absolute;
  right: 0;
  bottom: 0;
  margin: 9px;
  font-size: 0.7em;
  border-radius: 0 !important;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 2px;
}

.satvis-fullScreen {
  position: fixed;
  top: 65px;
  left:0;
  padding-bottom: 65px;
  height: 100%;
  width: 100%;
  z-index: 2;
}

.satvis-normal {
  display: block;
  width: 100%;
  height: 500px;
}

.fullScreen-btn-normal {
  position: absolute;
  right: 4px;
  bottom: 35px;
}

.fullScreen-btn-fullScreen {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 3;
}
</style>