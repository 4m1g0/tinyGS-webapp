<template>
<div class="Dmap" style="height:100%;">
  <iframe id="satvis-frame" allowtransparency="true" src="https://static.tinygs.com/?elements=Point,Label,Orbit,Sensor%20cone&layers=OfflineHighres&gs=48.1770,11.7476&tags=tinyGS" style="display: block; width:100%;height:100%;"></iframe>
</div>
</template>

<script>

export default {
  name: "DMap",
  components: {

  },
  data() {
    return {
      packet: null,
    }
  },
  beforeMount() {
    
  },
  methods: {
   
  }
}
</script>

<style>

</style>