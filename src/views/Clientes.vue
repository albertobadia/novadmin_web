<template>
  <div>
    <v-data-table
      :search="search"
      :loading="loading"
      :items="items"
      :headers="headers"
      sort-by="nombre"
    >
      <template v-slot:top>
        <v-app-bar dense flat dark app class="mt-12">
          <v-text-field v-model="search" hide-details prepend-icon="mdi-magnify" single-line></v-text-field>
          <v-btn icon @click="queryClientes">
            <v-icon>mdi-cached</v-icon>
          </v-btn>
          <v-layout justify-end></v-layout>
        </v-app-bar>
      </template>

      <template v-slot:item.nombre="{item}">
        <v-chip class="grey lighten-2" :to="'/cliente/' + item.pk">{{item.nombre}}</v-chip>
      </template>
    </v-data-table>
  </div>
</template>


<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "Clientes",

  computed: {
    ...mapState(["api_url"])
  },

  data() {
    return {
      loading: false,
      search: "",
      items: [],
      headers: [
        { text: "Nombre", value: "nombre" },
        { text: "Dni", value: "dni" },
        { text: "Domicilio", value: "direccion" }
      ]
    };
  },

  methods: {
    ...mapMutations(["set_title"]),

    async queryClientes() {
      this.loading = true;
      try {
        let result = await axios({
          method: "POST",
          url: this.api_url,
          headers: {
            Authorization: "JWT " + this.$cookies.get("token")
          },
          data: {
            query: `
            query{
              clientes{
                edges{
                  node{
                    pk
                    nombre
                    dni
                    direccion
                  }
                }
              }
            }`
          }
        });
        this.items = [];
        result = await result.data.data.clientes.edges;
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

  created() {
    this.set_title("Clientes");
    this.queryClientes();
  }
};
</script>