<template>
  <NuxtLayout>
    <ClientOnly><Viewer /></ClientOnly>
  </NuxtLayout>
</template>

<script lang="ts" setup>
useHead({
  link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  script: [{ src: 'https://kit.fontawesome.com/d129036538.js' }],
});
</script>
