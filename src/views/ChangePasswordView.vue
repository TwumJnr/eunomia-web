<script lang="ts" setup>
import type { User } from "@/helpers/types/Users";
import { AxiosInstance } from "axios";
import type { Ref } from "vue";
import { onMounted, computed, inject } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";

const axios = inject<AxiosInstance>("axios");

const router = useRouter();
const newPassword = ref("");
const confirmPassword = ref("");
const loading = ref(false);
const dismissCountDown = ref(10);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const alertMsg = ref("");
const alertVariant = ref("");
const showAlert = ref(false);
const user: Ref<User | null> = ref(null);

const disableForm = computed((): boolean => {
  return !state.value || newPassword.value !== confirmPassword.value;
});
const state = computed((): boolean | null => {
  if (newPassword.value) return newPassword.value.length >= 8;
  else return null;
});
const invalidFeedback = computed(() => {
  if (newPassword.value) {
    if (newPassword.value.length > 0) {
      return "Enter at least 8 characters.";
    }
    return "Please enter something.";
  }
  return "";
});

const changePassword = () => {
  loading.value = true;
  if (newPassword.value !== confirmPassword.value) {
    // console.log("Passwords do not match!");
    alertMsg.value =
      "Passwords provided do not match; Kindly check and try again";
    alertVariant.value = "warning";
    countDownChanged(10);
    loading.value = false;
    return (showAlert.value = true);
  }
  const password = newPassword;
  // loading = true;
  const patchBody = {
    id: user.value?.id,
    oldAuthString: user.value?.oldAuthString,
    authString: password.value,
  };
  // if (patchBody.authString === patchBody.oldAuthString) {
  // return toast.warning(
  //   "New password cannot be the same as the old password",
  //   "Passwords Cannot Match",
  // );
  // }

  loading.value = true;
  axios!
    .put(`/v1/auth/auth-string`, patchBody, {
      params: { id: patchBody.id },
    })
    .then(() => {
      // const data = response.data;

      sessionStorage.clear();
      router.replace("/login");
    })
    .catch((error) => {
      console.log({ error });
      // toast.danger("Could not change password", "Unknown Error");
    })
    .finally(() => {
      loading.value = false;
    });
};

const countDownChanged = (value: number) => {
  dismissCountDown.value = value;
};

onMounted(() => {
  const temp = sessionStorage.getItem("userDetails");
  if (!temp) return router.replace("/login");
  user.value = JSON.parse(temp);
  console.log({ user: user.value });
});
</script>

<template>
  <div id="change-password-view">
    <div class="container">
      <div class="change-password-wrapper">
        <div id="change-password-card">
          <div class="inst-head">
            <div class="d-flex justify-content-center">
              <!-- <img
                src="@/assets/img/pgh_logo.png"
                alt="Promasidor Ghana Logo"
                width="220"
              /> -->
            </div>
          </div>
          <h4 class="text-center text-uppercase mb-4">Change Password</h4>
          <div class="form-wrapper">
            <form @submit.prevent="changePassword">
              <div class="input-group mt-4">
                <div
                  class="form-floating"
                  :class="!state ? 'is-invalid' : 'is-valid'"
                >
                  <input
                    :type="showNewPassword ? 'text' : 'password'"
                    class="form-control"
                    :class="{
                      'is-valid': newPassword.length > 0 && state,
                      'is-invalid': newPassword.length > 0 && !state,
                    }"
                    v-model="newPassword"
                    id="new-password"
                    required
                  />
                  <label for="new-password">New Password</label>
                </div>
                <button
                  type="button"
                  class="btn input-group-button"
                  @click="showNewPassword = !showNewPassword"
                >
                  <div class="d-flex align-items-center">
                    <span class="material-symbols-rounded">
                      {{ showNewPassword ? "visibility" : "visibility_off" }}
                    </span>
                  </div>
                </button>
                <div class="invalid-feedback">
                  {{ invalidFeedback }}
                </div>
              </div>
              <div class="input-group mt-4">
                <div class="form-floating">
                  <input
                    :type="showConfirmPassword ? 'text' : 'password'"
                    class="form-control"
                    v-model="confirmPassword"
                    id="confirm-password"
                    required
                  />
                  <label for="confirm-password">Confirm Password</label>
                </div>
                <button
                  type="button"
                  class="btn input-group-button"
                  @click="showConfirmPassword = !showConfirmPassword"
                >
                  <div class="d-flex align-items-center">
                    <span class="material-symbols-rounded">
                      {{
                        showConfirmPassword ? "visibility" : "visibility_off"
                      }}
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
                  :disabled="disableForm || loading"
                >
                  Save New Password
                </button>
              </div>
            </form>
            <!-- <div class="alert alert-warning alert-dismissible fade show m-0 mt-4" role="alert">
              A simple warning alert—check it out!
              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" />
            </div> -->
          </div>
          <v-overlay
            v-model="loading"
            contained
            class="align-center justify-center"
          >
            <v-progress-circular color="primary" indeterminate size="64" />
          </v-overlay>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#change-password-view {
  // background-color: red;
  background: linear-gradient(to right, var(--white) 48%, var(--blue) 30%);
  height: 100vh;
  .change-password-wrapper {
    height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  $std-value: 0.5rem;
  #change-password-card {
    background-color: var(--white);
    box-shadow: var(--shadow);
    border-radius: calc(var(--radius) * 2);
    padding: 3rem;
    width: 500px;
    transition: var(--transition);
    .inst-head {
      margin-bottom: 3rem;
    }
    .form-wrapper {
      background-color: var(--blue-10);
      padding: 1rem;
      border-radius: calc(var(--bs-border-radius) + 1rem);
    }
  }
}
</style>
