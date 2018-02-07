/*
 * YG组件事件系统核心类
 * @Author: Simple 
 * @Date: 2017-11-13 15:34:48 
 * @Last Modified by: Simple
 * @Last Modified time: 2018-01-09 16:49:57
 */

class EventTarget {
    constructor() {
        this.queue = {}; // 事件监听队列
    }

    /**
     * 设置事件监听
     * @param {*事件类型} type 
     * @param {* 事件处理函数} handler 
     */
    $on(type, handler) {
        if (this.queue[type] instanceof Array) { // 如果已经绑定过该次事件
            this.queue[type].push(handler);
        } else {
            this.queue[type] = [handler];
        }
    }

    /**
     * 触发事件
     * @param {*事件对象} event { type, target }
     */
    $trigger(event) {
        const handlers = this.queue[event.type];
        event.target = event.target || this;
        if (handlers instanceof Array && handlers.length) {
            handlers.forEach(item => item(event)); // 依次触发所有监听事件回调函数
        }
    }

    /**
     * 移除事件
     * @param {*事件类型} type 
     * @param {*事件处理函数} handler 
     */
    $off(type, handler) {
        const handlers = this.queue[type];
        let tempIndex;

        if (handlers instanceof Array && handlers.length) {
            handlers.forEach((item, index) => {
                if (item === handler) {
                    tempIndex = index;
                }
            });

            typeof tempIndex !== 'undefined' && handlers.splice(tempIndex, 1);
        }
    }
}

export default EventTarget;
