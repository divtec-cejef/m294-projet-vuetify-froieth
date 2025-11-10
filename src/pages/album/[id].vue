<template>
  <v-container>
    <!-- Bouton de retour à la page précédente -->
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

    <!-- Contenu principal : affiché quand l'album est chargé -->
    <v-row v-else-if="album">
      <!-- Colonne gauche : pochette de l'album -->
      <v-col cols="12" md="4">
        <v-img
          aspect-ratio="1"
          class="rounded"
          :src="album.cover_big || album.cover_xl || '/images/default.jpg'"
        />
      </v-col>

      <!-- Colonne droite : informations détaillées -->
      <v-col cols="12" md="8">
        <!-- Titre de l’album -->
        <h1 class="mb-2">{{ album.title }}</h1>

        <!-- Nom de l’artiste (s’il existe) -->
        <h3 v-if="album.artist" class="text-grey mb-4">{{ album.artist.name }}</h3>

        <!-- Nombre de pistes -->
        <v-chip v-if="album.nb_tracks" class="mb-2 mr-2">
          <v-icon start>mdi-music-note</v-icon>
          {{ album.nb_tracks }} pistes
        </v-chip>

        <!-- Nombre de fans -->
        <v-chip v-if="album.fans" class="mb-2 mr-2">
          <v-icon start>mdi-account-multiple</v-icon>
          {{ album.fans.toLocaleString() }} fans
        </v-chip>

        <!-- Date de sortie -->
        <v-chip v-if="album.release_date" class="mb-2 mr-2">
          <v-icon start>mdi-calendar</v-icon>
          {{ formatDate(album.release_date) }}
        </v-chip>

        <!-- Boutons d’action : écouter sur Deezer ou ajouter aux favoris -->
        <div class="mt-4">
          <!-- Lien direct vers Deezer -->
          <v-btn
            class="mr-2"
            color="primary"
            :href="album.link"
            prepend-icon="mdi-play"
            size="large"
            target="_blank"
          >
            Écouter sur Deezer
          </v-btn>

          <!-- Bouton de gestion des favoris -->
          <v-btn
            :color="appStore.isFavorite(album) ? '#8889db' : ''"
            :prepend-icon="appStore.isFavorite(album) ? 'mdi-heart' : 'mdi-heart-outline'"
            size="large"
            @click="appStore.toggleFavorite(album)"
          >
            {{ appStore.isFavorite(album) ? 'Retirer des favoris' : 'Ajouter aux favoris' }}
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Message d’erreur si aucun album trouvé -->
    <v-alert v-else class="mt-4" type="error">
      Album non trouvé
    </v-alert>
  </v-container>
</template>

<script setup>
// Importation des outils Vue et des dépendances
  import { computed, onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import api from '@/plugins/axios' // Axios configuré pour appeler l'API Deezer
  import { useAppStore } from '@/stores/app' // Store global (Pinia)

  // Initialisation des variables et du store
  const route = useRoute() // Récupération des paramètres de la route (ex: ID de l'album)
  const appStore = useAppStore() // Accès au store principal
  const loading = ref(false) // État de chargement
  const album = ref(null) // Données de l’album en cours

  // Récupération dynamique de l’ID de l’album depuis l’URL
  const albumId = computed(() => route.params.id)

  // Exécution au montage du composant
  onMounted(async () => {
    // ✅ Essayer d'abord de trouver l'album dans les données déjà en mémoire (store)
    const foundAlbum = appStore.albums?.find(a => a.id == albumId.value)
      || appStore.searchResults.find(a => a.id == albumId.value && a.type === 'album')
      || appStore.favorites.find(a => a.id == albumId.value && a.cover_medium)

    if (foundAlbum && foundAlbum.release_date && foundAlbum.fans) {
      // Si l'album contient déjà toutes les infos nécessaires, on l'utilise directement
      album.value = foundAlbum
    } else {
      // ✅ Sinon, on va chercher les détails complets via l'API
      loading.value = true
      try {
        const response = await api.get(`/album/${albumId.value}`)
        album.value = response.data
      } catch (error) {
        // Gestion d’erreur en cas d’échec de l’appel API
        console.error('Erreur lors du chargement de l\'album:', error)
      } finally {
        // Arrêt du chargement (dans tous les cas)
        loading.value = false
      }
    }
  })

  // Fonction utilitaire pour formater une date au format français lisible
  function formatDate (dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }
</script>
