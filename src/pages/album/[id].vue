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

    <v-row v-else-if="album">
      <v-col cols="12" md="4">
        <v-img
          aspect-ratio="1"
          class="rounded"
          :src="album.cover_big || album.cover_xl || '/images/default.jpg'"
        />
      </v-col>

      <v-col cols="12" md="8">
        <h1 class="mb-2">{{ album.title }}</h1>
        <h3 v-if="album.artist" class="text-grey mb-4">{{ album.artist.name }}</h3>

        <v-chip v-if="album.nb_tracks" class="mb-2 mr-2">
          <v-icon start>mdi-music-note</v-icon>
          {{ album.nb_tracks }} pistes
        </v-chip>

        <v-chip v-if="album.fans" class="mb-2 mr-2">
          <v-icon start>mdi-account-multiple</v-icon>
          {{ album.fans.toLocaleString() }} fans
        </v-chip>

        <v-chip v-if="album.release_date" class="mb-2 mr-2">
          <v-icon start>mdi-calendar</v-icon>
          {{ formatDate(album.release_date) }}
        </v-chip>

        <div class="mt-4">
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

    <v-alert v-else class="mt-4" type="error">
      Album non trouvé
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
  const album = ref(null)

  const albumId = computed(() => route.params.id)

  onMounted(async () => {
    // ✅ Essayer de trouver dans le store d'abord
    const foundAlbum = appStore.albums?.find(a => a.id == albumId.value)
      || appStore.searchResults.find(a => a.id == albumId.value && a.type === 'album')
      || appStore.favorites.find(a => a.id == albumId.value && a.cover_medium)

    if (foundAlbum && foundAlbum.release_date && foundAlbum.fans) {
      // Si on a déjà toutes les infos
      album.value = foundAlbum
    } else {
      // ✅ Sinon, fetch les détails complets depuis l'API
      loading.value = true
      try {
        const response = await api.get(`/album/${albumId.value}`)
        album.value = response.data
      } catch (error) {
        console.error('Erreur lors du chargement de l\'album:', error)
      } finally {
        loading.value = false
      }
    }
  })

  function formatDate (dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }
</script>
