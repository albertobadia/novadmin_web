<template>
  <div>
    <v-card>
      <v-app-bar dense dark class="pl-0 pr-0">
        <v-chip @click="open_host(host)">{{host}}</v-chip>
        <v-layout justify-end>
          <v-chip>RTT : {{time}} ms</v-chip>
        </v-layout>
      </v-app-bar>
      <v-sheet>
        <v-sparkline
          :value="points"
          height="50"
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
    host: String
  },

  computed: {
    ...mapState(["api_url"])
  },

  data() {
    return {
      ping: true,
      time: 0,
      speed: 1,
      points: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      gradients: ["#1feaea", "#7af720", "#f72047"]
    };
  },

  methods: {
    open_host(host) {
      window.open("http://" + host);
    },

    callPing() {
      if (this.ping) {
        this.queryPing();
      }
    },

    async queryPing() {
      try {
        let result = await axios({
          method: "POST",
          url: this.api_url,
          headers: {
            Authorization: "JWT " + this.$cookies.get("token")
          },
          data: {
            query:
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
          }
        });
        try {
          result = await result.data;
          result = JSON.parse(result.data.ping.result).rtt_avg;
          result = parseFloat(result);

          if (!result) {
            result = -1;
          }

          this.time = parseInt(result);
          this.points.push(this.time);
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

  created() {
    this.callPing();
  },

  destroyed() {
    this.ping = false;
  }
};
</script>
