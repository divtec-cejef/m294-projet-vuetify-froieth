import { defineStore } from 'pinia'
import api from '@/plugins/axios'

export const useAppStore = defineStore('app', {
  // ===========================
  // STATE : données globales
  // ===========================
  state: () => ({
    isLoading: false,
    error: null,
    resources: [],
    artists: [],
    albums: [],
    searchResults: [],
    favorites: [],
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
        const response = await api.get('/chart/0.json')
        return response.data
      } catch (error) {
        this.error = error.message || 'Une erreur est survenue'
        console.error('Erreur API, tentative de chargement des données locales...', error)

        // Fallback vers données locales
        return await this.loadLocalData()
      } finally {
        this.isLoading = false
      }
    },

    // Charger les données depuis un fichier JSON local
    async loadLocalData () {
      try {
        const response = await fetch('/data/chart.json') // Mets ton fichier dans public/data/
        if (!response.ok) {
          throw new Error('Fichier local introuvable')
        }
        const data = await response.json()
        console.log('Données locales chargées avec succès')
        return data
      } catch (error) {
        console.error('Impossible de charger les données locales:', error)
        return null
      }
    },

    async init () {
      // Charger les favoris depuis localStorage
      this.initFavorites()

      // Récupérer les données principales (API ou local)
      const data = await this.fetchRoster()
      console.log('📦 DATA BRUTE:', data)

      if (data) {
        this.resources = data.tracks?.data || data.data || []
        this.artists = data.artists?.data || []
        this.albums = data.albums?.data || []
        console.log('Données chargées:', {
          musiques: this.resources.length,
          artistes: this.artists.length,
          albums: this.albums.length,
        })
      } else {
        console.error('Aucune donnée récupérée (ni API ni local)')
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
        console.error('Erreur de recherche API, tentative avec données locales...')

        // Fallback vers recherche locale
        return await this.searchLocal(query)
      } finally {
        this.isLoading = false
      }
    },

    // Recherche dans un fichier JSON local
    async searchLocal (query) {
      try {
        const response = await fetch(`/data/search-${query.toLowerCase()}.json`)
        if (!response.ok) {
          throw new Error('Pas de données locales pour cette recherche')
        }

        const data = await response.json()

        // Adapter selon la structure Deezer
        const allResults = (data.data || []).map(item => {
          // Détecter le type selon les propriétés
          if (item.album && item.duration) {
            return { ...item, type: 'track' }
          } else if (item.picture_medium) {
            return { ...item, type: 'artist' }
          } else if (item.cover_medium) {
            return { ...item, type: 'album' }
          }
          return { ...item, type: 'track' } // Par défaut
        })

        this.searchResults = allResults
        console.log('Résultats de recherche locaux chargés:', this.searchResults.length, 'résultats')
        return this.searchResults
      } catch (error) {
        console.error('Impossible de charger les résultats de recherche locaux:', error)
        return []
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
          console.error('Erreur parsing favoris depuis localStorage:', error)
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
      this.saveFavorites()
    },
  },
})
