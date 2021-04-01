<template>

  <div>
    <l-map
      :zoom="zoom"
      :center="center"
      style="height: 100%; width: 100%; z-index:0;"
    >
      <l-tile-layer
        :url="url"
        :attribution="attribution"
      />

      <l-marker v-for="satellite in satellites" :key="satellite.name" :lat-lng="[satellite.lat, satellite.lng]" :icon="satelliteIcon"> 

        <l-popup :content="`<h3>${satellite.displayName}</h3>`" />
      </l-marker>

      <l-marker v-for="station in stations" :key="`${station.name}@${station.userId}`" :lat-lng="station.location" :icon="(station.status == 0)?stationInactiveIcon:stationActiveIcon">

        <l-popup :content="`<h3>${station.name}</h2><br>
                            <strong>Last seen:</strong> ${ formatDate(station.lastSeen) } <br>
                            <strong>Version:</strong> ${station.version} <br>
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
      satellites: null
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
      return moment(time).fromNow()
    },
  }
};
</script>
