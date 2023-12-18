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
    path: "/users",
    name: "users",
    component: () =>
      import(/* webpackChunkName: "users" */ "../views/UsersView.vue"),
  },
  {
    path: "/change-password",
    name: "Change Password",
    component: () =>
      import(
        /* webpackChunkName: "change-password" */ "../views/ChangePasswordView.vue"
      ),
  },
  {
    path: "/event",
    name: "event",
    component: () =>
      import(
        /* webpackChunkName: "eventDetails" */ "../views/EventDetails.vue"
      ),
    // children: [
    //   {
    //     path: "position",
    //     component: () =>
    //       import(
    //         /* webpackChunkName: "eventDetails" */ "../components/EventPosition.vue"
    //       ),
    //   },
    // ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// eslint-disable-next-line
router.beforeEach(async (to, from) => {
  if (!isAuthenticated() && to.name !== "login") {
    return router.replace("/login");
  } else return true;

  return false;
});

export default router;
