<template>
  <el-dialog
    :title="title"
    :modal="modal"
    :modalAppendToBody="modalAppendToBody"
    :lockScroll="lockScroll"
    :closeOnClickModal="closeOnClickModal"
    :customClass="customClass"
    :top="top"
    :onClose="onClose"
    :visible.sync="visible"
    :size="fullScreen ? 'full' : size"
    :before-close="beforeClose"
    class="dialog-form">
    <template slot="title">
      <span @click="handleFullScreen" :class="className"></span>
      <slot name="title"></slot>
    </template>
    <slot></slot>
    <div slot="footer" class="dialog-footer">
      <slot name="footer"></slot>
    </div>
  </el-dialog>
</template>

<script>

export default {
    props: {
      title: {
        type: String,
        default: ''
      },

      onClose: Function,
      visible: {
        type: Boolean,
        default: false
      },

      modal: {
        type: Boolean,
        default: true
      },

      modalAppendToBody: {
        type: Boolean,
        default: true
      },

      lockScroll: {
        type: Boolean,
        default: true
      },

      closeOnClickModal: {
        type: Boolean,
        default: true
      },

      closeOnPressEscape: {
        type: Boolean,
        default: true
      },

      showClose: {
        type: Boolean,
        default: true
      },

      size: {
        type: String,
        default: 'small'
      },

      customClass: {
        type: String,
        default: ''
      },

      top: {
        type: String,
        default: '15%'
      },
      beforeClose: Function
    },
    data() {
      return {
        fullScreen: false
      };
    },
    mounted(){

    },
    computed: {
      className(){
        if(this.fullScreen){
          return 'icon-ctrl-screen min';
        }

        return 'icon-ctrl-screen';
      }
    },
    methods:{
      handleFullScreen(){
        this.fullScreen = !this.fullScreen;
      },
      beforeCloseInternal(){
        //this.$emit('update:visible',false);
        this.onClose && this.onClose();

      }
    },
    watch:{
      
    }
}
</script>
