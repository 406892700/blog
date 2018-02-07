/*
 * YG组件 状态组件
 * @Author: Simple 
 * @Date: 2017-11-16 15:57:00 
 * @Last Modified by: Simple
 * @Last Modified time: 2017-12-05 16:25:09
 */

import $ from 'jquery';
import Event from '@/components/YEvent/YEvent';
import getLoadingTpl from './YLoadingTpl.html';
import getNoDataTpl from './YNoDataTpl.html';
import './YState.scss';

class YState extends Event {
    constructor(config) {
        super();
        this.config = $.extend({}, {
            $el: '',
            tpl: '',
        }, config);
    }

    /**
     * 渲染
     */
    render() {
        const {
            $el,
            tpl,
        } = this.config;
        $($el).html(tpl);
    }
}

/**
 * 对目标元素设置无数据样式
 * @param {*目标元素} $el
 * @param {*文案} text 
 * @param {*自定义模板} tpl 
 */
export const setNoData = ($el, text, tpl) => {
    text = text || '没有数据哦~';
    new YState({
        $el,
        tpl: tpl || getNoDataTpl({
            text,
        }),
    }).render();
};

/**
 * 对目标元素设置加载中样式
 * @param {*目标元素} $el
 * @param {*文案} text 
 * @param {*自定义模板} tpl 
 */
export const setLoading = ($el, text, tpl) => {
    text = text || '加载中...';
    new YState({
        $el,
        tpl: tpl || getLoadingTpl({
            text,
        }),
    }).render();
};

export default YState;
