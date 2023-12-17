<script lang="ts" setup>
import { getUserSession } from "@/helpers/functions/general";
import { onMounted, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";

const router = useRouter();
const userRole = ref("");

onMounted(() => {
  const session = getUserSession();
  if (!session) return router.replace("/login");
});
</script>

<template>
  <div id="nav-widget">
    <div class="d-flex justify-content-between align-items-center">
      <RouterLink to="/" class="btn">
        <div class="inst-details d-flex align-items-end">
          <!-- <img src="@/assets/img/pgh_logo.png" alt="Promasidor Logo" width="70" /> -->
          <h1 class="m-0 ml-2">Eunomia</h1>
        </div>
      </RouterLink>
      <div class="buttons">
        <RouterLink
          type="button"
          to="/users"
          class="btn mx-2"
          v-if="$route.path !== '/users' && userRole === 'Super Admin'"
        >
          Users
        </RouterLink>
        <button
          type="button"
          class="btn"
          data-bs-toggle="modal"
          data-bs-target="#logoutModal"
        >
          <div class="d-flex align-items-center">
            <span class="mr-1 text-warning">Logout</span>
            <!-- <span class="material-symbols-rounded"> logout </span> -->
          </div>
        </button>
      </div>
    </div>
    <!-- <div class="container">
    </div> -->
  </div>
</template>

<style lang="scss" scoped>
$margin: 0.5rem;
#nav-widget {
  position: fixed;
  z-index: 5;
  width: calc(100% - ($margin * 2));
  margin: $margin;
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  border-radius: $margin * 2;
  // background-color: var(--inst-color-blue);
  color: var(--white);
  box-shadow: var(--shadow);
  transition: var(--transition);
}
</style>
