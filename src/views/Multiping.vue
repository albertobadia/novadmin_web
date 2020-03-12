<template>
  <div>
    <v-data-table
      class="mt-12 thin"
      :items-per-page="100"
      sort-by="rtt"
      :sort-desc="true"
      dense
      :loading="loading"
      :search="search"
      :headers="headers"
      :items="items"
      :mobile-breakpoint="0"
    >
      <template v-slot:top>
        <Traffic v-show="show_trafico" />
        <v-app-bar dense flat dark app class="mt-12">
          <v-text-field v-model="search" hide-details prepend-icon="mdi-magnify" single-line></v-text-field>
          <v-btn icon @click="queryNodes">
            <v-icon>mdi-cached</v-icon>
          </v-btn>
          <v-layout justify-end v-if="!$vuetify.breakpoint.xsOnly">
            <v-chip class="mx-1" style="width:120px">
              Tráfico
              <v-switch class="ml-1" hide-details v-model="show_trafico"></v-switch>
            </v-chip>
            <v-chip class="mx-1" style="width:100px">
              Ping
              <v-switch class="ml-1" hide-details v-model="enabled" @change="callQueryNodes"></v-switch>
            </v-chip>
          </v-layout>
        </v-app-bar>

        <v-app-bar dark dense flat v-if="$vuetify.breakpoint.xsOnly">
          <v-layout justify-center>
            <v-chip class="mx-1" style="width:100px">
              Tráfico
              <v-switch class="ml-1" hide-details v-model="show_trafico"></v-switch>
            </v-chip>
            <v-chip class="mx-1" style="width:100px">
              Ping
              <v-switch class="ml-1" hide-details v-model="enabled" @change="callQueryNodes"></v-switch>
            </v-chip>
          </v-layout>
        </v-app-bar>
      </template>

      <template v-slot:item.pk="{item}">
        <v-chip small dark v-bind:class="online_color(item.online)">{{item.pk}}</v-chip>
      </template>

      <template v-slot:item.address="{item}">
        <v-chip
          :small="$vuetify.breakpoint.xsOnly"
          @click="open_node(item.address)"
          class="my-1"
        >{{item.address}}</v-chip>
      </template>

      <template v-slot:item.nombre="{item}">
        <div v-if="!$vuetify.breakpoint.xsOnly">{{item.nombre}}</div>
        <v-chip
          dark
          v-bind:class="online_color(item.online)"
          small
          v-if="$vuetify.breakpoint.xsOnly"
        >{{item.nombre}}</v-chip>
      </template>

      <template v-slot:header.rtt>RTT (ms)</template>

      <template v-slot:header.pk>
        <NodeForm @done="queryNodes" />
      </template>
    </v-data-table>
  </div>
</template>


<script>
import { mapState, mapMutations } from "vuex";
import Traffic from "@/components/Traffic.vue";
import NodeForm from "@/components/forms/NodeForm.vue";

export default {
  name: "Analisis",

  components: {
    Traffic,
    NodeForm
  },

  data() {
    return {
      loading: false,
      search: "",
      enabled: true,
      sleep: 1,
      items: [],
      show_trafico: true
    };
  },

  computed: {
    ...mapState(["api_url"]),
    headers() {
      var list = [
        { text: "Nombre", value: "nombre" },
        { text: "IP", value: "address" },
        { text: "RTT", value: "rtt" }
      ];
      if (!this.$vuetify.breakpoint.xsOnly) {
        list.unshift({ text: "Id", value: "pk", sortable: false, width: 30 });
      }

      return list;
    }
  },

  methods: {
    ...mapMutations(["set_title"]),

    open_node(address) {
      window.open("http://" + address, "_blank");
    },

    online_color(online) {
      if (online) {
        return "green lighten-1";
      } else {
        return "red lighten-1";
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