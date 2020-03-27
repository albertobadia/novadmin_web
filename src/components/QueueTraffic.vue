<template>
  <div>
    <v-card>
      <v-app-bar dense dark class="pl-0 pr-0"></v-app-bar>
      <v-layout xs12 wrap>
        <v-flex xs12 sm6>
          <v-container>
            <v-card>
              <v-sheet>
                <v-sparkline
                  :value="tx_points"
                  height="50"
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
          <v-container>
            <v-card>
              <v-sheet>
                <v-sparkline
                  :value="rx_points"
                  height="50"
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

export default {
  name: "QueueTraffic",

  props: {
    host: String
  },

  computed: {
    ...mapState(["api_url"])
  },

  data() {
    return {
      active: true,
      speed: 1,
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
                queue(address:"` +
              this.host +
              `"){
                  rate
                }
              }
              `
          }
        });
        result = await result.data.data.queue.rate;

        console.log(result)

        this.tx = parseInt(result.split("/")[0] / 1024)
        this.rx = parseInt(result.split("/")[1] / 1024)

        this.tx_points.push(this.tx)
        this.rx_points.push(this.rx)

        this.tx_points.shift()
        this.rx_points.shift()

      } catch (error) {
        console.log(error);
        return [];
      } finally {
        setTimeout(this.callQueryTraffic(), 1000 * parseInt(this.speed));
      }
    }
  },

  created() {
    this.callQueryTraffic();
  },

  destroyed(){
    this.active = false
  }
};
</script>