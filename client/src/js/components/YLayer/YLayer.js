/*
 * YG组件 全局loading
 * @Author: Simple
 * @Date: 2017-12-08 15:49:29
 * @Last Modified by:   Simple
 * @Last Modified time: 2017-12-08 15:49:29
 */

import Event from '@/components/YEvent/YEvent';
import $ from 'jquery';
import loading from './assets/loading.gif';
import './YLayer.scss';

class YLayer extends Event {
    constructor(config) {
        super();
        this.config = $.extend({}, {
            text: '',
            icon: '',
        }, config);

        this.$el = this.getTpl();
    }

    init() {
        
    }

    getTpl() {
        const { text, icon } = this.config;
        return $(`
            <div class="YG-mask" style="background-color: rgba(0, 0, 0, 0)">
                <div class="YG-fixed-loading">
                    <div class="loading-icon">
                        <img src="${icon || loading}">
                    </div>
                    <p>${text || '正在加载中...'}</p>
                </div>
            </div>
        `);
    }

    /**
     * 显示loading
     */
    show() {
        $('body').append(this.$el);
    }

    /**
     * 隐藏loading
     */
    hide() {
        this.$el.remove();
    }
}

export default YLayer;
