<template>
  <div class="b">
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
                <el-button type="default" class="fl" size="small" @click="openFormDialog('edit', scope.row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </template>
    </list-grid>
  </div>
</template>
<script>
/**
 * 版权信息
 */
import listGrid from '../../components/ListGrid/ListGrid';
export default {
  name: 'list',
  data() {
    return {
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }]
      }
  },
  created(){
  },

  props: [],

  components: {
    listGrid
  },

  computed: {

  },

  filters:{
    translateState(value){
      return {
        '0': '正常',
        '1': '不可见'
      }[value]
    }
  },


  methods: {
    
  }
}
</script>

<style scoped>

</style>
