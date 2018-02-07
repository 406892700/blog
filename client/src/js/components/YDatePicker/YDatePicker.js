/**
 * 日期区间选择器
 */
import Pikaday from './pikaday';
import './pikaday.scss';

export default (start, end, callback) => {
    console.log(Pikaday);
    let startDate;
    let endDate;

    const addZero = (num) => {
        num = `${num}`;
        if (num.length === 1) {
            return `0${num}`;
        } 
        
        return num;
    };

    const formartDate = function (date, type) {
        if (type !== 1) {
            return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日';
        } else {
            return date.getFullYear() + '-' + addZero(date.getMonth() + 1) + '-' + addZero(date.getDate());
        }
    };

    const updateStartDate = function () {
        startPicker.setStartRange(startDate);
        endPicker.setStartRange(startDate);
        endPicker.setMinDate(startDate);
    };

    const updateEndDate = function () {
        startPicker.setEndRange(endDate);
        startPicker.setMaxDate(endDate);
        endPicker.setEndRange(endDate);
    };

    const startPicker = new Pikaday({
        field: start,
        minDate: new Date(1970, 1, 1),
        maxDate: new Date(2050, 12, 31),
        onSelect: function a() {
            start.value = formartDate(startPicker.getDate(), 1);
            startDate = this.getDate();
            updateStartDate();
            if (endPicker.getDate() !== null) {
                callback(formartDate(startPicker.getDate(), 1), formartDate(endPicker.getDate(), 1));
            }
        },
        i18n: {
            previousMonth: '上个月',
            nextMonth: '下个月',
            months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            weekdays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            weekdaysShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
        },
    });

    const endPicker = new Pikaday({
        field: end,
        minDate: new Date(),
        maxDate: new Date(2050, 12, 31),
        onSelect: function a() {
            end.value = formartDate(endPicker.getDate(), 1);
            endDate = this.getDate();
            updateEndDate();
            if (startPicker.getDate() !== null) {
                callback(formartDate(startPicker.getDate(), 1), formartDate(endPicker.getDate(), 1));
            }
        },
        i18n: {
            previousMonth: '上个月',
            nextMonth: '下个月',
            months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            weekdays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            weekdaysShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
        },
    });

    const _startDate = startPicker.getDate();
    const _endDate = endPicker.getDate();

    if (_startDate) {
        startDate = _startDate;
        updateStartDate();
    }

    if (_endDate) {
        endDate = _endDate;
        updateEndDate();
    }

    return {
        reset: () => {
            start.value = '';
            end.value = '';
            startPicker.setDate('');
            endPicker.setDate('');
            startPicker.setStartRange('');
            endPicker.setEndRange('');
            startPicker.setMinDate('');
            startPicker.setMaxDate('');
            endPicker.setMinDate('');
            endPicker.setMaxDate('');

            // startPicker.draw(true);
            // endPicker.draw(true);
        },
    };
};
