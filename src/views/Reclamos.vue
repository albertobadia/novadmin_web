<template>
  <div>
    <v-data-table
      :sort-by="order_by"
      :sort-desc="order_desc"
      :items="items"
      :headers="headers"
      :search="search"
      :loading="loading"
      class="mt-12"
    >
      <template v-slot:top>
        <v-app-bar dense flat dark app class="mt-12">
          <v-text-field
            color="blue darken-2"
            dense
            solo-inverted
            v-model="search"
            hide-details
            prepend-inner-icon="mdi-magnify"
            single-line
            clearable
          ></v-text-field>

          <v-btn icon @click="queryReclamos">
            <v-icon>mdi-cached</v-icon>
          </v-btn>

          <v-layout justify-end>
            <v-chip class="mr-2">
              <v-select
                style="width: 100px"
                :selected="items[0]"
                hide-details
                :items="estado_options"
                v-model="estado"
                @change="queryReclamos"
              ></v-select>
            </v-chip>

            <v-chip>
              <v-checkbox
                :disabled="estado == 'Cerrado'"
                class="mt-6 mr-2"
                v-model="imprimir"
                @change="queryReclamos"
              ></v-checkbox>
              <div v-show="imprimir">Atender</div>
              <div v-show="!imprimir">Revisar</div>
            </v-chip>
          </v-layout>
        </v-app-bar>
      </template>

      <template v-slot:item.pk="{item}">
        <v-layout>
          <reclamo_menu class="mr-1" v-bind:reclamo="item.pk" @done="queryReclamos" />
          <ping v-bind:servicio="item.servicio.pk" />
        </v-layout>
      </template>

      <template v-slot:item.servicio.cliente.nombre="{item}">
        <v-chip :to="'/cliente/' + item.servicio.cliente.pk">{{item.servicio.cliente.nombre}}</v-chip>
      </template>

      <template v-slot:item.fecha="{item}">
        <v-chip>{{formatDate(item.fecha)}}</v-chip>
      </template>

      <template v-slot:item.asunto="{item}">
        <div>
          <v-card class="ml-3 my-2">
            <v-card-text class="black--text">
              <v-layout>
                <reclamo_respuestas v-if="item.respuesta" :reclamo="item.pk" />
                {{item.asunto}}
              </v-layout>
            </v-card-text>
          </v-card>
        </div>
        <div v-if="item.respuesta">
          <v-card class="ml-3 mt-2 mb-4">
            <v-card-subtitle>{{formatDate(item.respuesta.fecha)}}</v-card-subtitle>
            <v-card-text>{{item.respuesta.respuesta}}</v-card-text>
          </v-card>
        </div>
      </template>
    </v-data-table>
  </div>
</template>


<script>
import { mapState, mapMutations } from "vuex";
import reclamo_menu from "@/components/reclamo/menu.vue";
import ping from "@/components/ping.vue";
import reclamo_respuestas from "@/components/reclamo/respuestas.vue";

export default {
  name: "Reclamos",

  components: {
    reclamo_menu,
    ping,
    reclamo_respuestas
  },

  data() {
    return {
      loading: false,
      search: "",
      items: [],
      abierto: true,
      imprimir: true,
      order_by: "fecha",
      order_desc: true,
      headers: [
        { text: "Acciones", value: "pk" },
        { text: "Creacion", value: "fecha" },
        { text: "Cliente", value: "servicio.cliente.nombre" },
        { text: "Asunto", value: "asunto" }
      ],
      estado_options: [
        { text: "Abiertos", value: "Abierto" },
        { text: "Cerrados", value: "Cerrado" }
      ],
      estado: "Abierto"
    };
  },

  computed: {
    ...mapState(["api_url"]),

    filters() {
      var string = 'orderBy: "-pk", estado: "' + this.estado + '"';

      if (this.estado == "Abierto") {
        var imprimir = this.imprimir.toString();
        imprimir = imprimir[0].toUpperCase() + imprimir.slice(1);

        string += ',imprimir: "' + imprimir + '"';
      }

      string += ",first: 100";

      return string;
    }
  },

  methods: {
    ...mapMutations(["set_title"]),

    formatDate(date) {
      var splited = date.split("T");
      return (splited =
        splited[0]
          .split("-")
          .reverse()
          .join("-") +
        " " +
        splited[1].substring(0, 5));
    },

    async queryReclamos() {
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
              reclamos(` +
              this.filters +
              `){
                edges{
                  node{
                    pk
                    asunto
                    fecha
                    estado
                    imprimir
                    respuestas(first:1){
                      edges{
                        node{
                          fecha
                          respuesta
                        }
                      }
                    }
                    servicio{
                      pk
                      cliente{
                        pk
                        nombre
                      }
                    }
                  }
                }
              }
            }`
          }
        });
        this.items = [];
        result = await result.data.data.reclamos.edges;
        for (var item of result) {
          var reclamo = item.node;

          for (var respuesta of item.node.respuestas.edges) {
            reclamo["respuesta"] = respuesta.node;
          }

          this.items.push(reclamo);
        }
      } catch (error) {
        console.log(error);
        return [];
      } finally {
        this.loading = false;
      }
    }
  },

  created() {
    this.set_title("Reclamos");
    this.queryReclamos();
  }
};
</script>