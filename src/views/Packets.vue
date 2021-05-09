<template>
  <div class="packets">
  <h1 class="subheading grey--text">Last packets</h1>
  <v-container>
    <v-layout row wrap v-if="packets">
      <v-flex xs12 sm12 pa-4>
        <div v-for="packet in packets" :key="packet.id"> 
          <PacketRow :packet="packet" :customTemplate="customTemplates[packet.satellite]" />
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
import PacketRow from '../components/PacketRow.vue'

export default {
  name:"Packets",
  components: {
    PacketRow
  },
  data() {
    return {
      packets: null,
      customTemplates: null
    }
  },
  beforeMount(){
    this.getPackets()
  },
  methods:{
    async getPackets() {
      const { data } = await axios.get("https://api.tinygs.com/v2/packets");
      console.log(data);
      this.packets = data.packets;
      this.customTemplates = data.templates;
    },
  }
}
</script>

<style>

</style>