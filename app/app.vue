<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage :keepalive="{ max: 5 }" />
  </NuxtLayout>
</template>
