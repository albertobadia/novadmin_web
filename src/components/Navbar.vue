<template>
  <div>
    <v-app-bar app color="primary" dark dense>
      <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>
      <v-layout justify-center class="title">{{title}}</v-layout>
    </v-app-bar>

    <v-btn v-if="false" small class="mt-6 ml-12" fab absolute left @click="toggleDrawer">
      <v-icon>mdi-menu</v-icon>
    </v-btn>

    <v-navigation-drawer app dark v-model="drawer">
      <v-list-item class="blue" dark dense>
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
    ...mapState(["title"])
  },

  data: () => ({
    drawer: true,
    items: [
      {
        title: "Multiping",
        icon: "mdi-view-dashboard",
        link: "/"
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