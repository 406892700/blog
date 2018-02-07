import './index.scss';
import '@/common/common';
import $ from 'jquery';
import T from '@/libs/tool';

/**
 * 获取文章评论
 * @param {*文章id} id 
 */
const getComments = (id) => {
    alert(3333);
};

$(() => {
    T.Alert(222);
    // getComments();
});

// hmr
if (module.hot) {
    module.hot.accept();
}
