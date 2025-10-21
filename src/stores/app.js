// Utilities
import { defineStore } from 'pinia'
// Importer l'API
import api from '@/plugins/axios'

export const useAppStore = defineStore('app', {
  state: () => ({
    isLoading: false,
    error: null,
    resources: [],
    favorites: [], // ✅ Nouveau : stocker les favoris
  }),

  getters: {
    hasResources: state => state.resources.length > 0,
    totalResources: state => state.resources.length,
    totalFavorites: state => state.favorites.length, // ✅ Nombre de favoris
  },

  actions: {
    async fetchRoster () {
      this.isLoading = true
      this.error = null

      try {
        // const response = await api.get('/album/302127.json')
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
      const data = await this.fetchRoster()

      console.log('📦 DATA BRUTE:', data)

      if (data) {
        this.resources = data.tracks?.data || data.data || []
        console.log('🎵 RESOURCES:', this.resources)
      } else {
        console.error('Aucune donnée récupérée')
      }
    },

    // ✅ Vérifier si une chanson est en favoris
    isFavorite (song) {
      return this.favorites.some(fav => fav.id === song.id)
    },

    // ✅ Ajouter/retirer des favoris
    toggleFavorite (song) {
      const index = this.favorites.findIndex(fav => fav.id === song.id)

      if (index === -1) {
        // Ajouter aux favoris
        this.favorites.push(song)
        console.log('❤️ Ajouté aux favoris:', song.title || song.name)
      } else {
        // Retirer des favoris
        this.favorites.splice(index, 1)
        console.log('💔 Retiré des favoris:', song.title || song.name)
      }
    },
  },
})
