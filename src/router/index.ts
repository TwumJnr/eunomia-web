import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { isAuthenticated } from "@/helpers/functions/general";
import HomeView from "../views/HomeView.vue";
// import { baseURL } from "@/helpers/services/axiosApi";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/LoginView.vue"),
  },
  {
    path: "/about",
    name: "about",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// eslint-disable-next-line
router.beforeEach(async (to, from) => {
  console.log({ env: process.env });
  if (!isAuthenticated() && to.name !== "login") {
    return router.replace("/login");
  } else return true;

  return false;
});

export default router;
