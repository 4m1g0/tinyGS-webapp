<template>
  <nav>
    <v-app-bar app color="primary" dark height="70">
      <v-app-bar-nav-icon @click="drawer=!drawer" class="mr-4"></v-app-bar-nav-icon>

      <div class="flex-grow-1 d-flex justify-center">
        <img alt="TinyGS logo" src="../assets/logo.png">
      </div>

      <v-btn color="gray" text>
        <span>Sign Out</span>
        <v-icon right>mdi-exit-to-app</v-icon>
      </v-btn>
      <Login />
    </v-app-bar >
    <v-navigation-drawer v-model="drawer" app color="primary" class="darken-1">
      <p>test</p>
    </v-navigation-drawer>
  </nav>
</template>

<script>


export default {
  data() {
    return {
      drawer: false
    }
  }
}
</script>

<style>

</style>