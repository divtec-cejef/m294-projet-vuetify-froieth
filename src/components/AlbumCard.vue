<template>
  <v-card class="relative-card">
    <v-img
      class="card-img"
      contain
      height="300"
      :src="album.cover_medium || album.cover_big || '/images/default.jpg'"
    >
      <!-- bouton coeur en haut à droite -->
      <v-btn
        class="favorite-btn"
        icon
        @click.stop.prevent="appStore.toggleFavorite(album)"
      >
        <v-icon :color="appStore.isFavorite(album) ? '#8889db' : 'rgba(0,0,0,0.6)'">
          {{ appStore.isFavorite(album) ? 'mdi-heart' : 'mdi-heart-outline' }}
        </v-icon>
      </v-btn>
    </v-img>

    <v-card-title class="text-capitalize">
      {{ album.title }}
    </v-card-title>
    <v-card-subtitle v-if="album.artist">
      {{ album.artist.name }}
    </v-card-subtitle>
  </v-card>
</template>

<script setup>
  import { useAppStore } from '@/stores/app'

  const appStore = useAppStore()

  defineProps({
    album: {
      type: Object,
      required: true,
    },
  })
</script>

<style scoped>
.card-img {
  margin-bottom: -2em;
  margin-top: -2.1em;
}

.relative-card {
  position: relative;
  padding-bottom: 1em;
  overflow: hidden;
}

/* bouton coeur sur l'image */
.favorite-btn {
  position: absolute;
  top: 1em;
  right: 1em;
  background-color: rgba(255, 255, 255, 0.2);
}

</style>
