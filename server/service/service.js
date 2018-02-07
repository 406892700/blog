const pool = require('../tool/connection');
const ASYNC = require('../tool/async');

/**
 * 获取文章列表
 * @param {* 当前页面} page 
 * @param {* 页面大小} pageSize 
 * @param {* 回调函数} callback 
 */
const getArticleList = (page, pageSize, callback) => {
    pool().then((connection) => {
        ASYNC(function *gen(cb) {
            const result1 = yield connection.query(`select count(*) as total from t_article`, cb);
            const result2 = yield connection.query(`select * from t_article LIMIT ${pageSize} OFFSET ${(page-1)*pageSize}`, cb);
        
            connection.release();

            if (result1[0] || result2[0]) {
                throw result1[0] || result2[0];
            } else {
                callback(result2[1], result1[1][0].total);
            }

        });
    });
};

/**
 * 获取文章详情
 * @param {* 文章id} id 
 * @param {* 回调函数} callback 
 */
const getArticleDetail = (id, callback) => {
    pool().then((connection) => {
        ASYNC(function *gen(cb) {
            const result = yield connection.query(`select * from t_article where id = ${id}`, cb);
            connection.release();

            if (result[0]) {
                throw result[0];
            } else {
                callback(result[1][0]);
            }
        });
    });
};

/**
 * 根据文章获取评论
 * @param {* 文章id} id 
 * @param {* 当前页} page 
 * @param {* 页面大小} pageSize 
 * @param {* 回调函数} callback 
 */
const getComments = (id, page, pageSize, callback) => {
    pool().then((connection) => {
        ASYNC(function *gen(cb) {
            const result1 = yield connection.query(`select count(*) as total from t_comment`, cb);
            const result2 = yield connection.query(`select * from t_comment where aId = ${id} LIMIT ${pageSize} OFFSET ${(page-1)*pageSize}`, cb);
        
            connection.release();

            if (result1[0] || result2[0]) {
                throw result1[0] || result2[0];
            } else {
                callback(result2[1], result1[1][0].total);
            }
        });
    });
};

module.exports = {
    getArticleList,
    getArticleDetail,
    getComments
};
