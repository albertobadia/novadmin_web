<template>
  <div>
    <v-app-bar app color="blue lighten-1" dark dense>
      <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>
      <div class="title" v-if="!drawer || force_show_title">{{title}}</div>
    </v-app-bar>

    <v-navigation-drawer app dark v-model="drawer">
      <v-list-item class="blue lighten-1" dark dense>
        <v-list-item-content>
          <v-list-item-title class="ml-8 title">Nov@dmin</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-layout justify-center class="mt-3">
        <CurrentLogin />
      </v-layout>
      <v-list>
        <v-list-item dark v-for="item in items" :key="item.title" link :to="item.link">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>


<script>
import { mapState } from "vuex";
import CurrentLogin from "@/components/CurrentLogin.vue";

export default {
  name: "Navbar",
  components: {
    CurrentLogin
  },

  computed: {
    ...mapState(["title", "force_show_title"])
  },

  data: () => ({
    drawer: true,
    items: [
      {
        title: "Clientes",
        icon: "mdi-account",
        link: "/"
      },
      {
        title: "Multiping",
        icon: "mdi-view-dashboard",
        link: "/multiping"
      },
      {
        title: "Reclamos",
        icon: "mdi-alert-circle",
        link: "/reclamos"
      },
      {
        title: "Instalaciones",
        icon: "mdi-pipe-disconnected",
        link: "/instalaciones"
      }
    ]
  }),

  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer;
    }
  }
};
</script>