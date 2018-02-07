/*
 * YG组件 confirm
 * @Author: Simple 
 * @Date: 2017-11-15 17:34:23 
 * @Last Modified by: Simple
 * @Last Modified time: 2017-12-05 16:23:00
 */

import YDialog from './YDialog';
import Event from '@/components/YEvent/YEvent';

const DONE = 'DONE'; // 确定
const CANCEL = 'CANCEL'; // 取消
class YConfirm extends Event {
    constructor(content, btnText = ['确定', '取消']) {
        super();
        this.content = `<div style="padding: 20px;text-align: left;">${content}</div>`;
        this.btnText = btnText;

        return this.init();
    }

    init() {
        const {
            content,
            btnText,
        } = this;
        new YDialog({
            width: '50%',
            content,
            btns: btnText,
            cache: false,
            close: false,
            full: false,
            mask: true,
        }).then(($btn, index) => {
            if (index === 0) {
                this.$trigger({
                    type: DONE,
                });
            } else {
                this.$trigger({
                    type: CANCEL,
                });
            }
        }).open();
        return this;
    }

    /**
     * 点击了确定
     * @param {*回调钩子函数} fn 
     */
    done(fn) {
        this.$on(DONE, fn);
        return this;
    }

    /**
     * 点击了取消
     * @param {*回调钩子函数} fn 
     */
    cancel(fn) {
        this.$on(CANCEL, fn);
        return this;
    }
}

export default (content, btnText) => {
    return new YConfirm(content, btnText);
};
