<template>
  <v-runtime-template :template="customTemplate"></v-runtime-template>
</template>

<script>
import VRuntimeTemplate from "v-runtime-template";

export default {
  components: {
    VRuntimeTemplate
  },
  props: [
    "packet",
    "customTemplate"
  ],
  methods: {
    round(x){
      if (x)
        return Math.round(x);
      return null;
    },
    fixed2(x){
      if (x)
        return x.toFixed(2);
      return null;
    },
    fixed3(x){
      if (x)
        return x.toFixed(3);
      return null;
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
  },
  computed: {
    h() {
      let packet = this.packet;
      if (packet && packet.parsed && packet.parsed.header)
        return packet.parsed.header
      return null
    },
    p() {
      let packet = this.packet;
      if (packet && packet.parsed && packet.parsed.payload)
        return packet.parsed.payload
      return null
    },
  }
}
</script>

<style>

</style>