<template>
  <div v-if="'raw' in data">
    {{data.payload.raw}}<br />
  </div>
  <div v-else>
    📻 {{data.payload.brk_transmitter_power_active}}W  🌡 {{data.payload.brk_temp_active}}ºC <br />
    🛰 {{data.payload.ses_voltage}}mV  🔌 {{data.payload.ses_total_power_load}}mW <br />
    ☀️ {{data.payload.ses_total_generated_power}}mW  🔋️{{data.payload.ses_charge_level_m_ah}}mAh  ⛽️{{data.payload.ses_total_charging_power}}mW  <br />
    🌡 Board PMM: {{data.payload.ses_median_pmm_temp}}ºC   PAM: {{data.payload.ses_median_pam_temp}}ºC   PDM: {{data.payload.ses_median_pdm_temp}}ºC <br />
    🌡 Solar Array X-: {{data.payload.ses_median_panel_x_temp_negative}}ºC  Solar Array X+: {{data.payload.ses_median_panel_x_temp_positive}}ºC <br />
    BRK Reset: {{data.payload.brk_restarts_count_active}}   Frame: {{data.payload.frame_number}} <br />
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