/*
 * 工具方法 tool
 * @Author: Simple
 * @Date: 2017-11-14 15:32:24
 * @Last Modified by: Simple
 * @Last Modified time: 2018-02-07 17:51:09
 */
import $ from 'jquery';
import Event from '@/components/YEvent/YEvent';
// import YAjax from '@/components/YAjax/YAjax';
// import YForm from '@/components/YForm/YForm';
import YCookie from '@/components/YCookie/YCookie';
// import YVCode from '@/components/YVCode/YVCode';
import YDialog from '@/components/YDialog/YDialog';
import YAlert from '@/components/YDialog/YAlert';
import YConfirm from '@/components/YDialog/YConfirm';
// import YPage from '@/components/YPage/YPage';
// import YList from '@/components/YList/YList';
import YCountDown from '@/components/YCountDown/YCountDown';

class Tool extends Event {
  constructor() {
    super();
  }

  /**
   * 列表加载工具函数
   * @param {*加载配置} config
   */
  renderList(config) {
    let yList = new YList(config).loaded(($el, data) => {
      new YPage({
        $el:config.$page,
        data
      }).onChange((args) => {
        yList.reload(args);
      })
    });

    return yList;
  }

  /**
   * 全局通用ajax方法
   * @param {*ajax参数，用法等同于$.ajax} config
   */
  Ajax(config) {
    return new YAjax(config);
  }

  /**
   * 表单验证方法
   * @param {*配置项目} options
   */
  formValid(options) {
    return new YForm(options);
  }

  /**
   * 发送验证码方法
   * @param {*配置项目} options
   */
  sendVCode(options) {
    return new YVCode(options);
  }

  /**
   * 弹窗
   * @param {*弹窗配置参数} config
   */
  Dialog(config){
    return new YDialog(config);
  }

  /**
   * alert
   * @param {*内容} content
   * @param {*回调函数} callback
   */
  Alert(content, callback) {
    return YAlert(content, callback);
  }

  /**
   * confirm
   * @param {*内容} content
   */
  Confirm(content) {
    return YConfirm(content);
  }

  /**
   * 设置cookie
   */
  setCookie = YCookie.setCookie;

  /**
   * 读取cookie
   */
  getCookie = YCookie.getCookie;

  /**
   * 删除cookie
   */
  delCookie = YCookie.delCookie;

  /**
   * 倒计时函数
   */
  countDown = (secondTime) => {
    return new YCountDown(secondTime);
  }

  /**
   * 获取url参数
   */
  getQueryField = (name) => {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return r[2];
    return null;
  }

  /**
   * 格式化date对象
   * @param {*格式化模板字符串} fmt 
   */
  formatDate = function (fmt) {
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
  

}

export default new Tool();
