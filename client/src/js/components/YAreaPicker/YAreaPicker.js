/*
 * YG组件 省市区三级联动
 * @Author: Simple
 * @Date: 2017-12-13 14:23:30
 * @Last Modified by: Simple
 * @Last Modified time: 2017-12-13 16:26:34
 */

import Event from '@/components/YEvent/YEvent';
import $ from 'jquery';
import areaData from './area';

const AFTER_SELECTED = 'AFTER_SELECTED'; // 完成一次选择

class YAreaPicker extends Event {
    constructor(config) {
        super();
        this.config = $.extend({}, {
            province: '110000', // 默认省
            city: '110100', // 默认市
            dist: '110101', // 默认区
            $province: $('[name=province]'), // 省元素
            $city: $('[name=city]'), // 市元素
            $dist: $('[name=dist]'), // 区元素
        }, config);

        this.getInitDataFromDom();

        this.init();
    }

    init() {
        this.renderElements();
        this.bindEvent();
    }

    /**
     * 从dom上获取初始数据,配合后端渲染
     */
    getInitDataFromDom() {
        const {
            province,
            city,
            dist,
            $province,
            $city,
            $dist,
        } = this.config;

        this.config.province = $province.data('init') || province;
        this.config.city = $city.data('init') || city;
        this.config.dist = $dist.data('init') || dist;
    }
    
    /**
     * 
     * @param {* 渲染类型} type undefined => 全部渲染 1 => 渲染市区 2 => 渲染区
     */
    renderElements(type) {
        const {
            province,
            city,
            dist,
            $province,
            $city,
            $dist,
        } = this.config;

        if (typeof type === 'undefined') {
            this.renderElement($province, this._getProvinceList(), province);
            this.renderElement($city, this._getCity(), city);
            this.renderElement($dist, this._getDist(), dist);
        } else if (type === 1) {
            this.renderElement($city, this._getCity(), city);
            this.renderElement($dist, this._getDist(), dist);
        } else if (type === 2) {
            this.renderElement($dist, this._getDist(), dist);
        }
    }

    /**
     * 渲染单个输入选择框
     * @param {*需要渲染的元素}  
     * @param {*渲染数据} data 
     * @param {*默认选中的id} sId 
     */
    renderElement($el, data, sId) {
        if (!data.length) {
            $el.hide().empty();
            return;
        }

        $el.html(() => {
            return data.map(({ value, label }) => {
                return `<option value="${value}" ${value * 1 === sId * 1 ? 'selected' : ''}>${label}</option>`;
            });
        }).show();
    }

    /**
     * 获取省
     */
    _getProvinceList() {
        return areaData;
    }

    /**
     * 根据省id查找下辖市级行政单位
     */
    _getCity() {
        const { province } = this.config;
        return (areaData.filter(item => item.value * 1 === province * 1)[0] || { children: [] })
            .children;
    }

    /**
     * 根据市id获取下辖区级行政单位
     */
    _getDist() {
        const { city } = this.config;
        const cityList = this._getCity();
        return (cityList.filter(item => item.value * 1 === city * 1)[0] || { children: [] })
            .children;
    }

    /**
     * 绑定选择事件
     */
    bindEvent() {
        const {
            $province,
            $city,
            $dist,
        } = this.config;
        const self = this;

        $province.on('change', function () {
            const $this = $(this);
            self.config.province = $this.val();
            self.config.city = self._getCity()[0].value;
            self.config.dist = self._getDist()[0].value;
            self.renderElements(1);
        });

        $city.on('change', function () {
            const $this = $(this);
            self.config.city = $this.val();
            self.config.dist = self._getDist()[0].value;
            self.renderElements(2);
        });

        $dist.on('change', function () {
            const $this = $(this);
            self.config.dist = $this.val();
            self.$trigger({
                type: AFTER_SELECTED,
                data: self.getSelectInfo(),
            });
        });
    }

    /**
     * 获取选择的信息
     */
    getSelectInfo() {
        const {
            $province,
            $city,
            $dist,
        } = this.config;
        return {
            province: $province.val(),
            city: $city.val(),
            dist: $dist.val(),
        };
    }

    /**
     * 完成选择回调函数
     * @param {*回调函数} fn 
     */
    onSelect(fn) {
        this.$on(AFTER_SELECTED, (event) => {
            fn && fn(event.data);
        });
    }
}

export default YAreaPicker;
