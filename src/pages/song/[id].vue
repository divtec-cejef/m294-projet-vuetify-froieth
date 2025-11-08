<template>
  <v-container>
    <v-btn
      class="mb-4"
      prepend-icon="mdi-arrow-left"
      @click="$router.back()"
    >
      Retour
    </v-btn>

    <v-row v-if="song">
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
  import { computed, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { useAppStore } from '@/stores/app'

  const route = useRoute()
  const appStore = useAppStore()

  const songId = computed(() => route.params.id)

  const song = computed(() => {
    return appStore.resources.find(s => s.id == songId.value)
      || appStore.searchResults.find(s => s.id == songId.value)
      || appStore.favorites.find(s => s.id == songId.value)
  })

  onMounted(() => {
    if (!song.value) {
      console.warn('Chanson non trouvée dans le store')
    }
  })

  function formatDuration (seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
</script>
