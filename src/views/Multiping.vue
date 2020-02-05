<template>
  <div>
    <v-data-table
      class="mt-12"
      :items-per-page="100"
      sort-by="rtt"
      sort-desc="true"
      dense
      :loading="loading"
      :search="search"
      :headers="headers"
      :items="items"
    >
      <template v-slot:top>
        <v-app-bar dense flat dark app class="mt-12">
          <v-text-field v-model="search" hide-details prepend-icon="mdi-magnify" single-line></v-text-field>
          <v-btn icon @click="queryNodes">
            <v-icon>mdi-cached</v-icon>
          </v-btn>
          <v-layout justify-end>
            <v-chip style="width:100px">
              <v-switch hide-details v-model="enabled" @change="callQueryNodes"></v-switch>
              <div v-if="enabled" class="ml-2">ON</div>
              <div v-if="!enabled" class="ml-2">OFF</div>
            </v-chip>
          </v-layout>
        </v-app-bar>
      </template>

      <template v-slot:item.pk="{item}">
        <v-chip small dark v-bind:class="online_color(item.online)">{{item.pk}}</v-chip>
      </template>

      <template v-slot:item.address="{item}">
        <v-chip @click="open_node(item.address)" class="my-1">{{item.address}}</v-chip>
      </template>

      <template v-slot:header.rtt>RTT (ms)</template>
    </v-data-table>
  </div>
</template>


<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "Analisis",

  data() {
    return {
      loading: false,
      search: "",
      enabled: true,
      sleep: 1,
      headers: [
        { text: "Id", value: "pk", sortable: false, width: 30 },
        { text: "Nombre", value: "nombre" },
        { text: "IP", value: "address" },
        { text: "RTT", value: "rtt" }
      ],
      items: []
    };
  },

  computed: {
    ...mapState(["api_url"])
  },

  methods: {
    ...mapMutations(["set_title"]),

    open_node(address){
      window.open("http://" + address, '_blank');
    },

    online_color(online) {
      if (online) {
        return "green";
      } else {
        return "red";
      }
    },

    callQueryNodes() {
      if (this.enabled) {
        this.queryNodes();
      }
    },

    async queryNodes() {
      try {
        let result = await axios({
          method: "POST",
          url: this.api_url,
          headers: {
            Authorization: "JWT " + this.$cookies.get("token")
          },
          data: {
            query: `
            query{
              nodes{
                edges{
                  node{
                    pk
                    nombre
                    address
                    rtt
                    online
                  }
                }
              }
            }`
          }
        });
        this.items = [];
        result = await result.data.data.nodes.edges;
        for (var item of result) {
          this.items.push(item.node);
        }
      } catch (error) {
        console.log(error);
        return [];
      } finally {
        if (this.enabled) {
          setTimeout(this.queryNodes, 1000 * this.sleep);
        }
      }
    }
  },

  mounted() {
    this.set_title("Multiping");
    this.queryNodes();
  }
};
</script>