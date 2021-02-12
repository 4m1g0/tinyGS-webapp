<template>
  <v-layout row wrap>
    <v-flex xs12 sm6 md6 lg3 xl2>
      <div class="caption grey--text">Time</div>
      <div>{{`${dateFormat(packet.serverTime)} (${dateSince(packet.serverTime)})`}}</div>
    </v-flex>
    <v-flex xs6 sm3 md3 lg2 xl1>
      <div class="caption grey--text">Mode</div>
      <div>{{`${packet.mode}@${packet.freq}`}}</div>
    </v-flex>
    <v-flex xs6 sm3 md3 lg1 xl1>
      <div class="caption grey--text">Recived by</div>
      <div>{{`${packet.stationNumber} stations`}}</div>
    </v-flex>
    <v-flex class="d-none d-xl-inline-block xl4">
      <div class="caption grey--text">Data</div>
      <div>{{data.raw}}</div>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: "UndefinedPacket",
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
  }
}
</script>

<style>

</style>