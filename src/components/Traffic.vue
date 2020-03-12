<template>
  <div>
    <v-card>
      <v-sheet>
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
    </v-card>
  </div>
</template>


<script>
import { mapState } from "vuex";
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
      gradients: ["#2196f3"]
    };
  },

  methods: {
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
          this.points.push(result);
          this.points.shift();

          this.labels.push(prettyBytes(result));
          this.labels.shift();
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
