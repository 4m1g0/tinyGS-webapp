<template>
  <v-app>
    <Navbar :user="user" />
    <v-main class="grey lighten-3">
      <router-view v-if="!$route.query.loginToken || !$route.query.userId"></router-view>

      <v-row v-else class="fill-height ma-0" align="center" justify="center">

          <h1 class="grey--text mr-12">Logging in...</h1>
          <v-progress-circular indeterminate color="grey"></v-progress-circular>
        
      </v-row>

    </v-main>
  </v-app>
</template>

<script>
import Navbar from './components/Navbar.vue';

export default {
  name: 'App',

  components: {
    Navbar,
  },

  data: () => ({
    return: {
      user: null
    }
  }),
  beforeMount() {
    if (this.$route.query.loginToken && this.$route.query.userId) {
      // put authenticate and save token and remove query string -> this.$router.push(this.$route.path)
    }
    
  }
};
</script>
