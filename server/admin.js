const moment = require('moment');
const service = require('./service/service');

/*
 * 管理后台接口地址
 * @Author: Simple
 * @Date: 2018-02-08 16:54:24
 * @Last Modified by: Simple
 * @Last Modified time: 2018-05-08 17:16:37
 */

const express = require('express');
const router = express.Router();

router.post('/getArticleList', (req, res, next) => {
    const pageNum = req.body.pageNum || 1;
    const pageSize = req.body.pageSize || 5;

    service.getArticleList(pageNum, pageSize, (result, total) => {
        const list = result.map((item) => {
            return {
                ...item,
                coversArr: item.covers.split(',').slice(0, 3),
                add_time: moment(item.add_time).format('YYYY-MM-DD HH:mm:ss'),
                modify_time: moment(item.modify_time).format('YYYY-MM-DD HH:mm:ss')
            };
        });

        const totalPage = Math.ceil(total / pageSize);

        res.json({
            code: '200',
            result: {
                list,
                total,
                totalPage,
                pageSize,
                pageNum
            },
            msg: ''
        });
    });
});

module.exports = router;
