<template>

  <div>
    <l-map
      :zoom="zoom"
      :center="center"
      style="height: 500px; width: 100%; z-index:0;"
    >
      <l-tile-layer
        :url="url"
        :attribution="attribution"
      />
      <l-circle v-if="packet.satPos"
        :lat-lng="circle.center"
        :radius="circle.radius"
      >
        
      </l-circle>

      <l-marker v-if="packet.satPos" :lat-lng="[packet.satPos.lat, packet.satPos.lng]" :icon="satelliteIcon"> 

        <l-popup :content="`<h3>${packet.satDisplayName}</h3>`" />
      </l-marker>

      <l-marker v-for="station in packet.stations" :key="`${station.name}@${station.userId}`" :lat-lng="station.location" :icon="(station.crc_error)?stationErrorIcon:stationActiveIcon">

        <l-popup :content="`<h3>${station.name}</h2><br>
                            <strong>Distance:</strong> ${station.distance?station.distance.toFixed(2):0} Km<br>
                            <strong>RSSI:</strong> ${station.receptionParams.rssi} dBm<br>
                            <strong>SNR:</strong> ${station.receptionParams.snr} Db<br>
                            <strong>Freq error:</strong> ${station.receptionParams.frequency_error} Hz<br>`" />
      </l-marker>

    </l-map>
  </div>
</template>

<script>
import {
  LMap,
  LTileLayer,
  LCircle,
  LPopup,
  LMarker,
} from "vue2-leaflet";
import { latLng, icon } from "leaflet";
  

export default {
  name: "PacketMap",
  components: {
    LMap,
    LTileLayer,
    LCircle,
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
      stationErrorIcon: icon({
                        iconUrl: 'https://static.tinygs.com/station_icon_orange.png',
                        iconSize:     [32, 32], // size of the icon
                        iconAnchor:   [16, 16], // point of the icon which will correspond to marker's location
                    }),
      zoom: 3,
      center: [this.packet.satPos?this.packet.satPos.lat:this.packet.stations[0].location[0], this.packet.satPos?this.packet.satPos.lng:this.packet.stations[0].location[1]],
      circle: {
        center: this.packet.satPos? latLng(this.packet.satPos.lat, this.packet.satPos.lng):[0,0],
        radius: (this.packet.footPrint*500)
      },
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    };
  },
};
</script>
