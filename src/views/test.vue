<template>
  <div>
    <v-container fluid>
      <v-row justify="center">
        <v-col lg="6" md="8" sm="12">
          <div class="d-flex flex-column">
            <div class="mx-auto">
              <div v-if="loading">Loading...</div>
              <div v-else-if="end">
                <div>ответы {{ answers_ids }}</div>
              </div>
              <div v-else>
                <h1>Тест: {{ test.name }}</h1>
                <div>
                  <testquest
                    :quest="current_quest"
                    @answer="nextQuest"
                  ></testquest>
                </div>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
import Testquest from "../components/test_quest.vue";

export default {
  data() {
    return {
      loading: true,
      radios: "Duckduckgo",
      questions: null,
      current_quest: null,
      test: null,
      answers_ids: [],
      end: false,
      count: 0
    };
  },
  methods: {
    nextQuest: function(val) {
      this.answers_ids.push(val);
      if (this.test.questions.length == this.count) {
        this.end = true;
        return;
      }
      this.current_quest = this.test.questions[this.count++];
    }
  },
  mounted() {
    axios
      .get("http://localhost:9125/api/tests/" + this.$route.params.id)
      .then(r => {
        this.loading = false;
        this.test = r.data;
        this.current_quest = this.test.questions[this.count++];
      });
  },
  components: {
    Testquest
  }
};
</script>

<style scoped></style>
