<template>
  <v-row justify="center">
    <v-col md="8" lg="6" sm="12">
      <router-view></router-view>
    </v-col>
  </v-row>
</template>

<script>
import { required } from "vuelidate/lib/validators";
// import axios from "axios";

export default {
  data() {
    return {
      firstname: "",
      lastname: "",
      selectedTest: null,
      tests: this.$store.getters.getAllTestsName
    };
  },
  validations: {
    firstname: { required },
    lastname: { required },
    selectedTest: { required }
  },
  computed: {
    selectErrors() {
      const errors = [];
      if (!this.$v.selectedTest.$dirty) return errors;
      !this.$v.selectedTest.required && errors.push("Field is required");
      return errors;
    },
    firstnameErrors() {
      const errors = [];
      if (!this.$v.firstname.$dirty) return errors;
      !this.$v.firstname.required && errors.push("Field is required.");
      return errors;
    },
    lastnameErrors() {
      const errors = [];
      if (!this.$v.lastname.$dirty) return errors;
      !this.$v.lastname.required && errors.push("Field is required.");
      return errors;
    }
  },
  methods: {
    submit() {
      this.$v.$touch();
      if (!this.$v.$anyError) {
        console.log("good");
        this.$router.push(`/test/${this.selectedTest}`);
      }
    },
    clear() {
      this.$v.$reset();
      this.firstname = "";
      this.lastname = "";
      this.selectedTest = null;
    }
  },
  mounted() {
    // const obj = {
    //   id: long,
    //   name: string,
    //   isStarted: boolean,
    //   questions: [
    //     {
    //       id: long,
    //       order: integer,
    //       text: string,
    //       answers: [
    //         {
    //           id: long,
    //           order: integer,
    //           name: string,
    //         },
    //       ],
    //     },
    //   ],
    // };
    // axios.get("http://192.168.31.142:9120/api/tests").then(r => {
    //   console.log(r);
    // });
  }
};
</script>

<style lang="scss" scoped>
.cen {
  max-width: 700px;
  min-width: 150px;
}
</style>
