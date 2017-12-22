<template>
  <div id = "homePage" ref="homePage">
    <div v-if="adverts.length"  class="slider-wrapper" ref="sliderWrapper">
      <slider :showDots = "true" :showCount = "false" :dotClick="true">
        <a v-for="(item,index) in adverts" :key="index">
           <!-- :href="item.adverturl" -->
          <img :src="item.picurl"  @error="_loaderrorx" > 
        </a>
      </slider>
    </div>
    <drop-menu  
      class="dropmenu"
      ref="dropMenu"
      @switch="switchItem" 
      :isSingle = "true"
      :dropData="sortObjects">
    </drop-menu>
    
    <div class="home-list" @scroll="listenScroll">
      <div class="shaixuan" @click="toSearch">高级筛选</div>
      <ul>
        <li @click="selcetHome(item)"  v-for="(item,key) in homeList" class="list-content" :key="key">
          <div class="pictureBox">
            <!-- <img :src="item.picurl" :alt="item.title + '的房源图'" > -->
            <img :src="item.picurl" alt="" ref="imgI"  @load="loadImage" @error="loaderror" >
          </div>
          <div class="textBox">
            <div class="nameBox">
              <p>{{item.title}}</p>
            </div>
            <div class="nameBox">
              <span>{{item.pricename}}元/㎡</span>
              <span>{{houseType(item.housetype)}}</span>
            </div>
            <div class="nameBox">
              <span class="hotNum"><img src="~common/image/icon_fire.png" alt="">{{item.hot}}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import SearchBox from 'base/search-box/search-box'
  import DropMenu from 'base/drop-menu/drop-menu'
  import Slider from 'base/slider/slider'
  import {getHomeList,getSearchCondition,getCityList,getAreaList,getCityWithLng, getAdverts} from 'api/home'
  import {mapGetters, mapMutations} from 'vuex'
  export default {
    props: {
    },
    computed: {
      posName() {
          return this.homeCity.cityname
      },
      ...mapGetters([
        'homeCity',
        'userToken'
      ])
    },
    data() {
      return {
        serachCont: {

        },
        adverts: [
          {
            picurl: require('common/image/banner/1.png')
          },
          {
            picurl: require('common/image/banner/2.png')
          },
          {
            picurl: require('common/image/banner/3.png')
          },
          {
            picurl: require('common/image/banner/4.png')
          },
          {
            picurl: require('common/image/banner/5.png')
          }
        ],
        homeList:[],
        sortObjects: [
          {
            title: '排序',
            data: ['不限','单价升序','单价降序','面积升序','面积降序'],
            currentIndex: 0,
            funParam: 'orderid'
          },
          {
            title: '区域',
            data: [{text:'不限'},{text:'思明区'},{text:'湖里区'},{text:'杏林区'},{text:'海沧区'},{text:'同安区'},{text:'集美区'}],
            currentIndex: 0,
            funParam: 'areaid'
          },
          {
            title: '价格',
            data: ['不限','10元以下/㎡','10-20元/㎡','20-30元/㎡','30-40元/㎡'],
            currentIndex: 0,
            funParam: 'priceid'
          },
          {
            title: '面积',
            data: ['不限','100㎡以内','100-500㎡','500-1000㎡','1000㎡'],
            currentIndex: 0,
            funParam: 'spaceid'
          },
          {
            title: '类型',
            data: ['不限','厂房仓库','办公','写字楼'],
            currentIndex: 0,
            funParam: 'housetype'
          }
        ]
      }
    },
    activated() {
    },
    mounted() {
      this._initPage()
      this.listenScroll()
      
    },
    methods: {
      _initPage() {
        this._getLocalCity()
        // this._getAdverts()
      },
      switchItem(type,index,id,text) {
        if(type === 'priceid') {
          if(index === 1){
            this.serachCont['pricedesc'] = '0-' + text.substring(0, text.length - 5)
          }else if(index === this.sortObjects[2].data.length-1){
            this.serachCont['pricedesc'] = text.substring(0, text.length - 5) + '-10000000'
          }else{
            this.serachCont['pricedesc'] = text.substring(0, text.length - 3)
          }
          this._getHomeList(this.serachCont)
        }else{
          this.serachCont[type] = id
          this._getHomeList(this.serachCont)
        }
        
      },
      updateLoad() {
        if(this.homeList.length<10 || this.$route.path !== '/pc/home'){
          return
        }
        this.serachCont.limit = this.homeList.length+10
        this._getHomeList(this.serachCont)
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
      listenScroll(event) {
        let _this = this
        window.addEventListener('scroll',function(){  
          if(document.documentElement.scrollTop + window.innerHeight >= document.body.offsetHeight) { 
            _this.updateLoad()
          }
        })
      },
      toSearch() {
        this.$router.push({
          path:'/pc/searchPage/1'
        })
      },
      loadImage() {
        if (!this.checkloaded) {
          this.checkloaded = true
        }
      },
      loaderror(event) {
        event.target.src = require('common/image/default_house.png')
      },
      _loaderrorx(event){
        event.target.src = require('common/image/default_house_l.png')
      },
      toSelectCity() {
         this.$router.push({
            path:'/searchPage/city'
          })
      },
      _getLocalCity() {
        this._getHomeList({cityid:this.homeCity.cityid})
        this._initSearchCondition(this.homeCity.cityid)
        this._getAreaList(this.homeCity.cityid)
      },
      _getAdverts() {
        let _this = this
        getAdverts(localStorage.getItem('usertoken')).then((res) => {
          if(!res.code){
            this.adverts = res.data
          }else{
            alert(res.msg)
          }
        })
      },
      _getAreaList(cirtyId){
        let _this = this
        getAreaList(localStorage.getItem('usertoken'), cirtyId).then((res) => {
          if(!res.code){
            _this.sortObjects[1].data = []
            _this.sortObjects[1].data.push({text:'不限',id:''})
            let arealist = {}
            res.data.forEach(element => {
              _this.sortObjects[1].data.push({text:element.areaname,id:element.areaid})
              arealist[element.areaid] = {}
              arealist[element.areaid]['areaname'] = element.areaname
              arealist[element.areaid]['areaid'] = element.areaid
            });
            
            _this.setAreaList(arealist)
          }else{
            alert(res.msg)
          }
          // console.log('getCityList',res)
        })
      },
      _initSearchCondition(cityID) {
        getSearchCondition(localStorage.getItem('usertoken'), cityID).then((res) => {
          let sortObj = this.sortObjects
          if(!res.code){
            sortObj[0].data = []
            res.data.order_ary.forEach(function(element) {
              sortObj[0].data.push({text:element.ordername,id:element.orderid})
            });
            sortObj[2].data = []
            res.data.price_ary.forEach(function(element) {
              sortObj[2].data.push({text:element.pricename,id:element.priceid})
            });
            sortObj[3].data = []
            res.data.space_ary.forEach(function(element) {
              sortObj[3].data.push({text:element.spacename,id:element.spaceid})
            });
            sortObj[4].data = []
            res.data.type_ary.forEach(function(element) {
              sortObj[4].data.push({text:element.typename,id:element.typeid})
            });
          }else{
            alert(res.msg)
          }
        })
      },
      _getHomeList(listObj) {
        let _this = this
        getHomeList(localStorage.getItem('usertoken'), listObj).then((res) => {
          if(!res.code){
            _this.homeList = res.data
          }else{
            alert(res.msg)
          }
        })
      },
      selcetHome(item) {
        this.$refs.dropMenu.showContent = false
        this.$router.push({
          path:`/pc/home/detail/${item.listid}`
        })
        this.setHomeDetial(item)
      },
      ...mapMutations({
        setHomeList: 'SET_HOME_LIST',
        setHomeDetial: 'SET_HOME_DETIAL',
        setHomeCity: 'SET_HOME_CITY',
        setAreaList: 'SET_AREA_LIST'
      })
    },
    watch: {
      homeCity(to , from) {
        if(from.cityname === to.cityname || !from.cityname){
          return
        }
        this.serachCont.cityid = to.cityid
        this._getHomeList(this.serachCont)
        this._initSearchCondition(to.cityid)
        this._getAreaList(to.cityid)
      }
    },
    components: {
      SearchBox,
      DropMenu,
      Slider
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  #homePage
    background-color $color-white
    .slider-wrapper
      position: relative
      width: 100%
      overflow: hidden
      img
        height 600px
        width 100%
        object-fit cover
    .dropmenu
      width 1000px
      margin 0 auto
    
    .selectTab
      display flex
      align-items center
      justify-content space-between
      font-size $font-size-medium-x
      height 50px 
      width 100%
      box-sizing border-box
      background-color #fff
      border-top 1px solid $color-border
      border-bottom 1px solid $color-border
      .title
        display flex
        align-items center
        img 
          width 20px
          height 20px
          padding 0 20px
    .home-list 
      position relative
      width 100%
      display flex
      justify-content center
      .shaixuan
        position absolute
        right 100px
        top -30px
        cursor pointer
        color $color-theme
      .home-list-content 
      ul 
        width 1200px
        border 1px solid $color-border
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
                  padding-right 10px
                  width 15px
</style>