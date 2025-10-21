<template>
  <v-container>
    <h1 class="mb-6 text-center">Meilleurs sons du moment</h1>

    <v-row>
      <v-col
        v-for="song in filteredSong"
        :key="song.id"
        cols="6"
        lg="3"
        md="4"
        sm="6"
        xl="2"
      >
        <div class="song-wrapper">
          <span class="song-index">{{ song.position }}</span>
          <div class="song-card-container">
            <SongCard :artiste="song" />
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue'
  import SongCard from '@/components/SongCard.vue'
  import { useAppStore } from '@/stores/app'

  const appStore = useAppStore()
  const search = ref('')

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
</script>

<style scoped>
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
}

.song-card-container {
  flex-grow: 1;          /* la carte prend tout l’espace restant */
}
</style>
