import axios, { AxiosInstance } from "axios";
import type { App } from "vue";

const baseURL = process.env.VUE_APP_BASE_URL;

const instance: AxiosInstance = axios.create({
  baseURL,
});

// export default {
//   install: (app: App) => {
//     app.config.globalProperties.$axios = instance;
//     app.provide("axios", instance);
//   },
// };

export const provideAxios = (app: App) => {
  app.provide<AxiosInstance>("axios", instance);
};

export default instance;
