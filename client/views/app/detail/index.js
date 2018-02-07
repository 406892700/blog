import './index.scss';
import '@/common/common';
import $ from 'jquery';
import T from '@/libs/tool';
import getCommentTpl from './commentTpl.html';
import moment from 'moment';

const id = /\/([^\/]+)$/.exec(location.pathname)[1]; // id
/**
 * 获取文章评论
 * @param {*文章id} id 
 */
const getComments = (id, page = 1) => {
    $.ajax({
        url: `/comment/${id}/${page}`,
        data: {
            pageSize: 3
        }
    }).done(({ list, totalPage, page }) => {
        list = list.map((item) => {
            return {
                ...item,
                add_time: moment(item.add_time).format('YYYY-MM-DD hh:mm:ss')
            };
        });
        const $commentList = $('#commentList');
        $commentList.html(getCommentTpl({list}));
        // console.log(data);
    });
};

$(() => {
    // T.Confirm(222);
    getComments(id);
});

// hmr
if (module.hot) {
    module.hot.accept();
}
