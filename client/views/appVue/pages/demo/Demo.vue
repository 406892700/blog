<template>
  <div class="b">
      {{msg}}<br>

      {{computedStr}}<br>
      {{methodStr()}}<br>
      {{fullName}}
      
  </div>
</template>
<script>
/**
 * 版权信息 重新学习vue的demo文件
 */
export default {
  name: 'list',
  data() {
    return {
        msg: 'heheh',
        name: 'simple',
        firstName: '怀远',
        lastName: '徐'
    }
  },
  created(){
      setInterval(function() {
          this.changeMsg();
          this.setFullName();
      }.bind(this), 2000)
  },

  props: [],

  components: {
    
  },

  computed: {
      computedStr() {
          return Date.now();
      },
      fullName: {
          //getter
          get() {
              return `${this.lastName} ${this.firstName}`;
          },
          // setter
          set(fullName) {
              let nameArr = fullName.split(' ');
              this.firstName = nameArr[1];
              this.lastName = nameArr[0];
          }
      }
  },

  methods: {
      changeMsg(){
          this.msg = 'hahahah'+Math.random();
      },
      methodStr(){
          return Date.now();
      },
      setFullName() {
          this.fullName = '徐 怀近';
      }
  },
  watch: {
      name(){
          console.log('msg changed');
      },
      firstName() {
          console.log('first has just change');
      },
      lastName() {
          console.log('last has just change');
      }
  }
}
</script>

<style scoped>

</style>
