<template>
  <v-card class="relative-card">
    <v-img
      class="card-img"
      contain
      height="300"
      :src="artiste.picture_medium || artiste.picture_big || '/images/default.jpg'"
    >
      <!-- bouton coeur en haut à droite -->
      <v-btn
        class="favorite-btn"
        icon
        @click.stop.prevent="appStore.toggleFavorite(artiste)"
      >
        <v-icon :color="appStore.isFavorite(artiste) ? '#8889db' : 'black'">
          {{ appStore.isFavorite(artiste) ? 'mdi-heart' : 'mdi-heart-outline' }}
        </v-icon>
      </v-btn>
    </v-img>

    <v-card-title class="text-capitalize">
      {{ artiste.name }}
    </v-card-title>
  </v-card>
</template>

<script setup>
  import { useAppStore } from '@/stores/app'

  const appStore = useAppStore()

  defineProps({
    artiste: {
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
}

/* bouton coeur sur l'image */
.favorite-btn {
  position: absolute;
  top: 2.4em;
  right: 0.3em;
  background-color: rgba(255, 255, 255, 0.2);
}
</style>
