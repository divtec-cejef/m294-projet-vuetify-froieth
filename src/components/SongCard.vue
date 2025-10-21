<template>
  <v-card>
    <v-img
      contain
      height="300"
      :src="artiste.album?.cover_medium || artiste.cover_medium || '/images/default.jpg'"
    />
    <v-card-title class="text-capitalize">
      {{ artiste.title || artiste.name }}
    </v-card-title>
    <v-card-subtitle v-if="artiste.artist">
      {{ artiste.artist.name }}
    </v-card-subtitle>

    <v-card-actions>
      <v-btn icon @click.prevent="appStore.toggleFavorite(artiste)">
        <v-icon :color="appStore.isFavorite(artiste) ? 'red' : ''">
          {{ appStore.isFavorite(artiste) ? 'mdi-heart' : 'mdi-heart-outline' }}
        </v-icon>
      </v-btn>
    </v-card-actions>
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
