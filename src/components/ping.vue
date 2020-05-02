<template>
  <div v-if="!loading">
    <v-btn icon @click="toggleShow">
      <v-icon>mdi-google-analytics</v-icon>
    </v-btn>

    <v-dialog v-model="show" max-width="1000">
      <v-card>
        <v-app-bar dense dark flat class="title blue darken-2">
          <v-icon class="mx-3">mdi-account</v-icon>{{nombre}}

          <v-layout justify-end>
            <v-btn icon @click="toggleShow">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-layout>
        </v-app-bar>

        <v-app-bar dense dark class="grey darken-3">
          <v-icon class="mx-3">mdi-map-marker</v-icon>{{domicilio}}
        </v-app-bar>

        <v-layout xs12 wrap>
          <v-flex xs12 sm6>
            <v-container class="pa-1">
              <PingToIp v-bind:is_antena="true" v-bind:host="ip_antena" v-bind:show="this.show" />
            </v-container>
          </v-flex>
          <v-flex xs12 sm6>
            <v-container class="pa-1">
              <PingToIp v-bind:is_router="true" v-bind:host="ip_router" v-bind:show="this.show" />
            </v-container>
          </v-flex>
        </v-layout>
        <QueueTraffic v-bind:name="queue_name" v-bind:show="this.show" />
      </v-card>
    </v-dialog>
  </div>
</template>


<script>
import { mapState, mapMutations } from "vuex";
import PingToIp from "@/components/PingToIp.vue";
import QueueTraffic from "@/components/QueueTraffic.vue";

export default {
  name: "Ping",

  props: {
    servicio: Number
  },

  components: {
    PingToIp,
    QueueTraffic
  },

  data() {
    return {
      show: false,
      loading: false,
      ip_router: "",
      ip_antena: "",
      cliente: "",
      nombre: "",
      domicilio: ""
    };
  },

  computed: {
    ...mapState(["api_url"]),
    queue_name() {
      return this.nombre + "-" + this.servicio;
    }
  },

  methods: {
    toggleShow() {
      this.show = !this.show;
      if (this.show) {
        this.queryServicio();
      }
    },

    async queryServicio() {
      this.loading = true;
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
            query{
              servicio(pk:` +
              this.servicio +
              `){
                pk
                ip
                ipAntena
                direccion
                cliente{
                  pk
                  nombre
                }
              }
            }`
          }
        });
        result = await result.data.data.servicio;
        this.ip_router = result.ip;
        this.ip_antena = result.ipAntena;
        this.cliente = result.cliente.pk;
        this.nombre = result.cliente.nombre;
        this.domicilio = result.direccion;
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>