/**
 * 登录鉴权拦截器
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
module.exports = (req, res, next) => {
    console.log('先进入拦截器');
    next();
};
