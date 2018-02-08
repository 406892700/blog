export default [
    {
        path: '/article',
        name: 'article',
        meta: { title: '文章管理' },
        component: resolve => require(['../pages/layout/Layout'], resolve),
        children: [
            {
                path: 'list',
                name: 'userList',
                meta: { title: '文章列表' },
                component: resolve => require(['../pages/article/List'], resolve)
            },
            {
                path: 'type',
                name: 'typeList',
                meta: { title: '类别列表' },
                component: resolve => require(['../pages/article/TypeList'], resolve)
            }
        ]
    },
    {
        path: '/comment',
        name: 'comment',
        meta: { title: '评论管理' },
        component: resolve => require(['../pages/layout/Layout'], resolve),
        children: [
            {
                path: 'list',
                name: 'userList',
                meta: { title: '评论列表' },
                component: resolve => require(['../pages/comment/List'], resolve)
            }
        ]
    },
];
