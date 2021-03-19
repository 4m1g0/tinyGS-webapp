<template>
<div class="packet">
  <v-container>
    <v-layout row wrap v-if="packet">
      <!-- description -->
      <v-flex mt-4 ml-4 xs12 class="grey--text text--darken-1"> 
        <h1 class="heading">{{ packet.name }}</h1>
      </v-flex>
      <v-flex pa-4 xs12 sm6 class="grey--text text--darken-1"> 
        
        <v-card flat class="mr-5 my-3 pa-2 grey--text text--darken-3">
          <v-card-text class="grey--text text--darken-3 mx-auto">
            <h1 class="ma-2 mb-5">{{packet.satDisplayName || packet.satellite}}</h1>
            <div>Received on: {{formatDate(packet.serverTime)}}</div>
            <div v-if="packet.mode == 'FSK'">
              <i>{{packet.mode}}</i> {{packet.freq}} Mhz  BR: {{packet.bitrate}}  FD: {{packet.freqDev}}  BW: {{packet.rxBw}} kHz
            </div>
            <div v-else>
              <i>{{packet.mode}}</i> {{packet.freq}} Mhz  SF: {{packet.sf}}  CR: {{packet.cr}}  BW: {{packet.bw}} kHz
            </div>
            <br>
            <component v-bind:is="getComponent(packet.satellite)" v-if="packet.parsed" :data="packet.parsed"></component>
          </v-card-text>
        </v-card>
        <v-card flat class="mr-5 my-3 pa-2 grey--text text--darken-3">
          <v-card-text class="grey--text text--darken-3 mx-auto">
            <h2 class="ma-2 mb-5">Hexadecimal view</h2>
            <HexView :raw="base64ToArrayBuffer(packet.raw)"/>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex pa-4 xs12 sm6 class="grey--text text--darken-1"> 
        <v-card flat class="mr-5 my-3 pa-4 grey--text text--darken-3">
          <PacketMap :packet="packet" />
        </v-card>
      </v-flex>
      
      <!-- Packets -->
      <v-flex xs12 sm12 pa-4>
        <div v-for="station in packet.stations" :key="`${station.name}@${station.userId}`"> 
          <StationRx :station="station" :freq="packet.freq"/>
          <v-divider></v-divider>
        </div>
      </v-flex>
      
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
import NorbiTelemetry from '../components/telemetry/NorbiTelemetry.vue'
import VR3XTelemetry from '../components/telemetry/VR3XTelemetry.vue'
import StationRx from '../components/StationRx.vue'
import HexView from '../components/HexView.vue'
import PacketMap from '../components/PacketMap.vue'
import moment from 'moment'
import "leaflet/dist/leaflet.css"

export default {
  name: "Packet",
  components: {
    NorbiTelemetry,
    StationRx,
    HexView,
    PacketMap,
    VR3XTelemetry
  },
  data() {
    return {
      packet: null,
    }
  },
  beforeMount() {
    this.getPacket()
  },
  methods: {
    async getPacket() {
      const { data } = await axios.get(`https://api.tinygs.com/v1/packet/${this.$route.params.id}`);
      console.log(data);
      this.packet = data;
    },
    formatDate(time) {
      return moment(time).format('LLL')
    },
    base64ToArrayBuffer(base64) {
        var binary_string = atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    },
    getComponent(sat) {
      sat = sat.replace("-A", "").replace("-B", "").replace("-C", "") // VR3X hack untill we impliment a way to handle constellations
      if (["Norbi", "VR3X"].includes(`${sat}`)) {
        return `${sat}Telemetry`
      }
      else {
        return "NorbiTelemetry"
      }
    },
  }
}
</script>

<style>

</style>