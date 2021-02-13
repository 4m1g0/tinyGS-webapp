<template>
  <nav>
    <v-app-bar app color="primary" dark height="70">
      <v-app-bar-nav-icon @click="drawer=!drawer" class="mr-4"></v-app-bar-nav-icon>

      <div class="flex-grow-1 d-flex justify-center">
        <div class="d-flex">
          <v-img contain transition="fade-transition" max-height="60" alt="TinyGS logo" src="../assets/logo.svg" />
          <v-chip
            class="ma-2 text-button font-weight-black"
            color="green"
            text-color="white"
          >
            BETA
          </v-chip>
        </div>
      </div>

      <v-btn @click="logout()" color="primary" class="lighten-1" depressed v-if="user">
        <span>Sign Out</span>
        <v-icon right>mdi-exit-to-app</v-icon>
      </v-btn>
      <!--<Login /> -->
    </v-app-bar >
    <v-navigation-drawer disable-resize-watcher v-model="drawer" app color="primary" class="darken-1">
      <div class="d-flex justify-center mt-3 mb-4">
        <v-img contain max-height="90" transition="scale-transition" alt="TinyGS logo" src="../assets/logo.svg" />
      </div>
      <v-divider color="white"></v-divider>
      <v-list dense>
        <v-list-item-group flat class="white--text">
          <v-list-item dark v-for="link in links" :key="link.text" router :to="link.path">
            <v-list-item-icon>
              <v-icon v-text="link.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="link.text"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>


export default {
  props: [
    "user"
  ],
  data() {
    return {
      drawer: false,
      links: [
        { text: 'Home', icon: 'mdi-home', path: '/' },
        { text: 'Stations', icon: '$station', path: '/stations' },
        { text: 'Satellites', icon: '$satellite', path: '/satellites' },
        { text: 'Packets', icon: 'mdi-file-document-outline', path: '/packets' },
      ],
    }
  },
  methods: {
    logout(){
      localStorage.removeItem("userId")
      localStorage.removeItem("sessionToken")
      this.user = null
    }
  }
}
</script>

<style>

</style>