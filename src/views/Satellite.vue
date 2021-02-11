<template>
<div class="satellite">
  <v-container>
    <v-layout row wrap v-if="satellite">
      <!-- description -->
      <v-flex pa-4 mt-2 xs12 sm6 class="grey--text text--darken-1"> 
        <h1 class="heading">{{ satellite.displayName }}</h1>
        <p v-html="satellite.description"></p>
        <v-card class="mr-5 pa-4 grey--text text--darken-3" style="overflow:auto">
          1 40378U 15003C   21041.25088245  .00002749  00000-0  10509-3 0  9993<br>
          2 40378  99.0833 156.2258 0119588 238.5994 120.3496 15.21428593333450
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
      <!-- Telemetry -->
      <v-flex pa-4 mt-2 xs12 sm6 class="grey--text text--darken-1">
        <v-card class="ma-2 pa-4 grey--text text--darken-3">
          <h2>Last telemetry</h2>
          <v-card-text class="grey--text text--darken-3 mx-auto">
                <div v-if="'raw' in satellite.lastTelemetry">
                    {{satellite.lastTelemetry.payload.raw}}<br />
                </div>
                <div v-else>
                  📻 {{satellite.lastTelemetry.payload.brk_transmitter_power_active}}W  🌡 {{satellite.lastTelemetry.payload.brk_temp_active}}ºC <br />
                  🛰 {{satellite.lastTelemetry.payload.ses_voltage}}mV  🔌 {{satellite.lastTelemetry.payload.ses_total_power_load}}mW <br />
                  ☀️ {{satellite.lastTelemetry.payload.ses_total_generated_power}}mW  🔋️{{satellite.lastTelemetry.payload.ses_charge_level_m_ah}}mAh  ⛽️{{satellite.lastTelemetry.payload.ses_total_charging_power}}mW  <br />
                  🌡 Board PMM: {{satellite.lastTelemetry.payload.ses_median_pmm_temp}}ºC   PAM: {{satellite.lastTelemetry.payload.ses_median_pam_temp}}ºC   PDM: {{satellite.lastTelemetry.payload.ses_median_pdm_temp}}ºC <br />
                  🌡 Solar Array X-: {{satellite.lastTelemetry.payload.ses_median_panel_x_temp_negative}}ºC  Solar Array X+: {{satellite.lastTelemetry.payload.ses_median_panel_x_temp_positive}}ºC <br />
                  BRK Reset: {{satellite.lastTelemetry.payload.brk_restarts_count_active}}   Frame: {{satellite.lastTelemetry.payload.frame_number}} <br />
                </div>   
          </v-card-text>
        </v-card>
      </v-flex>
      <!-- chart -->
      <!--<v-flex pa-4 mt-2 xs12 sm6 class="grey--text text--darken-1">
        <line-chart height="200" width="400" v-if="datacollection" :chart-data="datacollection" :options="options"></line-chart>
        <button @click="fillData()">Randomize</button>
      </v-flex>-->
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


export default {
  name: "Satellite",
  components: {
    //LineChart
  },
  data() {
    return {
      satellite: null,
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
    this.fillData()
  },
  methods: {
    async getSatellite() {
      const { data } = await axios.get(`https://api.tinygs.com/v1/satellite/${this.$route.params.name}`);
      console.log(data);
      this.satellite = data;
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
    }
  }
}
</script>

<style>

</style>