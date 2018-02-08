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
const renderComments = (id, page = 1) => {
    $.ajax({
        url: `/comment/${id}/${page}`,
        data: {
            pageSize: 10
        }
    }).done(({ list, totalPage, page}) => {
        list = list.map((item) => {
            return {
                ...item,
                add_time: moment(item.add_time).format('YYYY-MM-DD hh:mm:ss')
            };
        });
        const $commentList = $('#commentList');
        $commentList.html(getCommentTpl({list}));
        // console.log(data);
        renderPageCtrl(totalPage, page);
    });
};

/**
 * 分页
 * @param {*} totalPage 
 * @param {*} page 
 */
const renderPageCtrl = (totalPage, page) => {
    const $pageCtrl = $('#pageCtrl');
    const list = [];
    for (let i = 1; i <= totalPage; i++) {
        list.push(`<a href="javascript:void(0)" class="${i == page ? 'active' : ''}" data-page="${i}" data-total="${totalPage}">${i}</a>`)
    }

    $pageCtrl.html(list.join(''));
};

const bindEvent = () => {
    const $pageCtrl = $('#pageCtrl');

    $pageCtrl.on('click', 'a', function() {
        const $this = $(this);
        const page = $this.data('page')*1;
        renderComments(id, page);
    });
};

$(() => {
    // T.Confirm(222);
    renderComments(id);
    bindEvent();
});

// hmr
if (module.hot) {
    module.hot.accept();
}
