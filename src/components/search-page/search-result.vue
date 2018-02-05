<template>
  <div id = "searchResult" ref="homePage">
    <div class="home-list">
      <p class="noneFound" v-if="!homeList.length">搜索不到符合的房源 </p>
      <scroll ref="scroll" :data="homeList" class="home-list-content">
        <ul>
          <li @click="selcetHome(item)"  v-for="(item,key) in homeList" class="list-content" :key="key">
            <img class="posImg" :src="item.picurl" @load="loadImage" @error="loaderror"  >
            <div class="nameBox">
              <span>{{item.title}}</span>
              <span>{{item.pricename}}元/㎡ &nbsp&nbsp {{item.spacename}}㎡</span>
            </div>
            <div class="nameBox">
              <span class="hotNum"><img src="~common/image/icon_fire.png" alt="">{{item.hot}}</span>
              <span>{{houseType(item.housetype)}}</span>
            </div>
          </li>
        </ul>
      </scroll>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import {mapGetters, mapMutations} from 'vuex'
  export default {
    props: {
    },
    computed: {
      ...mapGetters([
        'homeList'
      ])
    },
    activated() {
      this.$refs.scroll.refresh()
    },
    methods: {
      houseType(id) {
        switch (id) {
          case '1':
            return '厂房仓库'
            break;
          case '2':
            return '办公写字楼'
            break;
          case '3':
            return '店面'
            break;
          case '4':
            return '住房'
            break;
          default: return ''
            break;
        }
      },
      loadImage() {
        this.$refs.scroll.refresh()
      },
      loaderror(event) {
        event.target.src = require('common/image/default_house.png')
      },
      selcetHome(item) {
        this.$router.push({
          path:`/home/detail/${item.listid}`
        })
        this.setHomeDetial(item)
      },
      ...mapMutations({
        setHomeDetial: 'SET_HOME_DETIAL'
      })
    },
    components: {
      Scroll
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  #searchResult
    position fixed
    left 0
    top 0
    z-index 2
    width 100%
    height 100%
    background $color-background
    .noneFound
      text-align center
      margin-top 100px
      font-size $font-size-large-x
    .home-list 
      position fixed
      width 100%
      height 100%
      .home-list-content 
        height 100%
        overflow hidden
      ul 
        width 100%
        font-size $font-size-medium-x
        .list-content
          display block
          margin-bottom 5px
          padding 15px
          background-color #fff
          .posImg
            display block
            width 100%
          .nameBox
            display flex
            justify-content space-between
            align-items center
            height 30px
            span 
              display flex
              align-items center 
              &.hotNum
                color red
              img 
                margin 10px
                width 15px
</style>