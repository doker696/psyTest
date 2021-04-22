<template>
  <v-app>
    <v-app-bar dense app>
      <router-link style="text-decoration: none; color: inherit;" to="/">
        <v-app-bar-title>
          Tests
        </v-app-bar-title>
      </router-link>
    </v-app-bar>
    <v-main>
      <div class="mx-auto">
        <transition name="slide" mode="out-in">
          <router-view></router-view>
        </transition>
      </div>
    </v-main>
  </v-app>
</template>
<script>
export default {
  components: {},
  data: function() {
    return {};
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}

.slide-enter {
  opacity: 0;
  transform: translateX(10%);
}
.slide-leave-to {
  opacity: 0;
  transform: translateX(-10%);
}
</style>
