<template>
  <v-card class="relative-card" @click="goToDetails">
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
  import { useRouter } from 'vue-router'
  import { useAppStore } from '@/stores/app'

  const router = useRouter()
  const appStore = useAppStore()

  const props = defineProps({
    item: {
      type: Object,
      required: true,
    },
  })

  // Détecter si c'est une chanson, un artiste ou un album
  const isArtist = computed(() => {
    return props.item.type === 'artist' || (props.item.picture_medium || props.item.picture_big)
  })

  const isAlbum = computed(() => {
    return props.item.type === 'album' || (props.item.cover_medium && !props.item.duration)
  })

  const isSong = computed(() => {
    return props.item.type === 'track' || !(!props.item.title || !props.item.album)
  })

  const getImage = computed(() => {
    if (isArtist.value) {
      return props.item.picture_medium || props.item.picture_big || '/images/default.jpg'
    } else if (isAlbum.value) {
      return props.item.cover_medium || props.item.cover_big || '/images/default.jpg'
    } else {
      return props.item.album?.cover_medium || props.item.cover_medium || '/images/default.jpg'
    }
  })

  const getTitle = computed(() => {
    return props.item.name || props.item.title
  })

  const getSubtitle = computed(() => {
    if (isArtist.value) {
      return props.item.nb_fan ? `${props.item.nb_fan.toLocaleString()} fans` : ''
    } else {
      return props.item.artist?.name || ''
    }
  })

  // ✅ Navigation selon le type
  function goToDetails () {
    if (isArtist.value) {
      router.push(`/artist/${props.item.id}`)
    } else if (isAlbum.value) {
      router.push(`/album/${props.item.id}`)
    } else if (isSong.value) {
      router.push(`/song/${props.item.id}`)
    }
  }
</script>

<style scoped>
.card-img {
  margin-bottom: -2em;
  margin-top: -2.1em;
}

.relative-card {
  position: relative;
  padding-bottom: 1em;
  cursor: pointer; /* ✅ Curseur pointer */
  transition: transform 0.2s;
}

.relative-card:hover {
  transform: scale(1.02); /* ✅ Effet au survol */
}

.favorite-btn {
  position: absolute;
  top: 2.4em;
  right: 0.3em;
  background-color: rgba(255, 255, 255, 0.2);
  z-index: 1;
}
</style>
