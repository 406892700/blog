/*
 * 数据库连接获取函数
 * @Author: Simple
 * @Date: 2018-02-07 11:12:37
 * @Last Modified by: Simple
 * @Last Modified time: 2018-02-07 16:07:08
 */

const mysql = require('mysql');
const  { $CFG } = require('../../config/config');
const pool  = mysql.createPool({
    connectionLimit: $CFG.DB_POOL_LIMIT,
    host           : $CFG.DB_HOST,
    port           : $CFG.DB_PORT,
    user           : $CFG.DB_USER,
    password       : $CFG.DB_PWD,
    database       : $CFG.DB
});

module.exports = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            } else {
                resolve(connection);
            }
        });
    });
};
