<template>
  <v-container>
    <v-btn
      class="mb-4"
      prepend-icon="mdi-arrow-left"
      @click="$router.back()"
    >
      Retour
    </v-btn>

    <div v-if="loading" class="text-center py-8">
      <v-progress-circular color="primary" indeterminate />
    </div>

    <v-row v-else-if="song">
      <v-col cols="12" md="4">
        <v-img
          aspect-ratio="1"
          class="rounded"
          :src="song.album?.cover_big || song.cover_big || '/images/default.jpg'"
        />
      </v-col>

      <v-col cols="12" md="8">
        <h1 class="mb-2">{{ song.title || song.name }}</h1>
        <h3 v-if="song.artist" class="text-grey mb-4">{{ song.artist.name }}</h3>

        <v-chip v-if="song.duration" class="mb-2 mr-2">
          <v-icon start>mdi-clock-outline</v-icon>
          {{ formatDuration(song.duration) }}
        </v-chip>

        <v-chip v-if="song.rank" class="mb-2 mr-2">
          <v-icon start>mdi-chart-line</v-icon>
          Popularité: {{ song.rank }}
        </v-chip>

        <v-chip v-if="song.album?.release_date" class="mb-2 mr-2">
          <v-icon start>mdi-calendar</v-icon>
          {{ formatDate(song.album?.release_date) }}
        </v-chip>

        <div class="mt-4">
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

    <v-alert v-else class="mt-4" type="error">
      Chanson non trouvée
    </v-alert>
  </v-container>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import api from '@/plugins/axios'
  import { useAppStore } from '@/stores/app'

  const route = useRoute()
  const appStore = useAppStore()
  const loading = ref(false)
  const song = ref(null)

  const songId = computed(() => route.params.id)

  onMounted(async () => {
    // ✅ Essayer de trouver dans le store d'abord
    const foundSong = appStore.resources.find(s => s.id == songId.value)
      || appStore.searchResults.find(s => s.id == songId.value)
      || appStore.favorites.find(s => s.id == songId.value)

    if (foundSong && (foundSong.release_date || foundSong.album?.release_date)) {
      // Si on a déjà toutes les infos
      song.value = foundSong
    } else {
      // ✅ Sinon, fetch les détails complets depuis l'API
      loading.value = true
      try {
        const response = await api.get(`/track/${songId.value}`)
        song.value = response.data
      } catch (error) {
        console.error('Erreur lors du chargement de la chanson:', error)
        // Si le fetch échoue, utiliser quand même les données du store
        song.value = foundSong
      } finally {
        loading.value = false
      }
    }
  })

  function formatDuration (seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

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
