<template>
  <div>
    <v-container fluid>
      <v-row class="my-3" justify="center">
        <v-col cols="auto">
          <v-btn to="/" icon><v-icon>mdi-arrow-left</v-icon></v-btn>
        </v-col>
        <v-col md="10" lg="6" sm="12">
          <h2>Список тестов</h2>
        </v-col>
        <v-col md="2" lg="auto" sm="6">
          <v-btn class="ml-auto" to="/tests/create">
            Создать тест
          </v-btn>
        </v-col>
      </v-row>
      <v-divider />

      <v-row justify="center" v-if="loading || error">
        <v-col cols="auto" class="my-4">
          <v-progress-circular
            v-if="loading"
            size="64"
            indeterminate
            color="primary"
          ></v-progress-circular>
          <v-container v-if="error" class="mx-auto" fluid>
            <h3 v-text="errorDiscr" class="mx-auto"></h3>
          </v-container>
        </v-col>
        <v-col
          cols="auto"
          v-if="error && this.tests.length != 0"
          class="my-auto"
        >
          <v-btn @click="refresh">Обновить</v-btn>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col lg="8" md="10" sm="12">
          <v-list>
            <v-list-item v-if="!tests">Пусто</v-list-item>
            <v-slide-y-transition group tag="div">
              <v-list-item v-for="item in tests" :key="item.id">
                <v-list-item-icon>
                  <v-icon>mdi-circle-small</v-icon>
                </v-list-item-icon>
                <v-list-item-title v-text="item.name"></v-list-item-title>

                <v-row class="mx-0" style="    min-width: 120px">
                  <v-btn :to="'/test/' + item.id" icon>
                    <v-icon color="primary">mdi-play</v-icon>
                  </v-btn>
                  <v-btn :to="'/tests/edit/' + item.id" icon>
                    <v-icon color="primary" @click="editTest(item.id)"
                      >mdi-pencil-outline</v-icon
                    >
                  </v-btn>
                  <v-btn icon>
                    <v-icon color="error" @click="deleteTest(item.id)"
                      >mdi-delete</v-icon
                    >
                  </v-btn>
                </v-row>
              </v-list-item>
            </v-slide-y-transition>
          </v-list>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      tests: {},
      api: "http://localhost:9125",
      loading: true,
      error: false,
      errorDiscr: ""
    };
  },

  methods: {
    deleteTest: function(id) {
      if (confirm("Вы действительно хотите удалить этот тест?")) {
        // Save it!
        const n = this.tests
          .map(v => {
            return v.id;
          })
          .indexOf(id);
        axios.delete(`${this.api}/api/tests/${id}`).then(() => {
          this.tests.splice(n, 1);
          if (this.tests.length == 0) {
            this.error = true;
            this.errorDiscr = "Список тестов пуст";
          }
        });
      }
    },

    editTest: id => {
      console.log(id);
    },
    createTest: function() {
      this.$router.push({ path: "tests/create" });
    },
    refresh: function() {
      this.loading = true;
      this.error = false;
      axios
        .get(this.api + "/api/tests")
        .then(r => {
          if (r.data.length == 0) {
            this.error = true;
            this.errorDiscr = "Список тестов пуст";
          }
          console.log(r.data);
          this.tests = r.data;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
          this.error = true;
          this.errorDiscr = "Ошибка получения тестов";
        });
    }
  },
  mounted() {
    this.refresh();
  }
};
</script>
<style scoped></style>
