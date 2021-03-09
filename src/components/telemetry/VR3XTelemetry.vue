<template>
  <div>
    🔋 {{data.vbatt}} % ☀ " {{data.SolarChrging}} mA<br />
    Gyro X: {{data.gyro[0]}} Y: {{data.gyro[1]}}  Z: {{data.gyro[2]}}<br />
    🔛 Boot Counts: {{data.bootCounts}} VBus Resets: {{data.VBusResets}} <br />
    ⏰ Time Rollovers: {{data.TimeRollovers}} Timeouts: {{data.Timeouts}}<br />
    📡 GS Messages: {{data.GSMessages}} Last RRSI: {{data.LastGSRSSI}} <br/>
    CRC Errors: {{data.UHFCRCErrors}} Downlink count: {{data.DownlinkCount}}<br/>
    SC time: {{data.scTime}}
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