<script lang="ts" setup>
import LoginCard from "@/components/widgets/LoginCard.vue";
</script>

<template>
  <div id="login-view">
    <div class="container">
      <div class="login-wrapper">
        <LoginCard />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#login-view {
  // background-color: red;
  background: linear-gradient(to right, var(--white) 48%, var(--blue) 30%);
  height: 100vh;
  .login-wrapper {
    height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
