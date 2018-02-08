export default [
    {
        path: '/',
        name: 'index',
        component: resolve => require(['../pages/layout/Layout'], resolve), //懒加载方式
        children: [{
            path: 'index',
            meta: {
                title: '首页'
            },
            component: resolve => require(['../pages/index/Index'], resolve)
        }]
    },
    // {
    //     path: '/login',
    //     name: 'login',
    //     component: resolve => require(['@/page/login/Login'], resolve)
    // },
    // {
    //     path: '*',
    //     meta: {
    //         title: '出错啦'
    //     },
    //     component: resolve => require(['@/page/error/404'], resolve)
    // }
];
