<template>
  <transition name="slide">
    <div id = "homeDetail" v-show="detial.title">
      <div id="fullImg" @click="fullimg = ''" v-show="fullimg">
        <img :src="fullimg" alt="">
      </div>
      <Modal
        v-model="dialog"
        title="云租房产"
        ok-text="去缴纳"
        @on-ok="dialogOk"
        @on-cancel="dialogCancel">
        <p style="font-size:16px">需缴纳押金后方可看到电话</p>
      </Modal>
      <scroll ref="scroll" :data="detial.nearlist" class="home-detial-content">
        <div>
          <div v-if="detial.pic_ary"  class="slider-wrapper" ref="sliderWrapper">
            <slider ref="slider">
              <div v-for="(item,index) in detial.pic_ary" :key="index">
                <div class="imgWCBox">
                  <img class="needsclick" :src="item.picurl"  @error="loaderror" @click="_fullScreen($event)" > 
                </div>
              </div>
            </slider>
          </div> 
          <section class="section">
            <div class="detialBox"> 
              <p class="title">{{detial.title}}</p>
              <div class="textBox">
                <div><span>价格:</span>{{detial.pricename || '--'}}元/㎡</div>
                <div><span>面积:</span>{{detial.areaname || '--'}}㎡</div>
              </div>
              <div class="textBox">
                <div><span>类型:</span>{{houseType(detial.house_type) || '--'}}</div>
                <div><span>入住:</span>{{detial.checkin || '--'}}</div>
              </div>
              <div class="textBox">
                <div><span>楼层:</span>{{detial.floor || '--'}}楼</div>
                <div><span>租期:</span>{{detial.tenancy || '--'}}</div>
              </div>
              <div class="textBox">
                <div v-if="areaList[detial.area_id]"><span>区域:</span>{{areaList[detial.area_id].areaname || '--'}}</div>
                <div><span>付款方式:</span>{{detial.payway || '--'}}</div>
              </div>
              <div class="textBox">
                <div><span>发布时间:</span>{{_formatDate(detial.crate_date) || '--'}}</div>
              </div>
              <div class="showType">
                <span v-for="(item, index) in detial.showtype_ary" :key="index">
                  {{item.showtypename}}
                </span>
              </div>
            </div>
            <detial-type :paycash="paycash" :detial = "detial"></detial-type>
            <div class="detialBox">
              <p class="title">联系我们</p>
              <div class="phoneBox">
                <div><img src="~common/image/icon_phone_grey.png" alt="电话">房东电话: <span> {{ paycash ? detial.owntel || '--' : paycashNoneStr}}</span>  <span>{{paycash ? detial.ownname : ''}}</span></div>
                <div><img src="~common/image/icon_phone_grey.png" alt="电话">平台电话: <span> {{detial.platformname || '--'}}</span></div>
              </div>
            </div>
            <div class="detialBox" v-if="detial.longitude && detial.latitude"  v-show="paycash">
              <p class="title">位置:{{detial.addressdesc || '--'}}</p>
              <bdmap :height="mapheight" :longitude="detial.longitude" :latitude="detial.latitude"></bdmap>
            </div>
            <div class="detialBox lastBox">
              <p class="title">附近房源</p>
              <div  class="nearBy " v-for="(item, index) in detial.nearlist" :key="index"  @click="selcetHome(item)"  >
                <div class="imgWCBox">
                  <img :src="item.picurl" @load="loadImage" @error="loaderror"  >
                </div>
                <span>{{item.title}}</span>
                <span>{{item.pricename}}元/㎡</span>
              </div>
            </div>
          </section>
        </div>
      </scroll>
      <footer>
        <span :class="{'theme': isCompare}" 
          @click="addToCompare">{{isCompare ? '取消对比' : '加入对比'}}</span>
        <span :class="{'theme': isCollect}" @click="addToCollect">{{isCollect ? '取消收藏' : '加入收藏'}}</span>
        <span  @click="_rentHouse" 
          class="theme" 
          >我要租房</span>
      </footer>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import DetialType from 'components/home-detial/detial-type'
  import Slider from 'base/slider/slider'
  import Bdmap from 'base/bdmap/bdmap'
  import {mapGetters, mapMutations} from 'vuex'
  import {getHomeDetial} from 'api/home'
  import {addComparison} from 'api/compare'
  import {collectOperation} from 'api/setting'
  import {formatDate} from 'common/js/util'
  export default {
    props: {
    },
    computed: {
      ...mapGetters([
        'homeDetial',
        'areaList'
      ])
    },
    created() {
      this._getHomeDetial()
      this.paycash = !!parseInt(localStorage.getItem('__paycash__'))
    },
    updated() {
      this.$refs.scroll.scrollTo(0,0)
      this.paycash = !!parseInt(localStorage.getItem('__paycash__'))
      this.$refs.slider._refresh()
      if(this.$refs.map){
        this.$refs.map.updateMap()
      }
    },
    watch: {
      $route(to, form) {
        if(to.path.indexOf('detail') > -1){
          this._getHomeDetial()
          this.fullimg = ''
        }
      }
    },
    data() {
      return {
        detial : {},
        mapheight:250,
        isCollect:false,
        isCompare:false,
        fullimg:'',
        paycash:false,
        dialog:false,
        paycashNoneStr: '缴纳押金后可见'
      }
    },
    methods: {
      loadImage() {
        if (!this.checkloaded) {
          this.checkloaded = true
          this.$refs.scroll.refresh()
        }
      },
      _fullScreen(event){
        // fullScreen(event.target)
        this.fullimg = event.target.src
      },
      loaderror(event) {
        event.target.src = require('common/image/default_house.png')
      },
      _formatDate(str){
        return formatDate(str)
      },
      _getHomeDetial() {
        if(!this.homeDetial.listid) {
          this.$router.push('/home')
          return 
        }
        let _this = this
        getHomeDetial(localStorage.getItem('usertoken'), _this.homeDetial.listid,_this.homeDetial.housetype).then((res) => {
          if(!res.code){
            _this.detial = res.data
            _this.isCollect = res.data.is_collect
            _this.isCompare = res.data.is_in_comparison
          }else{
            this.$router.back()
            alert(res.msg)
          }
        })
      },
      houseType(id) {
        switch (id) {
          case 1:
            return '厂房仓库'
            break;
          case 2:
            return '办公写字楼'
            break;
          case 3:
            return '店面'
            break;
          case 4:
            return '住房'
            break;
          default: return ''
            break;
        }
      },
      addToCompare() {
        let houseid = this.homeDetial.listid
        let _this = this
        let coltype = 0;
        if(_this.isCompare){
          coltype = 1
        }
        addComparison(localStorage.getItem('usertoken'), houseid, coltype).then((res) => {
          if(!res.code){
            _this.isCompare = !_this.isCompare
          }else{
            alert(res.msg)
          }
        })
      },
      _rentHouse(){
        if(this.paycash){
          location.href = 'tel:'+this.detial.owntel
        }else{
          this.dialog = true
        }
      },
      dialogOk() {
        this.$router.push({
          path:`/setting/wallet`
        })
      },
      dialogCancel(){

      },
      addToCollect() {
        let houseid = this.homeDetial.listid
        let _this = this
        let coltype = 2;
        if(_this.isCollect){
          coltype = 1
        }
        collectOperation(localStorage.getItem('usertoken'), houseid, coltype).then((res) => {
          if(!res.code){
            _this.isCollect = !_this.isCollect
          }else{
            alert(res.msg)
          }
        })
      },
      selcetHome(item) {
        this.$router.replace({
          path:`/home/detail/${item.listid}`
        })
        this.setHomeDetial(item)
      },
      ...mapMutations({
        setHomeDetial: 'SET_HOME_DETIAL'
      })
    },
    components: {
      Bdmap,
      Scroll,
      Slider,
      DetialType
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  #homeDetail
    z-index 102
    height 100%
    width 100%
    left 0
    top 0
    position fixed
    font-size $font-size-medium
    background-color $color-background
    footer
      position fixed
      width 100%
      bottom 0
      height 50px
      left 0
      display flex
      align-items center
      text-align center
      background-color #fff
      box-sizing border-box
      border-top 1px solid $color-border
      span,a
        flex 1
        color $color-theme
        border 1px solid $color-theme
        border-radius 10px
        font-size $font-size-medium
        display inline-block
        line-height 30px
        padding 0 10px
        margin 10px
        &.theme
          color $color-white
          background-color $color-theme
    .section 
      margin-top -30px
      padding-bottom 10px
      
    .home-detial-content
      height calc(100% - 50px)
      overflow hidden
      .detialBox
        position relative
        width 94%
        left 3%
        background-color #fff
        box-shadow $box-shadow
        border-radius 10px
        box-sizing border-box
        padding 15px
        margin 10px 0
        p
          font-size $font-size-large
          font-weight bold
          margin-bottom 15px
        .textBox
          display flex
          div 
            flex 1
            height 30px
          span 
            color $color-theme
            display inline-block
            text-indent 3px
            padding 0 3px
            border-left 5px solid $color-theme
        .showType
          span
            color $color-theme
            border 1px solid $color-theme
            border-radius 3px
            display inline-block
            font-size $font-size-small
            line-height 20px
            padding 0 10px
            margin-right 10px
        .nearBy
          width calc(50% - 20px)
          box-sizing borderbox
          display inline-block
          padding 10px
          img 
            width 100%
          span 
            line-height 30px
            display block
            text-overflow ellipsis
            white-space nowrap
            overflow hidden
            font-size $font-size-medium-x
            font-weight bold
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .phoneBox
        div
          display flex
          align-items center
          height 30px
          color $color-text-9
          span
            color $color-theme
            padding 5px
        img 
          width 15px
          margin 0 5px
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
  #fullImg
    background-color #000
    display flex
    position fixed
    z-index 999
    width 100%
    height 100%
    align-items center
    justify-content center
    left 0
    top 0
    img
      width 100%
</style>