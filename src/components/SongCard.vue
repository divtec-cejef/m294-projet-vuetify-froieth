<template>
  <!-- Carte principale représentant un artiste ou une chanson -->
  <v-card class="relative-card" @click="goToDetails">
    <!-- Image de couverture de l'artiste ou de l'album -->
    <v-img
      class="card-img"
      contain
      height="300"
      :src="artiste.album?.cover_medium || artiste.cover_medium || '/images/default.jpg'"
    >
      <!-- Bouton "favori" (icône de cœur) placé en haut à droite de l'image -->
      <v-btn
        class="favorite-btn"
        icon
        @click.stop.prevent="appStore.toggleFavorite(artiste)"
      >
        <!-- Icône du cœur : plein si favori, vide sinon -->
        <v-icon :color="appStore.isFavorite(artiste) ? '#8889db' : 'black'">
          {{ appStore.isFavorite(artiste) ? 'mdi-heart' : 'mdi-heart-outline' }}
        </v-icon>
      </v-btn>
    </v-img>

    <!-- Titre ou nom principal (ex : chanson ou artiste) -->
    <v-card-title class="text-capitalize">
      {{ artiste.title || artiste.name }}
    </v-card-title>

    <!-- Sous-titre affichant le nom de l’artiste si disponible -->
    <v-card-subtitle v-if="artiste.artist">
      {{ artiste.artist.name }}
    </v-card-subtitle>
  </v-card>
</template>

<script setup>
// Importation des outils nécessaires
  import { useRouter } from 'vue-router' // Pour naviguer entre les pages
  import { useAppStore } from '@/stores/app' // Accès au store global (Pinia)

  const router = useRouter() // Initialisation du routeur
  const appStore = useAppStore() // Accès au store de l'application

  // Définition des props reçues par le composant
  const props = defineProps({
    artiste: {
      type: Object,
      required: true, // L'objet artiste est obligatoire
    },
  })

  // Fonction de navigation vers la page de détails d'une chanson
  function goToDetails () {
    router.push(`/song/${props.artiste.id}`) // Redirige vers /song/<id>
  }
</script>
