<template>
  <div class="satellites">
    <v-container class="my-5">
      <v-row class="ml-1">
        <v-col cols="12" sm="12" md="4" lg="3" class="mt-1">
          <v-text-field v-model="findTxt" hide-details outlined dense clearable label="Find" prepend-inner-icon="mdi-magnify"></v-text-field>
        </v-col>
        <v-col cols="12" sm="12" md="4" lg="3">
          <v-select v-model="statusSelect" :items="statusItems" label="Status" multiple chips hide-details clearable dense prepend-inner-icon="mdi-filter-menu" :menu-props="{ bottom: true, offsetY: true }">
            <template v-slot:selection="data">
              <v-chip :class="data.item" :key="JSON.stringify(data.item)" v-bind="data.attrs" :input-value="data.selected" @click:close="statusSelect.splice(statusSelect.indexOf(data.item), 1)" close >
                {{ data.item }}
              </v-chip>
            </template>
          </v-select>
        </v-col>
        <v-col cols="12" class="d-none d-md-block" md="4" lg="3">
          <v-select v-model="freqSelect" :items="freqItems" label="Frequency" multiple hide-details chips clearable dense prepend-inner-icon="mdi-filter-menu" :menu-props="{ bottom: true, offsetY: true }">
            <template v-slot:selection="data">
              <v-chip :class="data.item" :key="JSON.stringify(data.item)" v-bind="data.attrs" :input-value="data.selected" @click:close="freqSelect.splice(statusSelect.indexOf(data.item), 1)" close >
                {{ data.item }}
              </v-chip>
            </template>
          </v-select>
        </v-col>
      </v-row>
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
      findTxt: "",
      statusSelect: [],
      statusItems: ['Supported', 'Future', 'Experimental', 'Inactive'],
      freqSelect: [],
      freqItems: ['433','868-915','2400'],

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
    },
    formatLaunchDate(date){
      return moment(date).format('lll');
    },
  },
  computed:{
    satellites(){
      if (!this.origData)
        return null;
      
      let sats;
      if (this.findTxt)
        sats = this.origData.filter(s => s.name.toLowerCase().includes(this.findTxt.toLowerCase()) 
                                    || s.displayName.toLowerCase().includes(this.findTxt.toLowerCase())
                                    || s.longDescription.toLowerCase().includes(this.findTxt.toLowerCase()))
      else
        sats = this.origData
      
      if (this.statusSelect.length > 0)
        sats = sats.filter(sat => this.statusSelect.includes(sat.status))

      if (this.freqSelect.length > 0) {
        let freq_min, freq_max;
        if (this.freqSelect == '433') {
          freq_min = 400; freq_max = 550;
        } else if (this.freqSelect == '868-915') {
          freq_min = 800; freq_max = 950;
        } else if (this.freqSelect == '2400') {
          freq_min = 2100; freq_max = 2500;
        }

        sats = sats.filter(sat => sat.configurations.filter(conf => freq_min < conf.freq && conf.freq < freq_max).length > 0)
      }

      return sats
    }
  }
}

</script>

<style>
.subheading {
  margin: 10px 20px;
}

.Supported {
  background: #4CAF50 !important;
}

.Future {
  background: #82B1FF  !important;
}


.Experimental {
  background: #FFC107  !important;
}

.Inactive {
  background: #FF5252  !important;
}

.clickable:hover {
  top: -5px;
}

</style>