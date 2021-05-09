<template>
  <v-runtime-template :template="customTemplate"></v-runtime-template>
</template>

<script>
import VRuntimeTemplate from "v-runtime-template";

export default {
  components: {
    VRuntimeTemplate
  },
  props: [
    "packet",
    "customTemplate"
  ],
  methods: {
    round(x){
      if (x)
        return Math.round(x);
      return null;
    },
    fixed2(x){
      if (x)
        return x.toFixed(2);
      return null;
    },
    fixed3(x){
      if (x)
        return x.toFixed(3);
      return null;
    }
  },
  computed: {
    h() {
      let packet = this.packet;
      if (packet && packet.parsed && packet.parsed.header)
        return packet.parsed.header
      return null
    },
    p() {
      let packet = this.packet;
      if (packet && packet.parsed && packet.parsed.payload)
        return packet.parsed.payload
      return null
    },
  }
}
</script>

<style>

</style>