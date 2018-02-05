<template>
  <div id = "searchResult" ref="homePage">
    <div class="home-list">
      <p class="noneFound" v-if="!homeList.length">搜索不到符合的房源 </p>
      <div class="home-list-content">
        <ul>
          <li @click="selcetHome(item)"  v-for="(item,key) in homeList" class="list-content" :key="key">
            <div class="pictureBox">
              <img class="posImg" :src="item.picurl" @load="loadImage" @error="loaderror"  >
            </div>
            <div class="textBox">
              <div class="nameBox">
                <p>{{item.title}}</p>
              </div>
              <div class="nameBox">
                <span>{{item.pricename}}元/㎡ &nbsp&nbsp {{item.spacename}}㎡</span>
                <span>{{houseType(item.housetype)}}</span>
              </div>
              <div class="nameBox">
                <span class="hotNum"><img src="~common/image/icon_fire.png" alt="">{{item.hot}}</span>
              </div>
            </div>
          </li>
      </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
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
        if (!this.checkloaded) {
          this.checkloaded = true
        }
      },
      loaderror(event) {
        event.target.src = require('common/image/default_house.png')
      },
      selcetHome(item) {
        this.$router.push({
          path:`/pc/home/detail/${item.listid}`
        })
        this.setHomeDetial(item)
      },
      ...mapMutations({
        setHomeDetial: 'SET_HOME_DETIAL'
      })
    },
    components: {
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  #searchResult
    z-index 2
    width 100%
    height 100%
    background $color-white
    .noneFound
      text-align center
      margin-top 100px
      font-size $font-size-large-x
    .home-list 
      width 1200px
      height 100%
      border 1px solid $color-border
      margin  0 auto
      .home-list-content 
      ul 
        padding 20px 130px
        box-sizing border-box 
        font-size $font-size-medium-x
        .list-content
          cursor pointer
          display block
          height 160px
          border-bottom 2px solid $color-border
          background-color #fff
          .pictureBox
            float left
            width 160px
            height 120px
            display flex
            margin 20px 30px 20px 0
            overflow hidden
            img
              width 100%
              height 100%
              object-fit cover
          .textBox
            padding 20px 0
            .nameBox
              display flex
              justify-content space-between
              align-items center
              line-height 40px
              height 40px
              p
                font-size $font-size-large
                font-weight bold
              span 
                display flex
                align-items center 
                &.hotNum
                  color red
                img 
                  margin-right 10px
                  width 15px
</style>