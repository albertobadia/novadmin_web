<template>
  <div>
    <v-card>
      <v-app-bar dense dark class="pl-0 pr-0">
        <v-chip @click="open_host(host)">
          <v-icon class="mr-2" v-if="is_router">mdi-router-wireless</v-icon>
          <v-icon class="mr-2" v-if="is_antena">mdi-video-input-antenna</v-icon>
          {{host}}
        </v-chip>

        <v-spacer></v-spacer>

        <v-layout class="mt-4">
          <v-chip dark class="grey darken-1 ml-2">
            {{time}} ms
            <v-icon class="ml-2">mdi-console-network-outline</v-icon>
          </v-chip>
          <v-chip class="ml-2">{{seq}}</v-chip>

          <v-layout class="mt-1 ml-3">
            ARP
            <v-switch v-model="arp" class="ml-2"></v-switch>
          </v-layout>
        </v-layout>
      </v-app-bar>

      <v-sheet>
        <v-sparkline
          :value="points"
          height="70"
          padding="20"
          stroke-linecap="round"
          smooth
          label-size="8"
          line-width="2"
          :gradient="gradients"
          gradient-direction="bottom"
        >
          <template v-slot:label="item">{{item.value}}</template>
        </v-sparkline>
      </v-sheet>
    </v-card>
  </div>
</template>


<script>
import { mapState } from "vuex";

export default {
  name: "PingToIp",

  props: {
    show: Boolean,
    host: String,
    is_router: Boolean,
    is_antena: Boolean
  },

  computed: {
    ...mapState(["api_url"]),

    query_data() {
      if (!this.arp) {
        return (
          `
              query
              {
                ping(host:"` +
          this.host +
          `"){
                  result
                }
              }
              `
        );
      } else {
        return (
          `
              query
              {
                pingarp(host:"` +
          this.host +
          `", interface: "bridge1"){
                  result
                }
              }
              `
        );
      }
    }
  },

  data() {
    return {
      arp: false,
      time: 0,
      speed: 3,
      seq: 0,
      points: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      gradients: ["#1feaea", "#7af720", "#f72047"]
    };
  },

  methods: {
    open_host(host) {
      var url = "http://" + host;
      if (this.is_router) {
        url += ":8080";
      }
      window.open(url);
    },

    callPing() {
      if (this.show) {
        this.queryPing();
      }
    },

    async queryPing() {
      try {
        this.seq += 1
        let result = await axios({
          method: "POST",
          url: this.api_url,
          headers: {
            Authorization: "JWT " + this.$cookies.get("token")
          },
          data: {
            query: this.query_data
          }
        });
        try {
          result = await result.data;
          if (!this.arp){
            result = JSON.parse(result.data.ping.result)
          } else {
            result = JSON.parse(result.data.pingarp.result)
          }
          
          if (result.received){
            result = parseInt(result.time);
          } else {
            result = -1
          }
          
          this.time = result
          this.points.push(result);
          this.points.shift();
        } catch (error) {
          console.log(error);
        }
      } catch (error) {
        console.log(error);
        return [];
      } finally {
        setTimeout(this.callPing, 1000 * parseInt(this.speed));
      }
    }
  },

  mounted() {
    this.callPing();
  }
};
</script>
