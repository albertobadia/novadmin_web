<template>
  <div>
    <v-card>
      <v-layout xs12 wrap>
        <v-flex xs12 sm6>
          <v-container class="pa-1">
            <v-card>
              <v-app-bar dense dark flat class="blue lighten-1">
                <v-icon class="mr-2">mdi-upload-network</v-icon>Upload :
                <div class="ml-2">{{tx}}</div>
              </v-app-bar>
              <v-sheet>
                <v-sparkline
                  :value="tx_points"
                  height="70"
                  padding="20"
                  stroke-linecap="round"
                  smooth
                  label-size="8"
                  line-width="2"
                  :gradient="tx_gradients"
                  gradient-direction="bottom"
                >
                  <template v-slot:label="item">{{item.value}}</template>
                </v-sparkline>
              </v-sheet>
            </v-card>
          </v-container>
        </v-flex>

        <v-flex xs12 sm6>
          <v-container class="pa-1">
            <v-card>
              <v-app-bar dense dark flat class="red lighten-1">
                <v-icon class="mr-2">mdi-download-network</v-icon>Download :
                <div class="ml-2">{{rx}}</div>
              </v-app-bar>
              <v-sheet>
                <v-sparkline
                  :value="rx_points"
                  height="70"
                  padding="20"
                  stroke-linecap="round"
                  smooth
                  label-size="8"
                  line-width="2"
                  :gradient="rx_gradients"
                  gradient-direction="bottom"
                >
                  <template v-slot:label="item">{{item.value}}</template>
                </v-sparkline>
              </v-sheet>
            </v-card>
          </v-container>
        </v-flex>
      </v-layout>
    </v-card>
  </div>
</template>


<script>
import { mapState } from "vuex";
const prettyBytes = require("pretty-bytes");

export default {
  name: "QueueTraffic",

  props: {
    name: String
  },

  computed: {
    ...mapState(["api_url"])
  },

  data() {
    return {
      active: true,
      speed: 3,
      tx: "",
      rx: "",
      tx_points: [0, 0, 0, 0, 0],
      rx_points: [0, 0, 0, 0, 0],
      tx_gradients: ["#1feaea"],
      rx_gradients: ["#f72047"]
    };
  },

  methods: {
    callQueryTraffic() {
      if (this.active) {
        this.queryTraffic();
      }
    },

    async queryTraffic() {
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
                queue(name:"` +
              this.name +
              `"){
                  rate
                }
              }
              `
          }
        });
        result = await result.data.data.queue.rate;

        this.tx = parseInt(result.split("/")[0]);
        this.rx = parseInt(result.split("/")[1]);

        this.tx_points.push(parseInt(this.tx / 1000));
        this.rx_points.push(parseInt(this.rx / 1000));

        this.tx = prettyBytes(this.tx);
        this.rx = prettyBytes(this.rx);

        this.tx_points.shift();
        this.rx_points.shift();
      } catch (error) {
        console.log(error);
        return [];
      } finally {
        setTimeout(this.callQueryTraffic, 1000 * parseInt(this.speed));
      }
    }
  },

  created() {
    this.callQueryTraffic();
  },

  destroyed() {
    this.active = false;
  }
};
</script>