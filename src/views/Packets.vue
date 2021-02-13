<template>
  <div class="packets">
  <h1 class="subheading grey--text">Last packets</h1>
  <v-container>
    <v-layout row wrap v-if="packets">
      <v-flex xs12 sm12 pa-4>
        <div v-for="packet in packets" :key="packet.id"> 
          <v-card flat class="pa-7 clickable" :to="`/packet/${packet.id}`">
            <component v-bind:is="`${packet.satellite}Packet` || UndefinedPacket" :packet="packet"></component>
          </v-card>
          <v-divider></v-divider>
        </div>
      </v-flex>
    </v-layout>
    <v-row v-else class="fill-height ma-0" align="center" justify="center">
      <v-progress-circular indeterminate color="grey"></v-progress-circular>
    </v-row>
  </v-container>
  </div>
</template>

<script>
const axios = require("axios");
import NorbiPacket from '../components/packets/NorbiPacket.vue'
import UndefinedPacket from '../components/packets/UndefinedPacket.vue'

export default {
  name:"Packets",
  components: {
    NorbiPacket,
    UndefinedPacket
  },
  data() {
    return {
      packets: null
    }
  },
  beforeMount(){
    this.getPackets()
  },
  methods:{
    async getPackets() {
      const { data } = await axios.get("https://api.tinygs.com/v1/packets");
      console.log(data);
      this.packets = data;
    },
  }
  
}
</script>

<style>

</style>