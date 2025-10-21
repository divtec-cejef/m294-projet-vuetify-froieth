<template>
  <v-container>
    <h1 class="mb-6 text-center">Titre</h1>

    <!-- Barre de recherche -->
    <v-text-field
      v-model="search"
      class="mb-4"
      clearable
      label="Rechercher..."
    />

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
        <span>{{ song.position }}</span>
        <SongCard :artiste="song" />
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
