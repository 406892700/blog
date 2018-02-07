/*
 * YG组件 回款日历
 * @Author: Simple 
 * @Date: 2017-11-30 15:28:05 
 * @Last Modified by: Simple
 * @Last Modified time: 2017-12-11 09:51:00
 */
import $ from 'jquery';
import Event from '@/components/YEvent/YEvent';
import './YCalendar.scss';
import getcalendarTpl from './YCalendarTpl.html';
import Ajax from '../YAjax/YAjax';

const CHANGE = 'CHANGE'; // 发生切换
const AFTER_INIT = 'AFTER_INIT'; // 初始化完成以后
/**
 * 格式化date对象
 * @param {*格式化模板字符串} fmt 
 */
const formatDate = function (fmt) {
    const o = {
        'M+': this.getMonth() + 1, // 月份
        'd+': this.getDate(), // 日
        'h+': this.getHours(), // 小时
        'm+': this.getMinutes(), // 分
        's+': this.getSeconds(), // 秒
        'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
        S: this.getMilliseconds(), // 毫秒
    };
    
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (`${this.getFullYear()}`).substr(4 - RegExp.$1.length));
    }

    Object.keys(o).forEach((k) => {
        if (new RegExp(`(${k})`).test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : ((`00${o[k]}`).substr((`${o[k]}`).length)));
        }
    });
        
    return fmt;
};

class YCalendar extends Event {
    constructor($el, today) {
        super();
        this.$el = $el; // 日历容器
        this.today = new Date(today.replace('-', '/')); // 今日对象
        this.cacheData = {}; // 缓存数据对象
        this.init();
    }

    init() {
        this.getData(formatDate.call(this.today, 'yyyy-MM'), (data) => {
            this.convertData(data);
            this.render();
            const day = 
                this.cacheData.repayInfo[formatDate.call(this.today, 'yyyy-MM-dd')];

            const { 
                month,
            } = this.cacheData;

            this.$trigger({
                type: CHANGE,
                month,
                day,
            });
        });
        this.bindEvent();
    }

    /**
     * 加载新的月份
     * @param {*日期字符串} dateStr 
     */
    reload(dateStr) {
        this.getData(dateStr, (data) => {
            this.today = new Date(`${dateStr}-01`); // 修改当前日期
            this.convertData(data);
            this.render();
        });
    }

    render() {
        const dateList = [
            ...this.getRestPartOfLastMonth(),
            ...this.getCurrentMonth(),
            ...this.getRestPartOfNextMonth(),
        ];

        this.$el.html(getcalendarTpl({ 
            list: dateList, 
            repayInfo: this.cacheData.repayInfo,
            title: formatDate.call(this.today, 'yyyy年MM月'),
            today: formatDate.call(this.today, 'yyyy-MM-dd'),
        }));
    }

    /**
     * 获取月份回款信息
     */
    getData(time, fn) {
        new Ajax({
            url: '/member/collectCalendar',
            type: 'post',
            data: {
                time,
            },
        }).success((data) => {
            fn && fn(data);
        }).fail(() => {
            console.log('数据获取失败');
        });
    }

    /**
     * 转换数据函数
     * @param {*原始数据} data 
     */
    convertData(data) {
        const { 
            alreadyCapital, 
            alreadyCount, 
            alreadyInterest, 
            waitCapital, 
            waitCount, 
            waitInterest, 
            dayCollectList,
        } = data;

        this.cacheData = {
            month: {
                alreadyCapital,
                alreadyCount,
                alreadyInterest,
                waitCapital,
                waitCount,
                waitInterest,
            },
        };

        const tmpObj = {};

        dayCollectList.forEach((item) => {
            if (!tmpObj[item.collectTime]) {
                tmpObj[item.collectTime] = [item];
            } else {
                tmpObj[item.collectTime].push(item);
            }
        });

        this.cacheData.repayInfo = tmpObj;
    }

    // 格式化
    addZero(date) {
        date += '';
        return `00${date}`.slice(date.length);
    }

    /**
     * 获取当前月份
     */
    getCurrentMonth() {
        const arr = [];
        const year = formatDate.call(this.today, 'yyyy') * 1;
        const month = formatDate.call(this.today, 'MM') * 1;
        let lastDay;
        if (month === 12) {
            lastDay = new Date(new Date(`${year + 1}/01/01`).getTime() - (24 * 60 * 60 * 1000)).getDate();
        } else {
            lastDay = new Date(new Date(`${year}/${this.addZero(month + 1)}/01`).getTime() - (24 * 60 * 60 * 1000)).getDate();
        }

        for (let i = 1; i <= lastDay; i += 1) {
            arr.push({ date: `${year}-${this.addZero(month)}-${this.addZero(i)}`, text: i });
        } 

        return arr;
    }

    /**
     * 获取上一个月的最后几天
     */
    getRestPartOfLastMonth() {
        const year = formatDate.call(this.today, 'yyyy');
        const month = formatDate.call(this.today, 'MM');
        
        const firstDay = new Date(`${year}/${month}/01`);
        const weekDay = firstDay.getDay();

        const arr = [];

        arr.length = weekDay;
        
        return arr;
    }

    /**
     * 获取下一个月的最开始几天
     */
    getRestPartOfNextMonth() {
        const year = formatDate.call(this.today, 'yyyy') * 1;
        const month = formatDate.call(this.today, 'MM') * 1;
        const firstDay = month === 12 ? new Date(`${year + 1}/01/01`) : new Date(`${year}/${month + 1}/01`);

        const weekDay = firstDay.getDay();

        const arr = [];
        arr.length = (7 - weekDay) % 7;

        return arr;
    }

    bindEvent() {
        const self = this;
        // 日期点击
        this.$el.on('click', '.calendar_content span', function a() {
            const $this = $(this);
            const date = $this.data('date');
            const day = 
                self.cacheData.repayInfo[date];
            self.$el.find('.selected').removeClass('selected');
            $this.addClass('selected');

            const { 
                month,
            } = self.cacheData;

            self.$trigger({
                type: CHANGE,
                month,
                day,
            });
        });

        this.$el.on('click', '.filter_date .icon', function () {
            const $this = $(this);
            const year = self.today.getFullYear();
            const month = self.today.getMonth();
            let dateStr = '';

            if ($this.hasClass('prevMonth')) { // 点击前一个月（公元前和8000年后会报错）
                dateStr = month === 0 ? `${year - 1}-12` : `${year}-${self.addZero(month)}`;
            } else {
                dateStr = month === 11 ? `${year + 1}-01` : `${year}-${self.addZero(month + 2)}`;
            }

            self.reload(dateStr);
        });
    }

    /**
     * 完成初始化后的回调函数
     * @param {*回调函数} fn 
     */
    afterInit(fn) {
        this.$on(AFTER_INIT, ({ month, day }) => {
            fn && fn(month, day);
        });
        return this;
    }

    /**
     * 日期切换
     * @param {*回调函数} fn 
     */
    change(fn) {
        this.$on(CHANGE, ({ month, day }) => {
            fn && fn(month, day);
        });
        return this;
    }
}

export default YCalendar;
