<template>
  <div id = "compareList">
    <section class="compareListCont">
      <scroll :data = "collectList" class="listContentS" :pullup="true" @scrollToEnd="updateLoad">
        <div class="listContent">
          <ul>
            <li v-for="(item, index) in collectList" :key="index" @click="selcetHome(item)" class="needsclick">
              <img class="posImg" :src="item.picurl" @error="_loadError" alt="">
              <div class="textBox">
                <div class="textCont">
                  <b>{{item.title}}</b>
                </div>
                <div class="textCont">
                  销量: {{item.hot}}
                </div>
                <div class="textCont">
                  价格: {{item.pricename}}元/㎡
                </div>
              </div>
                  <div class="textCont color-theme">{{houseType(item.housetype)}}</div>  
            </li>
          </ul>
          <p class="no-title" v-show="!collectList.length">无收藏内容</p>
          <div class="blank"></div>
        </div>
      </scroll>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import {collectList} from 'api/setting'
  import {changeImage, loadError} from 'common/js/dom'
  import {mapMutations} from 'vuex'
  export default {
    props: {
    },
    data() {
      return {
        collectList:[
        ],
        selectList:[
        ]
      }
    },
    mounted() {
      this._getCollectList()
    },
    methods: {
      _getCollectList(obj) {
        let _this = this
        collectList(localStorage.getItem('usertoken'),obj).then((res) => {
          if(!res.code){
            _this.collectList = res.data
          }else{
            alert(res.msg)
          }
          // console.log('getHomeList',res)
        })
      },
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
      updateLoad() {
        if(this.collectList.length<10){
          return
        }
        this._getCollectList({limit: this.collectList.length+10})
      }, 
      _loadError(event) {
        loadError(event)
      },
      selcetHome(item) {
        this.$router.push({
          path:`/setting/detail/${item.listid}`
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
  #compareList
    .compareListCont
      height 100%
      width 100%
      position fixed
      background-color $color-background
      top 0
      left 0
      z-index 200
    .no-title
      text-align center
      line-height 100px
      font-size 30px
    footer
      position fixed
      z-index 201
      bottom 0px
      width 100%
      .buttonG
        color $color-white
        width 100%
        height 40px
        text-align center
        line-height 40px
        background-color $color-theme
    .listContentS
      height 100%
      overflow hidden
      .listContent
        width 100%
        .blank
          height 150px
          background-color $color-background
        ul
          width 100%
          padding 0 15px
          background-color #fff
          box-sizing border-box
          li
            height 89px
            display flex
            border-bottom 1px solid $color-border
            align-items center
            .textBox
              flex 1
              line-height 20px
              font-size $font-size-medium-x
            .posImg
              width 60px
              height 60px
              border-radius 50%
              margin-right 15px
            .selImg
              height 15px
              width 15px


</style>