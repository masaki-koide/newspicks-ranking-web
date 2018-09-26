import { mount, createLocalVue } from '@vue/test-utils'
import { getters, mutations, actions } from '../store'
import Index from '../pages/index'
import Vuex from 'vuex'
import Vuetify from 'vuetify'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(Vuetify)

describe('Index.vue', () => {
  describe('mutations', () => {
    test('ランキングの対象期間をセット', () => {
      const state = {
        currentRankingKey: null
      }
      mutations.setCurrentRankingKey(state, 'day')
      expect(state.currentRankingKey).toBe('day')
    })

    test('ローディング状態のON', () => {
      const state = {
        isLoading: false
      }
      mutations.setIsLoading(state, true)
      expect(state.isLoading).toBe(true)
    })

    test('ローディング状態のOFF', () => {
      const state = {
        isLoading: true
      }
      mutations.setIsLoading(state, false)
      expect(state.isLoading).toBe(false)
    })

    test('エラー状態のON', () => {
      const state = {
        isError: false
      }
      mutations.setIsError(state, true)
      expect(state.isError).toBe(true)
    })

    test('エラー状態のOFF', () => {
      const state = {
        isError: true
      }
      mutations.setIsError(state, false)
      expect(state.isError).toBe(false)
    })
  })

  describe('stateを必要とするテスト', () => {
    let state

    beforeEach(() => {
      // dayのランキングを取得済みのstate
      state = {
        rankingObj: {
          day: {
            results: [
              {
                url: 'http://example.com',
                title: 'タイトル',
                pick_count: 100
              }
            ]
          }
        }
      }
    })

    describe('getters', () => {
      test('ランキングが取得できる', () => {
        state.currentRankingKey = 'day'
        const result = getters.ranking(state)
        expect(result).toEqual([
          {
            url: 'http://example.com',
            title: 'タイトル',
            pick_count: 100
          }
        ])
      })

      test('ランキングが取得できない', () => {
        state.currentRankingKey = 'week'
        const result = getters.ranking(state)
        expect(result).toBeFalsy()
      })
    })

    describe('actions', () => {
      let axios
      let action
      let testedAction

      beforeAll(() => {
        axios = {
          $get: jest.fn().mockResolvedValue('OK')
        }
        testedAction = (context, payload) => {
          return actions[action].bind({ $axios: axios })(context, payload)
        }
      })

      describe('axios.$getがresolveを返す', () => {
        test('APIを叩いてランキングを取得する', async done => {
          action = 'getRanking'
          const commit = jest.fn()
          await testedAction({
            state: state,
            commit: commit
          })
          expect(commit).toHaveBeenCalledTimes(3)
          expect(commit).toHaveBeenCalledWith('setIsLoading', true)
          expect(commit).toHaveBeenCalledWith('setIsLoading', false)
          expect(commit).toHaveBeenCalledWith('setRanking', {
            results: 'OK',
            range: 'default'
          })
          done()
        })

        test('キャッシュに存在するランキングはAPIを叩かずにキャッシュを返す', () => {
          action = 'getRanking'
          const commit = jest.fn()
          testedAction(
            {
              state: state,
              commit: commit
            },
            'day'
          )
          expect(commit).toHaveBeenCalledTimes(1)
          expect(commit).toHaveBeenCalledWith('setCurrentRankingKey', 'day')
        })
      })

      describe('axios.$getがrejectを返す', () => {
        test('APIを叩いた際にエラーを吐いた場合の処理', async done => {
          action = 'getRanking'
          const commit = jest.fn()
          axios.$get.mockRejectedValueOnce(new Error('NG'))
          await expect(
            testedAction({
              state: state,
              commit: commit
            })
          ).rejects.toEqual(new Error('NG'))
          expect(commit).toHaveBeenCalledTimes(3)
          expect(commit).toHaveBeenCalledWith('setIsLoading', true)
          expect(commit).toHaveBeenCalledWith('setIsLoading', false)
          expect(commit).toHaveBeenCalledWith('setIsError', true)
          done()
        })
      })
    })
  })

  describe('action', () => {
    let getters
    let actions
    let store

    beforeEach(() => {
      getters = {
        ranking: jest.fn().mockReturnValue([])
      }
      actions = {
        getRanking: jest.fn()
      }
      store = new Vuex.Store({
        state: {},
        getters,
        actions
      })
    })

    test('タブをクリックするとgetRankingがそれぞれの引数で呼ばれる', () => {
      const wrapper = mount(Index, { store, localVue })
      const tabs = wrapper.findAll('.v-tabs__item')
      tabs.trigger('click')
      expect(actions.getRanking).toHaveBeenCalledTimes(7)
      const { calls } = actions.getRanking.mock
      const args = ['day', 'day', 'week', 'month', 'half-year', 'year', null]
      args.forEach((arg, index) => {
        expect(calls[index][1]).toBe(arg)
      })
    })

    test('初期表示時にdayを引数にgetRankingが呼ばれる', () => {
      mount(Index, { store, localVue })
      expect(actions.getRanking).toHaveBeenCalledTimes(1)
      const { calls } = actions.getRanking.mock
      expect(calls[0][1]).toBe('day')
    })

    test('エラー状態がOFFのときはアラートが表示されない', () => {
      store.state.isError = false
      const wrapper = mount(Index, { store, localVue })
      const alert = wrapper.find('.v-alert')
      expect(alert.exists()).toBe(false)
    })

    test('エラー状態がONのときはアラートが表示される', () => {
      store.state.isError = true
      const wrapper = mount(Index, { store, localVue })
      const alert = wrapper.find('.v-alert')
      expect(alert.exists()).toBe(true)
    })

    test('ローディング状態がOFFのときはインジケータが表示されない', () => {
      store.state.isLoading = false
      const wrapper = mount(Index, { store, localVue })
      const indicator = wrapper.find('.v-progress-circular')
      expect(indicator.exists()).toBe(false)
    })

    test('ローディング状態がONのときはインジケータが表示される', () => {
      store.state.isLoading = true
      const wrapper = mount(Index, { store, localVue })
      const indicator = wrapper.find('.v-progress-circular')
      expect(indicator.exists()).toBe(true)
    })
  })
})
