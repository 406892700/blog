/*
 * YG组件 倒计时
 * @Author: Simple
 * @Date: 2017-11-21 13:35:16
 * @Last Modified by: Simple
 * @Last Modified time: 2017-12-05 15:41:29
 */

import Event from '@/components/YEvent/YEvent';

const COUNTING = 'COUNTING'; // 倒计时中
const END = 'END'; // 倒计时结束

class YCountDown extends Event {
    constructor(secondTime) {
        super();
        this.secondTime = secondTime * 1;
        this.timer = undefined;

        this.init();
    }

    init() {
        this.countTime();
    }

    /**
     * 倒计时函数
     */
    countTime() {
        this.timer = window.setInterval(() => {
            this.$trigger({ // 触发进行中
                type: COUNTING,
                time: this.parseDate(this.secondTime),
            });

            if (this.secondTime <= 0) {
                window.clearInterval(this.timer);

                this.$trigger({ // 触发结束
                    type: END,
                });
            }
            this.secondTime -= 1;
        }, 1000);
    }

    /**
     * 将秒数转换为时间对象
     * @param {*秒数} secondTime
     */
    parseDate(secondTime) {
        let time = {
            day: '00',
            hour: '00',
            minute: '00',
            second: parseInt(secondTime),
        };

        if (parseInt(secondTime) > 60) {
            const second = parseInt(secondTime) % 60;
            let min = parseInt(secondTime / 60);
            time = {
                day: '00',
                hour: '00',
                minute: min,
                second,
            };

            if (min > 60) {
                min = parseInt(secondTime / 60) % 60;
                let hour = parseInt(parseInt(secondTime / 60) / 60);
                time = {
                    day: '00',
                    hour,
                    minute: min,
                    second,
                };

                if (hour > 24) {
                    hour = parseInt(parseInt(secondTime / 60) / 60) % 24;
                    const day = parseInt(parseInt(parseInt(secondTime / 60) / 60) / 24);
                    time = {
                        day,
                        hour,
                        minute: min,
                        second,
                    };
                }
            }
        }

        return time;
    }

    /**
     * 倒计时进行中
     * @param {*回调钩子函数} fn
     */
    onCount(fn = () => {}) {
        this.$on(COUNTING, ({
            time,
        }) => {
            fn(time);
        });

        return this;
    }

    /**
     * 倒计时结束
     * @param {*回调钩子函数} fn 
     */
    onEnd(fn = () => {}) {
        this.$on(END, () => {
            fn();
        });

        return this;
    }
}

export default YCountDown;
