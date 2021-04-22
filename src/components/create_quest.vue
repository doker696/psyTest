<template>
  <v-dialog v-model="open" max-width="500px">
    <v-card>
      <v-card-title> Создание вопроса </v-card-title>
      <v-card-text>
        <v-textarea
          label="Вопрос"
          required
          autofocus
          v-model="question"
          rows="1"
          auto-grow
        ></v-textarea>
        <v-row>
          <v-col cols="auto" class="my-auto">
            <h2>Ответы:</h2>
          </v-col>

          <v-col cols="auto">
            <v-tooltip v-for="(item, i) in savedAnswers" :key="i" bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-chip
                  class="mx-1"
                  @click="addAn(item)"
                  v-bind="attrs"
                  v-on="on"
                  >{{ i }}</v-chip
                >
              </template>
              <span>{{ item.tooltip }}</span>
            </v-tooltip>
          </v-col>
          <v-col cols="auto">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-chip
                  class="spin"
                  @click="saveAnswersLocal"
                  v-bind="attrs"
                  v-on="on"
                  ><v-icon>mdi-plus</v-icon></v-chip
                >
              </template>
              <span>Сохранить ответы</span>
            </v-tooltip>
          </v-col>
        </v-row>
        <v-text-field
          hide-details
          class="new-answer"
          autocomplete="off"
          placeholder="Введите ответ"
          v-model="newAnswer"
          @keyup.enter="addAnswer"
        />
        <small
          >Нажмите Enter для сохранения ответа, дважды нажмите на ответ, для его
          изменения</small
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
              <label @dblclick="editAnswer(answer)"> {{ answer.name }}</label>
              <button class="destroy" @click="removeAnswer(answer)"></button>
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
        <v-btn color="primary" text @click="open = false">
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
</template>
<script>
export default {
  data() {
    return {
      api: "http://localhost:9125",
      counter: 0,
      dialog: this.dialogs,
      name: "",
      questions: [],
      orderQuestions: 1,
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
  props: ["isOpen"],
  computed: {
    open: {
      get() {
        this.checkLocal();

        return this.isOpen;
      },
      set(value) {
        if (!value) {
          this.$emit("close");
        }
      }
    }
  },
  methods: {
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
      this.open = false;
      this.$emit("quest", {
        text: this.question,
        answers: this.answers
      });
      this.answers = [];
      this.question = "";
      this.orderAnswer = 1;
    },
    addAn: function(val) {
      val.answers.forEach(el => {
        this.answers.push({
          name: el.name,
          order: this.orderAnswer++
        });
      });
    },
    saveAnswersLocal() {
      let obj = {};
      obj.answers = [...this.answers];
      obj.tooltip = obj.answers
        .map(el => {
          return el.name;
        })
        .join("/");
      let savedAnswers = [];
      if (localStorage.getItem("savedAnswers")) {
        try {
          savedAnswers = JSON.parse(localStorage.getItem("savedAnswers"));
        } catch (e) {
          localStorage.removeItem("savedAnswers");
        }
      }
      savedAnswers.push(obj);

      let parsed = JSON.stringify(savedAnswers);
      localStorage.setItem("savedAnswers", parsed);
      this.checkLocal();
    },
    checkLocal: function() {
      if (localStorage.getItem("savedAnswers")) {
        try {
          this.savedAnswers = JSON.parse(localStorage.getItem("savedAnswers"));
        } catch (e) {
          localStorage.removeItem("savedAnswers");
        }
      }
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
.spin:hover i {
  transform: rotate(180deg);
}
.spin:hover i {
  transform: rotate(180deg);
}
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
