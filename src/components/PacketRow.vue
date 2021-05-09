<template>
<v-card flat class="pa-7 clickable" :to="`/packet/${packet.id}`">
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
  <v-flex xs12 sm12 md12 lg6 xl8 v-if="packet.parsed && customTemplate">
    <DynamicTemplate class="pa-3" :packet="packet" :customTemplate="customTemplate" />
  </v-flex>
  <v-flex class="d-none d-xl-inline-block xl8" v-else>
    <div class="caption grey--text">Data</div>
    <div>{{toHex(packet.raw)}}</div>
  </v-flex>
  </v-layout>
</v-card>
</template>

<script>
import moment from 'moment'
import DynamicTemplate from './DynamicTemplate.vue'

export default {
  components: {
    DynamicTemplate
  },
  name: "PacketRow",
  props: [
    "packet",
    "customTemplate"
  ],
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