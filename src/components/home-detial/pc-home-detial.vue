<template>
    <div id = "homeDetail">
        <div id="fullImg" @click="fullimg = ''" v-show="fullimg">
          <img :src="fullimg" alt="">
        </div>
        <Modal
          v-model="dialog"
          title="云租房产"
          ok-text="去缴纳"
          @on-ok="dialogOk"
          @on-cancel="dialogCancel">
          <p style="font-size:18px">需缴纳押金后方可看到电话</p>
        </Modal>
        <Modal
          v-model="dialog2"
          title="云租房产"
          @on-ok="dialog2 = false"
          @on-cancel="dialog2 = false">
          <p style="font-size:18px">请拨打电话{{detial.owntel}}</p>
        </Modal>
        <div class="home-detial-content">
          <div class="detialTitle">
            <p class="routerLink">
              <router-link tag="span" class="tab-item" to="/pc/home">首页</router-link>
              <b>></b>
              <span>{{detial.title}}</span>
            </p>
            <div class="pictureTitle">{{detial.title}}</div>
          </div>
          <div class="contentBox">
            <div class="leftContent">
              <div class="pictureBox">
                <div v-if="detial.pic_ary"  class="slider-wrapper" ref="sliderWrapper">
                  <div class="btnBox" >
                    <img @click="motoPage('left')" src="~common/image/btn_left.png" alt="左箭头" style="cursor:pointer">
                  </div>
                  <slider ref="slider" class="slider-content"  :showCount="false">
                    <div v-for="(item,index) in detial.pic_ary" :key="index">
                      <img class="needsclick slidepic" :src="item.picurl"  @error="_loaderrorx" @click="_fullScreen($event)"> 
                    </div>
                  </slider>
                  <div class="btnBox">
                    <img @click="motoPage('right')" src="~common/image/btn_right.png" alt="右箭头" style="cursor:pointer">
                  </div>
                </div> 
                <ul class="pshowList" v-if="detial.pic_ary"> 
                  <li v-for="(item,index) in detial.pic_ary" :key="index" style="cursor:pointer">
                    <img  ref="showListPic" @click="motoPage(index)" :class="{'active': index===0 }"  :src="item.picurl"  @error="loaderror" > 
                  </li>
                </ul>
              </div>
              <section class="section">
                <div class="detialBox"> 
                  <p class="title">房源信息</p>
                  <div class="textBox">
                    <div><span>价格:</span>{{detial.pricename || '--'}}元/㎡</div>
                    <div><span>面积:</span>{{detial.areaname || '--'}}㎡</div>
                  </div>
                  <div class="textBox">
                    <div><span>类型:</span>{{houseType(detial.house_type) || '--'}}</div>
                    <div><span>总价格:</span>{{detial.totalprice || '--'}}元</div>
                  </div>
                  <div class="textBox">
                    <div v-if="areaList[detial.area_id]"><span>区域:</span>{{areaList[detial.area_id].areaname || '--'}}</div>
                    <div><span>发布时间:</span>{{_formatDate(detial.crate_date) || '--'}}</div>
                  </div>
                  <div class="showType">
                    <span v-for="(item, index) in detial.showtype_ary" :key="index">
                      {{item.showtypename}}
                    </span>
                  </div>
                </div>
                <detial-type  :paycash="_getAuthority()" :detial = "detial"></detial-type>
                <div class="detialBox" v-if="detial.longitude && detial.latitude" v-show="_getAuthority()">
                  <p class="title">位置:{{detial.address || '--'}}</p>
                  <bdmap ref="map" :height="mapheight" :mapTitle="detial.address" :longitude="detial.longitude" :latitude="detial.latitude"></bdmap>
                </div>
                <div class="detialBox lastBox">
                  
                </div>
              </section>
            </div>
            <div class="rightContent">
                <h3>{{_getAuthority() ? detial.ownname : ''}}</h3>
                <h4>{{ _getAuthority() ? detial.owntel || '--' : paycashNoneStr}}</h4>
                <h3>平台电话</h3>
                <h4>{{ '0592-6220892'}}</h4>
                <h3>附近房源</h3>
              <div class="nearBy" v-for="(item, index) in detial.nearlist" :key="index"  @click="selcetHome(item)" style="cursor:pointer" >
                <img :src="item.picurl" @load="loadImage" @error="loaderror"  >
                <span>{{item.title}}</span>
                <span class="color-theme">{{item.pricename}}元/㎡</span>
              </div>
            </div>
          </div>
        </div>
       <footer>
         <div class="footerBox">
          <span style="cursor:pointer" :class="{'theme': isCompare}" @click="addToCompare">{{isCompare ? '取消对比' : '加入对比'}}</span>
          <span style="cursor:pointer" :class="{'theme': isCollect}" @click="addToCollect">{{isCollect ? '取消收藏' : '加入收藏'}}</span>
          <span  @click="_rentHouse" style="cursor:pointer" 
          class="theme" 
          >我要租房</span>
         </div>
      </footer>
    </div>
</template>

<script type="text/ecmascript-6">
  import DetialType from 'components/home-detial/pc-detial-type'
  import Slider from 'base/slider/slider'
  import Bdmap from 'base/bdmap/bdmap'
  import {mapGetters, mapMutations} from 'vuex'
  import {getHomeDetial} from 'api/home'
  import {addComparison} from 'api/compare'
  import {collectOperation} from 'api/setting'
  import {formatDate} from 'common/js/util'
  import {fullScreen} from 'common/js/dom'
  
  export default {
    props: {
    },
    computed: {
      ...mapGetters([
        'homeDetial',
        'areaList'
      ])
    },
    mounted() {
      this._getHomeDetial()
      this.paycash = !!parseInt(localStorage.getItem('__paycash__'))
    },
    updated() {
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
      this.paycash = !!parseInt(localStorage.getItem('__paycash__'))
      this.motoPage(0)
      this.$refs.slider._refresh()
      if(this.$refs.map){
        this.$refs.map.updateMap()
      }
    },
    watch: {
      $route(to, form) {
        if(to.path.indexOf('detail') > -1){
          this._getHomeDetial()
        }
      }
    },
    data() {
      return {
        detial : {},
        mapheight:500,
        isCollect:false,
        isCompare:false,
        currentIndex: 0,
        paycash:false,
        fullimg:'',
        dialog:false,
        dialog2:false,
        paycashNoneStr: '缴纳押金后可见'
      }
    },
    methods: {
      loadImage() {
        if (!this.checkloaded) {
          this.checkloaded = true
        }
      },
      motoPage( pageIndex ) {
        let index = this.currentIndex
        if(pageIndex === 'left'){
          index = index-1
        }else if(pageIndex === 'right'){
          index = index+1
        }else{
          index = pageIndex
        }
        if(index>this.detial.pic_ary.length-1 || index<0){
          return
        }
        this.$refs.slider._moveToPage(parseInt(index))
        this.currentIndex = index
        this.$refs.showListPic.forEach(function(ele,i){
          if(i === index){
            ele.className  ='active'
          }else{
            ele.className =''
          }
        })
      },
      _getAuthority() {
        if(this.paycash){
          return true
        }else{
          if(localStorage.getItem('usertoken')){
            return this.detial.shownum < 4
          }else{
            return false
          }
        }
      },
      loaderror(event) {
        event.target.src = require('common/image/default_house.png')
      },
      _loaderrorx(event){
        event.target.src = require('common/image/default_house_l.png')
      },
      _fullScreen(event){
        // fullScreen(event.target)
        this.fullimg = event.target.src
      },
      _formatDate(str){
        return formatDate(str)
      },
      _getHomeDetial() {
        if(!this.homeDetial.listid) {
          this.$router.push('/pc/home')
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
        if(this._getAuthority()){
          this.dialog2 = true
        }else{
          this.dialog = true
        }
      },
      dialogOk() {
        this.$router.push({
          path:`/pc/setting/wallet`
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
          path:`/pc/home/detail/${item.listid}`
        })
        this.setHomeDetial(item)
      },
      ...mapMutations({
        setHomeDetial: 'SET_HOME_DETIAL'
      })
    },
    components: {
      Bdmap,
      Slider,
      DetialType
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  #homeDetail
    width 100%
    
    font-size $font-size-medium
    background-color $color-white
    .routerLink
      display block
      padding 10px 20px  
      width 1200px
      margin 0 auto
      font-size $font-size-medium-x
      span 
        cursor pointer
        color $color-theme
    .pictureTitle
      width 100%
      display block 
      padding 20px
      font-size 28px
      font-weight bold
      box-sizing border-box
    footer
      position fixed
      width 100%
      bottom 0
      height 60px
      left 0
      background-color #fff
      box-sizing border-box
      border-top 1px solid $color-border
      .footerBox
        width 1200px
        margin 0 auto
        display flex
        align-items center
        text-align center
      span 
        flex 1
        color $color-theme
        border 1px solid $color-theme
        border-radius 10px
        font-size $font-size-medium-x
        display inline-block
        line-height 40px
        padding 0 10px
        margin 10px
        &.theme
          color $color-white
          background-color $color-theme
    .section 
      padding-bottom 10px
      box-sizing border-box
      border 1px solid $color-border
    .home-detial-content
      width 1200px
      margin 0 auto
      .contentBox
        display flex
        width 100%
        justify-content space-between
      .leftContent
        width 880px
      .detialBox
        position relative
        width 94%
        left 3%
        background-color #fff
        box-shadow $box-shadow
        border-radius 10px
        font-size $font-size-medium
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
            font-size $font-size-medium-x
            line-height 20px
            padding 0 10px
            margin-right 10px
      .pictureBox
        width 100%
        flex-direction column
        box-sizing border-box
        border 1px solid $color-border
        display flex
        padding 40px
        align-items center
        justify-content center
        .slider-wrapper
          width: 800px
          display flex
          align-items center
          overflow hidden
          .btnBox
            width 100px
            img
              width 20px
              margin 40px
          .slider-content
            width 600px
            overflow hidden
            height 400px
            .slidepic
              width 600px
              height 400px
              object-fit cover
        .pshowList
          display flex
          width 600px
          flex-wrap wrap
          margin 0 auto
          img
            border 1px solid $color-border
            height 100px
            width 100px
            margin 10px 20px 10px 0 
            &.active
              border 1px solid $color-theme
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
      .rightContent
        width 280px
        box-sizing border-box
        margin-bottom 60px
        border 1px solid $color-border
        h3
          font-size $font-size-large
          font-weight bold
          padding 10px 30px
        h4
          font-size $font-size-medium-x
          color $color-theme
          padding 0 30px
        .nearBy
          width 280px
          margin 0 auto
          box-sizing border-box
          display inline-block
          font-size $font-size-medium-x
          padding 10px 30px
          img 
            width 220px
            height 180px
            object-fit cover
          span 
            line-height 30px
            display block
            text-overflow ellipsis
            white-space nowrap
            overflow hidden
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
      width 60%
</style>