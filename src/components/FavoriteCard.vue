<template>
  <v-card class="relative-card">
    <v-img
      class="card-img"
      contain
      height="300"
      :src="getImage"
    >
      <v-btn
        class="favorite-btn"
        icon
        @click.stop.prevent="appStore.toggleFavorite(item)"
      >
        <v-icon :color="appStore.isFavorite(item) ? '#8889db' : 'black'">
          {{ appStore.isFavorite(item) ? 'mdi-heart' : 'mdi-heart-outline' }}
        </v-icon>
      </v-btn>
    </v-img>

    <v-card-title class="text-capitalize">
      {{ getTitle }}
    </v-card-title>
    <v-card-subtitle>
      {{ getSubtitle }}
    </v-card-subtitle>
  </v-card>
</template>

<script setup>
  import { computed } from 'vue'
  import { useAppStore } from '@/stores/app'

  const appStore = useAppStore()

  const props = defineProps({
    item: {
      type: Object,
      required: true,
    },
  })

  // Détecter si c'est une chanson ou un artiste
  const isArtist = computed(() => {
    return props.item.picture_medium || props.item.picture_big
  })

  const getImage = computed(() => {
    if (isArtist.value) {
      // C'est un artiste
      return props.item.picture_medium || props.item.picture_big || '/images/default.jpg'
    }
    // C'est une chanson
    return props.item.album?.cover_medium || props.item.cover_medium || '/images/default.jpg'
  })

  const getTitle = computed(() => {
    return props.item.name || props.item.title
  })

  const getSubtitle = computed(() => {
    if (!isArtist.value) {
      return props.item.artist?.name || ''
    }
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

.favorite-btn {
  position: absolute;
  top: 2.4em;
  right: 0.3em;
  background-color: rgba(255, 255, 255, 0.2);
}
</style>
