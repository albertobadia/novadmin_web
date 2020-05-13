<template>
  <div>
    <v-btn icon @click="toggleShow">
      <v-icon>mdi-pencil</v-icon>
    </v-btn>

    <v-dialog v-model="show" max-width="500">
      <v-form v-model="valid">
        <v-card>
          <v-app-bar dense dark flat class="blue">
            {{nombre}}
            <v-layout justify-end>
              <v-btn icon @click="toggleShow">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-layout>
          </v-app-bar>

          <v-container>
            <v-layout xs12 wrap>
              <v-flex xs12>
                <v-textarea
                  :rules="required_rules"
                  prepend-icon="mdi-details"
                  label="Asunto"
                  v-model="asunto"
                ></v-textarea>
              </v-flex>

              <v-flex xs12 sm6>
                <v-btn
                  block
                  dark
                  class="blue mt-3"
                  v-show="!show_save && estado != 'Cerrado'"
                >Cerrar reclamo</v-btn>
              </v-flex>

              <v-flex xs12 sm6>
                <v-checkbox class="ml-6" label="Atender" v-model="imprimir"></v-checkbox>
              </v-flex>

              <v-btn
                block
                dark
                class="blue"
                v-show="show_save"
                @click="updateReclamo"
              >Guardar cambios</v-btn>
            </v-layout>
          </v-container>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>


<script>
import { mapState } from "vuex";

export default {
  name: "reclamo_menu",

  props: {
    reclamo: Number
  },

  data() {
    return {
      show: false,
      valid: false,
      estado: "",
      pre_asunto: "",
      asunto: "",
      nombre: "",
      imprimir: false,
      pre_imprimir: false,
      required_rules: [v => !!v || "Este campo es obligatorio"]
    };
  },

  computed: {
    ...mapState(["api_url"]),

    string_data() {
      var string =
        "id: " + this.reclamo + ', asunto: "' + this.asunto + '", imprimir: ';

      if (this.imprimir) {
        string += '"True"';
      } else {
        string += '"False"';
      }

      return string;
    },

    show_save() {
      return (
        (this.valid && this.asunto != this.pre_asunto) ||
        this.imprimir != this.pre_imprimir
      );
    }
  },

  methods: {
    toggleShow() {
      this.show = !this.show;

      if (this.show) {
        this.queryReclamo();
      }
    },

    async queryReclamo() {
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
              reclamo(pk: ` +
              this.reclamo +
              `){
                pk
                asunto
                imprimir
                estado
                servicio{
                  direccion
                  cliente{
                    nombre
                  }
                }
              }
            }`
          }
        });
        result = await result.data.data.reclamo;

        this.estado = result.estado;

        this.pre_asunto = result.asunto;
        this.asunto = result.asunto;
        this.nombre = result.servicio.cliente.nombre;

        if (result.imprimir == "True") {
          this.imprimir = true;
        } else {
          this.imprimir = false;
        }
        this.pre_imprimir = this.imprimir;
      } catch (error) {
        console.log(error);
        return [];
      } finally {
        this.loading = false;
      }
    },

    async updateReclamo() {
      console.log(this.string_data);
      try {
        let result = await axios({
          method: "POST",
          url: this.api_url,
          headers: {
            Authorization: "JWT " + this.$cookies.get("token")
          },
          data: {
            query:
              `mutation{
                updateReclamo(newReclamo:{` +
              this.string_data +
              `}){
                  ok
                }
              }`
          }
        });
        result = await result.data.data;
        console.log(result);
      } catch (error) {
        console.log(error);
        return false;
      } finally {
        this.$emit("done");
      }
    }
  }
};
</script>