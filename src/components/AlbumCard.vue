<template>
  <!-- Carte représentant un album -->
  <v-card class="relative-card" @click="goToDetails">
    <!-- Image de l'album -->
    <v-img
      class="card-img"
      contain
      height="300"
      :src="album.cover_medium || album.cover_big || '/images/default.jpg'"
    >
      <!-- Bouton coeur pour ajouter ou retirer des favoris -->
      <v-btn
        class="favorite-btn"
        icon
        @click.stop.prevent="appStore.toggleFavorite(album)"
      >
        <!-- Icône du coeur : plein si favori, contour sinon -->
        <v-icon :color="appStore.isFavorite(album) ? '#8889db' : 'rgba(0,0,0,0.6)'">
          {{ appStore.isFavorite(album) ? 'mdi-heart' : 'mdi-heart-outline' }}
        </v-icon>
      </v-btn>
    </v-img>

    <!-- Titre de l'album -->
    <v-card-title class="text-capitalize">
      {{ album.title }}
    </v-card-title>

    <!-- Nom de l’artiste si disponible -->
    <v-card-subtitle v-if="album.artist">
      {{ album.artist.name }}
    </v-card-subtitle>
  </v-card>
</template>

<script setup>
// Import des outils nécessaires
  import { useRouter } from 'vue-router'
  import { useAppStore } from '@/stores/app'

  const router = useRouter() // Permet de naviguer vers une autre page
  const appStore = useAppStore() // Accès au store

  // Définition des props reçues par le composant
  const props = defineProps({
    album: {
      type: Object,
      required: true,
    },
  })

  // Fonction pour naviguer vers la page de détails de l'album
  function goToDetails () {
    router.push(`/album/${props.album.id}`)
  }
</script>
