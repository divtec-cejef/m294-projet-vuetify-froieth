<template>
  <v-container>
    <!-- Section Musiques -->
    <h1 class="mb-6 text-center">Meilleurs musiques du moment</h1>

    <div class="slider-container">
      <v-btn
        class="slider-arrow left"
        icon
        size="large"
        @click="prevSongSlide"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>

      <div class="slider-content">
        <v-row>
          <v-col
            v-for="song in visibleSongs"
            :key="song.id"
            cols="12"
            md="4"
            sm="6"
          >
            <div class="song-wrapper">
              <span class="song-index">{{ song.position }}</span>
              <div class="song-card-container">
                <SongCard :artiste="song" />
              </div>
            </div>
          </v-col>
        </v-row>
      </div>

      <v-btn
        class="slider-arrow right"
        icon
        size="large"
        @click="nextSongSlide"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </div>

    <div class="text-center mt-4 mb-12">
      <span class="text-grey">
        {{ currentSongIndex + 1 }} - {{ Math.min(currentSongIndex + 3, filteredSong.length) }}
        sur {{ filteredSong.length }}
      </span>
    </div>

    <!-- Séparateur -->
    <v-divider />

    <!-- Section Artistes -->
    <h1 class="mb-6 text-center mt-12">Meilleurs artistes du moment</h1>

    <div class="slider-container">
      <v-btn
        class="slider-arrow left"
        icon
        size="large"
        @click="prevArtistSlide"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>

      <div class="slider-content">
        <v-row>
          <v-col
            v-for="artist in visibleArtists"
            :key="artist.id"
            cols="12"
            md="4"
            sm="6"
          >
            <div class="song-wrapper">
              <span class="song-index">{{ artist.position }}</span>
              <div class="song-card-container">
                <ArtistCard :artiste="artist" />
              </div>
            </div>
          </v-col>
        </v-row>
      </div>

      <v-btn
        class="slider-arrow right"
        icon
        size="large"
        @click="nextArtistSlide"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </div>

    <div class="text-center mt-4 mb-12">
      <span class="text-grey">
        {{ currentArtistIndex + 1 }} - {{ Math.min(currentArtistIndex + 3, filteredArtists.length) }}
        sur {{ filteredArtists.length }}
      </span>
    </div>

    <!-- Séparateur -->
    <v-divider />

    <!-- Section Albums -->
    <h1 class="mb-6 text-center mt-12">Meilleurs albums du moment</h1>

    <div class="slider-container">
      <v-btn
        class="slider-arrow left"
        icon
        size="large"
        @click="prevAlbumSlide"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>

      <div class="slider-content">
        <v-row>
          <v-col
            v-for="album in visibleAlbums"
            :key="album.id"
            cols="12"
            md="4"
            sm="6"
          >
            <div class="song-wrapper">
              <span class="song-index">{{ album.position }}</span>
              <div class="song-card-container">
                <AlbumCard :album="album" />
              </div>
            </div>
          </v-col>
        </v-row>
      </div>

      <v-btn
        class="slider-arrow right"
        icon
        size="large"
        @click="nextAlbumSlide"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </div>

    <div class="text-center mt-4">
      <span class="text-grey">
        {{ currentAlbumIndex + 1 }} - {{ Math.min(currentAlbumIndex + 3, filteredAlbums.length) }}
        sur {{ filteredAlbums.length }}
      </span>
    </div>
  </v-container>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue'
  import AlbumCard from '@/components/AlbumCard.vue'
  import ArtistCard from '@/components/ArtistCard.vue'
  import SongCard from '@/components/SongCard.vue'
  import { useAppStore } from '@/stores/app'

  const appStore = useAppStore()
  const search = ref('')
  const currentSongIndex = ref(0)
  const currentArtistIndex = ref(0)
  const currentAlbumIndex = ref(0)

  onMounted(() => {
    appStore.init()
  })

  // ===== MUSIQUES =====
  const sortedArtiste = computed(() => {
    return [...appStore.resources].sort((a, b) =>
      a.position - b.position,
    )
  })

  const filteredSong = computed(() => {
    const query = search.value.toLowerCase().trim()
    return sortedArtiste.value.filter(song =>
      song.title.toLowerCase().includes(query),
    )
  })

  const visibleSongs = computed(() => {
    return filteredSong.value.slice(currentSongIndex.value, currentSongIndex.value + 3)
  })

  function nextSongSlide () {
    if (currentSongIndex.value >= filteredSong.value.length - 3) {
      currentSongIndex.value = 0
    } else {
      currentSongIndex.value++
    }
  }

  function prevSongSlide () {
    if (currentSongIndex.value === 0) {
      currentSongIndex.value = filteredSong.value.length - 3
    } else {
      currentSongIndex.value--
    }
  }

  // ===== ARTISTES =====
  const sortedArtists = computed(() => {
    return [...(appStore.artists || [])].sort((a, b) =>
      a.position - b.position,
    )
  })

  const filteredArtists = computed(() => {
    const query = search.value.toLowerCase().trim()
    return sortedArtists.value.filter(artist =>
      artist.name.toLowerCase().includes(query),
    )
  })

  const visibleArtists = computed(() => {
    return filteredArtists.value.slice(currentArtistIndex.value, currentArtistIndex.value + 3)
  })

  function nextArtistSlide () {
    if (currentArtistIndex.value >= filteredArtists.value.length - 3) {
      currentArtistIndex.value = 0
    } else {
      currentArtistIndex.value++
    }
  }

  function prevArtistSlide () {
    if (currentArtistIndex.value === 0) {
      currentArtistIndex.value = filteredArtists.value.length - 3
    } else {
      currentArtistIndex.value--
    }
  }

  // ===== ALBUMS =====
  const sortedAlbums = computed(() => {
    return [...(appStore.albums || [])].sort((a, b) =>
      a.position - b.position,
    )
  })

  const filteredAlbums = computed(() => {
    const query = search.value.toLowerCase().trim()
    return sortedAlbums.value.filter(album =>
      album.title.toLowerCase().includes(query),
    )
  })

  const visibleAlbums = computed(() => {
    return filteredAlbums.value.slice(currentAlbumIndex.value, currentAlbumIndex.value + 3)
  })

  function nextAlbumSlide () {
    if (currentAlbumIndex.value >= filteredAlbums.value.length - 3) {
      currentAlbumIndex.value = 0
    } else {
      currentAlbumIndex.value++
    }
  }

  function prevAlbumSlide () {
    if (currentAlbumIndex.value === 0) {
      currentAlbumIndex.value = filteredAlbums.value.length - 3
    } else {
      currentAlbumIndex.value--
    }
  }
</script>

<style scoped>
.slider-container {
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
}

.slider-content {
  flex: 1;
  overflow: hidden;
}

.slider-arrow {
  flex-shrink: 0;
}

.slider-arrow.left {
  margin-right: 8px;
}

.slider-arrow.right {
  margin-left: 8px;
}

.song-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.song-index {
  background: linear-gradient(45deg, #1ebbe7, #ca6bd4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
  font-size: 5rem;
  text-align: right;
  min-width: 80px;
}

.song-card-container {
  flex-grow: 1;
}
</style>
