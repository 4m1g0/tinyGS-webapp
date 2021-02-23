<template>
  <div class="satellites">
    <!--<h1 class="subheading grey--text">Satellites</h1>-->
    <v-container class="my-5">
      <v-layout row class="mx-3">
        <v-btn small text color="grey" class="LoRa mx-1 text--darken-4" @click="filter(null)">
          <v-icon left small>mdi-radio</v-icon>
          <span class="caption">All</span>
        </v-btn>
        <v-btn small text color="grey" class="LoRa mx-1 text--darken-4" @click="filter('LoRa')">
          <v-icon left small>mdi-radio</v-icon>
          <span class="caption">LoRa</span>
        </v-btn>
        <v-btn small text color="grey" class="FSK mx-1 text--darken-4" @click="filter('FSK')">
          <v-icon left small>mdi-radio</v-icon>
          <span class="caption">FSK</span>
        </v-btn>
        <v-btn small text color="grey" class="GFSK9k6 mx-1 text--darken-4" @click="filter('GFSK9k6')">
          <v-icon left small>mdi-radio</v-icon>
          <span class="caption">GFSK9k6</span>
        </v-btn>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs12 sm6 md4 lg3 v-for="sat in satellites" :key="sat.name">
          <v-card class="text-center ma-4 rounded-lg clickable" :to="`satellite/${sat.name}`">
            <v-img height="250" :src="sat.images[0]">
              <template v-slot:placeholder>
                <v-row
                  class="fill-height ma-0"
                  align="center"
                  justify="center"
                >
                  <v-progress-circular
                    indeterminate
                    color="grey"
                  ></v-progress-circular>
                  
                </v-row>
              </template>
            </v-img>
            <!--<v-responsive class="pt-4">{{ sat.images[0] }}</v-responsive>-->
            <v-card-text>
              <div class="subheading">{{ sat.displayName }}</div>
              <div class="grey--text">{{ sat.description }}</div>
              <div class="mt-3" v-if="sat.status=='Future'"><strong>Launch Date:</strong> {{formatLaunchDate(sat.launchDate)}}</div>
            </v-card-text>
            <v-chip v-for="(conf,i) in sat.configurations" :key="i" :class="`${conf.mode} ma-2`">{{conf.mode}}@{{conf.freq}}</v-chip>
            <v-chip :class="`${sat.status} ma-2`">{{sat.status}}</v-chip>
            <v-card-actions>
              
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
const axios = require("axios");
import moment from 'moment'

export default {
  name: 'Satellites',
  data() {
    return {
      satellites: [],
      origData: []
    }
  },
  beforeMount() {
    this.getSatellites();
  },
  methods: {
    async getSatellites() {
      const { data } = await axios.get("https://api.tinygs.com/v1/satellites");
      console.log(data);
      this.origData = data;
      this.satellites = data;
    },
    filter(mode) {
      console.log(mode)
      if (mode === null) {
        this.satellites = this.origData;
        return
      }

      this.satellites = this.origData.filter(sat => sat.configurations.filter(conf => conf.mode == mode).length > 0)
    },
    formatLaunchDate(date){
      return moment(date).format('lll');
    }
  },
  
}
</script>

<style>
.subheading {
  margin: 10px 20px;
}

.LoRa {
  background: #3cd1c2 !important;
}

.FSK {
  background: #ffaa2c !important;
}

.GFSK9k6 {
  background: #f83e70 !important;
}

.clickable:hover {
  top: -5px;
}

</style>