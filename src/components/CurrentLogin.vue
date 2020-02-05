<template>
  <div>
    <v-menu offset-y dark open-on-hover>
      <template v-slot:activator="{ on }">
        <v-chip class="grey darken-1" dark v-on="on">
          <v-icon class="mr-2">mdi-account</v-icon>
          {{username}}
        </v-chip>
      </template>
      <v-list dense>
        <v-list-item dense @click="logout">
          <v-list-item-title>
            <v-icon class="mr-2">mdi-exit-to-app</v-icon>Salir
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>


<script>
export default {
  name: "CurrentLogin",
  computed: {
    username() {
      return this.$cookies.get("username");
    }
  },
  methods: {
    logout() {
      this.$cookies.remove("token");
      this.$cookies.remove("username");
      this.$router.go();
    }
  }
};
</script>