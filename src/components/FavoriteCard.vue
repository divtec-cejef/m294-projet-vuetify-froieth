<template>
  <!-- Carte générique pour chanson, album ou artiste -->
  <v-card class="relative-card" @click="goToDetails">
    <!-- Image de l'élément (artiste, album ou chanson) -->
    <v-img
      class="card-img"
      contain
      height="300"
      :src="getImage"
    >
      <!-- Bouton coeur pour ajouter ou retirer des favoris -->
      <v-btn
        class="favorite-btn"
        icon
        @click.stop.prevent="appStore.toggleFavorite(item)"
      >
        <!-- Icône du coeur : plein si favori, contour sinon -->
        <v-icon :color="appStore.isFavorite(item) ? '#8889db' : 'black'">
          {{ appStore.isFavorite(item) ? 'mdi-heart' : 'mdi-heart-outline' }}
        </v-icon>
      </v-btn>
    </v-img>

    <!-- Titre de l'élément -->
    <v-card-title class="text-capitalize">
      {{ getTitle }}
    </v-card-title>

    <!-- Sous-titre : nombre de fans pour un artiste, nom de l'artiste sinon -->
    <v-card-subtitle>
      {{ getSubtitle }}
    </v-card-subtitle>
  </v-card>
</template>

<script setup>
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAppStore } from '@/stores/app'

  const router = useRouter() // Pour navigation
  const appStore = useAppStore() // Accès au store global

  // Props reçues par le composant
  const props = defineProps({
    item: {
      type: Object,
      required: true, // L'élément est obligatoire
    },
  })

  // Détection du type d'élément
  const isArtist = computed(() => {
    return props.item.type === 'artist' || (props.item.picture_medium || props.item.picture_big)
  })

  const isAlbum = computed(() => {
    return props.item.type === 'album' || (props.item.cover_medium && !props.item.duration)
  })

  const isSong = computed(() => {
    return props.item.type === 'track' || !(!props.item.title || !props.item.album)
  })

  // Détermination de l'image à afficher selon le type
  const getImage = computed(() => {
    if (isArtist.value) {
      return props.item.picture_medium || props.item.picture_big || '/images/default.jpg'
    } else if (isAlbum.value) {
      return props.item.cover_medium || props.item.cover_big || '/images/default.jpg'
    } else {
      return props.item.album?.cover_medium || props.item.cover_medium || '/images/default.jpg'
    }
  })

  // Détermination du titre à afficher
  const getTitle = computed(() => {
    return props.item.name || props.item.title
  })

  // Détermination du sous-titre à afficher
  const getSubtitle = computed(() => {
    if (isArtist.value) {
      return props.item.nb_fan ? `${props.item.nb_fan.toLocaleString()} fans` : ''
    } else {
      return props.item.artist?.name || ''
    }
  })

  // Navigation vers la page de détails selon le type
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
