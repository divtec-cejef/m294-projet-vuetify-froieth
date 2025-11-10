import { defineStore } from 'pinia'
import api from '@/plugins/axios'

export const useAppStore = defineStore('app', {
  state: () => ({
    isLoading: false,
    error: null,
    resources: [],
    artists: [],
    albums: [],
    searchResults: [],
    favorites: [], // favoris
  }),

  getters: {
    hasResources: state => state.resources.length > 0,
    totalResources: state => state.resources.length,
    hasSearchResults: state => state.searchResults.length > 0,
    totalSearchResults: state => state.searchResults.length,
    totalFavorites: state => state.favorites.length,
  },

  actions: {
    // ---------------------------
    // FETCH & INIT
    // ---------------------------
    async fetchRoster () {
      this.isLoading = true
      this.error = null
      try {
        const response = await api.get('/chart/0.json')
        return response.data
      } catch (error) {
        this.error = error.message || 'Une erreur est survenue'
        console.error('Erreur lors du fetch:', error)
        return null
      } finally {
        this.isLoading = false
      }
    },

    async init () {
      // Initialise les données depuis un JSON
      await this.fetchSearchFromJson()

      // les favoris depuis le localStorage
      this.initFavorites()

      const data = await this.fetchRoster()
      console.log('📦 DATA BRUTE:', data)

      if (data) {
        this.resources = data.tracks?.data || data.data || []
        this.artists = data.artists?.data || []
        this.albums = data.albums?.data || []
        console.log('✅ Albums chargés:', this.albums)
      } else {
        console.error('Aucune donnée récupérée')
      }
    },

    // ---------------------------
    // RECHERCHE
    // ---------------------------
    async searchAll (query) {
      this.isLoading = true
      this.error = null
      this.searchResults = []

      try {
        // Recherche parallèle pour tous les types
        const [tracks, artists, albums] = await Promise.all([
          api.get(`/search/track?q=${encodeURIComponent(query)}`),
          api.get(`/search/artist?q=${encodeURIComponent(query)}`),
          api.get(`/search/album?q=${encodeURIComponent(query)}`),
        ])

        // Combiner tous les résultats avec un type pour les identifier
        const allResults = [
          ...(tracks.data?.data || []).map(item => ({ ...item, type: 'track' })),
          ...(artists.data?.data || []).map(item => ({ ...item, type: 'artist' })),
          ...(albums.data?.data || []).map(item => ({ ...item, type: 'album' })),
        ]

        this.searchResults = allResults
        console.log('🔍 Résultats combinés:', this.searchResults)

        return this.searchResults
      } catch (error) {
        this.error = error.message || 'Erreur lors de la recherche'
        console.error('Erreur de recherche:', error)
        return []
      } finally {
        this.isLoading = false
      }
    },

    clearSearch () {
      this.searchResults = []
    },

    // ---------------------------
    // FAVORIS + LOCALSTORAGE
    // ---------------------------
    initFavorites () {
      const stored = localStorage.getItem('favorites')
      if (stored) {
        try {
          this.favorites = JSON.parse(stored)
        } catch (error) {
          console.error('Erreur lors du parsing des favoris depuis localStorage:', error)
          this.favorites = []
        }
      }
    },

    saveFavorites () {
      localStorage.setItem('favorites', JSON.stringify(this.favorites))
    },

    isFavorite (song) {
      return this.favorites.some(fav => fav.id === song.id)
    },

    toggleFavorite (song) {
      const index = this.favorites.findIndex(fav => fav.id === song.id)
      if (index === -1) {
        this.favorites.push(song)
        console.log('Ajouté aux favoris:', song.title || song.name)
      } else {
        this.favorites.splice(index, 1)
        console.log('Retiré des favoris:', song.title || song.name)
      }
      // Sauvegarder automatiquement dans le localStorage
      this.saveFavorites()
    },
  },

  // ---------------------------
  // RECUPERER DONNEE AVEC UN JSON
  // ---------------------------
  async fetchSearchFromJson () {
    try {
      const response = await fetch('src/data/searchEminem.json')
      const data = await response.json()
      let searchArray = []
      if (Array.isArray(data)) {
        // Le JSON est directement un tableau
        searchArray = data
      } else if (data && Array.isArray(data.results)) {
        // Le JSON est un objet avec une propriété 'results' qui est le tableau
        searchArray = data.results
      } else {
        // Cas par défaut : on affecte la valeur telle quelle
        searchArray = data
      }
      this.searchResults = searchArray
      console.log('Résultat recherche chargé depuis fichier JSON :', this.searchResults)
    } catch (error) {
      this.error = error
      console.error('Erreur fetchSearchFromJson :', error)
    }
  },
})
