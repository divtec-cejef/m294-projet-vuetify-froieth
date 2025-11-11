<template>
  <v-app>
    <menu-principal />
    <router-view />
  </v-app>
</template>

<script setup>
  import { onMounted } from 'vue'
  // Importation du composant MenuPrincipal pour l'en-tête de l'application
  import MenuPrincipal from '@/components/AppHeader.vue'
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
