<template>
  <v-container fluid class="ma-0 pa-0">
        <iframe src="https://api.tinygs.com/worldmap/" style="height:60vh;width:100%;" ></iframe>
    <v-container class="grey--text text--darken-3">
      <h2 class="grey--text text--darken-3 mb-4">Welcome to TinyGS, the Open Source Global Satellite Network</h2>
      <p>TinyGS is an open network of Ground Stations distributed around the world to receive and operate LoRa satellites, weather probes and other flying objects, using cheap and versatile modules.</p>
      <p>This project is based on ESP32 boards and currently it is compatible with sx126x and sx127x LoRa módules but we plan to support more radio módules in the future.</p>
      <v-layout row wrap class="justify-center py-6">
        <v-flex sm12 md4 pa-4 >
          <v-layout justify-center>
            <v-card class="pa-2 ma-2 rounded-xl stats-card">
              <v-card-text>
                <div class="text-center display-1 "><v-icon x-large class="display-3 pb-3">mdi-account-group</v-icon></div>
                <div class="text-center display-2 ">{{statistics.members}}</div>
                <div class="subheading font-weight-bold text-center">Members</div>
              </v-card-text>
            </v-card>
          </v-layout>
        </v-flex>
        <v-flex sm12 md4 pa-4>
          <v-layout justify-center>
            <v-card class="pa-2 ma-2 rounded-xl stats-card">
              <v-card-text>
                <div class="text-center display-1"><v-icon x-large class="display-3 pb-3">mdi-satellite-uplink</v-icon></div>
                <div class="text-center display-2">{{statistics.stations}}</div>
                <div class="subheading font-weight-bold text-center">Active stations</div>
              </v-card-text>
            </v-card>
          </v-layout>
        </v-flex>
        <v-flex sm12 md4 pa-4>
          <v-layout justify-center>
            <v-card class="pa-2 ma-2 rounded-xl stats-card">
              <v-card-text>
                <div class="text-center display-1 "><v-icon x-large class="display-3 pb-3">mdi-file-document-outline</v-icon></div>
                <div class="text-center display-2">{{statistics.packets + 10000}}</div>
                <div class="subheading font-weight-bold text-center">Received packets</div>
              </v-card-text>
            </v-card>
          </v-layout>
        </v-flex>
      </v-layout>
      <h3 class="py-3 grey--text text--darken-3">History</h3>
      <p>Initially TinyGS was born under the name ESP32 Fossa Groundstation, it was developed as a "weekend" project for the FossaSAT-1 LoRa satellite. We are passionate about space and created this project to be able to track and use the satellites and to learn and experiment about radio. Currently the network is open to any LoRa satellite and we also support other flying objects that have a compatible radio modulation with our hardware such as FSK, GFSK, MSK, GMSK, LoRa and OOK. And the project was renamed to TinyGS.</p>
      <p>Even though we have no relation with the Fossa team, they inspired this project and we are excited to support their new launched satellites into our network.</p>
      <p>This are the more important moments of the project:</p>
      <ul>
        <li>Nov 28, 2019 ESP32-OLED-Fossa-GroundStation project born.</li>
        <li>Nov 28, 2019 ESP32-OLED-Fossa-GroundStation project born.</li>
        <li>Dec 6, 2019 FossaSAT-1 deployed with an Electron rocket by Rocket Lab.</li>
        <li>Dec 10,2019 YL3CT's GS receive the fist LoRa packet from FossaSAT-1</li>
        <li>Sep 28,2020 6U Norby LoRa satellite is deployed with a Soyuz-2-1b launcher</li>
        <li>Oct 11, 2020 KA9ETC's GS receive the first LoRa packet from Norby</li>
        <li>Jan 24, 2021 3x V-R3x sat deployed with a Falcon-9</li>
        <li>Jan 25, 2021 KA9ETC'S GS receive the first LoRa packet from V-R3x</li>
        <li>Feb 14, 2021 New name and web tinyGS.com with a new Beta firmware.</li>
      </ul>
      <h3 class="py-3 pt-6 grey--text text--darken-3">Get Started</h3>
      <p>Join out <a href="https://t.me/joinchat/DmYSElZahiJGwHX6jCzB3Q">Telegram Channel</a>, visit our <a href="https://github.com/G4lile0/tinyGS">GitHub Page</a> and build your station.</p>

    </v-container>
    <v-footer class="mt-6 pa-3"
    color="primary"
    padless
  >
    <v-row
      justify="center"
      no-gutters
    >
      <v-btn
        v-for="link in links"
        :key="link.url"
        color="white"
        text
        rounded
        class="my-2 mx-1"
        @click="navigate(link.url)"

      >
      <v-icon class="mr-2">{{link.icon}}</v-icon> {{link.name}}
      </v-btn>
      <v-col
        class=" py-4 text-center white--text"
        cols="12"
      >
        {{ new Date().getFullYear() }} — <strong>TinyGS</strong>
      </v-col>
    </v-row>
  </v-footer>
      
  </v-container>
</template>

<script>
const axios = require("axios");

export default {
  name: 'Home',
  components: {
  
  },
  data() {
    return {
      links: [
        {icon:"mdi-github", name:' GitHub',url:"https://github.com/G4lile0/tinyGS"},
        {icon:"mdi-file-document-multiple-outline", name:' Wiki',url:"https://github.com/G4lile0/tinyGS/wiki"},
        {icon:"mdi-map-marker-question-outline", name:' FAQ',url:"https://github.com/G4lile0/tinyGS/wiki/FAQ"},
        {icon:"mdi-forum", name:' Telegram',url:"https://t.me/joinchat/DmYSElZahiJGwHX6jCzB3Q"},
      ],
      statistics: {}
    }
  },
  beforeMount(){
    this.getStatistics()
  },
  methods: {
    navigate(l){
      window.location = l;
    },
    async getStatistics() {
      const { data } = await axios.get("https://api.tinygs.com/v1/statistics");
      console.log(data);
      this.statistics = data;
    }
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

.stats-card {
  min-width: 250px;
  margin:0 auto;
}

</style>
