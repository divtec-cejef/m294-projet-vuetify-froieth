<template>
  <v-container>
    <h1 class="mb-6 text-center">Recherche</h1>

    <!-- Barre de recherche -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-text-field
          v-model="searchQuery"
          clearable
          label="Rechercher..."
          prepend-inner-icon="mdi-magnify"
          @click:clear="clearSearch"
        />
      </v-col>
    </v-row>

    <!-- Message si aucun résultat -->
    <v-alert
      v-if="!appStore.isLoading && searchQuery && paginatedResults.length === 0"
      class="mb-4"
      color="#8889db"
      type="info"
    >
      Aucun résultat trouvé pour "{{ searchQuery }}"
    </v-alert>

    <!-- Résultats avec pagination -->
    <div v-if="paginatedResults.length > 0">
      <v-row>
        <v-col
          v-for="item in paginatedResults"
          :key="item.id"
          class="col-lg-custom"
          cols="6"
          md="4"
          sm="6"
        >
          <SongCard :artiste="item" />
        </v-col>
      </v-row>

      <div class="text-center mt-6">
        <v-pagination
          v-model="currentPage"
          color="primary"
          :length="totalPages"
          :total-visible="7"
        />
        <p class="text-grey mt-2">
          Résultats {{ startIndex + 1 }} - {{ endIndex }} sur {{ appStore.searchResults.length }}
        </p>
      </div>
    </div>
  </v-container>
</template>

<script setup>
  import { computed, ref, watch } from 'vue'
  import SongCard from '@/components/SongCard.vue'
  import { useAppStore } from '@/stores/app'

  const appStore = useAppStore()
  const searchQuery = ref('')
  const currentPage = ref(1)
  const itemsPerPage = 15

  // Debounce pour recherche dynamique
  let debounceTimeout = null
  watch(searchQuery, query => {
    clearTimeout(debounceTimeout)

    if (!query.trim()) {
      appStore.clearSearch()
      return
    }

    debounceTimeout = setTimeout(async () => {
      currentPage.value = 1
      await appStore.searchArtist(query) // ✅ méthode existante
    }, 500)
  })

  // Réinitialiser la recherche
  function clearSearch () {
    searchQuery.value = ''
    currentPage.value = 1
    appStore.clearSearch()
  }

  // Pagination
  const totalPages = computed(() => Math.ceil(appStore.searchResults.length / itemsPerPage))
  const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
  const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, appStore.searchResults.length))
  const paginatedResults = computed(() => appStore.searchResults.slice(startIndex.value, endIndex.value))
</script>

<style scoped>
@media (min-width: 1280px) {
  .col-lg-custom {
    flex: 0 0 20%;
    max-width: 20%;
  }
}
</style>
