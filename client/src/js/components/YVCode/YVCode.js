/*
 * YG组件 发送短信验证码(兼容邮箱验证码待完善)
 * @Author: Simple 
 * @Date: 2017-11-15 09:59:38 
 * @Last Modified by: Simple
 * @Last Modified time: 2017-12-11 16:11:22
 */

import $ from 'jquery';
import Event from '@/components/YEvent/YEvent';
import Ajax from '@/components/YAjax/YAjax';
import $config from '../../../../config/config';

const INIT = 'INIT'; // 初始化
const VALID = 'VALID'; // 验证
const SEND_SUCCESS = 'SEND_SUCCESS'; // 发送成功
const SEND_ERROR = 'SEND_ERROR'; // 发送失败
const TIME_OUT = 'TIME_OUT'; // 超时

class YVCode extends Event {
    constructor(config) {
        super();
        this.config = $.extend({}, {
            url: '/vCode/sendSms',
            $input: $('[name=mobile]'),
            $sendBtn: $('[name=sendBtn]'),
            $img: $('[name=img]'),
            $vCode: $('[name=vCode]'),
            beforeSend: () => {
                return true;
            },
            inputKey: 'mobile',
            codeKey: 'vCode',
            delay: 120,
            args: {},
            errClassName: 'error',
            errLogClassName: 'YG-error-log',
            email: false,
        }, config);

        this.sending = false; // 发送中标志
        this.vCodeKey = '';

        return this._init();
    }

    /**
     * 初始化入口
     */
    _init() {
        this.initComponents();
        return this;
    }

    /**
     * 初始化相关元素
     */
    initComponents() {
        this.initImg();
        this.bindEvent();
    }

    /**
     * 初始化图形验证码
     * @param {*时间戳} timeStamp 
     */
    initImg() {
        const {
            $img,
        } = this.config;

        new Ajax({
            url: '/vCode/findVcodeKey',
        }).success(({ vcodeKey }) => {
            this.vCodeKey = vcodeKey;
            if ($img[0].tagName.toLowerCase() === 'img') {
                $img.attr('src', `${$config.basePath}/vCode/imgCode?vCodeKey=${vcodeKey}`);
            } else {
                $img.find('img').attr('src', `${$config.basePath}/vCode/imgCode?vCodeKey=${vcodeKey}`);
            }
        });   
    }

    /**
     * 绑定事件
     */
    bindEvent() {
        const self = this;

        // 验证码点击事件
        this.config.$img.click(() => {
            self.flush();
        });

        // 发送按钮点击
        this.config.$sendBtn.click(() => {
            console.log(this.sending);
            if (this.sending) { // 发送中点击无效
                return;
            }
            const {
                beforeSend,
                $input,
                $vCode,
            } = this.config;
            const vResult = this.valid(); // 验证结果
            const extraArgs = beforeSend($input, $vCode);
            if (vResult && extraArgs) {
                this.sendData(extraArgs);
            }
        });
    }

    /**
     * 发送请求
     */
    sendData(extraArgs = {}) {
        const {
            url,
            args,
            $input,
            $vCode,
            inputKey,
            codeKey,
            $sendBtn,
        } = this.config;
        const { vCodeKey } = this;
        const data = {
            [inputKey]: $input.val(),
            [codeKey]: $vCode.val(),
            vCodeKey,
            ...args,
            ...extraArgs,
        };

        new Ajax({
            url,
            data: $.extend({}, data, args),
            type: 'post',
            beforeSend: () => {
                $sendBtn.html('发送中...');
                this.sending = true;
            },
        }).success((result) => {
            this.hideErrLog($input);
            this.hideErrLog($vCode);
            this.$trigger({ // 触发成功函数钩子
                type: SEND_SUCCESS,
                result,
            });

            this.countTime();
        }).error(({
            msg,
            errorParam,
        }) => {
            this.sending = false;
            this.$trigger({ // 触发失败函数钩子
                type: SEND_ERROR,
                msg,
                name: errorParam,
            });

            $sendBtn.html('重新发送');
            this.resetFields();
            if (errorParam === inputKey) {
                this.showErrLog($input, msg);
            } else if (errorParam === codeKey) {
                this.showErrLog($vCode, msg);
            } else {
                alert(msg);
            }
        }).fail(() => {
            this.sending = false;
        });
    }

    /**
     * 开始倒计时
     */
    countTime() {
        let { delay } = this.config;

        const { $sendBtn } = this.config;
        const timer = setInterval(() => {
            if (delay === -1) {
                window.clearInterval(timer);
                $sendBtn.html('重新发送');
                this.resetFields();
                this.sending = false;
                this.$trigger({ // 触发超时函数钩子
                    type: TIME_OUT,
                });
            } else {
                $sendBtn.html(`已发送(${delay})`);
            }
            delay -= 1;
        }, 1000);
    }

    /**
     * 重置一些字段
     */
    resetFields() {
        this.flush();
        this.config.$vCode.val('').trigger('blur');
    }

    /**
     * 验证字段
     */
    valid() {
        const {
            $input,
            $vCode,
        } = this.config;
        if ($input.val() === '') {
            this.showErrLog($input, '请输入手机号码');
            return false;
        }

        if (!/^1[3-8]\d{9}$/.test($input.val())) {
            this.showErrLog($input, '手机号码输入有误');
            return false;
        }

        if ($vCode.val() === '') {
            this.showErrLog($vCode, '请输入图形验证码');
            return false;
        }

        if ($vCode.val().length !== 4) {
            this.showErrLog($vCode, '图形验证码格式有误');
            return false;
        }

        return true;
    }

    /**
     * 提示错误
     * @param {*目标元素}  
     * @param {*错误信息} errMsg 
     */
    showErrLog($el, errMsg) {
        const {
            errClassName,
            errLogClassName,
        } = this.config;
        const errHtmlStr = `<div class="${errLogClassName}">${errMsg}</div>`;
        $el
            .parent()
            .addClass(`${errClassName}`)
            .find(`.${errLogClassName}`)
            .remove()
            .end()
            .append(errHtmlStr);
    }


    /**
     * 清除错误
     * @param {*目标元素}  
     */
    hideErrLog($el) {
        const {
            errClassName,
            errLogClassName,
        } = this.config;
        $el.parent().removeClass(`${errClassName}`).find(`.${errLogClassName}`).remove();
    }

    /**
     * 刷新图形验证码
     */
    flush() {
        this.initImg();
    }

    /**
     * 初始化回调钩子函数
     * @param {*回调函数} fn 
     */
    init(fn) {
        this.$on(INIT, (event) => {
            fn && fn(event);
        });
    }

    /**
     * 验证回调钩子函数
     * @param {*回调函数} fn 
     */
    validate(fn) {
        this.$on(VALID, (event) => {
            fn && fn(event);
        });
        return this;
    }

    /**
     * 发送成功回调钩子函数
     * @param {*回调函数} fn 
     */
    success(fn) {
        this.$on(SEND_SUCCESS, (event) => {
            fn && fn(event);
        });
        return this;
    }

    /**
     * 发送失败回调钩子函数
     * @param {*回调函数} fn
     */
    error(fn) {
        this.$on(SEND_ERROR, (event) => {
            fn && fn(event);
        });
        return this;
    }

    /**
     * 超时回调钩子函数
     * @param {*回调函数} fn 
     */
    timeout(fn) {
        this.$on(TIME_OUT, (event) => {
            fn && fn(event);
        });
        return this;
    }
}

export default YVCode;
