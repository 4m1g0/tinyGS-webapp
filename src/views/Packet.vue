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
            <div v-if="packet.parsed && packet.template">
              <div v-if="packet.eclipseDepth">
                <div v-if="packet.sunLit">Sat in Sun ☀️ Eclipse Depth: {{(packet.eclipseDepth).toFixed(2)}}º</div>
                <div v-else>Sat in Umbra 🌌  Eclipse Depth: {{(packet.eclipseDepth).toFixed(2)}}º </div>
                <div>Theoretical coverage {{(packet.footPrint).toFixed(0)}} km </div>
              </div><br>
              <DynamicTemplate :packet="packet" :customTemplate="packet.template" />
              
            </div>
            <div v-else>
              <strong>Unrecognized packet.</strong> This packet does not match the known structure of this satellite. It might be an unknown packet or just terrestrial noise.
            </div>
          </v-card-text>
        </v-card>
       
        <v-card flat class="mr-5 my-3 grey--text text--darken-3">
          <v-card-text class="grey--text text--darken-3 mx-auto">
            <a class="download-btn" :href="downloadUrl" download="packet.bin">Download</a>
            <h2 class="ma-2">Hexadecimal view</h2>
            <HexView :raw="base64ToArrayBuffer(packet.raw)"/>
          </v-card-text>
        </v-card>
        <v-card v-if="packet.parsed" flat class="mr-5 my-3 pa-2 grey--text text--darken-3" style="overflow:auto;white-space: nowrap;max-height:600px;">
          <v-card-text class="grey--text text--darken-3 mx-auto">
            <h2 class="ma-2 mb-5">Raw parsed view</h2>
            <json-viewer copyable :expand-depth=0 boxed  :value="packet.parsed"></json-viewer>
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
import JsonViewer from 'vue-json-viewer'
import DynamicTemplate from '../components/DynamicTemplate.vue'
import StationRx from '../components/StationRx.vue'
import HexView from '../components/HexView.vue'
import PacketMap from '../components/PacketMap.vue'
import moment from 'moment'
import "leaflet/dist/leaflet.css"

export default {
  name: "Packet",
  components: {
    DynamicTemplate,
    StationRx,
    HexView,
    PacketMap,
    JsonViewer
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
  },
  computed: {
    downloadUrl() {
      return `data:application/octet-stream;base64,${this.packet.raw}`
    }
  }
}
</script>

<style>
.jv-container .jv-code {
  padding: 4px 10px;
}

.download-btn {
  position:absolute;
  right:20px;
  text-decoration: none;
  color:rgb(84, 176, 212) !important;
}
</style>