/*
 * YG组件 cookie
 * @Author: Simple
 * @Date: 2017-11-14 19:14:57
 * @Last Modified by: Simple
 * @Last Modified time: 2017-12-05 15:32:45
 */

class YCookie {
    /**
     * 设置cookie
     * @param name 键名
     * @param value 键值
     * @param days 过期时间(天数)
     */
    setCookie(name, value, days) {
        const exp = new Date();
        days = days || 365;
        exp.setTime(exp.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${decodeURIComponent(value)};expires=${exp.toGMTString()};path=/`;
        return this;
    }

    /**
     * 读取cookie
     * @param name 键名
     * @returns {null}
     */
    getCookie(name) {
        const reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`);
        this.arr = document.cookie.match(reg);
        if (this.arr) {
            return decodeURIComponent(this.arr[2]);
        }
        return null;
    }

    /**
     * 删除cookie
     * @param name 键名
     */
    delCookie(name) {
        const exp = new Date();
        exp.setTime(exp.getTime() - 1);
        const cval = this.getCookie(name);
        if (cval != null) {
            document.cookie = `${name}=${cval};expires=${exp.toGMTString()}`;
        }
        return this;
    }
}

export default new YCookie();
