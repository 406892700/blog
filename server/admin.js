const moment = require('moment');
const service = require('./service/service');

/*
 * 管理后台接口地址
 * @Author: Simple
 * @Date: 2018-02-08 16:54:24
 * @Last Modified by: Simple
 * @Last Modified time: 2018-02-08 17:51:41
 */

const express = require('express');
const router = express.Router();

router.get('/getArticleList', (req, res, next) => {
    const page = req.query.page || 1;
    const pageSize = req.query.pageSize || 5;

    service.getArticleList(page, pageSize, (result, total) => {
        const list = result.map((item) => {
            return {
                ...item,
                coversArr: item.covers.split(',').slice(0, 3),
                add_time: moment(item.add_time).format('YYYY-MM-DD HH:mm:ss')
            };
        });

        const totalPage = Math.ceil(total / pageSize);

        res.json({
            code: '200',
            result: {
                list,
                totalPage,
                pageSize,
            },
            msg: ''
        });
    });
});

module.exports = router;
