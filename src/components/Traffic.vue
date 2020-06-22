<template>
  <div>
    <v-card>
      <v-container py-1>
        <area-chart
          :height="$vuetify.breakpoint.xsOnly ? 30 : 70"
          :data="chart_data"
          :bytes="true"
          :library="{tooltips: {mode: 'nearest', intersect: false}}"
          :xtitle="rx | prettyBytes"
        />
      </v-container>
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
      speed: 2,
      tx: 0,
      rx: 0,
      tx_points: [],
      rx_points: []
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
          result = result.data.data.router.wanInterfaceTraffic.split("-")

          this.tx_points = []
          this.rx_points = []

          for (let point of result){
            let tx = point.split("/")[0];
            let rx = point.split("/")[1];

            this.tx_points.push(tx);
            this.rx_points.push(rx);
          }

          this.tx = parseInt(result[result.length -1].split("/")[0]);
          this.rx = parseInt(result[result.length -1].split("/")[1]);

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
