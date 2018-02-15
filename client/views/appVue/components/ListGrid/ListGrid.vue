<template>
    <div class="app-list-grid" v-loading="loading">
      <slot name="list"
            :list="result.list" >
        <!-- 这里写入备用内容 -->
      </slot>
      <div class="pagination-bar">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="result.pageNum"
          :page-sizes="[5,10,20,40,60]"
          :page-size="pageSize"
          layout="prev, pager, next, sizes, jumper"
          :total="result.total">
        </el-pagination>
      </div>
    </div> 
</template>

<script>
    import fetch from '../../libs/fetch'
    /**
     * 版权信息
     */
    export default {
        name: 'list-grid',
        data () {
            return {
              result:{},
              pageSize: 5,
              pageNum: 1,
              loading: false
            }
        },
        created(){
          this.getListData();
        },
        methods: {
          /**
           * 分页按钮被点击
           * @param page
           */
          handleCurrentChange(page){
//            debugger;
              this.pageNum = page;
              this.getListData();
          },
          /**
           * pageSize改变
           * @param pageSize
           */
          handleSizeChange(pageSize){
            this.pageNum = 1;
            this.pageSize = pageSize;
            this.getListData();
          },
          /**
           * 获取数据列表
           */
          getListData(){
            this.loading = true;
            fetch({
              url: this.url,
              method: this.method || 'post',
              data: {
                ...this.args,
                pageSize: this.pageSize,
                pageNum: this.pageNum
              }
            }).then((result)=>{
                this.loading = false;
                result.pageNum = result.pageNum*1 || 1;
                this.result = result;
                this.fn  && this.fn(result);
            })
          }
        },
        watch: {
          // pageSize(){
          //   this.getListData();
          // },
          // pageNum(){
          //   this.getListData();
          // }
        },
        props: ['args', 'fn', 'url', 'method']
    }
</script>

<style>
  .pagination-bar{
    text-align: right;
    margin-top: 10px;
  }
</style>
