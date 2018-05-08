<template>
  <div class="b">
    <div class="app-list-bar">
      <el-button type="default" @click="openDialog('add')">新增</el-button>
    </div>
    <list-grid  :args="{}" :url="'/getArticleList'" ref="dataList">
      <template slot="list" scope="props">
        <div class="list">
          <el-table :data="props.list" border >
            <el-table-column prop="title" label="标题" ></el-table-column>
            <el-table-column prop="add_time" label="添加时间" ></el-table-column>
            <!-- <el-table-column prop="content" label="内容" ></el-table-column> -->
            <el-table-column prop="modify_time" label="修改时间" ></el-table-column>
            <el-table-column prop="state" label="状态" >
              <template scope="scope">
                {{scope.row.state | translateState}}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="190" fixed="right">
              <template scope="scope">
                <el-button type="default" class="fl" size="small" @click="openDialog('edit', scope.row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </template>
    </list-grid>
    <article-list-dialog 
      :visible.sync="visibleFormDialog" 
      v-if="visibleFormDialog" 
      :dialogType="dialogType" 
      :typeList="typeList" 
      :args="args" 
      @success="signSuccess"/>
  </div>
</template>
<script>
/**
 * 版权信息
 */
import listGrid from '../../components/ListGrid/ListGrid';
import ArticleListDialog from './ArticleListDialog';
export default {
  name: 'list',
  data() {
    return {
        visibleFormDialog: false,
        dialogType: '编辑',
        typeList: [],
        args: {},
    }
  },
  created(){
  },

  props: [],

  components: {
    listGrid,
    ArticleListDialog
  },

  computed: {

  },

  filters:{
    translateState(value){
      return {
        '1': '正常',
        '2': '不可见'
      }[value]
    }
  },


  methods: {
    signSuccess() {
      console.log('弹窗关闭');
    },
    openDialog(type) {
      this.dialogType = type;
      this.visibleFormDialog = true;
    }
  }
}
</script>

<style scoped>

</style>
