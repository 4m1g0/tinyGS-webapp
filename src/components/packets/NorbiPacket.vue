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
  <v-flex xs12 sm12 md12 lg6 xl4 v-if="packet.parsed && !packet.parsed.payload.raw">
    <div>📻 {{packet.parsed.payload.brk_transmitter_power_active}}W  🌡 {{packet.parsed.payload.brk_temp_active}}ºC ☀️ {{packet.parsed.payload.ses_total_generated_power}}mW  🔋️{{packet.parsed.payload.ses_charge_level_m_ah}}mAh  ⛽️{{packet.parsed.payload.ses_total_charging_power}}mW</div>
    <div>🛰 {{packet.parsed.payload.ses_voltage}}mV  🔌 {{packet.parsed.payload.ses_total_power_load}}mW 🌡 Board PMM: {{packet.parsed.payload.ses_median_pmm_temp}}ºC   PAM: {{packet.parsed.payload.ses_median_pam_temp}}ºC </div>
  </v-flex>
  <v-flex class="d-none d-xl-inline-block xl4" v-if="packet.parsed">
    <div>🌡 Solar Array X-: {{packet.parsed.payload.ses_median_panel_x_temp_negative}}ºC  Solar Array X+: {{packet.parsed.payload.ses_median_panel_x_temp_positive}}ºC</div>
    <div>BRK Reset: {{packet.parsed.payload.brk_restarts_count_active}}   Frame: {{packet.parsed.payload.frame_number}}</div>
  </v-flex>
  <v-flex class="d-none d-xl-inline-block xl4" v-if="!packet.parsed">
    <div class="caption grey--text">Data</div>
    <div>{{data.raw}}</div>
  </v-flex>
  </v-layout>
</template>

<script>
import moment from 'moment'

export default {
  name: "NorbiPacket",
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