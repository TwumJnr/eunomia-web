<script lang="ts" setup>
import { useRouter } from "vue-router";
import { AxiosInstance } from "axios";
import { ref, onMounted, inject } from "vue";
import type { User } from "@/helpers/types/Users";
import { getUserSession } from "@/helpers/functions/general";

const axios = inject<AxiosInstance>("axios");
const router = useRouter();
const username = ref("");
const password = ref("");
const loading = ref(false);
const isVisible = ref(false);

const login = () => {
  loading.value = true;
  const postData = { username: username.value, password: password.value };

  axios!
    .post("/v1/auth/login", postData)
    .then((response) => {
      const data: User = response.data;
      // console.log({ data });

      if (data.firstTime || data.reset) {
        // change password
        sessionStorage.setItem(
          "userDetails",
          JSON.stringify({ ...data, oldAuthString: password.value })
        );
        router.replace("/change-password");
      } else {
        sessionStorage.setItem(
          "userDetails",
          JSON.stringify({ ...data, message: undefined })
        );

        router.replace("/");
      }
      // users.value = data;
    })
    .catch((error) => {
      console.log(error);
      switch (error.response.status) {
        case 400:
          console.log("error code is 400");
          break;
      }
    })
    .finally(() => {
      loading.value = false;
    });
};

onMounted(() => {
  const session = getUserSession();
  if (!session) return;
  if (!session.user) return;
  console.log({ session });
  if (session.user.id) router.push("/");
});
</script>

<template>
  <div id="login-card">
    <div class="inst-head">
      <div class="d-flex justify-content-center">
        <!-- <img src="@/assets/img/pgh_logo.png" alt="Promasidor Ghana Logo" width="220" /> -->
      </div>
    </div>
    <h4 class="text-center text-uppercase mb-4">Eunomia Dashboard</h4>
    <div class="form-wrapper">
      <form @submit.prevent="login">
        <div class="form-floating">
          <input
            type="email"
            class="form-control"
            id="emailAddressInput"
            v-model="username"
            placeholder="name@example.com"
            required
          />
          <label for="emailAddressInput">Email Address</label>
        </div>
        <div class="input-group mt-4">
          <div class="form-floating">
            <input
              :type="isVisible ? 'text' : 'password'"
              class="form-control"
              v-model="password"
              id="password"
              required
            />
            <label for="password">Password</label>
          </div>
          <button
            type="button"
            class="btn input-group-button"
            @click="isVisible = !isVisible"
          >
            <div class="d-flex align-items-center">
              <span class="material-symbols-rounded">
                {{ isVisible ? "visibility" : "visibility_off" }}
              </span>
            </div>
          </button>
        </div>
        <div class="d-grid mt-6">
          <button
            class="btn btn-primary"
            style="
              color: var(--white);
              font-weight: bolder;
              box-shadow: var(--shadow);
            "
            type="submit"
            :disabled="loading"
          >
            Login
          </button>
        </div>
      </form>
    </div>
    <v-overlay v-model="loading" contained class="align-center justify-center">
      <v-progress-circular color="primary" indeterminate size="64" />
    </v-overlay>
  </div>
</template>

<style lang="scss" scoped>
$std-value: 0.5rem;
#login-card {
  background-color: var(--white);
  box-shadow: var(--shadow);
  border-radius: calc(var(--radius) * 2);
  padding: 3rem;
  width: 500px;
  .inst-head {
    margin-bottom: 3rem;
  }
  .form-wrapper {
    background-color: var(--blue-10);
    padding: 1rem;
    border-radius: calc(var(--bs-border-radius) + 1rem);
  }
}
</style>
