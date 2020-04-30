<template>
  <div>
    <v-btn dark block class="blue mt-2" @click="toggleShow">Respuestas</v-btn>

    <v-dialog v-model="show" max-width="500">
      <v-card>
        <v-app-bar dense dark flat class="blue">
          Respuestas del reclamo
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
                <tr v-for="item in respuestas" :key="item.name">
                  <td>{{ item.fecha }}</td>
                  <td>{{ item.respuesta }}</td>
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
export default {
  name: "reclamo_respuestas",

  props: {
    reclamo: Number
  },

  data() {
    return {
      show: false,
      respuestas: []
    };
  },

  methods: {
    toggleShow() {
      this.show = !this.show;
    }
  }
};
</script>