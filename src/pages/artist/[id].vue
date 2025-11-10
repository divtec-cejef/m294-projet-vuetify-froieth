<template>
  <v-container>
    <!-- Bouton pour revenir à la page précédente -->
    <v-btn
      class="mb-4"
      prepend-icon="mdi-arrow-left"
      @click="$router.back()"
    >
      Retour
    </v-btn>

    <!-- Indicateur de chargement pendant la récupération des données -->
    <div v-if="loading" class="text-center py-8">
      <v-progress-circular color="primary" indeterminate />
    </div>

    <!-- Affichage principal : si un artiste a été trouvé -->
    <v-row v-else-if="artist">
      <!-- Image de l’artiste -->
      <v-col cols="12" md="4">
        <v-img
          aspect-ratio="1"
          class="rounded"
          :src="artist.picture_big || artist.picture_xl || '/images/default.jpg'"
        />
      </v-col>

      <!-- Colonne droite : informations de l’artiste -->
      <v-col cols="12" md="8">
        <!-- Nom de l’artiste -->
        <h1 class="mb-2">{{ artist.name }}</h1>

        <!-- Nombre de fans -->
        <v-chip v-if="artist.nb_fan" class="mb-2 mr-2">
          <v-icon start>mdi-account-multiple</v-icon>
          {{ artist.nb_fan.toLocaleString() }} fans
        </v-chip>

        <!-- Nombre d’albums -->
        <v-chip v-if="artist.nb_album" class="mb-2 mr-2">
          <v-icon start>mdi-album</v-icon>
          {{ artist.nb_album }} albums
        </v-chip>

        <!-- Boutons d’action -->
        <div class="mt-4">
          <!-- Lien vers la page Deezer de l’artiste -->
          <v-btn
            class="mr-2"
            color="primary"
            :href="artist.link"
            prepend-icon="mdi-open-in-new"
            size="large"
            target="_blank"
          >
            Voir sur Deezer
          </v-btn>

          <!-- Bouton pour ajouter ou retirer l’artiste des favoris -->
          <v-btn
            :color="appStore.isFavorite(artist) ? '#8889db' : ''"
            :prepend-icon="appStore.isFavorite(artist) ? 'mdi-heart' : 'mdi-heart-outline'"
            size="large"
            @click="appStore.toggleFavorite(artist)"
          >
            {{ appStore.isFavorite(artist) ? 'Retirer des favoris' : 'Ajouter aux favoris' }}
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Message d’erreur si aucun artiste trouvé -->
    <v-alert v-else class="mt-4" type="error">
      Artiste non trouvé
    </v-alert>
  </v-container>
</template>

<script setup>
// Importation des outils Vue et des dépendances nécessaires
  import { computed, onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import api from '@/plugins/axios' // Plugin Axios pour les appels API
  import { useAppStore } from '@/stores/app' // Store principal (Pinia)

  // Initialisation des outils et variables
  const route = useRoute() // Permet d’accéder aux paramètres de la route (ID de l’artiste)
  const appStore = useAppStore() // Accès au store global
  const loading = ref(false) // Indique si une requête est en cours
  const artist = ref(null) // Données de l’artiste sélectionné

  // Récupération dynamique de l’ID de l’artiste depuis l’URL
  const artistId = computed(() => route.params.id)

  // Chargement des données au montage du composant
  onMounted(async () => {
    // Chercher si l’artiste existe déjà dans le store (cache local)
    const foundArtist = appStore.artists?.find(a => a.id == artistId.value)
      || appStore.searchResults.find(a => a.id == artistId.value && a.type === 'artist')
      || appStore.favorites.find(a => a.id == artistId.value && (a.picture_medium || a.picture_big))

    if (foundArtist && foundArtist.nb_fan && foundArtist.nb_album) {
      // Si l’artiste contient déjà toutes les informations nécessaires
      artist.value = foundArtist
    } else {
      // Sinon, on charge les informations complètes depuis l’API Deezer
      loading.value = true
      try {
        const response = await api.get(`/artist/${artistId.value}`)
        artist.value = response.data
      } catch (error) {
        // Gestion d’erreur en cas d’échec de la requête
        console.error('Erreur lors du chargement de l\'artiste:', error)
      } finally {
        // Fin du chargement (qu’il y ait eu une erreur ou non)
        loading.value = false
      }
    }
  })
</script>
