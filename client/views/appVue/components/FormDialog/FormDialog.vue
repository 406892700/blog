<template>
    <div class="app-list-grid">
      <slot name="dialog">
        <el-dialog title="提示" visible.sync="dialogVisible" size="tiny" :before-close="handleClose">
          <template slot="title"></template>
          <slot></slot>
          <span>这是一段信息</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          </span>
        </el-dialog>
      </slot>
    </div> 
</template>

<script>
    import fetch from '../../libs/fetch'
    /**
     * 版权信息
     */
    export default {
        name: 'form-dialog',
        data () {
            return {
              dialogVisible: false,
            }
        },
        created(){
          
        },
        methods: {
          handleClose() {
            this.dialogVisible = false;
          }
        },
        watch: {
          
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
