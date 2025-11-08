<template>
  <v-card class="relative-card" @click="goToDetails">
    <v-img
      class="card-img"
      contain
      height="300"
      :src="artiste.album?.cover_medium || artiste.cover_medium || '/images/default.jpg'"
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
      {{ artiste.title || artiste.name }}
    </v-card-title>
    <v-card-subtitle v-if="artiste.artist">
      {{ artiste.artist.name }}
    </v-card-subtitle>
  </v-card>
</template>

<script setup>
  import { useRouter } from 'vue-router'
  import { useAppStore } from '@/stores/app'

  const router = useRouter()
  const appStore = useAppStore()

  const props = defineProps({
    artiste: {
      type: Object,
      required: true,
    },
  })

  function goToDetails () {
    router.push(`/song/${props.artiste.id}`)
  }
</script>
