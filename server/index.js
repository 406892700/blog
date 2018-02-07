const express = require('express');
const mixin = require('./tool/mixin');
const service = require('./service/service');
const moment = require('moment');

const router = express.Router();

/**
 * 首页
 */
router.get('/', (req, res) => {
    const page = req.query.page || 1;
    const pageSize = req.query.pageSize || 5;

    service.getArticleList(page, pageSize, (result, total) => {
        const list = result.map((item) => {
            return {
                ...item,
                coversArr: item.covers.split(',').slice(0, 3),
                add_time: moment(item.add_time).format('YYYY-MM-DD h:mm:ss')
            };
        });

        const totalPage = Math.ceil(total / pageSize);
        mixin(res).render('app/index', { list, page, totalPage });
    });
});

/**
 * 博文详情
 */
router.get('/detail/:id', (req, res) => {
    const id = req.params.id;
    service.getArticleDetail(id, (result) => {
        result.add_time = moment(result.add_time).format('YYYY-MM-DD h:mm:ss');
        mixin(res).render('app/detail', { result });
    });
});

/**
 * 获取评论列表
 */
router.get('/comment/:id/:page', (req, res) => {
    const id = req.params.id;
    const page = req.params.page;
    const pageSize = req.query.pageSize || 5;

    service.getComments(id, page, pageSize, (result, total) => {
        const totalPage = Math.ceil(total / pageSize);

        res.json({
            list: result,
            totalPage,
            page
        });
    });

});

/**
 * 相册
 */
router.get('/gallery', (req, res) => {
    mixin(res).render('app/gallery', {});
});

module.exports = router;
