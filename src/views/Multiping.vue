<template>
  <div>
    <v-data-table
      dense
      class="mt-12"
      :items-per-page="100"
      sort-by="node.rtt"
      :sort-desc="true"
      :search="search"
      :headers="headers"
      :items="items"
    >
      <template v-slot:top>
        <Traffic v-show="show_trafico" class="mt-12" />
        <v-app-bar dense flat dark app class="mt-12">
          <v-text-field
            color="blue darken-2"
            dense
            solo-inverted
            v-model="search"
            hide-details
            prepend-inner-icon="mdi-magnify"
            single-line
            clearable
          ></v-text-field>
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
          <v-layout justify-end>
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

      <template v-slot:item.node.pk="{item}">
        <v-chip small dark :class="item.node.online ? 'green' : 'red'">{{item.node.pk}}</v-chip>
      </template>

      <template v-slot:item.node.address="{item}">
        <v-chip small @click="open_node(item.node.address)" class="my-1">{{item.node.address}}</v-chip>
      </template>

      <template v-slot:item.node.nombre="{item}">
        <div v-if="!$vuetify.breakpoint.xsOnly">{{item.node.nombre}}</div>
        <v-chip
          dark
          :class="item.node.online ? 'green' : 'red'"
          small
          v-if="$vuetify.breakpoint.xsOnly"
        >{{item.node.nombre}}</v-chip>
      </template>

      <template v-slot:header.node.rtt>RTT (ms)</template>

      <template v-slot:item.node.downAt="{item}">
        <div v-if="item.node.online">-</div>
        <div v-if="!item.node.online">{{down_diff(item.node.downAt)}}</div>
      </template>

      <template v-slot:header.node.pk>
        <NodeForm @done="queryNodes" />
      </template>
    </v-data-table>
  </div>
</template>


<script>
import moment from "moment";
import { mapState, mapMutations } from "vuex";
import Traffic from "@/components/Traffic.vue";
import NodeForm from "@/components/forms/NodeForm.vue";
const humanizeDuration = require("humanize-duration");

export default {
  name: "Analisis",

  components: {
    Traffic,
    NodeForm
  },

  data() {
    return {
      search: "",
      enabled: true,
      sleep: 1,
      items: [],
      show_trafico: true,
      headers: [
        { text: "", value: "node.pk" },
        { text: "Nombre", value: "node.nombre" },
        { text: "IP", value: "node.address" },
        { text: "RTT", value: "node.rtt" },
        { text: "Downtime", value: "node.downAt" }
      ]
    };
  },

  computed: {
    ...mapState(["api_url", "now_traffic"])
  },

  methods: {
    ...mapMutations(["set_title"]),

    down_diff(downAt) {
      var duration = moment.duration(moment(new Date()).diff(moment(downAt)));
      return humanizeDuration(duration, {
        language: "short",
        round: true,
        languages: {
          short: {
            y: () => "A",
            mo: () => "M",
            w: () => "S",
            d: () => "d",
            h: () => "h",
            m: () => "m",
            s: () => "s",
            ms: () => "ms"
          }
        }
      });
    },

    open_node(address) {
      window.open("http://" + address, "_blank");
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
                    downAt
                  }
                }
              }
            }`
          }
        });
        this.items = await result.data.data.nodes.edges;
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