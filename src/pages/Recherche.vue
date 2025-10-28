<template>
  <v-container>
    <h1 class="mb-6 text-center">Recherche</h1>

    <!-- Barre de recherche -->
    <v-text-field
      v-model="searchQuery"
      class="mb-6"
      clearable
      label="Rechercher un artiste ou une chanson..."
      prepend-inner-icon="mdi-magnify"
      @click:clear="clearSearch"
      @keyup.enter="handleSearch"
    />

    <v-btn
      class="mb-6"
      color="primary"
      :loading="appStore.isLoading"
      size="large"
      @click="handleSearch"
    >
      Rechercher
    </v-btn>

    <!-- Message si aucun résultat -->
    <v-alert
      v-if="!appStore.isLoading && searchQuery && !appStore.hasSearchResults"
      class="mb-4"
      type="info"
    >
      Aucun résultat trouvé pour "{{ searchQuery }}"
    </v-alert>

    <!-- Résultats avec pagination -->
    <div v-if="appStore.hasSearchResults">
      <v-row>
        <v-col
          v-for="song in paginatedResults"
          :key="song.id"
          class="col-lg-custom"
          cols="6"
          md="4"
          sm="6"
        >
          <SongCard :artiste="song" />
        </v-col>
      </v-row>

      <!-- Pagination -->
      <div class="text-center mt-6">
        <v-pagination
          v-model="currentPage"
          color="primary"
          :length="totalPages"
          :total-visible="7"
        />
        <p class="text-grey mt-2">
          Résultats {{ startIndex + 1 }} - {{ endIndex }} sur {{ appStore.totalSearchResults }}
        </p>
      </div>
    </div>
  </v-container>
</template>

<script setup>
  import { computed, ref } from 'vue'
  import SongCard from '@/components/SongCard.vue'
  import { useAppStore } from '@/stores/app'

  const appStore = useAppStore()
  const searchQuery = ref('')
  const currentPage = ref(1)
  const itemsPerPage = 15 // ✅ Nombre de résultats par page

  async function handleSearch () {
    if (searchQuery.value.trim()) {
      currentPage.value = 1 // ✅ Retour à la page 1 à chaque recherche
      await appStore.searchArtist(searchQuery.value)
    }
  }

  function clearSearch () {
    appStore.clearSearch()
    searchQuery.value = ''
    currentPage.value = 1
  }

  // ✅ Calcul de la pagination
  const totalPages = computed(() => {
    return Math.ceil(appStore.searchResults.length / itemsPerPage)
  })

  const startIndex = computed(() => {
    return (currentPage.value - 1) * itemsPerPage
  })

  const endIndex = computed(() => {
    return Math.min(startIndex.value + itemsPerPage, appStore.searchResults.length)
  })

  const paginatedResults = computed(() => {
    return appStore.searchResults.slice(startIndex.value, endIndex.value)
  })
</script>

<style scoped>
@media (min-width: 1280px) {
  .col-lg-custom {
    flex: 0 0 20%;
    max-width: 20%;
  }
}
</style>
