<template>
  <v-card class="relative-card" @click="goToDetails">
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
  import { useRouter } from 'vue-router'
  import { useAppStore } from '@/stores/app'

  const router = useRouter()
  const appStore = useAppStore()

  const props = defineProps({
    album: {
      type: Object,
      required: true,
    },
  })

  function goToDetails () {
    router.push(`/album/${props.album.id}`)
  }
</script>
