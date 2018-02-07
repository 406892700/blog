/*
 * YG组件 分页组件
 * @Author: Simple 
 * @Date: 2017-11-16 15:57:15 
 * @Last Modified by: Simple
 * @Last Modified time: 2017-12-05 16:14:50
 */

import $ from 'jquery';
import Event from '@/components/YEvent/YEvent';
import getYPgaeTpl from './YPageTpl.html';
import './YPage.scss';

const CHANGE = 'CHANGE'; // 发生改变

class YPage extends Event {
    constructor(config) {
        super();
        this.$el = $(config.$el);
        this.data = config.data;

        this.init();
    }

    init() {
        this.render().bindEvent();
    }

    /**
     * 转换数据
     */
    parseData() {
        const { data } = this;
        const pageArr = []; // 页码缓存数组
        const pageLength = data.pages * 1; // 总页数
        const cPage = data.pageNum * 1; // 当前页码
        const hasPrev = (cPage !== 1); // 是否有前一页
        const hasNext = (cPage !== pageLength); // 是否有后一页

        hasPrev && pageArr.push(['前一页', cPage - 1]);

        if (pageLength <= 10) { // 小于一定的数目
            for (let i = 1; i <= pageLength; i += 1) {
                pageArr.push([i, i]);
            }
        } else { // 大于一定数目以后，需要隐藏一些
            if (cPage < 5) { // 当前页小于5
                for (let j = 1; j <= 5; j += 1) {
                    pageArr.push([j, j]);
                }
                pageArr.push(['...', -1]);
                pageArr.push([pageLength, pageLength]);
            } else if (cPage >= 5 && cPage < pageLength - 4) { // 当前页大于5且小于总页数-4
                pageArr.push([1, 1]);
                pageArr.push([2, 2]);
                pageArr.push(['...', -1]);
                pageArr.push([cPage - 2, cPage - 2]);
                pageArr.push([cPage - 1, cPage - 1]);
                pageArr.push([cPage, -2]);
                pageArr.push([cPage + 1, cPage + 1]);
                pageArr.push([cPage + 2, cPage + 2]);
                pageArr.push(['...', -1]);
                pageArr.push([pageLength - 1, pageLength - 1]);
                pageArr.push([pageLength, pageLength]);
            } else { // 其他
                pageArr.push([1, 1]);
                pageArr.push([2, 2]);
                pageArr.push([3, 3]);
                pageArr.push(['...', -1]);
                pageArr.push([pageLength - 4, pageLength - 4]);
                pageArr.push([pageLength - 3, pageLength - 3]);
                pageArr.push([pageLength - 2, pageLength - 2]);
                pageArr.push([pageLength - 1, pageLength - 1]);
                pageArr.push([pageLength, pageLength]);
            }
        }

        hasNext && pageArr.push(['后一页', cPage + 1]);

        return {
            list: pageArr,
            cPage,
        };
    }

    /**
     * 渲染
     */
    render() {
        if (this.data.list.length) {
            this.$el.html(getYPgaeTpl(this.parseData()));
        } else {
            this.$el.empty();
        }

        return this;
    }

    /**
     * 绑定事件
     */
    bindEvent() {
        const self = this;
        self.$el.find('a').one('click', function () {
            const $this = $(this);
            self.$trigger({
                type: CHANGE,
                pageNum: $this.data('index'),
            });
        });
        return this;
    }

    /**
     * 发生改变时候的回调
     * @param {*回调钩子函数} fn 
     */
    onChange(fn) {
        this.$on(CHANGE, ({
            pageNum,
        }) => {
            fn && fn({
                pageNum,
            });
        });
    }
}

export default YPage;
