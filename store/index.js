import Vuex from 'vuex'

const store = () => new Vuex.Store({
  state: {
    rankingObj: {},
    currentRankingKey: null
  },
  getters: {
    ranking: state => state.rankingObj[state.currentRankingKey] && state.rankingObj[state.currentRankingKey].results
  },
  mutations: {
    setRanking(state, { results, range }) {
      state.rankingObj[range] = results
      state.currentRankingKey = range
    },
    setCurrentRankingKey(state, currentRankingKey) {
      state.currentRankingKey = currentRankingKey
    }
  },
  actions: {
    async getRanking({ state, commit }, range) {
      try {
        const rankingKey = range ? range : 'default'
        if (state.rankingObj[rankingKey]) {
          commit('setCurrentRankingKey', rankingKey)
          return
        }
        const results = await this.$axios.$get(`/ranking?range=${range ? range : ''}`)
        commit('setRanking', { results: results, range: rankingKey})
      } catch (e) {
        return Promise.reject(e)
      }
    }
  }
})

export default store
