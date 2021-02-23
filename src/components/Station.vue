<template>
  <v-card flat :class="`pa-7 clickable ${(station.status ? 'online' : 'offline')}`" :to="`/station/${station.name}@${station.userId}`">
  <v-layout row wrap>
    <v-flex xs12 sm12 md12 lg3 xl2>
      <h3 class="caption grey--text">Station Name</h3>
      <div ><strong>{{station.name}}</strong></div>
    </v-flex>
    <v-flex xs6 sm4 md3 lg2 xl1>
      <div class="caption grey--text text-center">Listening</div>
      <div class="text-center">{{station.satellite}}</div>
    </v-flex>
    <v-flex xs6 sm4 md3 lg1 xl1>
      <div class="caption grey--text text-center">Version</div>
      <div class="text-center">{{station.version}}</div>
    </v-flex>
    <v-flex xs6 sm4 md3 lg1 xl1>
      <div class="caption grey--text text-center">Last seen</div>
      <div class="text-center">{{dateSince(station.lastSeen)}}</div>
    </v-flex>
    <v-flex xs6 sm4 md3 lg1 xl1>
      <div class="caption grey--text text-center">Auto tunning</div>
      <div class="text-center"><v-icon>{{station.remoteTune?"mdi-check":"mdi-cancel"}}</v-icon></div>
    </v-flex>
    <v-flex xs6 sm4 md3 lg1 xl1>
      <div class="caption grey--text text-center">Test mode</div>
      <div class="text-center">{{station.test?"ON":"OFF"}}</div>
    </v-flex>
    <v-flex xs6 sm4 md3 lg1 xl1>
      <div class="caption grey--text text-center">Telemetry packets</div>
      <div class="text-center">{{station.telemetryPackets}}</div>
    </v-flex>
    <v-flex xs6 sm4 md3 lg1 xl1>
      <div class="caption grey--text text-center">Confirmed packets</div>
      <div class="text-center">{{station.confirmedPackets}}</div>
    </v-flex>
  </v-layout>
</v-card>
</template>

<script>
import moment from 'moment'

export default {
  props: [
    "station"
  ],
  methods: {
    dateSince(time) {
      return moment(time).fromNow()
    },
  }
}
</script>

<style>
.online {
  border-left: 4px solid green !important;
}

.offline {
  border-left: 4px solid red !important;
}

</style>