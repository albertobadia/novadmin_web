<template>
  <div>
    <v-btn icon light class="mr-2" @click="toggleShow">
      <v-icon>mdi-progress-alert</v-icon>
    </v-btn>

    <v-dialog v-model="show" max-width="500">
      <v-card :loading="loading">
        <v-app-bar dense dark flat class="blue">
          Respuestas
          <v-layout justify-end>
            <v-btn icon @click="toggleShow">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-layout>
        </v-app-bar>

        <v-container>
          <v-simple-table dense fixed-header>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Creada</th>
                  <th class="text-left">Respuesta</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in respuestas" :key="item.node.pk">
                  <td>
                    <v-chip>{{ formatDate(item.node.fecha) }}</v-chip>
                  </td>
                  <td>{{ item.node.respuesta }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>


<script>
import { mapState } from "vuex";

export default {
  name: "reclamo_respuestas",

  props: {
    reclamo: Number
  },

  data() {
    return {
      show: false,
      loading: true,
      respuestas: []
    };
  },

  computed: {
    ...mapState(["api_url"])
  },

  methods: {
    toggleShow() {
      this.show = !this.show;
      if (this.show) {
        this.queryRespuestas();
      }
    },

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

    async queryRespuestas() {
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
              `query{
                reclamo(pk: ` +
              this.reclamo +
              `){
                  respuestas{
                    edges{
                      node{
                        pk
                        fecha
                        respuesta
                      }
                    }
                  }
                }
              }`
          }
        });
        this.respuestas = await result.data.data.reclamo.respuestas.edges;
      } catch (error) {
        console.log(error);
        return [];
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>