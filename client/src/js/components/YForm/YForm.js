/*
 * YG组件 表单验证
 * @Author: Simple
 * @Date: 2017-11-13 16:25:29
 * @Last Modified by: Simple
 * @Last Modified time: 2018-01-19 14:28:55
 */

import $ from 'jquery';
import Event from '@/components/YEvent/YEvent';
import Ajax from '@/components/YAjax/YAjax';

const INVALID = 'invalid'; // 验证失败
const DIY_SUBMIT = 'submit'; // 自定义提交
const SEND_FAILD = 'sendFailed'; // 发送失败
const SEND_SUCCEED = 'sendSucceed'; // 发送成功

class YForm extends Event {
    constructor(options) {
        super();
        this.$form = options.$form;
        this.$submit = options.$submit;
        this.options = $.extend({}, {
            url: '', // 请求地址
            beforeSend: $.noop,
            method: 'post', // 提交方式
            fields: [], // 字段验证规则
            diy: false, // 开启手动提交模式
            errClassName: 'error', // 错误样式类名
            errLogClassName: 'YG-error-log', // 错误提示样式类名
        }, options);

        return this.init();
    }

    init() {
        this.bindEvent();
        this.renderFields();
        return this;
    }

    /**
     * 加载所有数据项中的数据到表单对象中
     */
    renderFields() {
        const {
            fields
        } = this.options;
        fields.forEach((item, i) => {
            const $item = this.T.$(`[name=${item.name}]`);

            // 如果默认有值在，则反向别入到数据项中
            if ($item.val() !== '') {
                this.options.fields[i].value = $item.val();
            } else {
                this.T.$(`[name=${item.name}]`).val(item.value);
            }

        });
    }

    /**
     * 事件绑定函数
     */
    bindEvent() {
        const self = this;
        const {
            $form,
            $submit,
            options
        } = this;
        const {
            fields,
            diy
        } = this.options;
        const selectors = this.T.getAllBindedFields();
        /**
         * 丢失焦点时候重新进行验证
         */
        function blurEvent() {
            const name = $(this)[0].name || this.name;
            let field;
            fields.forEach((item) => { // 赋值
                item.value = self.T.$(`[name=${item.name}]`).val();
                if (name === item.name) {
                    field = item;
                }
            });

            self.valid(field);
        }

        /**
         * 键盘弹起时候
         */
        function keyupEvent() {
            fields.forEach((item) => { // 赋值
                item.value = self.T.$(`[name=${item.name}]`).val();
            });
        }

        /**
         * 输入框获取焦点的时候(移除错误提示)
         */
        function focusEvent() {
            self.T.hideErrLog($(this));
        }
        // 使用form 元素表单
        if ($form.is('form')) {
            $form.on('blur', selectors, blurEvent);
            $form.on('keyup', selectors, keyupEvent);
            $form.on('focus', selectors, focusEvent);
        } // 使用div元素表单
        else {
            $form.on('blur', blurEvent);
            $form.on('keyup', keyupEvent);
            $form.on('focus', focusEvent);
        }

        /**
         * 提交表单按钮点击
         */
        $submit.on('click', function () {
            const flags = [];
            const $this = $(this);
            const sendData = {};
            if ($this.hasClass('disabled')) return;

            fields.forEach((item) => {
                self.T.hideErrLog(self.T.$(`[name=${item.name}]`)); // 清除掉所有的错误提示
                flags.push(self.valid(item, true)); // 再次进行验证
            });

            if (!flags.every(item => item)) { // 如果存在错误
                self.$trigger({ // 触发invalid生命周期钩子
                    type: INVALID,
                });

                return;
            }

            $($form.serializeArray()).each((i, item) => { // 为异步提交赋值
                sendData[item.name] = item.value;
            });

            // beforeSend 如果返回了false,则停止提交
            if (options.beforeSend(sendData, $this) === false) {
                return;
            }

            if (diy) { // 如果开启手动提交模式
                self.$trigger({ // 触发diySubmit生命周期钩子
                    type: DIY_SUBMIT,
                    data: sendData,
                    $btn: $this,
                    url: options.url,
                });
                return;
            }

            // 默认提交方式
            new Ajax({
                url: options.url,
                data: sendData,
                type: options.method,
                load: true,
            }).success((result) => {
                self.$trigger({ // 触发发送成功钩子函数
                    type: SEND_SUCCEED,
                    result,
                });
            }).error(({
                msg,
                errorParam
            }) => {
                if (errorParam) { // 如果存在错误字段名,精确提示到输入框
                    self.T.showErrLog(self.T.$(`[name=${errorParam}]`), msg);
                } else { // 如果没有，则全局方式提示
                    // todo://
                    alert(msg);
                }

                self.$trigger({ // 触发发送失败钩子函数
                    type: SEND_FAILD,
                    msg,
                    name: errorParam,
                });
            }).fail((err) => {
                console.log(err);
                // alert(JSON.stringify(err));
            });
        });
    }

    /**
     * 验证规则字段
     * @param {*字段验证规则} field
     * @param {*是否是提交时触发的验证} submit
     */
    valid(field, submit = false) {
        const self = this;
        const $input = this.T.$(`[name=${field.name}]`); // 输入框对象
        const {
            fields
        } = this.options;
        const {
            name, // 字段名称
            rule, // 验证规则
            eMsg, // 为空时候的错误提示
            iMsg, // 验证时候的错误提示
            value, // 字段的值
            // need,// 是否需要在丢失焦点时候验证
            canEmpty, // 是否可为空
            async, // 是否需要异步验证
        } = field;

        /**
         * 验证函数
         */
        const validRule = (value) => {
            // debugger;
            if (!rule) { // 如果没有指定规则
                return true;
            } else if (typeof rule === 'function') { // 如果验证规则是函数
                const data = self.T.convertData(fields);
                if (async) { // 如果是异步认证，直接返回true,依赖函数本身验证
                    !submit && rule(data, self.T.showErrLog, $input); // 提交验证时候不进行异步验证
                    return true;
                } // 如果是同步认证，则依赖函数的返回值
                return rule(data, self.T.showErrLog, $input);
            } // 普通的正则验证
            return typeof rule === 'string' ? new RegExp(rule).test(value) : rule.test(value);
        };

        if (field.value === '') { // 字符串为空
            if (field.canEmpty) { // 可以为空
                return true;
            } // 不可以为空
            self.T.showErrLog($input, field.eMsg); // 显示错误
            return false;
        } // 不为空
        if (!validRule(field.value)) { // 不匹配规则
            field.iMsg && self.T.showErrLog($input, field.iMsg); // 显示错误
            return false;
        }


        return true;
    }

    // 生命周期钩子 start
    /**
     * 表单验证失败钩子函数
     * @param {*事件回调函数} fn
     */
    invalid(fn) {
        this.$on(INVALID, fn);
        return this;
    }

    /**
     * 自定义提交钩子函数
     * @param {*事件回调函数} fn
     */
    submit(fn) {
        this.$on(DIY_SUBMIT, ({
            data,
            $btn,
            url
        }) => {
            fn && fn(data, $btn, url);
        });
        return this;
    }

    /**
     * 发送失败钩子函数
     * @param {*事件回调函数} fn
     */
    failed(fn) {
        this.$on(SEND_FAILD, ({
            msg,
            name
        }) => {
            fn && fn(msg, name);
        });
        return this;
    }

    /**
     * 发送成功钩子函数
     * @param {*事件回调函数} fn
     */
    success(fn) {
        this.$on(SEND_SUCCEED, ({
            result
        }) => {
            fn && fn(result);
        });
        return this;
    }

    // 生命周期钩子 end
    /**
     * 组件工具函数
     */
    T = {
        /**
         * 作用域内jquery选择器
         */
        $: (selector) => {
            const {
                $form
            } = this;
            let ele = $(selector, $form);
            if (ele.length === 0) {
                ele = $form.filter(selector);
            }
            return ele;
        },
        /**
         * 获取所有需要建立双向绑定的输入框
         */
        getAllBindedFields: () => {
            const {
                fields
            } = this.options;
            return fields.map(item => `[name=${item.name}]`).join(',');
        },
        /**
         * 显示错误提示
         */
        showErrLog: ($el, errMsg) => {
            const {
                errClassName,
                errLogClassName
            } = this.options;
            const errHtmlStr = `<div class="${errLogClassName}">${errMsg}</div>`;
            $el.parent().addClass(`${errClassName}`).find(`.${errLogClassName}`).remove()
                .end()
                .append(errHtmlStr);
        },
        /**
         * 移除错误提示
         */
        hideErrLog: ($el) => {
            const {
                errClassName,
                errLogClassName
            } = this.options;
            $el.parent().removeClass(`${errClassName}`).find(`.${errLogClassName}`).remove();
        },
        /**
         * 将数组转换为以name为键的对象，方便使用
         */
        convertData: (fields) => {
            const tempObj = {};
            fields.forEach((item) => {
                tempObj[item.name] = item;
            });

            return tempObj;
        },
    };
}



export default YForm;
