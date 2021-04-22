import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;

import Vuelidate from "vuelidate";
Vue.use(Vuelidate);

Vue.filter("str_limit", function(value, size) {
  if (!value) return "";
  value = value.toString();

  if (value.length <= size) {
    return value;
  }
  return value.substr(0, size) + "...";
});

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount("#app");
