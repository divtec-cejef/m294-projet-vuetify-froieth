// Utilities
import { defineStore } from 'pinia'
// Importer l'API
import api from '@/plugins/axios'

export const useAppStore = defineStore('app', {
  state: () => ({
    isLoading: false,
    error: null,
    resources: [],
    searchResults: [], // ✅ Nouveau : résultats de recherche
    favorites: [],
  }),

  getters: {
    hasResources: state => state.resources.length > 0,
    totalResources: state => state.resources.length,
    hasSearchResults: state => state.searchResults.length > 0, // ✅ Nouveau
    totalSearchResults: state => state.searchResults.length, // ✅ Nouveau
    totalFavorites: state => state.favorites.length,
  },

  actions: {
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

    // ✅ Nouvelle méthode de recherche
    async searchArtist (query) {
      this.isLoading = true
      this.error = null

      try {
        const response = await api.get(`/search?q=${encodeURIComponent(query)}`)
        console.log('🔍 Résultats de recherche:', response.data)

        if (response.data) {
          this.searchResults = response.data.data || []
          return this.searchResults
        }
        return []
      } catch (error) {
        this.error = error.message || 'Erreur lors de la recherche'
        console.error('Erreur de recherche:', error)
        return []
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Réinitialiser les résultats de recherche
    clearSearch () {
      this.searchResults = []
    },

    async init () {
      const data = await this.fetchRoster()

      console.log('📦 DATA BRUTE:', data)

      if (data) {
        this.resources = data.tracks?.data || data.data || []
        console.log('RESOURCES:', this.resources)
      } else {
        console.error('Aucune donnée récupérée')
      }
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
    },
  },
})
