<template>
  <v-dialog v-model="show" max-width="600">
    <v-form v-model="valid">
      <v-card>
        <v-app-bar class="blue" dark dense flat>Iniciar Sesión</v-app-bar>
        <v-container grid-list-md>
          <v-form v-model="valid" @keyup.native.enter="DoLogin">
            <v-layout xs12 wrap>
              <v-flex xs12 sm6>
                <v-text-field
                  prepend-icon="mdi-account"
                  v-model="username"
                  label="Usuario"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                  prepend-icon="mdi-security"
                  v-model="password"
                  type="password"
                  label="Contraseña"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-btn block color="blue darken-1" dark @click="DoLogin">Iniciar Sesion</v-btn>
              </v-flex>
            </v-layout>
          </v-form>
        </v-container>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Login",
  data() {
    return {
      show: true,
      valid: false,
      username: "",
      password: ""
    };
  },
  computed: {
    ...mapState(["api_url"]),
    isLogin() {
      return this.$cookies.isKey("token");
    }
  },

  methods: {
    async DoLogin() {
      try {
        let result = await axios({
          method: "POST",
          url: this.api_url,
          data: {
            query:
              `
                    mutation{
                        tokenAuth(username:"` +
              this.username +
              `", password:"` +
              this.password +
              `"){
                            token
                        }
                    }`
          }
        });

        result = await result.data.data.tokenAuth.token;
        this.$cookies.set("token", result);
        this.$cookies.set("username", this.username);
        this.$router.go();
      } catch (error) {
        console.log(error);
      } finally {
      }
    }
  }
};
</script>