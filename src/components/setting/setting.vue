<template>
  <div id = "userCenter">
    <scroll ref="scroll" :data="menuList" class="setting-content">
      <section>
        <wave class="waveBox">
          <div class="warpContent" @click="member">
            <div class="imgBox">
              <img :src="userInfo.logo " alt="" @error="_loadError">
            </div>
            <div class="userConte">
              <b>{{userInfo.nickname}}</b>
              <span>{{userInfo.phone}}</span>
            </div>
          </div>
        </wave>
        <section class="menuContent">
          <ul class="menuBox" v-for="(item, index) in menuList" :key="index">
            <li v-for="(menu, id) in item.menuItem" :key="id" @click="menuClick(menu)">
              <div class="iconBox">
                <img :src="menu.icon">
              </div>
              <div class="textBox">
                <span>{{menu.text}}</span>
                <div class="toPage">
                  <img src="~common/image/icon_arror_right.png" >
                </div>
              </div>
            </li>
          </ul>
        </section>
        
      </section>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import Wave from 'base/wave/wave'
  import Scroll from 'base/scroll/scroll'
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
        menuList: [
          {
            menuItem:[
              // {icon:require('common/image/icon_dingdan.png'),text: '我的订单',type:'order'},
              {icon:require('common/image/icon_shoucang.png'),text: '我的收藏',type:'collect'},
              {icon:require('common/image/icon_duibi.png'),text: '我的对比',type:'compare'},
              {icon:require('common/image/icon_qianbao.png'),text: '我的钱包',type:'wallet'}
            ]
          },
          {
            menuItem:[
              {icon:require('common/image/icon_fankui.png'),text: '意见反馈',type:'suggest'},
              {icon:require('common/image/icon_lianxi.png'),text: '联系我们',type:'connect'},
              {icon:require('common/image/icon_shezhi.png'),text: '系统设置',type:'system'}
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
          path:'setting/member'
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
      _loadError(event) {
        event.target.src = require('common/image/tab_center_normal.png')
      },
      menuClick( item ) {
        this.$router.push({
          path:`setting/${item.type}`
        })
      },
      ...mapMutations({
        setUserInfo: 'SET_USER_INFO'
      })
    },
    components: {
      Wave,
      Scroll
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .setting-content
    height 100%
    position fixed
    width 100%
    overflow hidden
  .waveBox
    .warpContent
      height 100px
      top 25px
      color white
      .imgBox
        float left
        margin 10px 0px 10px 50px
        background-color #fff
        border-radius 50%
        height 60px
        box-sizing border-box
        img
          width 60px
          height 60px
          border-radius 50%
      .userConte
        margin-left 130px
        padding 10px 0
        b,span 
          display block
          line-height 30px
          font-size $font-size-large
  .menuContent
    padding-bottom 60px
  .menuBox
    background: $color-white
    width 100%
    margin-bottom 10px
    box-sizing border-box
    line-height: 30px
    position relative
    li
      height 45px
      .iconBox 
        float left
        width 65px
        height 45px
        display flex
        align-items center
        justify-content center
        img 
          width 25px
          height 25px
      .textBox 
        border-bottom 1px solid $color-border
        box-sizing border-box
        line-height 45px
        display flex
        align-items center
        justify-content space-between
        width calc(100% - 65px)
        .toPage 
          display flex
          align-items center
          margin-right 20px
          img 
            height 12px
</style>