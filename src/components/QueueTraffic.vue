<template>
  <div>
    <v-card>
      <v-app-bar dense dark flat class="grey darken-3">
        <v-chip class="mx-2">
          <v-icon class="mr-2">mdi-cloud-upload</v-icon>
          {{tx | prettyBytes}}
        </v-chip>
        <v-chip class="mx-2">
          <v-icon class="mr-2">mdi-cloud-download</v-icon>
          {{rx | prettyBytes}}
        </v-chip>
        <v-spacer></v-spacer>
      </v-app-bar>

      <v-container>
        <area-chart :bytes="true" :data="chart_data" height="150px"></area-chart>
      </v-container>
    </v-card>
  </div>
</template>


<script>
import { mapState } from "vuex";

export default {
  name: "QueueTraffic",

  props: {
    name: String,
    show: Boolean
  },

  computed: {
    ...mapState(["mkapi_url"]),

    json_upload() {
      var n = 1;
      var data = {};
      for (var value of this.tx_points) {
        data[n] = value;
        n += 1;
      }
      return data;
    },

    json_download() {
      var n = 1;
      var data = {};
      for (var value of this.rx_points) {
        data[n] = value;
        n += 1;
      }
      return data;
    },

    chart_data() {
      return [
        {
          name: "Upload",
          data: this.json_upload
        },
        {
          name: "Download",
          data: this.json_download
        }
      ];
    }
  },

  data() {
    return {
      speed: 3,
      tx: "",
      rx: "",
      tx_points: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      rx_points: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      tx_gradients: ["#1feaea"],
      rx_gradients: ["#f72047"]
    };
  },

  methods: {
    callQueryTraffic() {
      if (this.show) {
        this.queryTraffic();
      }
    },

    async queryTraffic() {
      try {
        let result = await axios({
          method: "GET",
          url: this.mkapi_url + "queue/traffic/" + this.name,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
          },
        });
        result = await result.data.rate;

        this.tx = parseInt(result.split("/")[0]);
        this.rx = parseInt(result.split("/")[1]);

        this.tx_points.push(parseInt(this.tx / 1000));
        this.rx_points.push(parseInt(this.rx / 1000));

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

  mounted() {
    this.callQueryTraffic();
  }
};
</script>