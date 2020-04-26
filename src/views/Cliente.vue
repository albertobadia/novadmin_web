<template>
  <div>
    <v-layout xs12 wrap>
      <v-flex xs12 sm5>
        <v-container>
          <v-hover v-slot:default="{hover}">
            <v-chip @click="queryCliente">
              <div v-show="!hover">{{$route.params.pk}}</div>
              <v-icon v-show="hover">mdi-cached</v-icon>
            </v-chip>
          </v-hover>

          <v-divider class="mt-1 mb-2"></v-divider>
          <v-text-field v-model="nombre" label="Nombre" prepend-icon="mdi-account" readonly></v-text-field>
          <v-text-field
            v-model="direccion"
            label="Domicilio"
            prepend-icon="mdi-map-marker"
            readonly
          ></v-text-field>
          <v-text-field v-model="dni" label="DNI" prepend-icon="mdi-card-text" readonly></v-text-field>
        </v-container>
      </v-flex>

      <v-flex xs12 sm7>
        <v-container>
          <v-layout justify-start>
            <v-card>
              <v-list>
                <v-container v-for="telefono in telefonos" v-bind:key="telefono.pk">
                  <v-chip>
                    <v-icon class="mr-1">mdi-cellphone-android</v-icon>
                    {{telefono.telefono}}
                  </v-chip>
                </v-container>
                <v-container v-for="correo in correos" v-bind:key="correo.pk">
                  <v-chip>
                    <v-icon class="mr-1">mdi-email</v-icon>
                    {{correo.correo}}
                  </v-chip>
                </v-container>
              </v-list>
            </v-card>
          </v-layout>
        </v-container>
      </v-flex>

      <v-flex>
        <v-container>
          <v-card>
            <v-data-table
              disable-sort
              class="grey darken-3"
              dark
              hide-default-footer
              :items="servicios"
              :headers="headers"
            >
              <template v-slot:item.pk="{item}">
                <ping v-bind:servicio="item.pk" />
              </template>

              <template v-slot:item.estado="{item}">
                <v-chip dark v-bind:class="servicioColor(item.estado)">{{item.estado}}</v-chip>
              </template>
            </v-data-table>
          </v-card>
        </v-container>
      </v-flex>
    </v-layout>
  </div>
</template>


<script>
import { mapState, mapMutations } from "vuex";
import ping from "@/components/ping.vue"

export default {
  name: "Cliente",

  components:{
    ping
  },

  computed: {
    ...mapState(["api_url"])
  },

  data() {
    return {
      loading: false,
      nombre: "",
      dni: "",
      direccion: "",
      fecha_alta: "",
      fecha_nacimiento: "",
      telefonos: [],
      correos: [],
      servicios: [],
      headers: [
        { text: "Acciones", value: "pk", sortable: false, width: 30 },
        { text: "Estado", value: "estado", sortable: false },
        { text: "Domicilio", value: "direccion", sortable: false },
        { text: "IP", value: "ip" },
        { text: "IP Antena", value: "ipAntena" }
      ]
    };
  },

  methods: {
    ...mapMutations(["set_title", "set_force_show_title"]),

    servicioColor(estado) {
      switch (estado) {
        case "Activo":
          return "green";
        case "Suspendido":
          return "red";
        case "Retirado":
          return "brown";
      }
    },

    open_ping(servicio) {
      window.open("/ping/" + servicio);
    },

    async queryCliente() {
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
              cliente(pk:` +
              this.$route.params.pk +
              `){
                nombre
                dni
                direccion
                fechaNacimiento
                fechaAlta
                servicios{
                  edges{
                    node{
                      pk
                      estado
                      direccion
                      ip
                      ipAntena
                    }
                  }
                }
                correos{
                  edges{
                    node{
                      pk
                      correo
                    }
                  }
                }
                telefonos{
                  edges{
                    node{
                      pk
                      telefono
                    }
                  }
                }
              }
            }`
          }
        });
        result = await result.data.data.cliente;
        this.nombre = result.nombre;
        this.dni = result.dni;
        this.direccion = result.direccion;
        this.fecha_alta = result.fecha_alta;
        this.fecha_nacimiento = result.fecha_nacimiento;

        this.correos = [];
        for (var item of result.correos.edges) {
          this.correos.push(item.node);
        }

        this.telefonos = [];
        for (var item of result.telefonos.edges) {
          this.telefonos.push(item.node);
        }

        this.servicios = [];
        for (var item of result.servicios.edges) {
          this.servicios.push(item.node);
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    }
  },

  created() {
    this.set_title("Datos del cliente");
    this.queryCliente();
    setTimeout(() => {
      this.set_force_show_title(true);
    }, 1000);
  },

  destroyed() {
    this.set_force_show_title(false);
  }
};
</script>