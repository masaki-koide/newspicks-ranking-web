<template>
  <div>
    <header class="py-5">
      <h1 class="headline font-weight-thin">NewsPicks人気記事ランキング</h1>
    </header>
    <main>
      <v-tabs
        dark
        show-arrows
        fixed-tabs
        slider-color="white">
        <v-tab @click="getRanking('day')">日間</v-tab>
        <v-tab @click="getRanking('week')">週間</v-tab>
        <v-tab @click="getRanking('month')">月間</v-tab>
        <v-tab @click="getRanking('half-year')">半年間</v-tab>
        <v-tab @click="getRanking('year')">年間</v-tab>
        <v-tab @click="getRanking(null)">全期間</v-tab>
      </v-tabs>
      <div v-if="!isLoading">
        <div v-if="isError || !ranking">
          <v-alert
            :value="true"
            color="red"
            outline>
            エラーが発生しました。しばらく待ってから画面を再読込してください。
          </v-alert>
        </div>
        <v-layout wrap>
          <v-flex
            v-for="post in ranking"
            :key="post.url"
            xs12
            sm6>
            <v-card
              tile
              hover>
              <v-card-title primary-title>
                <a
                  :href="post.url"
                  target="_blank">
                  {{ post.title }}
                </a>
              </v-card-title>
              <v-card-actions class="pl-3">
                <span class="font-weight-bold">{{ post.pick_count }}</span>Picks
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </div>
      <div
        v-else
        class="pt-5">
        <v-layout justify-center>
          <v-progress-circular
            :size="100"
            color="primary"
            indeterminate
          />
        </v-layout>
      </div>
    </main>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState(['isLoading', 'isError']),
    ...mapGetters(['ranking'])
  },
  async created() {
    await this.getRanking('day')
  },
  methods: {
    ...mapActions(['getRanking'])
  }
}
</script>

<style>
h1 {
  text-align: center;
}

a {
  text-decoration: none;
}
</style>
