<script setup lang="ts">
import { RouterView, useRouter } from "vue-router";
import NavWidget from "@/components/widgets/MainNav.vue";

const router = useRouter();

const logout = () => {
  sessionStorage.clear();
  console.clear();
  router.replace("/login");
};
</script>

<template>
  <NavWidget
    v-if="$route.path !== '/login' && $route.path !== '/change-password'"
  />
  <RouterView />

  <div
    class="modal fade"
    id="logoutModal"
    tabindex="-1"
    aria-labelledby="logoutModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="d-flex justify-content-between p-4 pb-0">
          <h5 class="modal-title" id="logoutModalLabel">Confirm</h5>
          <button
            type="button"
            class="btn-close"
            id="closeModalBtn"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div class="modal-body">
          <div class="modal-inner-content">
            <p>Are you sure you want to log out of this application?</p>
            <div class="d-grid mt-4">
              <button
                class="btn btn-primary"
                type="button"
                style="
                  box-shadow: var(--shadow);
                  font-weight: bolder;
                  color: var(--white);
                "
                @click="logout"
                data-bs-dismiss="modal"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
