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

export default {
    [ADD_VISIT_PAGE](state, data) {
        state.visitedPage.push(data);
        sessionStorage.setItem('visitedPage', JSON.stringify(state.visitedPage));
    },
    [SET_TAB_ACTIVE](state, index) {
        state.tabActive = index;
        sessionStorage.setItem('tabActive', state.tabActive);
    },
    [REMOVE_TAB](state, index) {
        state.visitedPage.splice(index, 1);
        sessionStorage.setItem('visitedPage', JSON.stringify(state.visitedPage));
    },
    [CLEAR_TABS](state) {
        state.visitedPage = [];
        state.tabActive = '0';
        sessionStorage.removeItem('visitedPage');
    },
    [SET_USERINFO](state, userInfo) {
        state.userInfo = userInfo;
        sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
    },
    [CLEAR_USERINFO](state) {
        state.userInfo = {};
        sessionStorage.setItem('userInfo', JSON.stringify({}));
    },
    [INIT_LEFTMENU](state, data) {
        state.leftMenu = data;
        sessionStorage.setItem('leftMenu', JSON.stringify(data));
    }
};
