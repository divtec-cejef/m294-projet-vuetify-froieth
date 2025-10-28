<template>
  <v-container>
    <h1 class="mb-6 text-center">Favoris</h1>

    <v-row v-if="favoris.length > 0">
      <v-col
        v-for="song in favoris"
        :key="song.id"
        class="col-lg-custom"
        cols="6"
        md="4"
        sm="6"
      >
        <SongCard :artiste="song" />
      </v-col>
    </v-row>

    <v-alert
      v-else
      class="text-center"
      type="info"
    >
      Vous n'avez pas encore de chansons favorites.<br>
      <v-btn class="mt-2" color="primary" to="/">Retourner à la liste</v-btn>
    </v-alert>
  </v-container>
</template>

<script setup>
  import { computed } from 'vue'
  import SongCard from '@/components/SongCard.vue'
  import { useAppStore } from '@/stores/app'

  const appStore = useAppStore()
  const favoris = computed(() => appStore.favorites)
</script>

<style scoped>
@media (min-width: 1280px) {
  .col-lg-custom {
    flex: 0 0 20%;
    max-width: 20%;
  }
}
</style>
