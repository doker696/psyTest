<template>
  <div>
    <v-container fluid>
      <v-row>
        <v-col lg="6" class="mx-auto">
          <v-row>
            <v-col class="py-auto px-1 my-auto" cols="auto">
              <v-btn @click="$router.push('/tests')" icon
                ><v-icon>mdi-arrow-left</v-icon></v-btn
              >
            </v-col>
            <v-col>
              <h1 class="my-auto">Редактировать тест</h1>
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
            <v-btn color="primary" class="ma-2" dark @click="dialog = true">
              Добавить вопрос
            </v-btn>
            <v-dialog v-model="dialog" max-width="500px">
              <v-card>
                <v-card-title> Создание вопроса </v-card-title>
                <v-card-text>
                  <v-text-field
                    label="Вопрос"
                    required
                    autofocus
                    v-model="question"
                  ></v-text-field>

                  <h2>Ответы:</h2>
                  <v-text-field
                    hide-details
                    class="new-answer"
                    autocomplete="off"
                    placeholder="Введите ответ"
                    v-model="newAnswer"
                    @keyup.enter="addAnswer"
                  />
                  <small
                    >Нажмите Enter для сохранения ответа, дважды нажмите на
                    ответ, для его изменения</small
                  >
                  <v-divider />
                  <v-slide-y-transition class="answer-list py-0" group tag="ul">
                    <li
                      v-for="(answer, i) in answers"
                      class="answer"
                      :key="i"
                      :class="{ editing: answer == editedAnswer }"
                    >
                      <div class="view">
                        <label @dblclick="editAnswer(answer)">
                          {{ answer.name }}</label
                        >
                        <button
                          class="destroy"
                          @click="removeAnswer(answer)"
                        ></button>
                      </div>
                      <input
                        class="edit"
                        type="text"
                        v-model="answer.name"
                        v-answer-focus="answer == editedAnswer"
                        @blur="doneAnswer(answer)"
                        @keyup.enter="doneAnswer(answer)"
                        @keyup.esc="cancelAnswer(answer)"
                      />
                    </li>
                  </v-slide-y-transition>
                </v-card-text>

                <v-card-actions>
                  <v-btn color="primary" @click="createQuestion" text>
                    Создать
                  </v-btn>
                  <v-btn color="primary" text @click="closeDialog">
                    Закрыть
                  </v-btn>
                </v-card-actions>
                <v-expand-transition>
                  <v-alert v-show="alert" class="mb-0" dense type="error">
                    {{ alertName }}
                  </v-alert>
                </v-expand-transition>
              </v-card>
            </v-dialog>

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
                          <h3 class="title">{{ q.text }}</h3></v-col
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
import axios from "axios";

export default {
  validations: {
    name: { required }
  },
  data() {
    return {
      api: "http://localhost:9125",

      name: "",
      questions: [],
      orderQuestions: 1,
      dialog: false,
      alert: false,
      alertName: "",
      answers: [],
      newAnswer: "",
      question: "",
      orderAnswer: 1,
      editedAnswer: null
    };
  },
  mounted() {
    axios.get(this.api + "/api/tests/" + this.$route.params.id).then(r => {
      console.log(r);

      this.name = r.data.name;

      r.data.questions.forEach(el => {
        let answ = [];
        el.answers.forEach(answer => {
          answ.push({
            name: answer.name,
            order: answer.order
          });
        });
        this.questions.push({ text: el.text, order: el.order, answers: answ });
      });
      // this.questions = r.data.questions;

      this.orderQuestions = this.questions.length + 1;
      // this.orderQuestions = [...r.data.questions].pop().order;
    });
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
        console.log(test);
        axios
          .delete(`${this.api}/api/tests/${this.$route.params.id}`)
          .then(
            axios
              .post(`${this.api}/api/tests`, test)
              .then(this.$router.push("/tests/"))
          );
      }
    },
    addAnswer: function() {
      var value = this.newAnswer && this.newAnswer.trim();
      if (!value) {
        return;
      }
      this.answers.push({
        name: value,
        order: this.orderAnswer++
      });
      this.newAnswer = "";
    },
    removeAnswer: function(answer) {
      this.answers.splice(this.answers.indexOf(answer), 1);
    },

    editAnswer: function(answer) {
      this.beforeEditCache = answer.name;
      this.editedAnswer = answer;
    },
    doneAnswer: function(answer) {
      if (!this.editedAnswer) {
        return;
      }
      this.editedAnswer = null;
      answer.name = answer.name.trim();
      if (!answer.name) {
        this.removeAnswer(answer);
      }
    },

    cancelAnswer: function(answer) {
      this.editedAnswer = null;

      answer.name = this.beforeEditCache;
    },
    createQuestion: function() {
      if (this.question == "") {
        this.alertName = "Введите вопрос";
        this.alert = true;
        setTimeout(() => (this.alert = false), 2500);
        return;
      }
      if (this.answers.length < 2) {
        this.alertName = "Добавьте хотя-бы 2 ответа";
        this.alert = true;
        setTimeout(() => (this.alert = false), 2500);
        return;
      }
      var q = {
        order: +this.orderQuestions++,
        text: this.question,
        answers: this.answers
      };
      console.log(this.questions);
      console.log(q);
      this.questions.push(q);
      this.closeDialog();
    },
    closeDialog: function() {
      this.dialog = false;
      this.answers = [];
      this.orderAnswers = 1;
      this.newAnswer = "";
      this.question = "";
      this.orderAnswer = 1;
      this.editedAnswer = null;
    }
  },
  directives: {
    "answer-focus": function(el, binding) {
      if (binding.value) {
        el.focus();
      }
    }
  }
};
</script>
<style scoped>
.assa {
  align-items: flex-end;
}
.maxH {
  max-height: 500px;
  overflow-y: auto;
}
.answer-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.answer-list li {
  position: relative;
  font-size: 24px;
  border-bottom: 1px solid #ededed;
}

.answer-list li:last-child {
  border-bottom: none;
}

.answer-list li.editing {
  border-bottom: none;
  padding: 0;
}

.answer-list li.editing .edit {
  display: block;
  width: calc(100% - 25px);
  padding: 12px 16px;
  margin: 0 0 0 25px;
}

.answer-list li.editing .view {
  display: none;
}

.answer-list li .toggle {
  text-align: center;
  width: 40px;
  /* auto, since non-WebKit browsers doesn't support input styling */
  height: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto 0;
  border: none; /* Mobile Safari */
  -webkit-appearance: none;
  appearance: none;
}

.answer-list li .toggle {
  opacity: 0;
}

.answer-list li label {
  word-break: break-all;
  padding: 15px 15px 15px 25px;
  display: block;
  line-height: 1.2;
  transition: color 0.4s;
}

.answer-list li .destroy {
  display: none;
  position: absolute;
  top: 0;
  right: 10px;
  bottom: 0;
  width: 40px;
  height: 40px;
  margin: auto 0;
  font-size: 30px;
  color: #cc9a9a;
  margin-bottom: 11px;
  transition: color 0.2s ease-out;
}

.answer-list li .destroy:hover {
  color: #af5b5e;
}

.answer-list li .destroy:after {
  content: "×";
}

.answer-list li:hover .destroy {
  display: block;
}

.answer-list li .edit {
  display: none;
}

.answer-list li.editing:last-child {
  margin-bottom: -1px;
}
.new-todo,
.edit {
  position: relative;
  margin: 0;
  width: 100%;
  font-size: 24px;
  font-family: inherit;
  font-weight: inherit;
  line-height: 1.4em;
  border: 0;
  color: inherit;
  padding: 6px;
  border: 1px solid #999;
  box-shadow: inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
