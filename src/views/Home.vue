<template>
  <div class="home">
    <div class="map" style="height:70%">
        <iframe src="https://fossa.apaluba.com/worldmap/" style="height:100%;width:100%;" ></iframe>
    </div>
    <v-container>
      <h2 class="grey--text text--darken-1">Welcome to TinyGS, the Open Source Global Satellite Network</h2>
    <p></p>
    </v-container>
      
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  components: {

  }
}
</script>

<style scoped>
.home {
  height: 100%;
}

h2 {
  text-align: center;
}
</style>
