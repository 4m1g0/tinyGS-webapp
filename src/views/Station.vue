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
              <v-flex pa-2 xs6 sm6 md6 lg3 xl3>
                <EditStation v-on:sent="configSent()" :station="$route.params.id" :config="station.modem_conf" v-if="isCurrentUser(station.userId)"/>
              </v-flex>
              <v-flex pa-2 xs8 sm8 md8 lg4 xl4 v-if="isCurrentUser(station.userId) ">
                <v-text-field v-model="txStr" maxlength="25" persistent-hint hint="Make sure you are allowed to transmit by local regulations!" label="Message to transmit" style="display:inline"></v-text-field>
              </v-flex>
              <v-flex pa-2 xs4 sm4 md4 lg3 xl3 v-if="isCurrentUser(station.userId) ">
                <v-btn :disabled="txDisabled||!station.tx" @click="sendTx()" color="primary">{{buttonText}}</v-btn>
              </v-flex>
              <v-flex pa-2 xs4 sm4 md4 lg3 xl3 v-if="isCurrentUser(station.userId)">
                <v-btn :disabled="txDisabled||!station.tx" @click="sendTest()" color="primary">Transmit test frame</v-btn>
              </v-flex>
              <v-checkbox v-if="isCurrentUser(station.userId) " v-model="base64Cb" label="Base 64 encoded"></v-checkbox>
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
      <v-snackbar
        v-model="snackbar.show"
        >
          <b>{{ snackbar.title }}</b><br>
          <i>{{ snackbar.description }}</i>

          <template v-slot:action="{ attrs }">
            <v-btn
              color="primary"
              text
              v-bind="attrs"
              @click="snackbar.show = false"
            >
              Close
            </v-btn>
        </template>
      </v-snackbar>
      
  
      <!-- Packets -->
      <v-flex xs12 sm12 pa-4>
        <div v-for="packet in packets" :key="packet.id"> 
          <PacketRow :packet="packet" :customTemplate="customTemplates[packet.satellite]" />
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
import PacketRow from '../components/PacketRow.vue'
import EditStation from '../components/EditStation.vue'
import moment from 'moment'


export default {
  components: {
    EditStation,
    PacketRow
  },
  data() {
    return {
      station: null,
      packets: null,
      satvisFullScreen: false,
      txStr: "",
      txDisabled: false,
      snackbar: {text:"", show:false},
      customTemplates: null,
      base64Cb: false
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
      const { data } = await axios.get(`https://api.tinygs.com/v2/packets?station=${this.$route.params.id}`);
      console.log(data);
      this.packets = data.packets;
      this.customTemplates = data.templates;
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
    async sendTx() {
      if (!this.txStr) {
        this.snackbar.title = "You cannot send an empty payload!"
        this.snackbar.description = ""
        this.snackbar.show = true;
        return;
      }
        
      this.snackbar.title = "TX successful from your station!"
      this.snackbar.description = "Please, be aware that nearby stations might also want to transmit. Do not flood."
      this.snackbar.show = true;
      setTimeout(() => this.txDisabled = false , 1000);
      this.txDisabled = true;
      let params = {
        tx: (this.base64Cb?this.txStr:btoa(this.txStr))
      }
      let config = {
        headers: {
          sessionToken: localStorage.sessionToken,
          userId: localStorage.userId
        }
      }
      //console.log(this.modemConf);
      try {
        await axios.post(`https://api.tinygs.com/v2/station/${this.$route.params.id}/tx`, params, config);
      } catch (err) {
        console.log(JSON.stringify(err))
      }
    },
    async sendTest() {
      this.snackbar.title = "Test frame sent!"
      this.snackbar.description = "Please, do not overuse this feature to keep the system available for real packets."
      this.snackbar.show = true;
      setTimeout(() => this.txDisabled = false , 20000);
      this.txDisabled = true;
      let params = {
      }
      let config = {
        headers: {
          sessionToken: localStorage.sessionToken,
          userId: localStorage.userId
        }
      }
      //console.log(this.modemConf);
      try {
        await axios.post(`https://api.tinygs.com/v1/station/${this.$route.params.id}/test`, params, config);
      } catch (err) {
        console.log(JSON.stringify(err))
      }
    }
  },
  computed: {
    buttonText() {
      if (!this.station.tx)
        return "TX Disabled"
      
      return this.txDisabled?"Tx sent":"Send TX!"
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