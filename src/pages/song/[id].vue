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

    <!-- Affichage principal : si une chanson est trouvée -->
    <v-row v-else-if="song">
      <!-- Colonne gauche : pochette de l’album ou image de la chanson -->
      <v-col cols="12" md="4">
        <v-img
          aspect-ratio="1"
          class="rounded"
          :src="song.album?.cover_big || song.cover_big || '/images/default.jpg'"
        />
      </v-col>

      <!-- Colonne droite : informations détaillées sur la chanson -->
      <v-col cols="12" md="8">
        <!-- Titre ou nom de la chanson -->
        <h1 class="mb-2">{{ song.title || song.name }}</h1>

        <!-- Nom de l’artiste si disponible -->
        <h3 v-if="song.artist" class="text-grey mb-4">{{ song.artist.name }}</h3>

        <!-- Durée de la chanson -->
        <v-chip v-if="song.duration" class="mb-2 mr-2">
          <v-icon start>mdi-clock-outline</v-icon>
          {{ formatDuration(song.duration) }}
        </v-chip>

        <!-- Popularité / classement -->
        <v-chip v-if="song.rank" class="mb-2 mr-2">
          <v-icon start>mdi-chart-line</v-icon>
          Popularité: {{ song.rank }}
        </v-chip>

        <!-- Date de sortie de l’album -->
        <v-chip v-if="song.album?.release_date" class="mb-2 mr-2">
          <v-icon start>mdi-calendar</v-icon>
          {{ formatDate(song.album?.release_date) }}
        </v-chip>

        <!-- Boutons d’action -->
        <div class="mt-4">
          <!-- Lien vers Deezer pour écouter la chanson -->
          <v-btn
            class="mr-2"
            color="primary"
            :href="song.link"
            prepend-icon="mdi-play"
            size="large"
            target="_blank"
          >
            Écouter sur Deezer
          </v-btn>

          <!-- Bouton pour ajouter ou retirer des favoris -->
          <v-btn
            :color="appStore.isFavorite(song) ? '#8889db' : ''"
            :prepend-icon="appStore.isFavorite(song) ? 'mdi-heart' : 'mdi-heart-outline'"
            size="large"
            @click="appStore.toggleFavorite(song)"
          >
            {{ appStore.isFavorite(song) ? 'Retirer des favoris' : 'Ajouter aux favoris' }}
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Message d’erreur si aucune chanson n’est trouvée -->
    <v-alert v-else class="mt-4" type="error">
      Chanson non trouvée
    </v-alert>
  </v-container>
</template>

<script setup>
// Import des outils Vue et des dépendances
  import { computed, onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import api from '@/plugins/axios' // Plugin Axios configuré pour l'API Deezer
  import { useAppStore } from '@/stores/app' // Store principal (Pinia)

  // Initialisation des variables
  const route = useRoute() // Pour récupérer l’ID de la chanson depuis l’URL
  const appStore = useAppStore() // Accès au store global
  const loading = ref(false) // Indique si les données sont en cours de chargement
  const song = ref(null) // Données de la chanson sélectionnée

  // ID de la chanson depuis la route
  const songId = computed(() => route.params.id)

  // Chargement des données lors du montage du composant
  onMounted(async () => {
    // Cherche si la chanson existe déjà dans le store (cache local)
    const foundSong = appStore.resources.find(s => s.id == songId.value)
      || appStore.searchResults.find(s => s.id == songId.value)
      || appStore.favorites.find(s => s.id == songId.value)

    if (foundSong && (foundSong.release_date || foundSong.album?.release_date)) {
      // Si toutes les informations nécessaires sont déjà présentes
      song.value = foundSong
    } else {
      // Sinon, récupérer les détails complets depuis l’API
      loading.value = true
      try {
        const response = await api.get(`/track/${songId.value}`)
        song.value = response.data
      } catch (error) {
        // Gestion d’erreur si l’appel API échoue
        console.error('Erreur lors du chargement de la chanson:', error)
        // Utiliser quand même les données trouvées dans le store si disponibles
        song.value = foundSong
      } finally {
        // Fin du chargement
        loading.value = false
      }
    }
  })

  // Fonction pour formater la durée en minutes:secondes
  function formatDuration (seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Fonction pour formater une date au format français
  function formatDate (dateString) {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }
</script>
