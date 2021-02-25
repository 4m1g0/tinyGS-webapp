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
      <l-circle
        :lat-lng="circle.center"
        :radius="circle.radius"
      >
        
      </l-circle>

      <l-marker :lat-lng="[packet.satPos.lat, packet.satPos.lng]" :icon="satelliteIcon"> 

        <l-popup :content="`<h3>${packet.satDisplayName}</h3>`" />
      </l-marker>

      <l-marker v-for="station in packet.stations" :key="`${station.name}@${station.userId}`" :lat-lng="station.location" :icon="(station.crc_error)?stationErrorIcon:stationActiveIcon">

        <l-popup :content="`<h3>${station.name}</h2><br>
                            <strong>Distance:</strong> ${station.distance.toFixed(2)} Km<br>
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
      zoom: 4,
      center: [this.packet.satPos.lat, this.packet.satPos.lng],
      circle: {
        center: latLng(this.packet.satPos.lat, this.packet.satPos.lng),
        radius: 2500000
      },
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    };
  },
};
</script>
