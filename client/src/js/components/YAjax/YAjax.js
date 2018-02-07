/*
 * YG组件 ajax
 * @Author: Simple
 * @Date: 2017-11-14 11:16:00
 * @Last Modified by: Simple
 * @Last Modified time: 2017-12-18 09:56:43
 */

import $ from 'jquery';
import Event from '@/components/YEvent/YEvent';
import $config from '../../../../config/config';
import Alert from '@/components/YDialog/YAlert';
import YLayer from '@/components/YLayer/YLayer';

import { JSEncrypt } from 'jsencrypt';

const SUCCESS = 'success'; // 发送成功
const ERROR = 'error'; // 发送成功,业务逻辑错误
const FAIL = 'fail'; // 发送失败, 网络请求错误
const ALWAYS = 'always'; // 无论成功与否，都执行

// 发送队列
const ajaxCacheList = {};

class YAjax extends Event {
    constructor(config) {
        super();
        this.config = $.extend({}, { // 合并参数
            type: 'get',
            load: false,
            beforeSend: null,
            unique: false,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            delay: 1000,
        }, config);

        this.loading = new YLayer();

        return this.init();
    }

    init() {
        this.send();
        return this;
    }

    /**
     * 敏感字段加密函数
     * @param plainText
     * @returns {string}
     */
    encrypt(plainText) {
        const publicKey = 
            'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCwwGlyRh968odnK9TL7DmpMQa0dBBHbjBKL0/Fgo0SQIaIXInyj6eyLU9HRwpU0K2/7KJR185kIFJ63BeDNW4smE+L7GrfBkYzAXdQOlff6IjZM2MpClgm1wFumuaogZvgZTH1ac6baSfuaBUCkLwss8Gt6McflNAEYQvsgiPg5wIDAQAB';
        const encrypt = new JSEncrypt();
        encrypt.setPublicKey(publicKey);
        return encrypt.encrypt(plainText);
    }

    send() {
        const self = this;
        const {
            config,
        } = this;
        const beforeSendTmp = config.beforeSend;

        // 封装beforeSend
        config.beforeSend = (jqXHR) => {
            jqXHR.setRequestHeader('clientType', '01');
            jqXHR.setRequestHeader('version', 'v100');
            if (config.unique || config.type.toLowerCase() === 'post') { // 如果是需要处理重复提交的或者post请求
                if (ajaxCacheList[config.url]) {
                    return false;
                }
                ajaxCacheList[config.url] = jqXHR;
            }

            if (config.load) {
                this.loading.show();
            }

            if (beforeSendTmp) {
                return beforeSendTmp(jqXHR);
            }

            return true;
        };

        if (config.type.toLowerCase() === 'post') {
            const encryptMapper 
            = ['loginPwd', 'reLoginPwd', 'mobile', 'userName', 'realName', 'idNumber', 'payPwd', 'rePayPwd', 'oldPwd', 'cardNo', 'reLoginPwd', 'oldPayPwd'];

            config.data = config.data || {};
            Object.keys(config.data).forEach((item) => {
                if (encryptMapper.indexOf(item) !== -1) {
                    config.data[item] = this.encrypt(config.data[item]).replace(/\s/g, '');
                }
            });
        }
        
        config.url = $config.basePath + config.url;

        config.data = JSON.stringify(config.data);

        const jqXHR = $.ajax(config); // 发送请求
        if (jqXHR) {
            jqXHR.always(() => { // 从队列删除已完成的请求
                if (jqXHR.statusText !== 'canceled') {
                    delete ajaxCacheList[config.url];
                }
            });

            // 发送成功
            jqXHR.done((data) => {
                data = typeof data === 'string' ? JSON.parse(data) : data;
                if (data.code * 1 === 200) { // 正常的业务逻辑
                    self.$trigger({ // 触发成功钩子函数
                        type: SUCCESS,
                        data: data.result,
                        response: data,
                    });
                } else if (data.code * 1 === 403) { // 登录鉴权失败
                    window.location.href = '/user/login';
                } else { // 业务逻辑错误
                    if (data.code * 1 === 500) {
                        new Alert('系统,请重试~');
                    }
                    
                    self.$trigger({ // 触发业务逻辑错误钩子函数
                        type: ERROR,
                        data,
                    });
                }
            });

            // 发送失败
            jqXHR.fail((error) => {
                self.$trigger({
                    type: FAIL,
                    error,
                });
            });

            // 无论成功与否
            jqXHR.always((data) => {
                data = typeof data === 'string' ? JSON.parse(data) : data;
                self.$trigger({
                    type: ALWAYS,
                    data,
                });
                this.loading.hide();
            });
        }
    }

    /**
     * 发送成功钩子
     * @param {*} fn
     */
    success(fn) {
        this.$on(SUCCESS, ({
            data,
            response,
        }) => {
            fn(data, response);
        });

        return this;
    }

    /**
     * 发送成功,业务逻辑错误钩子
     */
    error(fn = () => {}) {
        this.$on(ERROR, ({
            data,
            type,
        }) => {
            fn(data, type);
        });

        return this;
    }

    /**
     * 发送失败,网络错误钩子
     * @param {*} fn
     */
    fail(fn = () => {}) {
        this.$on(FAIL, (err) => {
            new Alert('网络错误,请重试~');
            fn(err);
        });

        return this;
    }

    /**
     * 无论失败成功，一直执行钩子
     * @param {*} fn
     */
    always(fn) {
        this.$on(ALWAYS, fn);
        return this;
    }
}

export default YAjax;
