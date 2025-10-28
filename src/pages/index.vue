<template>
  <v-container>
    <h1 class="mb-6 text-center">Meilleurs musiques du moment</h1>

    <div class="slider-container">
      <!-- Flèche gauche -->
      <v-btn
        class="slider-arrow left"
        icon
        size="large"
        @click="prevSlide"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>

      <!-- Conteneur des cartes -->
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

      <!-- Flèche droite -->
      <v-btn
        class="slider-arrow right"
        icon
        size="large"
        @click="nextSlide"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </div>

    <!-- Indicateurs -->
    <div class="text-center mt-4">
      <span class="text-grey">
        {{ currentIndex + 1 }} - {{ Math.min(currentIndex + 3, filteredSong.length) }}
        sur {{ filteredSong.length }}
      </span>
    </div>
  </v-container>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue'
  import SongCard from '@/components/SongCard.vue'
  import { useAppStore } from '@/stores/app'

  const appStore = useAppStore()
  const search = ref('')
  const currentIndex = ref(0)

  onMounted(() => {
    appStore.init()
  })

  const sortedArtiste = computed(() => {
    return [...appStore.resources].toSorted((a, b) =>
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
    return filteredSong.value.slice(currentIndex.value, currentIndex.value + 3)
  })

  // Navigation infinie
  function nextSlide () {
    if (currentIndex.value >= filteredSong.value.length - 3) {
      currentIndex.value = 0 // Retourne au début
    } else {
      currentIndex.value++
    }
  }

  function prevSlide () {
    if (currentIndex.value === 0) {
      currentIndex.value = filteredSong.value.length - 3 // Va à la fin
    } else {
      currentIndex.value--
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
