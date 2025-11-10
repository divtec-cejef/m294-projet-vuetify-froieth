import { defineStore } from 'pinia'
import api from '@/plugins/axios'

export const useAppStore = defineStore('app', {
  // ===========================
  // STATE : données globales
  // ===========================
  state: () => ({
    isLoading: false, // Indicateur de chargement
    error: null, // Message d'erreur global
    resources: [], // Musiques principales
    artists: [], // Artistes principaux
    albums: [], // Albums principaux
    searchResults: [], // Résultats de recherche
    favorites: [], // Favoris de l'utilisateur
  }),

  // ===========================
  // GETTERS : calculs sur le state
  // ===========================
  getters: {
    hasResources: state => state.resources.length > 0,
    totalResources: state => state.resources.length,
    hasSearchResults: state => state.searchResults.length > 0,
    totalSearchResults: state => state.searchResults.length,
    totalFavorites: state => state.favorites.length,
  },

  // ===========================
  // ACTIONS : méthodes pour modifier le state ou interagir avec API
  // ===========================
  actions: {
    // ---------------------------
    // FETCH & INIT
    // ---------------------------
    async fetchRoster () {
      this.isLoading = true
      this.error = null
      try {
        // Récupération des données principales (charts)
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
      // Charger les favoris depuis localStorage
      this.initFavorites()

      // Récupérer les données principales
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
        // Recherche parallèle pour tous les types : musiques, artistes, albums
        const [tracks, artists, albums] = await Promise.all([
          api.get(`/search/track?q=${encodeURIComponent(query)}`),
          api.get(`/search/artist?q=${encodeURIComponent(query)}`),
          api.get(`/search/album?q=${encodeURIComponent(query)}`),
        ])

        // Ajouter un type à chaque résultat pour l'identifier
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

    // Réinitialiser les résultats de recherche
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
          console.error('Erreur parsing favoris depuis localStorage:', error)
          this.favorites = []
        }
      }
    },

    saveFavorites () {
      localStorage.setItem('favorites', JSON.stringify(this.favorites))
    },

    // Vérifier si un élément est favori
    isFavorite (song) {
      return this.favorites.some(fav => fav.id === song.id)
    },

    // Ajouter ou retirer des favoris
    toggleFavorite (song) {
      const index = this.favorites.findIndex(fav => fav.id === song.id)
      if (index === -1) {
        this.favorites.push(song)
        console.log('Ajouté aux favoris:', song.title || song.name)
      } else {
        this.favorites.splice(index, 1)
        console.log('Retiré des favoris:', song.title || song.name)
      }
      // Sauvegarder automatiquement dans localStorage
      this.saveFavorites()
    },

    // ---------------------------
    // CHARGER DES DONNÉES DEPUIS UN FICHIER JSON LOCAL
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
          // Le JSON est un objet avec propriété 'results'
          searchArray = data.results
        } else {
          // Cas par défaut
          searchArray = data
        }

        this.searchResults = searchArray
        console.log('Résultat recherche chargé depuis fichier JSON :', this.searchResults)
      } catch (error) {
        this.error = error
        console.error('Erreur fetchSearchFromJson :', error)
      }
    },
  },
})
