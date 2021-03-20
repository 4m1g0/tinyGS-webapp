<template>
<div class="station">
  <v-container>
    <v-layout row wrap v-if="station">
      <!-- description -->
      <v-flex mt-4 ml-4 xs12 class="grey--text text--darken-1"> 
        <h1 class="heading">
          <v-btn @click="$router.go(-1)" class="mr-2" depressed>
            <v-icon  large>mdi-arrow-left</v-icon>
            <span>Back</span>
          </v-btn>
          {{ station.name }} Console</h1>
      </v-flex>
      <v-flex pa-4 xs12 sm6 class="grey--text text--darken-1"> 
        
        <v-card flat class="mr-5 my-3 pa-2 grey--text text--darken-3">
          <v-card-text class="grey--text text--darken-3 mx-auto">
            <v-layout row wrap>
              <v-flex pa-2 xs6 sm6 md6 lg3 xl3>
                <div class="caption grey--text">Listening</div>
                <div >{{station.satellite}}</div>
              </v-flex>
              <v-flex pa-2 xs6 sm6 md6 lg3 xl3>
                <div class="caption grey--text">Version</div>
                <div >{{station.version}}</div>
              </v-flex>
              <v-flex pa-2 xs6 sm6 md6 lg3 xl3>
                <div class="caption grey--text">Last seen</div>
                <div >{{dateSince(station.lastSeen)}}</div>
              </v-flex>
              <v-flex pa-2 xs6 sm6 md6 lg3 xl3>
                <div class="caption grey--text">Auto tunning</div>
                <div ><v-icon>{{station.remoteTune?"mdi-check":"mdi-cancel"}}</v-icon></div>
              </v-flex>
              <v-flex pa-2 xs6 sm6 md6 lg3 xl3>
                <div class="caption grey--text">Test mode</div>
                <div >{{station.test?"ON":"OFF"}}</div>
              </v-flex>
              <v-flex pa-2 xs6 sm6 md6 lg3 xl3>
                <div class="caption grey--text">Confirmed packets</div>
                <div >{{station.confirmedPackets}}</div>
              </v-flex>
              <v-flex pa-2 xs6 sm6 md6 lg3 xl3>
                <div class="caption grey--text">Status</div>
                <strong v-html="(station.status==1) ? '<span class=\'green--text\'>Online</span>' : '<span class=\'red--text\'>Offline</span>'"></strong>
              </v-flex>
              <v-flex pa-2 xs6 sm6 md6 lg3 xl3 v-if="isCurrentUser(station.userId)">
                <EditStation v-on:sent="configSent()" :station="$route.params.id" :config="station.modem_conf" />
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex pa-4 xs12 sm6 class="grey--text text--darken-1"> 
        <v-card flat class="mr-5 my-3 pa-2 grey--text text--darken-3" style="min-height:500px;">
          <iframe id="satvis-frame" allowtransparency="true" :src="`https://viewer.tinygs.com/?elements=Point,Label,Orbit,Sensor-cone,Ground-station-link&layers=OfflineHighres&gs=${station.location[0]},${station.location[1]}&tags=TinyGS`" class="satvis" :class="{'satvis-fullScreen': satvisFullScreen, 'satvis-normal': !satvisFullScreen}"></iframe>
          <div class="credits-satvis">Powered by <a href="https://github.com/Flowm/satvis">Satvis</a> (MIT)</div>
          <v-btn @click="satvisFullScreen = !satvisFullScreen" class="mr-2" :class="{'fullScreen-btn-fullScreen': satvisFullScreen, 'fullScreen-btn-normal': !satvisFullScreen}" icon>
            <v-img contain transition="fade-transition" max-height="60" src="../assets/fullScren-but.png" />
          </v-btn>
        </v-card>
      </v-flex>
      
  
      <!-- Packets -->
      <v-flex xs12 sm12 pa-4>
        <div v-for="packet in packets" :key="packet.id"> 
          <v-card flat class="pa-7 clickable" :to="`/packet/${packet.id}`">
            <!--<NorbiPacket :packet="packet"/>-->
            <component v-bind:is="getComponent(packet.satellite)" :packet="packet"></component>
          </v-card>
          <v-divider></v-divider>
        </div>
      </v-flex>
    </v-layout>
    <div v-else> <!-- loading spinner -->
      <v-row class="fill-height ma-16" align="center" justify="center">
        <v-progress-circular indeterminate color="grey"></v-progress-circular>
      </v-row>
    </div>
  </v-container>
</div>

</template>

<script>
const axios = require("axios");
import NorbiPacket from '../components/packets/NorbiPacket.vue'
import UndefinedPacket from '../components/packets/UndefinedPacket.vue'
import EditStation from '../components/EditStation.vue'
import moment from 'moment'

export default {
  components: {
    NorbiPacket,
    UndefinedPacket,
    EditStation
  },
  data() {
    return {
      station: null,
      packets: null,
      satvisFullScreen: false
    }
  },
  beforeMount() {
    this.getStation()
    this.getPackets()
    
  },
  methods: {
    async getStation() {
      const { data } = await axios.get(`https://api.tinygs.com/v1/station/${this.$route.params.id}`);
      console.log(data);
      this.station = data;
      document.title = `${this.station.name} Console - TinyGS`
    },
    async getPackets() {
      const { data } = await axios.get(`https://api.tinygs.com/v1/packets?station=${this.$route.params.id}`);
      console.log(data);
      this.packets = data;
    },
    dateSince(time) {
      console.log(time)
      return moment(time).fromNow()
    },
    isCurrentUser(user) {
      return localStorage.userId == user
    },
    configSent(){
      this.getStation()
    },
    getComponent(sat) {
      if (["NorbiPacket"].includes(`${sat}Packet`)) {
        return `${sat}Packet`
      }
      else {
        return "UndefinedPacket"
      }
    }
  }
}
</script>

<style>
.credits-satvis {
  position: absolute;
  right: 0;
  bottom: 0;
  margin: 9px;
  font-size: 0.7em;
  border-radius: 0 !important;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 2px;
}

.satvis-fullScreen {
  position: fixed;
  top: 65px;
  left:0;
  padding-bottom: 65px;
  height: 100%;
  width: 100%;
  z-index: 2;
}

.satvis-normal {
  display: block;
  width: 100%;
  height: 500px;
}

.fullScreen-btn-normal {
  position: absolute;
  right: 4px;
  bottom: 35px;
}

.fullScreen-btn-fullScreen {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 3;
}

</style>