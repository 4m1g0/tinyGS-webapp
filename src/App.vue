<template>
  <v-app>
    <Navbar v-on:logout="user=null" :user="user" />
    <v-main class="grey lighten-3 " style="height:100%;">
      <router-view v-if="!$route.query.loginToken || !$route.query.userId"></router-view>

      <v-row v-else class="fill-height ma-0" align="center" justify="center">
        <div class="text-center">
          <h1 class="grey--text mr-12">Logging in...</h1>
          <v-progress-circular v-if="!loginError" indeterminate color="grey"></v-progress-circular>
          <v-alert class="mt-2" color="red" v-else dark icon="mdi-alert-circle" border="right">
            Login error! This login token has expired.
          </v-alert>
        </div>
      </v-row>
      <div style="padding-bottom:150px;"></div>
      <v-footer class="mt-12 pa-3"
        color="primary"
        padless
        absolute
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
    </v-main>
  </v-app>
</template>

<script>
import Navbar from './components/Navbar.vue';
const axios = require("axios");

export default {
  name: 'App',

  components: {
    Navbar,
  },
  data() {
    return {
      user: null,
      loginError: false,
      links: [
        {icon:"mdi-github", name:' GitHub',url:"https://github.com/G4lile0/tinyGS"},
        {icon:"mdi-file-document-multiple-outline", name:' Wiki',url:"https://github.com/G4lile0/tinyGS/wiki"},
        {icon:"mdi-map-marker-question-outline", name:' FAQ',url:"https://github.com/G4lile0/tinyGS/wiki/FAQ"},
        {icon:"mdi-forum", name:' Telegram',url:"https://t.me/joinchat/DmYSElZahiJGwHX6jCzB3Q"},
      ],
    }
  },
  mounted() {
    if ("userId" in localStorage) {
        this.user = localStorage.userId
    }

    if (this.$route.query.loginToken && this.$route.query.userId) {
      this.login();
    }
  },
  methods: {
    async login() {
      if ("userId" in localStorage) {
        this.$router.push(`/user/${this.user}`)
        return
      }
      let params = {
        loginToken: this.$route.query.loginToken,
        userId: this.$route.query.userId
      }
      try {
        const { data } = await axios.post("https://api.tinygs.com/v1/login", params);
        console.log(data);
        localStorage.sessionToken = data.sessionToken
        localStorage.userId = params.userId
        this.user = params.userId
        this.$router.push(`/user/${params.userId}`)
      } catch (err) {
        //console.log(JSON.stringify(err))
        this.loginError = true;
      }
      
      // put authenticate and save token and remove query string -> this.$router.push(this.$route.path)
    },
    navigate(l){
      window.location = l;
    },
  }
};
</script>
