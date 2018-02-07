/*
 * YG组件 图片剪切上传 简易版本（以满足现阶段业务为主,ie10兼容,ie9以及以下优雅降级）
 * @Author: Simple
 * @Date: 2017-12-12 16:43:37
 * @Last Modified by: Simple
 * @Last Modified time: 2017-12-12 17:38:38
 */

import T from '@/libs/tool';
import $ from 'jquery';
import Event from '@/components/YEvent/YEvent';
import getTpl from './YUpload.html';
import './YUpload.scss';

class YUpload extends Event {
    constructor(config) {
        super();
        this.config = $.extend({}, {
            url: '/file/avatarUpload',
            successFn() {
                T.Alert('图片上传成功!', () => {
                    window.location.reload();
                });
            },
            errorFn() {
                T.Alert('图片上传失败');
            },
        }, config);

        // 组件全局状态
        this.state = {
            left: 0,
            top: 0,
            base64: '',
            scale: 1,
        };

        // 状态更改函数
        this.setState = (state) => {
            this.state = $.extend({}, this.state, state);
        };

        this.$dialog;

        this.init();
    }

    init() {
        this.$dialog = T.Dialog({
            content: getTpl(this.testCompatibility()),
            width: '500px',
        }).onLoaded(($el) => {
            this.$el = $el.find('.YG-upload');
            setTimeout(() => {
                this.drag();
                this.selectPic();
                this.btnAreaEvent();
            });
        }).open();
    }

    /**
     * 必要的兼容性浏览器嗅探
     */
    testCompatibility() {
        const compatInfo = {
            FileReader: true,
            Canvas: true,
        };

        if (!window.FileReader) {
            compatInfo.FileReader = false;
        }

        if (!document.createElement('canvas').getContext) {
            compatInfo.Canvas = false;
        }

        return compatInfo;
    }

    /**
     * 选择图片操作
     */
    selectPic() {
        const $fakeBtn = this.$el.find('.select-pic .btn');
        const $realBtn = this.$el.find('.real-file-select');

        $fakeBtn.on('click', () => {
            $realBtn.trigger('click');
        });

        $realBtn.on('change', () => {
            const fr = new FileReader();

            if (!$realBtn[0].files.length) {
                return;
            }

            fr.readAsDataURL($realBtn[0].files[0]);

            fr.onload = (e) => {
                this.setState({
                    base64: e.target.result,
                });

                this.drawOpImg();
                this.drawPreview();
            };
        });
    }

    /**
     * 选择区域拖放
     */
    drag() {
        const $dragZone = this.$el.find('.drag-zone');
        const $opArea = this.$el.find('.op-area');

        const dragZoneWidth = $dragZone[0].offsetWidth;
        const dragZoneHeight = $dragZone[0].offsetHeight;

        const opAreaWidth = $opArea[0].offsetWidth;
        const opAreaHeight = $opArea[0].offsetHeight;

        const leftMax = opAreaWidth - dragZoneWidth;
        const topMax = opAreaHeight - dragZoneHeight;
        const leftMin = 0;
        const topMin = 0;

        // 获取有效范围内的位移量
        const getLegalValue = (left, top) => {
            const tmpObj = {
                left,
                top,
            };

            if (left * 1 < leftMin * 1) {
                tmpObj.left = leftMin;
            }

            if (left * 1 > leftMax * 1) {
                tmpObj.left = leftMax;
            }

            if (top * 1 < topMin * 1) {
                tmpObj.top = topMin;
            }

            if (top * 1 > topMax * 1) {
                tmpObj.top = topMax;
            }

            return tmpObj;
        };

        $dragZone.bind('mousedown', (eDown) => {
            let oLeft = eDown.clientX;
            let oTop = eDown.clientY;
            const move = (eMove) => { // 拖动函数
                const offsetLeft = eMove.clientX - oLeft;
                const offsetTop = eMove.clientY - oTop;

                const styleLeft = $dragZone.css('left').slice(0, -2) * 1;
                const styleTop = $dragZone.css('top').slice(0, -2) * 1;

                const pObj = getLegalValue(styleLeft + offsetLeft, styleTop + offsetTop);

                $dragZone.css({ left: `${pObj.left}px`, top: `${pObj.top}px` });
                this.setState({ // 设置位置状态
                    left: pObj.left,
                    top: pObj.top,
                });

                this.drawPreview(); // 绘制预览图

                oLeft = eMove.clientX;
                oTop = eMove.clientY;
            };

            const mouseup = () => { // 鼠标抬起函数
                $opArea.unbind('mousemove', move);// 清除拖动
            };

            $opArea.bind('mousemove', move);// 绑定
            $opArea.bind('mouseup', mouseup);// 绑定
        });
    }

    /**
     * 绘制操作区
     */
    drawOpImg() {
        const $opImg = this.$el.find('.op-img');
        $opImg[0].src = this.state.base64;
    }

    /**
     * 头像预览
     */
    drawPreview() {
        const $canvas = this.$el.find('canvas')[0];
        const ctx = $canvas.getContext('2d');
        const { left, top, base64 } = this.state;
        const width = this.$el.find('.op-area')[0].offsetWidth;
        const $img = new Image();
        $img.src = base64;

        $img.onload = () => {
            const height = (width / $img.naturalWidth) * $img.naturalHeight;
            ctx.drawImage($img, -left, -top, width, height);
        };
    }

    /**
     * 获取待上传头像 base64方式
     */
    getBase64Img() {
        return this.$el.find('canvas')[0].toDataURL();
    }

    /**
     * 开始上传
     */
    upload() {
        const { successFn, errorFn, url } = this.config;
        T.Ajax({
            url,
            data: {
                avatar: this.getBase64Img(),
            },
            type: 'post',
        }).success((result) => {
            successFn && successFn(result);
        }).error((data) => {
            errorFn && errorFn(data);
        }).fail(() => {
        });
    }

    /**
     * 底部按钮事件
     */
    btnAreaEvent() {
        const $btnDone = this.$el.find('.btn-done');
        const $btnCancel = this.$el.find('.btn-cancel');

        $btnDone.on('click', () => {
            this.upload();
        });

        $btnCancel.on('click', () => {
            this.$dialog.close();
        });
    }
}

export default YUpload;
