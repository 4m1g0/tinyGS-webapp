<template>

  <div>
    <l-map
      @click="focusSatellite=null"
      :zoom="zoom"
      :center="center"
      style="height: 100%; width: 100%; z-index:0;"
    >
      <l-tile-layer
        :url="url"
        :attribution="attribution"
      />

      <l-marker v-for="satellite in satellites" :key="satellite.name" :lat-lng="[satellite.lat, satellite.lng]" :icon="satelliteIcon" @click="focusSatellite=satellite.name"> 
        <l-popup :content="`<h3>${satellite.displayName}</h3>`" @click="focusSatellite=null" />
      </l-marker>

      <l-marker v-for="station in focusStations" :key="`${station.name}@${station.userId}`" :lat-lng="station.location" :icon="(station.status == 0)?stationInactiveIcon:stationActiveIcon" :class="(station.status == 0)?'inactive':'active'" >

        <l-popup :content="`<h3><a href='/station/${station.name}@${station.userId}'>${station.name}</a></h3><br>
                            <strong>${(station.status==0)?'Last seen':'Last packet'}:</strong> ${(station.status==0)?formatDate(station.lastSeen):formatDate(station.lastPacketTime)} <br>
                            <strong >Version:</strong> ${station.version} <br>
                            <strong>Status:</strong> ${(station.status==0)?'Offline':'Online'} <br>
                            <strong>Listening:</strong> ${station.satellite} <br>`" />
      
      </l-marker>

    </l-map>
  </div>
</template>

<script>
import {
  LMap,
  LTileLayer,
  LPopup,
  LMarker,
} from "vue2-leaflet";
import { icon } from "leaflet";
const axios = require("axios");
import moment from 'moment'
  

export default {
  name: "Worldmap",
  components: {
    LMap,
    LTileLayer,
    LPopup,
    LMarker
  },
  props: [
      "packet"
  ],
  data() {
    return {
      satelliteIcon: icon({
                        iconUrl: 'https://static.tinygs.com/satellite_blue.png',
                        iconSize:     [32, 32], // size of the icon
                        iconAnchor:   [16, 16], // point of the icon which will correspond to marker's location
                    }),
      stationActiveIcon: icon({
                        iconUrl: 'https://static.tinygs.com/station_icon_green.png',
                        iconSize:     [32, 32], // size of the icon
                        iconAnchor:   [16, 16], // point of the icon which will correspond to marker's location
                    }),
      stationInactiveIcon: icon({
                        iconUrl: 'https://static.tinygs.com/station_icon_red.png',
                        iconSize:     [32, 32], // size of the icon
                        iconAnchor:   [16, 16], // point of the icon which will correspond to marker's location
                    }),
      zoom: 3,
      center: [35, 0],
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      stations: null,
      satellites: null,
      focusSatellite: null
    };
  },
  beforeMount(){
    this.getSatellites()
    this.getStations()
    //setInterval(this.getSatellites, 10000);
    //setInterval(this.getStations, 10000);
  },
  methods:{
    async getStations() {
      const { data } = await axios.get("https://api.tinygs.com/v1/stations");
      //console.log(data);
      this.stations = data;
    },
    async getSatellites() {
      const { data } = await axios.get("https://api.tinygs.com/v1/satellitesWorldmap");
      //console.log(data);
      this.satellites = data;
    },
    formatDate(time) {
      if (!time) { return "Never"}
      return moment(time).fromNow()
    },
  },
  computed:{ 
    focusStations: function (){
      if (!this.focusSatellite) return this.stations
      let root=this 
      return this.stations.filter((x)=>x.satellite==root.focusSatellite)
    }

  }

};
</script>

<style >
  .leaflet-marker-icon[src*="satellite_blue.png"] {
    z-index: 300 !important;
  }

  .leaflet-marker-icon[src*="station_icon_green.png"] {
    z-index: 200 !important;
  }

  .leaflet-marker-icon[src*="station_icon_red.png"] {
    z-index: 199 !important;
  }
</style>
