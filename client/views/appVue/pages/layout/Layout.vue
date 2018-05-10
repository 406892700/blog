<template>
  <div class="app-wrapper">
    <el-row>
      <el-col :span="24">
        <div class="app-top-bar">
          <el-menu theme="dark" class="el-menu-demo" mode="horizontal" :router="false">
            <el-col :span="4"><img src="/static/images/logo.png" alt="" width="100%" height="100%"></el-col>
            <el-col :span="20">
              <el-menu-item index="/index">首页</el-menu-item>

              <el-submenu index="userInfo" style="float: right;margin-right: 20px;">
                <template slot="title">simple</template>
                <el-menu-item index="1">修改密码</el-menu-item>
                <el-menu-item index="2">登出</el-menu-item>
              </el-submenu>
            </el-col>
          </el-menu>
        </div>
      </el-col>
    </el-row>
    <div class="app-container">
      <div class="app-left-bar">
        <el-menu default-active="2" class="el-menu-vertical-demo" theme="dark" @select="select">
          <el-submenu :index="index+''" v-for="(item, index) in router">
            <template slot="title">{{item.meta.title}}</template>
            <el-menu-item-group>
              <el-menu-item :index="`${item.path}/${innerItem.path}$$${innerItem.meta.title}`" v-for="(innerItem, innerIndex) in item.children">
                  {{innerItem.meta.title}}
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </div>
      <div class="app-content">
        <el-tabs v-model="tabActive.tabActive" @tab-click="handleClick" @tab-remove="handleRemove" closable>
          <el-tab-pane :label="item.title" :path="item.path" :index="index" :name="index+''" v-for="(item, index) in visitedPage"></el-tab-pane>
        </el-tabs>

        <div class="inner-content">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * 版权信息
 */
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';
import router from '../../router/router';
export default {
  name: 'index',
  data() {
    return {
        router
    }
  },
  created(){
  },

  props: [],

  components: {
  },

  computed: {
    ...mapState({
      visitedPage: state => state.visitedPage,
      tabActive: state => state,
      userInfo: state => state.userInfo,
      // leftMenu: state=> state.leftMenu.length ? state.leftMenu[0].subMenu : []//根目录不计算在内
    }),
    
  },

  methods: {
    ...mapActions({
      add: 'addVisitPage',
      setActive: 'setActive',
      removeTab: 'removeTab',
      loginOut: 'loginOut',
      clearTabs: 'clearTabs'
    }),
    //tab点击
    handleClick(tab, event) {
      this.setActive(tab.$attrs.index+'');
      this.$router.push({path: tab.$attrs.path});
    },
    //tab移除
    handleRemove(index){
      let nIndex = index*1;//需要删除的tab
      this.removeTab(nIndex).then(result=>{
        let cIndex = this.tabActive.tabActive*1;//当前选中的tab
        if(nIndex === cIndex){//如果要删除的是当前选中的tab
          this.setActive('0');
          this.$router.push({path: this.visitedPage[0].path})
        }else{//不是选中的
          if(nIndex < cIndex){//要删除下标大于当前选中的
            this.setActive(cIndex-1+'');
          }
        }
      }).catch(err=>{
        this.clearTabs();
        this.$router.push({path: '/index'});
      });

    },
    /**
     * 选中的情况
     */
    select(path){
      let arr = path.split('$$');
      path = {
        title: arr[1],
        path: arr[0]
      }

      if(this.visitedPage.every((item)=>{return item.path !== path.path })){//队列中没有
        this.setActive(this.visitedPage.length+'');
      }else{
        this.visitedPage.forEach((item, index)=>{
          item.path == path.path && this.setActive(index+'');
        });
      }

      this.add(path);
      this.$router.push(path);
    },
  }
}
</script>

<style lang="scss" scoped type="text/css">

</style>
