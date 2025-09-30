<template>
  <v-app>
    <v-btn @click="logData()">Charger les ressources</v-btn>
    <router-view />
  </v-app>
</template>

<script setup>
  import { onMounted } from 'vue'
  import { useAppStore } from '@/stores/app'
  const store = useAppStore()
  onMounted(() => {
    store.init() // premier chargement
    console.log('App mounted, store initialized')
  })
  // onclick du bouton pour logData
  function logData () {
    console.log(store.resources)
  }
</script>
