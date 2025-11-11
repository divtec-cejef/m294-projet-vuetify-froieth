<template>
  <!-- Carte représentant un artiste -->
  <v-card class="relative-card" @click="goToDetails">
    <!-- Image de l'artiste -->
    <v-img
      class="card-img"
      contain
      height="300"
      :src="artiste.picture_medium || artiste.picture_big || '/images/default.jpg'"
    >
      <!-- Bouton coeur pour ajouter ou retirer l'artiste des favoris -->
      <v-btn
        class="favorite-btn"
        icon
        @click.stop.prevent="appStore.toggleFavorite(artiste)"
      >
        <!-- Icône du coeur : plein si favori, contour sinon -->
        <v-icon :color="appStore.isFavorite(artiste) ? '#8889db' : 'black'">
          {{ appStore.isFavorite(artiste) ? 'mdi-heart' : 'mdi-heart-outline' }}
        </v-icon>
      </v-btn>
    </v-img>

    <!-- Nom de l'artiste -->
    <v-card-title class="text-capitalize">
      {{ artiste.name }}
    </v-card-title>
  </v-card>
</template>

<script setup>
// Import des outils nécessaires
  import { useRouter } from 'vue-router'
  import { useAppStore } from '@/stores/app'

  const router = useRouter() // Permet de naviguer vers une autre page
  const appStore = useAppStore() // Accès au store global

  // Définition des props reçues par le composant
  const props = defineProps({
    artiste: {
      type: Object,
      required: true,
    },
  })

  // Fonction pour naviguer vers la page de détails de l'artiste
  function goToDetails () {
    router.push(`/artist/${props.artiste.id}`)
  }
</script>
