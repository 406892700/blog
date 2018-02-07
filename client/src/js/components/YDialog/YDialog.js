/*
 * YG组件 弹窗基类
 * @Author: Simple 
 * @Date: 2017-11-15 18:38:45 
 * @Last Modified by: Simple
 * @Last Modified time: 2017-12-12 11:33:37
 */

import $ from 'jquery';
import Event from '@/components/YEvent/YEvent';
import getDialogTpl from './YDialogTpl.html';
import './YDialog.scss';

const BTN_CLICK = 'BTN_CLICK'; // 按钮点击回调
const TIPS_CLOSE = 'TIPS_CLOSE'; // 弹窗关闭
const TIPS_RENDERED = 'TIPS_RENDERED'; // 弹窗渲染完成

class YDialog extends Event {
    constructor(config) {
        super();
        this.config = $.extend({}, {
            width: 300, // 宽
            init: null, // 弹窗初始化回调函数
            btns: [], // 下方的按钮
            content: '', // 内容，html字符串
            title: '', // 标题
            close: true, // 是否需要关闭按钮
            cache: false, // 是否开启模板缓存(若开启，关闭时不移除节点，只是简单的变为display: none)
            mask: false, // 是否开启遮罩
            full: true, // 是否需要全屏
        }, config);

        this.$tipsWrap = this.compileTemplate();
        this.$mask = this.$tipsWrap.find('.YG-mask'); // 弹窗遮罩
        this.$tips = this.$tipsWrap.find('.YG-dialog'); // 弹窗主体
        this.$content = this.$tips.find('.content'); // 弹窗内容区域
        this.$closeBtn = this.$tips.find('.close'); // 关闭按钮
        this.$fullBtn = this.$tips.find('.full'); // 全屏按钮
        this.$btns = this.$tips.find('.btn-area a.btn'); // 弹窗按钮

        this.initFlag = false; // 是否初始化标志
    }

    open() {
        if (!this.initFlag) {
            this.render();
            this.bindEvent();
            this.config.init && this.config.init(this.$content, this.$tips);
            this.initFlag = true;
        } else {
            this.show();
        }

        return this;
    }

    /**
     * 编译生成模板
     */
    compileTemplate() {
        let {
            width,
            
        } = this.config;

        const {
            full,
            btns,
            content,
            title,
            close,
            mask,
        } = this.config;

        width = width * 1 ? `${width}px` : width;

        return $(getDialogTpl({
            dialog: {
                width,
                btns: btns.map(item => (item instanceof Array ? item[0] : item)),
                content,
                title,
                close,
                mask,
                full,
            },
        }));
    }

    /**
     * 渲染函数
     */
    render() {
        $('body').append(this.$tipsWrap);
        this.$trigger({
            type: TIPS_RENDERED,
            $el: this.$tipsWrap,
        });
    }

    /**
     * 绑定事件
     */
    bindEvent() {
        const self = this;
        const {
            $closeBtn,
            $btns,
            $fullBtn,
        } = this;
        const {
            btns,
        } = this.config;

        // 关闭按钮点击
        $closeBtn.click(() => {
            this.config.cache ? this._hide() : this._remove();
        });

        // 全屏按钮的点击
        $fullBtn.click(() => {
            const {
                $tips,
                $tipsWrap,
            } = this;
            if (!$tips.hasClass('full-screen')) {
                $tipsWrap.css('overflow-y', 'hidden');
            } else {
                $tipsWrap.css('overflow-y', 'scroll');
            }
            $tips.toggleClass('full-screen');
        });

        // 按钮的点击
        $btns.click(function () {
            const $btn = $(this);
            const index = $btn.index();

            const btnCfg = btns[index];

            self.$trigger({
                type: BTN_CLICK,
                $btn,
                index,
                callback: self.config.cache ? self._hide.bind(self) : self._remove.bind(self)
            });

            if (typeof btnCfg === 'string' || (btnCfg instanceof Array && btnCfg[1] != true)) { // 如果配置方式为数组形式，且指定拦截默认的关闭
                self.config.cache ? self._hide() : self._remove();
            }
        });
    }

    /**
     * 按钮点击回调钩子
     * @param {*回调函数} fn 
     */
    then(fn) {
        this.$on(BTN_CLICK, ({
            $btn,
            index,
            callback,
        }) => {
            fn && fn($btn, index, callback);
        });

        return this;
    }

    /**
     * 弹窗关闭事件
     * @param {*回调函数} fn 
     */
    onClose(fn) {
        this.$on(TIPS_CLOSE, (event) => {
            fn && fn(event);
        });

        return this;
    }

    /**
     * 弹窗渲染完成事件
     * @param {*弹窗渲染完成} fn 
     */
    onLoaded(fn) {
        this.$on(TIPS_RENDERED, ({ $el }) => {
            fn && fn($el);
        });

        return this;
    }

    /**
     * 关闭弹窗
     */
    _hide() {
        this.$tips.addClass('YG_bounceOut');
        this.$mask.fadeOut(0.2);
        setTimeout(() => {
            this.$tips.hide();
            this.$tipsWrap.hide();
            this.$trigger({
                type: TIPS_CLOSE,
                form: 'closeBtn',
            });
        }, 200);
    }

    /**
     * 移除弹窗
     */
    _remove() {
        this.$tips.addClass('YG_bounceOut');
        setTimeout(() => {
            this.$tipsWrap.remove();
            this.$trigger({
                type: TIPS_CLOSE,
                form: 'closeBtn',
            });
        }, 200);
    }


    /**
     * 外部调用弹窗关闭方法
     */
    close() {
        this.config.cache ? this._hide() : this._remove();
    }

    /**
     * 外部调用显示弹窗(仅用于设置了缓存的弹窗)
     */
    show() {
        if (this.config.cache) {
            this.$tips.removeClass('YG_bounceOut').show();
            this.$mask.fadeIn(0.2);
            this.$tipsWrap.show();
        } else {
            console.log('您未设置缓存模式，无法打开~');
        }
    }
}

export default YDialog;
