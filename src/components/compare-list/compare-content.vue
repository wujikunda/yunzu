<template>
  <transition name="slide">
    <div id = "compareContent">
      <scroll :data = "compareCont" class="listContentS">
        <div class="listContent">
          <ul class="topBox">
            <li v-for="(item, index) in compareCont" :key="index">
              <img ref="tImg" :src="item.picurl"  @load="loadImage(this)" @error="_loadError">
              <b>{{item.title}}</b>
              <span>{{item.pricename}}米/㎡</span>
            </li>
          </ul>
          <p>对比信息</p>
          <ul class="tableBox">
            <li><span>方式</span><div>{{compareCont[0].way || '--'}}</div><div>{{compareCont[1].way || '--'}}</div></li>
            <li><span>面积</span><div>{{compareCont[0].spacename}}</div><div>{{compareCont[1].spacename}}</div></li>
            <li><span>付款方式</span><div>{{compareCont[0].payway}}</div><div>{{compareCont[1].payway}}</div></li>
            <li><span>楼层</span><div>{{compareCont[0].floor}}</div><div>{{compareCont[1].floor}}</div></li>
          </ul>
        </div>
      </scroll>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import {loadError} from 'common/js/dom'
  import {getCompareCont} from 'api/compare'
  import {mapGetters} from 'vuex'
  export default {
    props: {
    },
    
    data() {
      return {
        compareCont:[
          {},{}
        ]
      }
    },
    computed: {
      ...mapGetters([
        'selectList'
      ])
    },
    mounted() {
      this._getContent()
    },
    
    methods: {
      _getContent() {
        if(!this.selectList.length){
          this.$router.push({
            path: '/compareList'
          })
          return
        }
        getCompareCont(localStorage.getItem('usertoken'),this.selectList[0],this.selectList[1]).then((res) => {
          if(!res.code){
            this.compareCont = res.data
          }else{
            alert(res.msg)
            this.$router.back()
          }
        })
      },
      loadImage( el ) {
        for (let index = 0; index < this.$refs.tImg.length; index++) {
          this.$refs.tImg[index].height = this.$refs.tImg[index].width
        }
      },
      _loadError(event) {
        loadError(event)
      }
    },
    components: {
      Scroll
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  #compareContent
    position fixed
    width 100%
    height 100%
    z-index 102
    top 0
    left 0
    background-color $color-background
    .listContentS
      height 100%
      overflow hidden
      .listContent
        width 100%
        p
          padding 15px
          color $color-text-l
        .topBox
          padding 20px 0
          box-sizing border-box
          width 100%
          background-color $color-white
          text-align center
          display flex
          line-height 24px
          li
            flex 1
            display flex
            align-items center
            font-size $font-size-medium
            justify-content center
            flex-direction column
            border-right 1px solid $color-border
            b
              font-weight bold
            img
              width 40%
              border-radius 50%
              margin-bottom 10px
        .tableBox
          width 100%
          background-color $color-white
          li
            display flex
            align-items center
            justify-content center
            text-align center
            font-size $font-size-medium
            height 59px
            line-height 60px
            border-bottom 1px solid $color-border
            width 100%
            span
              width 79px
              border-right 1px solid $color-border
            div 
              flex 1
              border-right 1px solid $color-border
              
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>