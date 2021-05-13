<template>
  <div class="stations">
    <v-container>
      <v-row class="ml-1 mt-2">
        <v-col cols="12" sm="12" md="4" lg="3" class="mt-1">
          <v-text-field v-model="findTxt" hide-details outlined dense clearable label="Find" prepend-inner-icon="mdi-magnify"></v-text-field>
        </v-col>
        <v-col cols="12" sm="12" md="4" lg="3">
          <v-select v-model="satelliteSelect" :items="satelliteItems" label="Satellite" multiple chips hide-details clearable dense prepend-inner-icon="mdi-filter-menu" :menu-props="{ bottom: true, offsetY: true }">
            <template v-slot:selection="data">
              <v-chip :class="data.item" :key="JSON.stringify(data.item)" v-bind="data.attrs" :input-value="data.selected" @click:close="satelliteSelect.splice(satelliteSelect.indexOf(data.item), 1)" close >
                {{ data.item }}
              </v-chip>
            </template>
          </v-select>
        </v-col>
      </v-row>
      <v-layout row wrap v-if="stations">
        <v-flex xs12 sm12 pa-4>
          <div v-for="station in currentPageStations" :key="`${station.name}@${station.userId}`"> 
            <Station :station="station"/>
            <v-divider></v-divider>
          </div>
        </v-flex>
      </v-layout>
      <v-row v-else class="fill-height ma-0" align="center" justify="center">
        <v-progress-circular indeterminate color="grey"></v-progress-circular>
      </v-row>
      <v-row justify="center">
        <v-col cols="4">
          <v-container class="max-width">
            <v-pagination v-show="pagLength > 1"
              v-model="page"
              :length="pagLength"
            ></v-pagination>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
const axios = require("axios");
import Station from '../components/Station.vue'

const itemsPerPage = 50;

export default {
  name:"Stations",
  components: {
    Station
  },
  data() {
    return {
      satelliteSelect: [],
      satelliteItems: [],
      findTxt: "",
      stations: null,
      page: 1,
    }
  },
  beforeMount(){
    this.getStations()
  },
  methods:{
    async getStations() {
      const { data } = await axios.get("https://api.tinygs.com/v1/stations");
      console.log(data);
      this.satelliteItems = data.map(item => item.satellite).filter((value, index, self) => self.indexOf(value) === index)
      this.stations = data;
    }
  },
  computed:{
    stationsFiltered() {
      if (!this.stations)
        return null
      
      let ret;
      if (this.satelliteSelect.length > 0)
        ret = this.stations.filter(s => this.satelliteSelect.includes(s.satellite))
      else
        ret = this.stations
      
      if (this.findTxt)
        ret = ret.filter(s => s.name.toLowerCase().includes(this.findTxt.toLowerCase()))
      
      return ret;
    },
    currentPageStations(){
      let start = itemsPerPage*(this.page-1)
      return this.stationsFiltered.slice(start, start+itemsPerPage);
    },
    pagLength(){
      
      if (!this.stationsFiltered)
        return 0

      return Math.round(this.stationsFiltered.length / itemsPerPage)
    }
  },
  watch: {
    findTxt(){
      this.page = 1
    },
    satelliteSelect(){
      this.page = 1
    },
    page() {
      window.scrollTo(0,0)
    }
  }
  
}
</script>

<style>


</style>