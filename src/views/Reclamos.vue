<template>
  <div>
    <v-data-table :items="items" :headers="headers" :search="search" :loading="loading">
      <template v-slot:top>
        <v-app-bar dense flat dark app class="mt-12">
          <v-text-field v-model="search" hide-details prepend-icon="mdi-magnify" single-line></v-text-field>
          <v-btn icon @click="queryReclamos">
            <v-icon>mdi-cached</v-icon>
          </v-btn>
          <v-layout justify-end>
            <v-chip class="mr-2">
              <v-switch class="mt-6 mr-2" v-model="abierto" @change="queryReclamos"></v-switch>
              <div v-show="abierto">Abiertos</div>
              <div v-show="!abierto">Cerrados</div>
            </v-chip>
            <v-chip>
              <v-checkbox class="mt-6 mr-2" v-model="imprimir" @change="queryReclamos"></v-checkbox>
              <div v-show="imprimir">Imprimir</div>
              <div v-show="!imprimir">Revisar</div>
            </v-chip>
          </v-layout>
        </v-app-bar>
      </template>

      <template v-slot:item.fecha="{item}">{{formatDate(item.fecha)}}</template>
    </v-data-table>
  </div>
</template>


<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "Reclamos",

  computed: {
    ...mapState(["api_url"]),

    filters() {
      var string = "";
      if (this.abierto) {
        string += 'estado: "Abierto"';
      }
      if (this.imprimir) {
        if (string){
          string += ', '
        }
        string += 'imprimir: "True"';
      }
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
                    servicio{
                      direccion
                      cliente{
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
          this.items.push(item.node);
        }
      } catch (error) {
        console.log(error);
        return [];
      } finally {
        this.loading = false;
      }
    }
  },

  data() {
    return {
      loading: false,
      search: "",
      items: [],
      abierto: true,
      imprimir: true,
      headers: [
        { text: "Nombre", value: "servicio.cliente.nombre" },
        { text: "Domicilio", value: "servicio.direccion" },
        { text: "Asunto", value: "asunto" },
        { text: "Fecha", value: "fecha" }
      ]
    };
  },

  created() {
    this.set_title("Reclamos");
    this.queryReclamos();
  }
};
</script>