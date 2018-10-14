import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  strict: debug,
  state: {
    snackmsg: null,
    intervalTime: 30,
    publicKey: null,
    privateKey: null,
    lang: 'en',
    nativeBalance: 0,
    nativeMax: 0,
    balances: [],
    ratios: ['usd_to_euro', 'usd_to_gbp', 'gbp_to_euro', 'xlm_to_usd', 'xlm_to_gbp', 'xlm_to_euro'],
    issuers: [],
    orderBook: [],
    assetVals: [],
    assetPrices: [],
    maxes: [],
    isloading: false,
    exchangePairs: [],
    robotStatus: false,
    offers: [],
    offerLocks: [],
  },
  mutations: {
    intervalTime(state, intervalTime) {
      state.intervalTime = intervalTime;
    },
    updatePublicKey(state, publicKey) {
      // window.Sconsole(['update publicKey']);
      state.publicKey = publicKey;
    },
    updatePrivateKey(state, privateKey) {
      // window.Sconsole(['update privateKey']);
      state.privateKey = privateKey;
    },
    updateSnackmsg(state, msg) {
      // window.Sconsole(['update snackmsg']);
      state.snackmsg = msg;
    },
    updateLang(state, lang) {
      // window.Sconsole(['update lang']);
      state.lang = lang;
    },
    updateNativeBalance(state, nativeBalance) {
      // window.Sconsole(['update native balances']);
      state.nativeBalance = nativeBalance;
    },
    updateNativeMax(state, nativeMax) {
      // window.Sconsole(['update native max']);
      state.nativeMax = nativeMax;
    },
    updateBalances(state, balances) {
      // window.Sconsole(['update balances']);
      // update balances
      state.balances = balances;
      // init maxes
      balances.forEach((detail) => {
        const key = `${detail.asset_code}_${detail.asset_issuer}`;
        // find if current balance exists
        const tmp = state.maxes.filter(val => val.skey === key);
        if (tmp.length === 0) {
          // if not exist, add it.
          state.maxes.push({ skey: key, max: 0 });
        }
      });
    },
    updateAllIssuers(state, issuers) {
      // window.Sconsole(['update issuers']);
      state.issuers = issuers;
    },
    updateOrderBook(state, data) {
      // window.Sconsole(['update orderBook']);
      const skey = data.skey;
      let existIndex = null;
      const tmp = state.orderBook.filter((val, index) => {
        window.Sconsole(['test updateOrderBook', val, index]);
        if (val.skey === skey) {
          existIndex = index;
          return true;
        }
        return false;
      });
      if (tmp.length > 0) {
        state.orderBook[existIndex] = data;
      } else {
        state.orderBook.push(data);
      }
    },
    updateAssetVals(state, data) {
      // window.Sconsole(['update assetVals']);
      const skey = data.skey;
      let existIndex = null;
      const tmp = state.assetVals.filter((val, index) => {
        if (val.skey === skey) {
          existIndex = index;
          return true;
        }
        return false;
      });
      if (tmp.length > 0) {
        state.assetVals[existIndex] = data;
      } else {
        state.assetVals.push(data);
      }
    },
    updateAssetPrices(state, data) {
      // window.Sconsole(['update assetPrices']);
      const skey = data.skey;
      let existIndex = null;
      const tmp = state.assetPrices.filter((val, index) => {
        if (val.skey === skey) {
          existIndex = index;
          return true;
        }
        return false;
      });
      if (tmp.length > 0) {
        state.assetPrices[existIndex] = data;
      } else {
        state.assetPrices.push(data);
      }
    },
    updateMaxes(state, data) {
      alert('updateMaxes');
      // window.Sconsole(['update maxes']);
      let existIndex = null;
      const tmp = state.maxes.filter((val, index) => {
        if (val.skey === data.skey) {
          existIndex = index;
          return true;
        }
        return false;
      });
      if (tmp.length === 0) {
        state.maxes.push(data);
      } else {
        state.maxes[existIndex] = data;
      }
    },
    // removeTrustline(state, code, issuer) {
    //   // state.balances.forEach({})
    // },
    updateIsloading(state, status) {
      state.isloading = status;
    },
    updateExchangePairs(state, pair) {
      alert('here');
      alert(JSON.stringify(pair));
      const tmp = state.exchangePairs.filter((val) => {
        if (val.skey === pair.skey || val.skey === pair.skey2) {
          return true;
        }
        return false;
      });
      if (tmp.length === 0) {
        state.exchangePairs.push(pair);
      }
    },
    updateExchangePairRateAmount(state, data) {
      state.exchangePairs.filter((val, index) => {
        if (val.skey === data.skey) {
          state.exchangePairs[index].baseRate = data.baseRate;
          state.exchangePairs[index].baseValue = data.baseValue;
          state.exchangePairs[index].counterRate = data.counterRate;
          state.exchangePairs[index].counterValue = data.counterValue;
          // state.exchangePairs[index].ratiooption = data.ratiooption;
          return true;
        }
        return false;
      });
    },
    updateExchangePairOrder(state, data) {
      state.exchangePairs.filter((val, index) => {
        if (val.skey === data.skey) {
          // buy order
          if (data.flag === 0) {
            state.exchangePairs[index].buy_time = data.buy_time;
            state.exchangePairs[index].buy_ratio = data.buy_ratio;
          } else { // sell order
            state.exchangePairs[index].sell_time = data.sell_time;
            state.exchangePairs[index].sell_ratio = data.sell_ratio;
          }
          return true;
        }
        return false;
      });
    },
    removeExchangePair(state, skey) {
      const tmp = state.exchangePairs.filter((val) => {
        if (val.skey !== skey) {
          return true;
        }
        return false;
      });
      state.exchangePairs = tmp;
    },
    updateRobotStatus(state, status) {
      state.robotStatus = status;
    },
    updateOffers(state, offers) {
      state.offers = offers;
    },
    updateOrderLock(state, lockInfo) {
      alert('updateOrderLock');
      let existIndex = null;
      const tmp = state.offerLocks.filter((detail, index) => {
        if (detail.skey === lockInfo.skey) {
          existIndex = index;
          return true;
        }
        return false;
      });
      if (tmp.length > 0) {
        state.offerLocks[existIndex] = lockInfo;
      } else {
        state.offerLocks.push(lockInfo);
      }
    },
  },
  getters: {
    intervalTime(state) {
      return state.intervalTime;
    },
    publicKey(state) {
      return state.publicKey;
    },
    privateKey(state) {
      return state.privateKey;
    },
    lang(state) {
      return state.lang;
    },
    nativeBalance(state) {
      return state.nativeBalance;
    },
    nativeMax(state) {
      return state.nativeMax;
    },
    balances(state) {
      return state.balances;
    },
    ratios(state) {
      return state.ratios;
    },
    issuers(state) {
      return state.issuers;
    },
    orderBook(state) {
      return state.orderBook;
    },
    assetVals(state) {
      return state.assetVals;
    },
    assetPrices(state) {
      return state.assetPrices;
    },
    maxes(state) {
      return state.maxes;
    },
    isloading(state) {
      return state.isloading;
    },
    exchangePairs(state) {
      return state.exchangePairs;
    },
    exchangePairsSelector(state) {
      const res = [];
      state.exchangePairs.forEach((pair) => {
        res.push({
          skey: `${pair.baseAsset}|${pair.baseIssuer}_${pair.counterAsset}|${pair.counterIssuer}`,
          text: `[${pair.baseAsset}] ${pair.baseIssuer} / [${pair.counterAsset}] ${pair.counterIssuer}`,
        });
      });
      return res;
    },
    robotStatus(state) {
      return state.robotStatus;
    },
    offers(state) {
      return state.offers;
    },
    offerLocks(state) {
      return state.offerLocks;
    },
  },
  plugins: [
    createPersistedState({
      storage: {
        getItem: key => localStorage.getItem(key),
        setItem: (key, value) => localStorage.setItem(key, value),
        removeItem: key => localStorage.removeItem(key),
      },
    }),
  ],
});
