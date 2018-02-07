/*
 * generator 处理异步回调嵌套的问题
 * @Author: Simple
 * @Date: 2018-02-07 15:49:20
 * @Last Modified by: Simple
 * @Last Modified time: 2018-02-07 15:49:51
 */

module.exports = function(gen){
    var gen_obj = gen(resume);
    function resume() {
        gen_obj.next(arguments);
    }
    gen_obj.next();
};
