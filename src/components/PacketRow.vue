<template>
  <v-layout row wrap>
  <v-flex xs12 sm6 md6 lg3 xl2>
  <h3><v-icon>$satelliteDark</v-icon> {{packet.parsed?packet.satDisplayName:"Unknown"}}</h3>
  <div>{{`${dateFormat(packet.serverTime)} (${dateSince(packet.serverTime)})`}}</div>
  </v-flex>
  <v-flex xs6 sm3 md3 lg2 xl1>
  <div class="caption grey--text">Mode</div>
  <div>{{`${packet.mode}@${packet.freq}`}}</div>
  </v-flex>
  <v-flex xs6 sm3 md3 lg1 xl1>
  <div class="caption grey--text">Received by</div>
  <div>{{`${packet.stationNumber} stations`}}</div>
  </v-flex>
  
  </v-layout>
</template>

<script>
import moment from 'moment'

export default {
  name: "NorbiPacket",
  props: [
    "packet",
    "customTemplate"
  ],
  data() {
    return {
        parsedContent: null
    }
  },
  mounted(){
    this.parsedContent = Vue.compile(this.customTemplate).render;
  },
  methods: {
    dateFormat(time){
      return moment(time).format("lll")
    },
    dateSince(time) {
      return moment(time).fromNow()
    },
    toHex(data){
      if (data.startsWith("VGlueUdTLXRlc3Q"))
        return "TinyGS Test Packet"
      
      if (data.startsWith("RXJyb3JfQ1JD"))
        return "CRC ERROR"

      var decodedData = Buffer.from(data, 'base64')
      let packetData = "";
      for (var i = 0; i < decodedData.length; i++) {
          if (decodedData[i] <= 0xF) { packetData += "0"; }
          else { packetData += ""; }
          packetData += decodedData[i].toString(16) + "";
      }
      return packetData;
    }
  }
}
</script>

<style>

</style>