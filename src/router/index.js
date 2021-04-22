import Vue from "vue";
import VueRouter from "vue-router";
import App from "../index.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "App",
    component: App
  },
  {
    path: "/test/:id",
    name: "Test",
    component: () => import("../views/test.vue")
  },
  {
    path: "/tests",
    name: "Tests",
    component: () => import("../views/Admin/tests.vue")
  },
  {
    path: "/tests/create",
    name: "Createtest",
    component: () => import("../views/Admin/createTest.vue")
  },
  {
    path: "/tests/edit/:id",
    name: "EditTest",
    component: () => import("../views/Admin/editTest.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
