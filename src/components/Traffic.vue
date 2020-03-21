<template>
  <div>
    <v-card>
      <v-layout xs12>
        <v-flex xs12>
          <v-sheet color="green lighten-5">
            <v-sparkline
              :value="points"
              :height="traffic_height"
              padding="20"
              stroke-linecap="round"
              smooth
              :label-size="traffic_label_size"
              line-width="2"
              :gradient="gradients"
              gradient-direction="bottom"
              :labels="labels"
            >
              <template v-slot:label="item">{{item.value}}</template>
            </v-sparkline>
          </v-sheet>
        </v-flex>
        <v-flex xs2 v-show="!$vuetify.breakpoint.xsOnly">
          <v-layout justify-center>
            <div class="headline mt-9">
              <v-icon x-large>mdi-download-network</v-icon>
              {{actual_label}}
            </div>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-card>
  </div>
</template>


<script>
import { mapState, mapMutations } from "vuex";
const prettyBytes = require("pretty-bytes");

export default {
  name: "Traffic",

  computed: {
    ...mapState(["api_url"]),
    traffic_height() {
      var value = 0;
      if (this.$vuetify.breakpoint.xsOnly) {
        value = 70;
      } else {
        value = 30;
      }
      return value;
    },

    traffic_label_size() {
      if (this.$vuetify.breakpoint.xsOnly) {
        return 10;
      } else {
        return 4;
      }
    }
  },

  data() {
    return {
      watch: true,
      traffic: 0,
      speed: 1,
      points: [],
      labels: [],
      actual_label: "",
      gradients: ["#2196f3"]
    };
  },

  methods: {
    ...mapMutations(["set_now_traffic"]),
    callTraffic() {
      if (this.watch) {
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
            query: `query{
                router(pk:1){
                  nombre
                  wanInterfaceTraffic
                }
              }`
          }
        });
        try {
          result = result.data.data.router.wanInterfaceTraffic;
          result = parseInt(result);

          this.traffic = result;
          this.set_now_traffic(prettyBytes(result))

          this.points.push(result);
          this.points.shift();

          var label = prettyBytes(result);    
          this.labels.push(label);
          this.labels.shift();
          this.actual_label = label;
        } catch (error) {
          console.log(error);
        }
      } catch (error) {
        console.log(error);
        return [];
      } finally {
        setTimeout(this.callTraffic, 1000 * parseInt(this.speed));
      }
    },
    set_labels_and_points() {
      if (this.$vuetify.breakpoint.xsOnly) {
        this.points = [0, 0, 0, 0, 0];
        this.labels = [0, 0, 0, 0, 0];
      } else {
        this.points = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.labels = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      }
    }
  },

  created() {
    this.set_labels_and_points();
    this.callTraffic();
  }
};
</script>
