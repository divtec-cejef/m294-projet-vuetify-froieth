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

    <v-row v-else-if="artist">
      <v-col cols="12" md="4">
        <v-img
          aspect-ratio="1"
          class="rounded"
          :src="artist.picture_big || artist.picture_xl || '/images/default.jpg'"
        />
      </v-col>

      <v-col cols="12" md="8">
        <h1 class="mb-2">{{ artist.name }}</h1>

        <v-chip v-if="artist.nb_fan" class="mb-2 mr-2">
          <v-icon start>mdi-account-multiple</v-icon>
          {{ artist.nb_fan.toLocaleString() }} fans
        </v-chip>

        <v-chip v-if="artist.nb_album" class="mb-2 mr-2">
          <v-icon start>mdi-album</v-icon>
          {{ artist.nb_album }} albums
        </v-chip>

        <div class="mt-4">
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

    <v-alert v-else class="mt-4" type="error">
      Artiste non trouvé
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
  const artist = ref(null)

  const artistId = computed(() => route.params.id)

  onMounted(async () => {
    // ✅ Essayer de trouver dans le store d'abord
    const foundArtist = appStore.artists?.find(a => a.id == artistId.value)
      || appStore.searchResults.find(a => a.id == artistId.value && a.type === 'artist')
      || appStore.favorites.find(a => a.id == artistId.value && (a.picture_medium || a.picture_big))

    if (foundArtist && foundArtist.nb_fan && foundArtist.nb_album) {
      // Si on a déjà toutes les infos
      artist.value = foundArtist
    } else {
      // ✅ Sinon, fetch les détails complets depuis l'API
      loading.value = true
      try {
        const response = await api.get(`/artist/${artistId.value}`)
        artist.value = response.data
      } catch (error) {
        console.error('Erreur lors du chargement de l\'artiste:', error)
      } finally {
        loading.value = false
      }
    }
  })
</script>
