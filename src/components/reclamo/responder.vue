<template>
  <div>
    <v-btn icon @click="toggleShow">
      <v-icon>mdi-account</v-icon>
    </v-btn>

    <v-dialog v-model="show">
      <v-form v-model="valid">
        <v-card>
          <v-app-bar dense dark flat class="blue">
            Responder reclamo
            <v-layout justify-end>
              <v-btn icon @click="toggleShow">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-layout>
          </v-app-bar>

          <v-container>
            <v-textarea v-model="respuesta" label="Respuesta"></v-textarea>
          </v-container>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>


<script>
import { mapState } from "vuex";
export default {
  name: "reclamo_responder",

  data() {
    return {
      show: false,
      valid: false,
      respuesta: ""
    };
  },

  computed: {
    ...mapState(["api_url"])
  },

  methods: {
    toggleShow() {
      this.show = !this.show;
    }
  }
};
</script>