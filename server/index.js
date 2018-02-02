const express = require('express');
const mixin = require('./tool/mixin');

const router = express.Router();

router.get('/', (req, res) => {
    mixin(res).render('app/index', {});
});

module.exports = router;
