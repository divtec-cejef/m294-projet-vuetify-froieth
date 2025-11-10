<template>
  <v-container>
    <!-- Titre principal de la page -->
    <h1 class="mb-6 text-center">Recherche</h1>

    <!-- Barre de recherche et filtre -->
    <v-row class="mb-6">
      <v-col cols="12" md="9">
        <v-text-field
          v-model="searchQuery"
          clearable
          label="Rechercher..."
          prepend-inner-icon="mdi-magnify"
          @click:clear="clearSearch"
        />
      </v-col>
      <v-col cols="12" md="3">
        <v-select
          v-model="selectedFilter"
          :items="filterOptions"
          label="Filtrer par"
          prepend-inner-icon="mdi-filter-variant"
        />
      </v-col>
    </v-row>

    <!-- Message si aucun résultat n'est trouvé -->
    <v-alert
      v-if="!appStore.isLoading && searchQuery && filteredResults.length === 0"
      class="mb-4"
      color="#8889db"
      type="info"
    >
      Aucun résultat trouvé pour "{{ searchQuery }}"
    </v-alert>

    <!-- Affichage des résultats avec pagination -->
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
          <!-- Affichage conditionnel selon le type d'élément -->
          <SongCard v-if="isSong(item)" :artiste="item" />
          <ArtistCard v-else-if="isArtist(item)" :artiste="item" />
          <AlbumCard v-else-if="isAlbum(item)" :album="item" />
        </v-col>
      </v-row>

      <!-- Pagination et indicateur des résultats -->
      <div class="text-center mt-6">
        <v-pagination
          v-model="currentPage"
          color="primary"
          :length="totalPages"
          :total-visible="7"
        />
        <p class="text-grey mt-2">
          Résultats {{ startIndex + 1 }} - {{ endIndex }} sur {{ filteredResults.length }}
        </p>
      </div>
    </div>
  </v-container>
</template>

<script setup>
  import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
  import AlbumCard from '@/components/AlbumCard.vue'
  import ArtistCard from '@/components/ArtistCard.vue'
  import SongCard from '@/components/SongCard.vue'
  import { useAppStore } from '@/stores/app'

  const appStore = useAppStore() // Accès au store global

  // Récupération des valeurs sauvegardées ou initialisation par défaut
  const searchQuery = ref(sessionStorage.getItem('search_query') || '')
  const selectedFilter = ref(sessionStorage.getItem('search_filter') || 'all')
  const currentPage = ref(Number.parseInt(sessionStorage.getItem('search_page') || '1'))
  const itemsPerPage = 15 // Nombre d'éléments par page

  // Options de filtre affichées dans le select
  const filterOptions = [
    { title: 'Tout', value: 'all' },
    { title: 'Musiques', value: 'tracks' },
    { title: 'Artistes', value: 'artists' },
    { title: 'Albums', value: 'albums' },
  ]

  // Restaurer la recherche au montage si nécessaire
  onMounted(async () => {
    if (searchQuery.value && appStore.searchResults.length === 0) {
      await appStore.searchAll(searchQuery.value)
    }
  })

  // Sauvegarder l'état avant de quitter la page
  onBeforeUnmount(() => {
    sessionStorage.setItem('search_query', searchQuery.value)
    sessionStorage.setItem('search_filter', selectedFilter.value)
    sessionStorage.setItem('search_page', currentPage.value.toString())
  })

  // Détection du type d'élément
  const isSong = item => item.type === 'track' || !(!item.title || !item.album)
  const isArtist = item => item.type === 'artist' || (item.picture_medium && !item.cover_medium)
  const isAlbum = item => item.type === 'album' || (item.cover_medium && item.title && !item.duration)

  // Debounce pour recherche dynamique (évite trop de requêtes)
  let debounceTimeout = null
  watch(searchQuery, query => {
    clearTimeout(debounceTimeout)

    if (!query.trim()) {
      appStore.clearSearch()
      sessionStorage.removeItem('search_query')
      return
    }

    debounceTimeout = setTimeout(async () => {
      currentPage.value = 1
      await appStore.searchAll(query)
      sessionStorage.setItem('search_query', query)
    }, 500)
  })

  // Sauvegarder le filtre quand il change
  watch(selectedFilter, newFilter => {
    currentPage.value = 1
    sessionStorage.setItem('search_filter', newFilter)
  })

  // Sauvegarder la page quand elle change
  watch(currentPage, newPage => {
    sessionStorage.setItem('search_page', newPage.toString())
  })

  // Réinitialiser la recherche et les filtres
  function clearSearch () {
    searchQuery.value = ''
    currentPage.value = 1
    selectedFilter.value = 'all'
    appStore.clearSearch()
    sessionStorage.removeItem('search_query')
    sessionStorage.removeItem('search_filter')
    sessionStorage.removeItem('search_page')
  }

  // Filtrage des résultats selon le type
  const filteredResults = computed(() => {
    if (selectedFilter.value === 'all') {
      return appStore.searchResults
    }

    return appStore.searchResults.filter(item => {
      if (selectedFilter.value === 'tracks') return isSong(item)
      if (selectedFilter.value === 'artists') return isArtist(item)
      if (selectedFilter.value === 'albums') return isAlbum(item)
      return true
    })
  })

  // Pagination
  const totalPages = computed(() => Math.ceil(filteredResults.value.length / itemsPerPage))
  const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
  const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, filteredResults.value.length))
  const paginatedResults = computed(() => filteredResults.value.slice(startIndex.value, endIndex.value))
</script>
