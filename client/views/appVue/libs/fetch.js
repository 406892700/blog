import axios from 'axios';
import {
    Message
} from 'element-ui';
// import store from '@/store';

// 创建axios实例
const service = axios.create({
    baseURL: '/manage', // api的base_url
    timeout: 5000, // 请求超时时间
    headers: {
        'Content-Type': 'application/json'
    }
});

// request拦截器
service.interceptors.request.use(config => {
    return config;
}, error => {
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error);
});

// respone拦截器
service.interceptors.response.use(
    response => {
        /**
         * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
         * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
         */
        const res = response.data;

        if (res.code == '401') { // 401登录状态已过期需要重新登录
            debugger;
            Message({
                message: res.msg,
                type: 'error',
                duration: 3000,
                onClose: () => {
                    // store.dispatch('FedLogOut').then(() => {
                    //   location.reload();// 为了重新实例化vue-router对象 避免bug
                    // })
                    window.location.href = '/login';
                }
            });

            return Promise.reject('error');
        }
        if (res.code == '200') { //正常的业务逻辑
            return res.result;
        }

        //网络请求成功，但是业务逻辑错误
        Message({
            message: res.msg,
            type: 'error',
            duration: 3000
        });
        
        return Promise.reject('error');
    },
    error => {
        console.log('err' + error); // for debug
        Message({
            message: error.message,
            type: 'error',
            duration: 3000
        });

        return Promise.reject(error);
    }
);

export default service;
