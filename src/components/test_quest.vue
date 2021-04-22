<template>
  <div>
    <v-radio-group v-model="radios">
      <template v-slot:label>
        <h3>{{ quest.text }}</h3>
      </template>
      <v-radio v-for="i in quest.answers" :key="i.id" :value="i.text">
        <template v-slot:label>
          <div>
            {{ i.name }}
          </div>
        </template>
      </v-radio>
    </v-radio-group>
    <v-btn @click="next">Следующий вопрос</v-btn>
  </div>
</template>
<script>
export default {
  data() {
    return {
      radios: null
    };
  },
  props: ["quest"],
  methods: {
    next: function() {
      this.$emit("answer", this.quest.answers[this.radios].id);
      this.radios = null;
    }
  }
};
</script>
<style scoped>
[v-cloak] {
  display: block;
}
</style>
