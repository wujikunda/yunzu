<template>
  <div id = "userCenter">
    <section class="menuContent">
      <ul class="menuBox" v-for="(item, index) in menuList" :key="index">
        <p class="pTitle" @click="member">个人中心</p>
        <li v-for="(menu, id) in item.menuItem" :key="id" @click="menuClick(menu)" :class="{'active': getActiveClass(menu)}">
          <div class="iconBox">
            <img :src="menu.icon">
          </div>
          <div class="textBox">
            <span>{{menu.text}}</span>
          </div>
        </li>
      </ul>
      <div class="routerView">
        <router-view></router-view>
      </div>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  import Wave from 'base/wave/wave'
  import {userInfo} from 'api/setting'
  import {mapGetters, mapMutations} from 'vuex'
  export default {
    props: {
    },
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    data() {
      return {
        userimg: require('common/image/tab_center_normal.png'),
        menuList: [
          {
            menuItem:[
              // {icon:require('common/image/icon_dingdan.png'),text: '我的订单',type:'order'},
              {icon:require('common/image/icon_shoucang.png'),text: '我的收藏',type:'collect'},
              {icon:require('common/image/icon_duibi.png'),text: '我的对比',type:'compare'},
              {icon:require('common/image/icon_qianbao.png'),text: '我的钱包',type:'wallet'},
              {icon:require('common/image/icon_yuzhu.png'),text: '我要预租',type:'preLease'},
              {icon:require('common/image/icon_fankui.png'),text: '意见反馈',type:'suggest'},
              {icon:require('common/image/icon_lianxi.png'),text: '联系我们',type:'connect'},
              {icon:require('common/image/icon_shezhi.png'),text: '设置',type:'system'}

            ]
          }
        ]
      }
    },
    mounted() {
      this.initUserInfo()
    },
    methods: {
      member() {
        this.$router.push({
          path:'/pc/setting/member'
        })
      },
      initUserInfo() {
        let _this = this
        userInfo(localStorage.getItem('usertoken')).then((res) => {
          if(!res.code){
            _this.setUserInfo(res.data)
          }else{
            alert(res.msg)
          }
        })
      },
      getActiveClass(item) {
        return this.$route.path.indexOf(item.type) >-1
      },
      menuClick( item ) {
        this.$router.push({
          path:`/pc/setting/${item.type}`
        })
      },
      ...mapMutations({
        setUserInfo: 'SET_USER_INFO'
      })
    },
    components: {
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  #userCenter
    width 100%
    background-color $color-white
  .menuContent
    width 1200px
    margin 0 auto 
    padding 30px 0
    display flex
    justify-content space-between
  .menuBox
    background-color #f0f0f0
    width 200px
    box-sizing border-box
    line-height: 50px
    position relative
    .pTitle
      height 100px 
      width 140px
      margin 0 30px 20px 30px
      border-bottom 1px solid #ddd
      font-size 26px
      font-weight bold
      text-align center
      line-height 100px
      cursor pointer
    li
      height 45px
      margin 3px 0
      border-left 5px solid #f0f0f0
      &.active
        border-left 5px solid $color-theme
        color $color-theme
      .iconBox 
        float left
        width 60px
        height 45px
        padding-left 20px
        display flex
        align-items center
        justify-content center
        img 
          width 25px
          height 25px
      .textBox 
        cursor pointer
        border-bottom 1px solid $color-border
        box-sizing border-box
        text-align center
        line-height 45px
        width 150px
  .routerView
    width 900px
</style>