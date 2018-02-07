/*
 * YG组件 列表加载
 * @Author: Simple 
 * @Date: 2017-11-16 15:56:38 
 * @Last Modified by: Simple
 * @Last Modified time: 2017-12-15 17:54:06
 */

import $ from 'jquery';
import Event from '@/components/YEvent/YEvent';
import YAjax from '@/components/YAjax/YAjax';
import getYListTpl from './YListTpl.html';
import {
    setLoading,
    setNoData,
} from '@/components/YState/YState';
import ejs from '@/libs/ejs';

console.log(ejs);
import './YList.scss';

const DATA_LOADED = 'DATA_LOADED'; // 数据加载完成

class YList extends Event {
    constructor(config) {
        super();
        this.config = $.extend({}, {
            grid: false, // 是否开启默认列表加载方式
            $el: '', // 容器
            url: '', // 数据源地址
            args: {
                pageNum: 1,
                pageSize: 10,
            }, // 参数
            method: 'post', // 请求方式,
            formatData: null, // 数据格式化回调参数
            extraArgsForRender: {}, // 为渲染传入额外参数
            tpl: '', // 所使用的数据模板
            setLoading, // 加载中
            setNoData, // 没有数据占位
            columns: [], // 默认列表加载方式
            selectable: false, // 是否需要前面加上选择框
        }, config);

        this.dataCacheList = []; // 数据缓存数组

        this.init();
    }

    init() {
        this.getData();
        this.bindEvent();
    }

    /**
     * 获取数据
     */
    getData() {
        const {
            $el,
            url,
            args,
            method,
            setLoading,
            setNoData,
            formatData
        } = this.config;

        new YAjax({
            url,
            data: args,
            type: method,
            beforeSend() {
                setLoading($el);
            },
        }).success((result) => {
            result = formatData ? formatData(result) : result; // 如果传入了数据格式化函数，则将数据赋值为格式化后的数据
            this.render(result);
            this.$trigger({ // 触发数据加载完成回调钩子
                type: DATA_LOADED,
                result,
                $el,
            });
        });
    }

    /**
     * 将后端返回的数据转换为grid方式使用的格式
     * @param {*数据列表} list 
     */
    parseDataForGrid(list) {
        const {
            columns,
        } = this.config;
        const newList = [];
        $(list).each((i, item) => {
            const columnNew = $.extend(true, [], columns);
            $(columns).each((j, columnItem) => {
                const keyName = columnItem.key;
                const value = item[keyName];
                columnNew[j].value = columnItem.callback ? columnItem.callback(value, item) : value;
            });
            newList.push(columnNew);
        });

        return newList;
    }

    /**
     * 渲染列表
     * @param {*数据列表} result 
     */
    render(result) {
        const {
            $el,
            grid,
            columns,
            tpl,
            extraArgsForRender,
            selectable,
        } = this.config;
        
        const list = grid ? {
            title: columns,
            list: this.parseDataForGrid(result.list),
            selectable,
            originList: result.list,
        } : result.list;

        this.dataCacheList = result.list; // 缓存数据

        if (result.list.length) { // 有数据
            if (grid) { // 默认方式加载
                $el.html(getYListTpl(list));
            } else { // 自定义模板方式
                $el.html(typeof tpl === 'string' ? ejs.render(tpl, {
                    list,
                    ...extraArgsForRender,
                }) : tpl({
                    list,
                    ...extraArgsForRender,
                })); // 兼容import ejs-loader方式与普通字符串模板的方式
            }
        } else { // 没有数据
            setNoData($el);
        }
    }

    /**
     * 一些事件的绑定
     */
    bindEvent() {
        const {
            $el,
            selectable,
        } = this.config;
        if (selectable) {
            $el.on('change', '.select-all-checkbox', function () {
                const $this = $(this);
                const $checksList = $el.find('.select-checkbox');
                $checksList.prop('checked', $this.prop('checked')).trigger('change');
            });

            $el.on('change', '.select-checkbox', function () {
                const $this = $(this);
                const $tr = $this.closest('tr');
                if ($this.prop('checked')) {
                    $tr.addClass('active');
                } else {
                    $tr.removeClass('active');
                }
            });
        }
    }

    /**
     * 获取选中的列 (todo:// 需要优化为数据缓存的方式，目前暂时使用dom查询的方式)
     * @param {*需要获取的属性的键名} keys 
     */
    getSelectColumns(...keys) {
        const { $el } = this.config;
        const temArr = [];
        $el.find('tr.active input[type=checkbox]').each((i, item) => {
            temArr.push($(item).data('obj'));
        });

        return temArr.map((item) => {
            const tempItem = {};
            keys.forEach((innerItem) => {
                tempItem[innerItem] = item[innerItem];
            });

            return tempItem;
        });
    }

    /**
     * 刷新列表
     * @param {*新参数} newArgs 
     */
    reload(newArgs) {
        $.extend(this.config.args, newArgs);
        this.getData();
    }

    /**
     * 数据加载完成钩子函数
     * @param {*回调函数} fn 
     */
    loaded(fn) {
        this.$on(DATA_LOADED, ({
            $el,
            result,
        }) => {
            fn && fn($el, result);
        });

        return this;
    }
}

export default YList;
