<template>
  <v-container>
    <h1 class="mb-6 text-center">Favoris</h1>

    <div v-if="favoris.length > 0">
      <!-- Section Musiques -->
      <div v-if="musiqueFavorites.length > 0">
        <h2 class="mb-4">Musiques</h2>
        <v-row>
          <v-col
            v-for="song in musiqueFavorites"
            :key="song.id"
            class="col-lg-custom"
            cols="6"
            md="4"
            sm="6"
          >
            <FavoriteCard :item="song" />
          </v-col>
        </v-row>
      </div>

      <!-- Séparateur -->
      <v-divider v-if="musiqueFavorites.length > 0 && artisteFavorites.length > 0" class="my-8" />

      <!-- Section Artistes -->
      <div v-if="artisteFavorites.length > 0">
        <h2 class="mb-4">Artistes</h2>
        <v-row>
          <v-col
            v-for="artist in artisteFavorites"
            :key="artist.id"
            class="col-lg-custom"
            cols="6"
            md="4"
            sm="6"
          >
            <FavoriteCard :item="artist" />
          </v-col>
        </v-row>
      </div>
    </div>

    <!-- Séparateur -->
    <v-divider v-if="artisteFavorites.length > 0 && albumFavorites.length > 0 || musiqueFavorites.length > 0 && albumFavorites.length > 0" class="my-8" />

    <!-- Section Album -->
    <div v-if="albumFavorites.length > 0">
      <h2 class="mb-4">Albums</h2>
      <v-row>
        <v-col
          v-for="album in albumFavorites"
          :key="album.id"
          class="col-lg-custom"
          cols="6"
          md="4"
          sm="6"
        >
          <FavoriteCard :item="album" />
        </v-col>
      </v-row>
    </div>

    <v-alert
      v-if="albumFavorites.length === 0 && artisteFavorites.length === 0 && musiqueFavorites.length === 0"
      class="text-center"
      color="#8889db"
      type="info"
    >
      Vous n'avez pas encore de favoris.<br>
      <v-btn class="mt-2" color="#8889ef" to="/">Retourner à l'accueil'</v-btn>
    </v-alert>
  </v-container>
</template>

<script setup>
  import { computed } from 'vue'
  import FavoriteCard from '@/components/FavoriteCard.vue'
  import { useAppStore } from '@/stores/app'

  const appStore = useAppStore()
  const favoris = computed(() => appStore.favorites)

  // Musiques (tracks)
  const musiqueFavorites = computed(() => {
    return favoris.value.filter(item => item.type === 'track')
  })

  // Artistes
  const artisteFavorites = computed(() => {
    return favoris.value.filter(item => item.type === 'artist')
  })

  // Albums
  const albumFavorites = computed(() => {
    return favoris.value.filter(item => item.type === 'album')
  })
</script>

<style scoped>
@media (min-width: 1280px) {
  .col-lg-custom {
    flex: 0 0 20%;
    max-width: 20%;
  }
}
</style>
