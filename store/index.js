import Vuex from 'vuex'

const store = () =>
  new Vuex.Store({
    state: {
      rankingObj: {},
      currentRankingKey: null,
      isLoading: false
    },
    getters: {
      ranking: state =>
        state.rankingObj[state.currentRankingKey] &&
        state.rankingObj[state.currentRankingKey].results
    },
    mutations: {
      setRanking(state, { results, range }) {
        state.rankingObj = {
          ...state.rankingObj,
          [range]: results
        }
        state.currentRankingKey = range
      },
      setCurrentRankingKey(state, currentRankingKey) {
        state.currentRankingKey = currentRankingKey
      },
      setIsLoading(state, isLoading) {
        state.isLoading = isLoading
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

          commit('setIsLoading', true)
          const results = await this.$axios.$get(
            `/dev/ranking?range=${range ? range : ''}`
          )
          commit('setIsLoading', false)

          commit('setRanking', { results: results, range: rankingKey })
        } catch (e) {
          commit('setIsLoading', false)
          return Promise.reject(e)
        }
      }
    }
  })

export default store
