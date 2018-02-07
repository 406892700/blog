/*
 * YG组件 筛选条
 * @Author: Simple 
 * @Date: 2017-11-20 17:46:51 
 * @Last Modified by: Simple
 * @Last Modified time: 2017-12-05 15:50:49
 */

import $ from 'jquery';
import Event from '@/components/YEvent/YEvent';

const SELECTED = 'SELECTED'; // 选中
class YFilter extends Event {
    constructor(config) {
        super();

        this.config = $.extend({}, {
            $el: '', // 筛选条容器
            item: '.option', // item样式名称
            active: '.active', // 选中样式名称
        }, config);

        this.init();
    }

    /**
     * 初始化入口
     */
    init() {
        this.bindEvent();
    }

    /**
     * 立即执行 主动触发(！请用于初始化后的首次触发，若后续主动执行，会产生问题)
     */
    fire(option) {
        option && (this.option = Object.assign({}, this.option, option)); // 合并一次参数
        this.$trigger({ // 触发回调钩子
            type: SELECTED,
            data: this.getFilterData(),
        });

        return this;
    }

    /**
     * 事件绑定
     */
    bindEvent() {
        const self = this;
        const {
            $el,
            item,
            active,
        } = this.config;

        $el.on('click', `${item} a:not(${active})`, function () {
            $(this).siblings(active).removeClass(active.slice(1)).end().addClass(active.slice(1));
            self.$trigger({ // 触发回调钩子
                type: SELECTED,
                data: self.getFilterData(),
            });
        });
    }

    /**
     * 获取选择后的参数
     */
    getFilterData() {
        const {
            $el,
            item,
            active,
        } = this.config;
        const $data = $el.find(item);
        const state = {};
        $data.each((i, innerItem) => {
            const $item = $(innerItem);
            state[$item.data('key')] = $item.find(active).data('value');
        });

        return state;
    }

    /**
     * 触发选中回调函数
     * @param {*回调函数} fn 
     */
    onSelect(fn) {
        this.$on(SELECTED, (event) => {
            fn && fn(event.data);
        });

        return this;
    }
}

export default YFilter;
