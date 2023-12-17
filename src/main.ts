import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "./assets/scss/index.scss";
import "@mdi/font/css/materialdesignicons.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// apex charts
import VueApexCharts from "vue3-apexcharts";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import { provideAxios } from "./plugins/axios";

const vuetify = createVuetify({
  components: {
    ...components,
  },
  directives,
});

const app = createApp(App);

app.use(vuetify);
app.use(VueApexCharts);

provideAxios(app);

app.use(store);
app.use(router);

app.mount("#app");
