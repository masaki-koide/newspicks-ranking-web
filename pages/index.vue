<template>
  <section class="container">
    <div>
      <!-- <app-logo/> -->
      <h1 class="title">
        newspicks-ranking-web
      </h1>
      <ul>
        <li v-for="result in results" :key="result.title">{{ result.title }}</li>
      </ul>
    </div>
  </section>
</template>

<script>
import AppLogo from '~/components/AppLogo.vue'

export default {
  async asyncData({ app }) {
    const { results } = await app.$axios.$get(process.env.API_URL)
    return { results }
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

