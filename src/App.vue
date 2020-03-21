<template>
  <v-app>
    <Login v-if="!isLogin" />
    <div v-if="isLogin">
      <Navbar />
      <v-content class="mt-12">
        <router-view></router-view>
      </v-content>
    </div>
  </v-app>
</template>

<script>
import Login from "@/components/Login.vue";
import Navbar from "@/components/Navbar.vue";

export default {
  name: "App",

  components: {
    Login,
    Navbar
  },

  computed: {
    isLogin() {
      return this.$cookies.isKey("token");
    }
  }
};
</script>
