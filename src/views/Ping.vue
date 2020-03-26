<template>
  <div v-if="!loading">
    <v-layout xs12 wrap>
      <v-flex xs12 sm6>
        <v-container>
          <PingToIp v-bind:host="ip_antena" />
        </v-container>
      </v-flex>
      <v-flex xs12 sm6>
        <v-container>
          <PingToIp v-bind:host="ip_router" />
        </v-container>
      </v-flex>
    </v-layout>
  </div>
</template>


<script>
import { mapState, mapMutations } from "vuex";
import PingToIp from "@/components/PingToIp.vue";

export default {
  name: "Ping",

  components: {
    PingToIp
  },

  data() {
    return {
      loading: false,
      ip_router: "",
      ip_antena: ""
    };
  },

  computed: {
    ...mapState(["api_url"])
  },

  methods: {
    ...mapMutations(["set_title", "set_force_show_title"]),

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
              this.$route.params.pk +
              `){
                pk
                ip
                ipAntena
                direccion
                cliente{
                  nombre
                }
              }
            }`
          }
        });
        result = await result.data.data.servicio;
        this.ip_router = result.ip;
        this.ip_antena = result.ipAntena;
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    }
  },

  created() {
    this.queryServicio();
    this.set_title("Diagnóstico de servicio");
    setTimeout(() => {
      this.set_force_show_title(true);
    }, 1000);
  },

  destroyed() {
    this.set_force_show_title(false);
  }
};
</script>