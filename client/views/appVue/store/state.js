/**
 * Created by xhy on 17/8/4.
 */

export default {
    userInfo: JSON.parse(sessionStorage.getItem('userInfo') || '{}'), //用户信息
    visitedPage: JSON.parse(sessionStorage.getItem('visitedPage') || '[]'), //访问过的页面
    tabActive: sessionStorage.getItem('tabActive') + '' || '0', //激活的tab选项卡
    // leftMenu: JSON.parse(sessionStorage.getItem('leftMenu') || '[]') //左边菜单
};
