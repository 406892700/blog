<template>
  <my-dialog  :visible="true" class="dialog-form" :before-close="handleClose" size="large">
    <template slot="title">
      {{dialogType == 'edit' ? '文章编辑' : '文章新增'}}
    </template>
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" placeholder="输入标题"></el-input>
      </el-form-item>

      <el-form-item label="类型" prop="type">
        <el-select v-model="form.type" placeholder="请选择文章类型">
          <el-option
            v-for="(item, index) in typeList"
            :key="index"
            :label="item.name"
            :value="item.nid">
          </el-option>
        </el-select>
        <!-- <el-input v-model="form.type" placeholder="输入类型"></el-input> -->
      </el-form-item>

      <el-form-item label="简介" prop="summary">
        <el-input v-model="form.summary" placeholder="输入简介"></el-input>
      </el-form-item>

      <el-form-item label="文章内容" prop="content">
        <!-- <tiny-mce :content.sync="form.content"></tiny-mce> -->
        <el-input type="hidden" v-model="form.content" placeholder="请输入文章内容" :autosize="{ minRows: 4, maxRows: 8}"></el-input>
      </el-form-item>

      <el-form-item label="文章状态" prop="state">
        <el-switch
          v-model="form.state"
          on-value="10"
          off-value="20"
          on-text="启用"
          off-text="禁用"
          on-color="#13ce66"
          off-color="#ff4949">
        </el-switch>
        <!-- <el-input type="textarea" v-model="form.state"></el-input> -->
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </span>
  </my-dialog>
</template>

<script>
import MyDialog from '../../components/MyDialog/MyDialog'
import { mapValidate } from '../../libs/mapValidate'
import fetch from '../../libs/fetch'
// import TinyMce from '@/components/TinyMce/TinyMce'
export default {
    props: ['args', 'dialogType', 'typeList'],
    data() {
      return {
        visible: true,
        urlEdit: '/article/edit',
        urlAppend: '/article/append',
        form: {
          id: '',
          type: '',
          title: '',
          summary: '',
          content: '',
          state: ''
        },
        rules: mapValidate({
          type: {required: true, eMsg: '请选择文章类型',trigger: 'change'},
          title: {required: true, eMsg: '请输入文章标题'},
          summary: {required: true, eMsg: '请输入文章简介'},
          content: {required: true, eMsg: '请输入文章内容'}
        })
      };
    },
    mounted(){
      let form = JSON.parse(JSON.stringify(this.args));
      !form.state ? (form.state = '10') : '';
      !form.type ? (form.type = '') : '';
      this.form = form;
    },
    computed: {

    },
    components: {
      MyDialog
    },
    methods:{
      handleClose(){
        this.$emit('update:visible', false)
        this.$refs['form'].resetFields();
      },
      onSubmit(){
        this.$refs['form'].validate((valid) => {
          if (valid) {
            fetch({
              url: this.dialogType == 'edit' ? this.urlEdit : this.urlAppend,
              data: this.form,
              method: 'post'
            }).then(result=>{
              this.$emit('success');
              this.handleClose();
              this.$message({
                type: 'info',
                message: '文章'+(this.dialogType == 'edit' ? '编辑' : '新增')+'成功！'
              });
            }).catch(err=>{

            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
}
</script>
<style>

</style>
