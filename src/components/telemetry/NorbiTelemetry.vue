<template>
  <div v-if="'raw' in data.lastTelemetry">
    {{data.lastTelemetry.payload.raw}}<br />
  </div>
  <div v-else>
    📻 {{data.lastTelemetry.payload.brk_transmitter_power_active}}W  🌡 {{data.lastTelemetry.payload.brk_temp_active}}ºC <br />
    🛰 {{data.lastTelemetry.payload.ses_voltage}}mV  🔌 {{data.lastTelemetry.payload.ses_total_power_load}}mW <br />
    ☀️ {{data.lastTelemetry.payload.ses_total_generated_power}}mW  🔋️{{data.lastTelemetry.payload.ses_charge_level_m_ah}}mAh  ⛽️{{data.lastTelemetry.payload.ses_total_charging_power}}mW  <br />
    🌡 Board PMM: {{data.lastTelemetry.payload.ses_median_pmm_temp}}ºC   PAM: {{data.lastTelemetry.payload.ses_median_pam_temp}}ºC   PDM: {{data.lastTelemetry.payload.ses_median_pdm_temp}}ºC <br />
    🌡 Solar Array X-: {{data.lastTelemetry.payload.ses_median_panel_x_temp_negative}}ºC  Solar Array X+: {{data.lastTelemetry.payload.ses_median_panel_x_temp_positive}}ºC <br />
    BRK Reset: {{data.lastTelemetry.payload.brk_restarts_count_active}}   Frame: {{data.lastTelemetry.payload.frame_number}} <br />
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