/*
 * YG Alert组件
 * @Author: Simple 
 * @Date: 2017-11-15 17:10:21 
 * @Last Modified by: Simple
 * @Last Modified time: 2017-12-05 16:23:21
 */

import YDialog from './YDialog';

export default (content, callback) => {
    return new YDialog({
        width: '40%',
        cache: false,
        close: false,
        full: false,
        mask: true,
        content: `<div style="padding: 20px;text-align: left;">${content}</div>`,
        btns: [
            ['确定'],
        ],
    }).then(() => {
        callback && callback();
    }).open();
};
