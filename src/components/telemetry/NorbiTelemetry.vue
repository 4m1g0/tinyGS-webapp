<template>
  <div v-if="'raw' in data.payload">
    No parser available for this type of packet
  </div>
  <div v-else>
    📻 {{data.payload.brkTransmitterPowerActive}}W  🌡 {{data.payload.brkTempActive}}ºC <br />
    🛰 {{data.payload.sesVoltage}}mV  🔌 {{data.payload.sesTotalPowerLoad}}mW <br />
    ☀️ {{data.payload.sesTotalGeneratedPower}}mW  🔋️{{data.payload.sesChargeLevelMAh}}mAh  ⛽️{{data.payload.sesTotalChargingPower}}mW  <br />
    🌡 Board PMM: {{data.payload.sesMedianPmmTemp}}ºC   PAM: {{data.payload.sesMedianPamTemp}}ºC   PDM: {{data.payload.sesMedianPdmTemp}}ºC <br />
    🌡 Solar Array X-: {{data.payload.sesMedianPanelXTempNegative}}ºC  Solar Array X+: {{data.payload.sesMedianPanelXTempPositive}}ºC <br />
    BRK Reset: {{data.payload.brkRestartsCountActive}}   Frame: {{data.payload.frameNumber}} <br />
  </div>   
</template>

<script>
export default {
  name:"NorbiTelemetry",
  props: [
    "data"
  ]
}
</script>

<style>

</style>