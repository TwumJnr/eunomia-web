<template>
  <div id="page-head-component">
    <div class="page-head">
      <h6>{{ text }}</h6>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  text: string;
}>();
</script>
