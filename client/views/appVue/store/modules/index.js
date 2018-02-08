/**
 * Created by xhy on 17/8/4.
 */
import axios from 'axios';

const GET_BANNER_LIST = 'getBanner'; //获取banner数据
const GET_NOTICE_LIST = 'getNotice'; //获取notice数据

// initial state
const state = {
    bannerList: [],
    noticeList: [],
    projectInfo: null
};

// getters
const getters = {

};

// actions
const actions = {
    getBanner({
        commit
    }) {
        axios.get('/AppApi/v1.0.0/getBannerList').then(res => {
            commit(GET_BANNER_LIST, res.data.result);
        });
    },
    getNotice({
        commit
    }) {
        axios.get('/AppApi/v1.0.0/getArticleList').then(res => {
            commit(GET_NOTICE_LIST, res.data.result.list);
        });
    }
};

// mutations
const mutations = {
    [GET_BANNER_LIST](state, data) {
        state.bannerList = data;
    },
    [GET_NOTICE_LIST](state, data) {
        state.noticeList = data;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
