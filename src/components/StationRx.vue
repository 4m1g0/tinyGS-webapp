<template>
  <v-card flat class="pa-7 clickable" :to="`/station/${station.name}@${station.userId}`">
  <v-layout row wrap>
    <v-flex xs12 sm12 md12 lg2 xl2>
      <h3 class="caption grey--text">Station Name</h3>
      <div ><strong>📡 {{station.name}}</strong></div>
    </v-flex>
    <v-flex xs6 sm4 md2 lg1 xl1>
      <div class="caption grey--text text-center">📏 Distance</div>
      <div class="text-center">{{station.distance.toFixed(0)}} Km</div>
    </v-flex>
    <v-flex xs6 sm4 md2 lg1 xl1>
      <div class="caption grey--text text-center">📐 Elevation</div>
      <div class="text-center">{{(station.elevation || 0).toFixed(2)}}º</div>
    </v-flex>
    <v-flex xs6 sm4 md4 lg2 xl2>
      <div class="caption grey--text text-center">🕒 Time</div>
      <div class="text-center">{{formatTime(station.usec_time)}}</div>
    </v-flex>
    <v-flex xs6 sm4 md2 lg1 xl1>
      <div class="caption grey--text text-center">📶 RSSI</div>
      <div class="text-center">{{station.receptionParams.rssi}} dBm</div>
    </v-flex>
    <v-flex xs6 sm4 md3 lg1 xl1>
      <div class="caption grey--text text-center">SNR</div>
      <div class="text-center">{{station.receptionParams.snr}} dB</div>
    </v-flex>
    <v-flex xs6 sm4 md2 lg1 xl1>
      <div class="caption grey--text text-center">Predicted Doppler</div>
      <div class="text-center">{{((station.doppler * freq * 1000000 - freq * 1000000) || 0).toFixed(2)  || ""}} Hz</div>
    </v-flex>
    <v-flex xs6 sm4 md4 lg2 xl2>
      <div class="caption grey--text text-center">Frequency Error</div>
      <div class="text-center">{{station.receptionParams.frequency_error}} Hz</div>
    </v-flex>
    <v-flex xs6 sm4 md3 lg1 xl1>
      <div class="caption grey--text text-center">CRC Error</div>
      <div class="text-center"><v-icon color="red">{{station.crc_error?"mdi-checkbox-blank-circle":""}}</v-icon></div>
    </v-flex>

  </v-layout>
</v-card>
</template>

<script>
import moment from 'moment'

export default {
  props: [
    "station",
    "freq"
  ],
  methods: {
    dateSince(time) {
      return moment(time).fromNow()
    },
    formatTime(time) {
      return moment(time/1000).format('HH:mm:ss.SSS');
    }
  }
}
</script>

<style>

</style>