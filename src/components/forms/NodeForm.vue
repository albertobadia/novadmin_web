<template>
  <div>
    <v-btn icon @click="toggleShow">
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <v-dialog v-model="show" max-width="600">
      <v-card>
        <v-form v-model="valid">
          <v-app-bar dense dark class="blue">
            Crear nuevo nodo
            <v-layout justify-end>
              <v-btn icon @click="toggleShow">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-layout>
          </v-app-bar>
          <v-container>
            <v-layout xs12 wrap>
              <v-flex xs12 sm6>
                <v-text-field v-model="nombre" label="Nombre" prepend-icon="mdi-details"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field v-model="address" label="IP" prepend-icon="mdi-details"></v-text-field>
              </v-flex>
            </v-layout>
            <v-btn block dark class="blue" @click="createNode">Crear</v-btn>
          </v-container>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>


<script>
import { mapState } from "vuex";

export default {
  name: "NodeForm",

  computed: {
    ...mapState(["api_url"]),

    string_data(){
      return (
        'nombre:"' +
        this.nombre +
        '", address:"' +
        this.address +
        '"'
      );
    }
  },

  data() {
    return {
      show: false,
      valid: false,
      nombre: "",
      address: ""
    };
  },

  methods: {
    toggleShow() {
      this.show = !this.show;
    },

    async createNode() {
      try {
        console.log(this.string_data)
        let result = await axios({
          method: "POST",
          url: this.api_url,
          headers: {
            Authorization: "JWT " + this.$cookies.get("token")
          },
          data: {
            query:
              `mutation{
                createNode(newNode:{
                  ` + this.string_data + `
                }){
                  ok
                }
              }`
          }
        });
        console.log(result);
      } catch (error) {
        console.log(error);
        return [];
      } finally {
        this.toggleShow();
        this.$emit("done");
      }
    }
  }
};
</script>