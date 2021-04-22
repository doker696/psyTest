<template>
  <div>
    <v-container fluid>
      <v-row>
        <v-col lg="6" class="mx-auto">
          <v-row>
            <v-col class="py-auto px-1 my-auto" cols="auto">
              <v-btn @click="$router.push('/tests')" icon
                ><v-icon>mdi-arrow-left</v-icon>
              </v-btn>
            </v-col>
            <v-col>
              <h1 class="my-auto">Создание теста</h1>
            </v-col>
          </v-row>

          <v-form>
            <v-text-field
              v-model="name"
              label="Название теста"
              :error-messages="nameErrors"
              required
              autofocus
              @input="$v.name.$touch()"
            ></v-text-field>

            <div id="idquestions"></div>
            <v-btn
              color="primary"
              class="ma-2"
              dark
              @click.stop="showCreateQuest = true"
            >
              Добавить вопрос
            </v-btn>
            <createquest
              :isOpen="showCreateQuest"
              @close="showCreateQuest = false"
              @quest="addQ"
            ></createquest>

            <v-btn
              class="mr-4"
              :disabled="name != '' && questions.length > 0 ? false : true"
              @click="submit"
            >
              Закончить создание
            </v-btn>
            <v-divider />
            <div class="maxH">
              <v-expansion-panels class="my-3">
                <v-slide-y-transition group tag="div" class="flex">
                  <v-expansion-panel v-for="q in questions" :key="q.order">
                    <v-expansion-panel-header>
                      <v-row>
                        <v-col cols="auto" class="px-0">
                          <v-icon class="mx-0"
                            >mdi-help-circle-outline</v-icon
                          ></v-col
                        >
                        <v-col cols="auto" class="py-2">
                          <h3 class="title">
                            {{ q.text | str_limit(60) }}
                          </h3></v-col
                        >
                      </v-row>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <div class="px-4" v-for="an in q.answers" :key="an.order">
                        <v-row>
                          <v-col cols="auto" class="px-0">
                            <v-icon class="mx-0">mdi-minus</v-icon></v-col
                          >
                          <v-col cols="auto" class="py-auto">
                            <div class="subtitle-1">{{ an.name }}</div></v-col
                          >
                        </v-row>
                      </div>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-slide-y-transition>
              </v-expansion-panels>
            </div>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import { required } from "vuelidate/lib/validators";
import createquest from "@/components/create_quest.vue";
import axios from "axios";

export default {
  validations: {
    name: { required }
  },
  components: {
    createquest
  },
  data() {
    return {
      api: "http://localhost:9125",
      counter: 0,

      name: "",
      questions: [],
      orderQuestions: 1,
      showCreateQuest: false,
      alert: false,
      alertName: "",
      answers: [],
      newAnswer: "",
      question: "",
      orderAnswer: 1,
      editedAnswer: null,
      loading: true,
      savedAnswers: []
    };
  },
  mounted() {
    this.checkLocal();
  },
  computed: {
    nameErrors() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;
      !this.$v.name.required && errors.push("Name is required.");
      return errors;
    }
  },
  methods: {
    submit() {
      this.$v.$touch();
      if (this.name != "" && this.questions.length != 0) {
        var test = {
          name: this.name,
          isStarted: false,
          questions: this.questions
        };
        axios
          .post(`${this.api}/api/tests`, test)
          .then(this.$router.push("/tests/"));
      }
    },
    checkLocal: function() {
      if (localStorage.getItem("savedAnswers")) {
        try {
          this.savedAnswers = JSON.parse(localStorage.getItem("savedAnswers"));
        } catch (e) {
          localStorage.removeItem("savedAnswers");
        }
      }
    },
    addQ(obj) {
      console.log(obj);
      this.dialog = false;
      this.questions.push({
        order: +this.orderQuestions++,
        text: obj.text,
        answers: obj.answers
      });
    }
  }
};
</script>
<style scoped></style>
