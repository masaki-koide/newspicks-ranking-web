<template>
  <div>
    <header class="py-5">
      <h1 class="headline font-weight-thin">newspicks-ranking-web</h1>
    </header>
    <main>
      <v-tabs
        dark
        show-arrows
        fixed-tabs
        slider-color="white">
        <v-tab @click="getRanking(null)">全体</v-tab>
        <v-tab @click="getRanking('day')">24時間以内</v-tab>
        <v-tab @click="getRanking('week')">1週間以内</v-tab>
        <v-tab @click="getRanking('month')">1ヶ月以内</v-tab>
        <v-tab @click="getRanking('half-year')">半年以内</v-tab>
        <v-tab @click="getRanking('year')">1年以内</v-tab>
      </v-tabs>
      <div v-if="true">
        <v-card v-for="post in ranking" :key="post.url">
          <v-card-title primary-title>
            <a :href="post.url" target="_blank">{{ post.title }}</a>
          </v-card-title>
          <v-card-actions class="pl-3">
            <span class="font-weight-bold">{{ post.pick_count }}</span>Picks
          </v-card-actions>
        </v-card>
      </div>
      <div v-else>
        <v-progress-circular
          :size="100"
          color="primary"
          indeterminate
        />
      </div>
    </main>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import AppLogo from '~/components/AppLogo.vue'

export default {
  async asyncData({ store }) {
    await store.dispatch('getRanking', null)
  },
  computed: {
    ...mapGetters(['ranking'])
  },
  methods: {
    ...mapActions(['getRanking'])
  },
  components: {
    AppLogo
  }
}
</script>

<style>
h1 {
  text-align: center;
}
</style>

