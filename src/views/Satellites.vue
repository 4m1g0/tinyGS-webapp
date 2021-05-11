<template>
  <div class="satellites">
    <!--<h1 class="subheading grey--text">Satellites</h1>-->
    <v-container class="my-5">
      <v-layout row class="mx-3">
        <v-btn small text color="grey" class="Supported mx-1 text--darken-4" @click="filter(null)">
          <v-icon left small>mdi-filter-remove</v-icon>
          <span class="caption">All</span>
        </v-btn>
        <v-btn small text color="grey" class="Grey mx-1 text--darken-4" @click="filter3(400,550)">
          <v-icon left small>mdi-radio</v-icon>
          <span class="caption">433</span>
        </v-btn>
        <v-btn small text color="grey" class="Grey mx-1 text--darken-4" @click="filter3(800,950)">
          <v-icon left small>mdi-radio</v-icon>
          <span class="caption">868-915</span>
        </v-btn>
        <v-btn small text color="grey" class="Grey mx-1 text--darken-4" @click="filter3(2100,2500)">
          <v-icon left small>mdi-radio</v-icon>
          <span class="caption">2400</span>
        </v-btn>
        <v-btn small text color="grey" class="Supported mx-1 text--darken-4" @click="filter2('Supported')">
          <v-icon left small>mdi-satellite-variant</v-icon>
          <span class="caption">Supported</span>
        </v-btn>
        <v-btn small text color="grey" class="Future mx-1 text--darken-4" @click="filter2('Future')">
          <v-icon left small>mdi-satellite-variant</v-icon>
          <span class="caption">Future</span>
        </v-btn>
        <v-btn small text color="grey" class="Experimental mx-1 text--darken-4" @click="filter2('Experimental')">
          <v-icon left small>mdi-satellite-variant</v-icon>
          <span class="caption">Experimental</span>
        </v-btn>
        <v-btn small text color="grey" class="Inactive mx-1 text--darken-4" @click="filter2('Inactive')">
          <v-icon left small>mdi-satellite-variant</v-icon>
          <span class="caption">Inactive</span>
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
    filter2(status) {
      console.log(status)
      if (status === null) {
        this.satellites = this.origData;
        return
      }
      this.satellites = this.origData.filter((sat => sat.status == status))
    },
    filter3(freq_min,freq_max) {
      console.log(freq_min,freq_max)
      this.satellites = this.origData.filter(sat => sat.configurations.filter(conf => ( (freq_min < conf.freq )) && (conf.freq < freq_max) ).length > 0)
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

.Grey {
  background: #7f7f7f !important;
}

.Supported {
  background: #00C851 !important;
}

.Future {
  background: #5dbecc  !important;
}


.Experimental {
  background: #c4b152  !important;
}

.Inactive {
  background: #c80013  !important;
}

.clickable:hover {
  top: -5px;
}

</style>