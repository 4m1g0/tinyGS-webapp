<template>
  <v-layout row wrap>
  <v-flex xs12 sm6 md6 lg3 xl2>
  <h3><v-icon>$satelliteDark</v-icon> {{packet.satellite}}</h3>
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
  <v-flex xs12 sm12 md12 lg6 xl3 v-if="packet.parsed">
    🔋 {{packet.parsed.vbatt}} % ☀ {{packet.parsed.SolarChrging}} mA SC time: {{packet.parsed.scTime}}<br />
    Gyro X: {{packet.parsed.gyro[0]}} Y: {{packet.parsed.gyro[1]}}  Z: {{packet.parsed.gyro[2]}}<br />
  </v-flex>
  <v-flex xs12 sm12 md12 lg6 xl2 v-if="packet.parsed">
    🔛 Boot Counts: {{packet.parsed.bootCounts}} VBus Resets: {{packet.parsed.VBusResets}} <br />
    ⏰ Time Rollovers: {{packet.parsed.TimeRollovers}} Timeouts: {{packet.parsed.Timeouts}}<br />
  </v-flex>
  <v-flex xs12 sm12 md12 lg6 xl3 v-if="packet.parsed">
    📡 GS Messages: {{packet.parsed.GSMessages}} Last RRSI: {{packet.parsed.LastGSRSSI}} <br/>
    CRC Errors: {{packet.parsed.UHFCRCErrors}} Downlink count: {{packet.parsed.DownlinkCount}}
  </v-flex>   
  <v-flex class="d-none d-xl-inline-block xl8" v-else>
    <div class="caption grey--text">Data</div>
    <div>{{toHex(packet.raw)}}</div>
  </v-flex>
  </v-layout>
</template>

<script>
import moment from 'moment'

export default {
  name: "VR3XPacket",
  props: [
    "packet"
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