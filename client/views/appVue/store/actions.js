/**
 * Created by xhy on 17/8/4.
 */
import {
    ADD_VISIT_PAGE,
    SET_TAB_ACTIVE,
    REMOVE_TAB,
    CLEAR_TABS,
    SET_USERINFO,
    CLEAR_USERINFO,
    INIT_LEFTMENU
} from './constant';
// import fetch from '@/lib/fetch';

export default {
    //添加选项卡
    addVisitPage({
        commit,
        state
    }, page) {
        if (state.visitedPage.every((item, index, arr) => { return item.path !== page.path})) {
            commit(ADD_VISIT_PAGE, page);
        }
    },
    //设置选项卡选中
    setActive({
        commit,
        state
    }, index) {
        commit(SET_TAB_ACTIVE, index);
    },
    //删除选项卡
    removeTab({
        commit,
        state
    }, index) {
        return new Promise((resolve, reject) => {
            if (index == 0 && state.visitedPage.length == 1) {
                reject(index);
            } else {
                commit(REMOVE_TAB, index);
                resolve(index);

            }

        });
    },
    //清除所有选项卡
    clearTabs({
        commit,
        state
    }) {
        commit(CLEAR_TABS);
    },
    //设置用户信息
    // doLogin({
    //     commit,
    //     state
    // }, form) {
    //     return new Promise((resolve, reject) => {
    //         fetch({
    //             url: '/sys/user/login',
    //             method: 'post',
    //             data: form
    //         }).then(result => {
    //             commit(SET_USERINFO, result);
    //             resolve(result);
    //             //this.$store.dispatch('setUserInfo',result)
    //         }).catch(err => {
    //             reject(err);
    //         });
    //     });
    // },
    // //登出
    // loginOut({
    //     commit,
    //     state
    // }, form) {
    //     return new Promise((resolve, reject) => {
    //         fetch({
    //             url: '/sys/user/logout',
    //             method: 'post'
    //         }).then(result => {
    //             commit(CLEAR_USERINFO);
    //             resolve(result);
    //         }).catch(err => {
    //             reject(err);
    //         });
    //     });
    // },
    // //生成左边菜单
    // initLeftMenu({
    //     commit,
    //     state
    // }, data) {
    //     return new Promise((resolve, reject) => {
    //         fetch({
    //             url: '/sys/menu/left',
    //             method: 'post'
    //         }).then(result => {
    //             commit(INIT_LEFTMENU, result);
    //             resolve(result);
    //         }).catch(err => {
    //             reject(err);
    //         });
    //     });
    // }
};
