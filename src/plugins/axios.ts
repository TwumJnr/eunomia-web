import axios, { AxiosInstance } from "axios";
import type { App } from "vue";
import { getUserToken } from "@/helpers/functions/general";

const baseURL = process.env.VUE_APP_BASE_URL;
const token = () => {
  return getUserToken();
};

const instance: AxiosInstance = axios.create({
  baseURL,
  headers: {
    Authorization: `Bearer ${token()}`,
  },
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
