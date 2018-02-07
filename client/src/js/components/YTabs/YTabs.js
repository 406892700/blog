/*
 * YG组件 tab切换插件
 * @Author: Simple 
 * @Date: 2017-11-13 16:19:46 
 * @Last Modified by: Simple
 * @Last Modified time: 2017-12-05 16:30:02
 */

import $ from 'jquery';
import Event from '@/components/YEvent/YEvent';

const CHANGE = 'CHANGE'; // 发生改变的时候

class YTabs extends Event {
    constructor($tabEl, $panelEl, option) {
        super();
        this.$tabEl = $tabEl;
        this.$panelEl = $panelEl;

        this.option = Object.assign({}, {
            index: 0,
            active: 'active',
        }, option);

        return this.init();
    }

    /**
     * 初始化方法
     */
    init() {
        this.bindEvent();
        return this;
    }

    /**
     * 立即执行 主动触发(！请用于初始化后的首次触发，若后续主动执行，会产生问题)
     */
    fire(option) {
        option && (this.option = Object.assign({}, this.option, option)); // 合并一次参数
        this.$trigger({
            type: CHANGE,
            $el: this.$panelEl.eq(this.option.index),
            index: this.option.index,
        });

        return this;
    }

    /**
     * 绑定函数
     */
    bindEvent() {
        const self = this;
        this.$tabEl.on('click', function () {
            const {
                index,
            } = self.option;
            const cIndex = self.$tabEl.index($(this)); // 当前点击的tab

            if (cIndex === index) {
                return;
            } 
            self.toggle(cIndex);
            self.$trigger({
                type: CHANGE,
                $el: self.$panelEl.eq(cIndex),
                index: cIndex,
            });
        });
    }

    /**
     * 选项卡切换函数
     * @param {*当前点击的tab} cIndex 
     */
    toggle(cIndex) {
        const {
            index,
            active,
        } = this.option;
        cIndex = typeof cIndex === 'undefined' ? index : cIndex;
        this.$tabEl
            .eq(index)
            .removeClass(active)
            .end()
            .eq(cIndex)
            .addClass(active);
        this.$panelEl
            .eq(index)
            .hide()
            .end()
            .eq(cIndex)
            .show();
        this.option.index = cIndex;
    }

    /**
     * 事件回调方法
     * @param {*事件回调函数} fn 
     */
    change(fn) {
        this.$on(CHANGE, fn);
        return this;
    }
}

export default YTabs;
