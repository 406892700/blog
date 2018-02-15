const express = require('express');
// const proxyMiddleware = require('http-proxy-middleware');
// const consolidate = require('consolidate');
const path = require('path');
const mixin = require('./server/tool/mixin');
const config = require('./config/config');
const bodyParser = require('body-parser');

const app = express();

// 添加json解析
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
const App = require('./server/index')(app);

const isDev = process.env.NODE_ENV !== 'production';

if (isDev) {
    const opn = require('opn');
    // const fallback = require('express-history-api-fallback');
    const gulp = require('gulp');
    const webpack = require('webpack');
    const webpackConfig = require('./webpack.dev.config');
    const compiler = webpack(webpackConfig);

    const devMiddleware = require('webpack-dev-middleware')(compiler, {
        publicPath: webpackConfig.output.publicPath,
        quiet: true,
    });
    
    const hotMiddleware = require('webpack-hot-middleware')(compiler, {
        log: () => {},
    });
    
    gulp.watch([
        './client/**/*.html',
        './static/*.*'], (e) => {
        console.log(`${e.path} has ${e.type}, reload current page~`);
        hotMiddleware.publish({ action: 'reload' });
    });
    
    // app.use(fallback('index.html', { root: __dirname + './static'}));
    
    app.use(devMiddleware);
    
    app.use(hotMiddleware);
    
    // 指定静态资源文件夹
    app.use(express.static(path.join(__dirname, './client')));
    app.set('views', path.resolve(__dirname, './client/views'));
    
    devMiddleware.waitUntilValid(() => {
        console.log('构建开始...');
        // opn('http://localhost:3001');
    });

} else {
    // 指定静态资源文件夹
    app.use(express.static(path.join(__dirname, './dist/client')));
    app.set('views', path.resolve(__dirname, './dist/client/views'));
}

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// 主工程模块
app.get('/admin', (req, res, next) => {
    const contentBase = config.framework === 'vue' ? 'appVue' : 'appReact';
    mixin(res).render(contentBase, {});
});

// 活动模块
app.use('/', App);

process.on('uncaughtException', (err) => {
    console.log(err);
});

app.listen(3001);
