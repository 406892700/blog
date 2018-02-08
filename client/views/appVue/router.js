import Vue from 'vue';
import Router from 'vue-router';

import router from './router/router';
import routerStatic from './router/routerStatic';

Vue.use(Router);

export default new Router({
    mode: 'hash',
    routes: [...routerStatic, ...router]
});
