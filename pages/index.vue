<template>
  <section class="container">
    <div>
      <!-- <app-logo/> -->
      <h1 class="title">
        newspicks-ranking-web
      </h1>
      <div>
        <button @click="getRanking(null)">全体</button>
        <button @click="getRanking('day')">24時間以内</button>
        <button @click="getRanking('week')">1週間以内</button>
        <button @click="getRanking('month')">1ヶ月以内</button>
        <button @click="getRanking('half-year')">半年以内</button>
        <button @click="getRanking('year')">1年以内</button>
      </div>
      <ul>
        <li v-for="post in ranking" :key="post.url">
          <a :href="post.url" target="_blank">{{ post.title }}</a> {{ post.pick_count }}pick
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import AppLogo from '~/components/AppLogo.vue'

export default {
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
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* 1 */
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}
</style>

