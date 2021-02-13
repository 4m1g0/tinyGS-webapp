<template>
  <v-app>
    <Navbar :user="user" />
    <v-main class="grey lighten-3">
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
      loginError: false
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
    }
  }
};
</script>
