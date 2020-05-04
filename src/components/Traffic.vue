<template>
  <div>
    <v-card>
      <v-layout xs12>
        <v-flex xs12>
          <v-container py-1>
            <area-chart
              :height="$vuetify.breakpoint.xsOnly ? 30 : 70"
              :data="chart_data"
              :bytes="true"
              :library="{tooltips: {mode: 'nearest', intersect: false}}"
              :xtitle="rx | prettyBytes"
            />
          </v-container>
        </v-flex>
      </v-layout>
    </v-card>
  </div>
</template>


<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "Traffic",

  computed: {
    ...mapState(["api_url"]),

    chart_data() {
      return [
        {
          name: "Upload",
          data: this.tx_points.map((p, index) => [index, p])
        },
        {
          name: "Download",
          data: this.rx_points.map((p, index) => [index, p])
        }
      ];
    }
  },

  data() {
    return {
      watch: true,
      speed: 1,
      max: 20,
      tx: 0,
      rx: 0,
      tx_points: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      rx_points: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
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
          console.log(result)
          var tx = result.split("/")[0]
          var rx = result.split("/")[1]

          tx = parseInt(tx);
          rx = parseInt(rx);

          this.tx = tx;
          this.rx = rx;
          this.tx_points.push(tx);
          this.rx_points.push(rx);

          this.tx_points.shift();
          this.rx_points.shift();


        } catch (error) {
          console.log(error);
        }
      } catch (error) {
        console.log(error);
        return [];
      } finally {
        setTimeout(this.callTraffic, 1000 * this.speed);
      }
    }
  },

  created() {
    this.callTraffic();
  }
};
</script>
