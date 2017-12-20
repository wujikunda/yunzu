<template>
  <div class="header">
    <section class="headCont">
      <div class="logoBox">
        <img class="logo" src="~common/image/login_admin.png">
      </div>
      <div class="tab" >
        <div v-for="(item,index) in routerObj" :key="index"  class="tab-items">
          <div class="tab-item" style="cursor:pointer" @click="tabClick(item)">
            <img class="tab-icon" :src="item.incoPath">
            <span class="tab-link">{{item.title}}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  import {changeImage} from 'common/js/dom'
  export default{
    data() {
      return {
        routerObj: [
          {path: '/pc/home', incoPath: require('common/image/icon_xiugai.png'), title: '修改密码'},
          {path: '/pc/compareList', incoPath: require('common/image/btn_logout.png'), title: '安全退出'}
        ],
        tabIconList: [],
      }
    },
    computed: {
    },
    mounted() {
    },
    methods: {
      tabClick(item){
        console.log(item.title)
      }
    },
    components: {
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
.header
  background-color: $color-white
  box-shadow 0px 3px 3px -3px #bbb
  margin-bottom 3px
.headCont 
  width 100%
  box-sizing border-box
  padding 0 30px
  display flex
  height 100px
  align-items center
  justify-content space-between
  .logoBox
    display flex
    height 100px
    margin-left 20px
    align-items center
  .logo
    height 28px
.tab 
  display flex
  font-size: $font-size-medium;
  .tab-items 
    &>.router-link-active 
      .tab-link 
        color: $color-theme;
  .tab-item 
    display block
    padding 10px
    box-sizing border-box
    text-align center
    .tab-link 
      color: $color-text-l
      line-height: 20px
      display : block
    .tab-icon 
      width 25px
      padding 5px
</style>