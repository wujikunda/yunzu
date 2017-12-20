<template>
    <div id = "compareContent">
      <div class="listContentS">
        <div class="listContent">
          <div class="comparePicCont">
            <div class="picLs">
              <div class="compPictureBox"  v-for="(item, index) in compareCont" :key="index">
                <img class="posImg" :src="item.picurl" @error="_loadError" >
              </div>
            </div>
            <div class="compareBtn"  @click="reCompare"><span>重新选择</span></div>
          </div>
          <p>对比信息</p>
          <ul class="tableBox">
            <li><span>方式</span><div>{{compareCont[0].way || '--'}}</div><div>{{compareCont[1].way || '--'}}</div></li>
            <li><span>价格</span><div>{{compareCont[0].pricename}}元/㎡</div><div>{{compareCont[1].pricename}}元/㎡</div></li>
            <li><span>面积</span><div>{{compareCont[0].spacename}}㎡</div><div>{{compareCont[1].spacename}}㎡</div></li>
            <li><span>付款方式</span><div>{{compareCont[0].payway}}</div><div>{{compareCont[1].payway}}</div></li>
            <li><span>楼层</span><div>{{compareCont[0].floor}}</div><div>{{compareCont[1].floor}}</div></li>
          </ul>
        </div>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
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
    activated() {
      this._getContent()
    },
    methods: {
      _getContent() {
        if(!this.selectList.length){
          this.$router.push({
            path: '/pc/compareList'
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
      reCompare() {
        console.log(this.$router)
        this.$router.back()
      },
      loadImage( el ) {
      },
      _loadError(event) {
        loadError(event)
      }
    },
    components: {
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
    top 100px
    left 0
    background-color $color-white
    .listContentS
      height 100%
      width 1200px
      margin 0 auto
      overflow hidden
      .posImg
        width 160px
        height 120px
        background-color $color-theme
        object-fit cover
      .comparePicCont
        width 100%
        height 160px
        padding-top 30px
        display flex
        align-items center
        justify-content space-between
        .picLs
          display flex
          margin-left 100px
        .compPictureBox
          position relative
          margin-right 40px
          .deleBtn
            position absolute
            top -10px
            right -10px
            width 20px
            height 20px
        .compareBtn
          width 400px
          height 50px
          margin-right 100px
          span
            width 400px
            display block
            height 60px
            line-height 60px
            text-align center
            background-color $color-theme
            color $color-white
            font-size $font-size-medium-x
            border-radius 10px
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
            box-sizing border-box
            border 1px solid $color-border
            b
              font-weight bold
            img
              width 200px
              height 200px
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
            box-sizing border-box
            font-size $font-size-medium
            height 59px
            line-height 60px
            border 1px solid $color-border
            width 100%
            span
              width 79px
              box-sizing border-box
              border 1px solid $color-border
            div 
              flex 1
              box-sizing border-box
              border 1px solid $color-border
              
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>