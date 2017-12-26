<template>
  <div id = "homePage" ref="homePage">
    <search-box ref="searchBox" @change="searchChange" ></search-box>
    <div class="selectTab">
      <div class="title">
        <img src="~common/image/icon_pos_checked.png" alt="pos">
        <span>城市选择</span>
      </div>
      <div class="title" @click='toSelectCity'>
        <span>{{homeCity.cityname}}</span>
        <img src="~common/image/icon_arror_right.png" alt="pos">
      </div>
    </div>
    <drop-menu  
      ref="dropMenu"
      @switch="switchItem" 
      :dropData="sortObjects">
    </drop-menu>
    <div class="home-list">
      <scroll ref="scroll" :data="homeList" class="home-list-content" :pullup="true" @scrollToEnd="updateLoad">
        <ul>
          <li @click="selcetHome(item)"  v-for="(item,key) in homeList" class="list-content" :key="key">
            <div class="imgWCBox">
              <img alt="" ref="imgI" v-lazy="item.picurl" @load="loadImage" >
            </div>
            <!-- <img src="https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png" alt=""  @load="loadImage" > -->
            <div class="nameBox">
              <span>{{item.title}}</span>
              <span>{{item.pricename}}元/㎡</span>
            </div>
            <div class="nameBox">
              <span class="hotNum"><img src="~common/image/icon_fire.png" alt="">{{item.hot}}</span>
              <span>{{houseType(item.housetype)}}</span>
            </div>
          </li>
        </ul>
      </scroll>
    </div>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import SearchBox from 'base/search-box/search-box'
  import DropMenu from 'base/drop-menu/drop-menu'
  import {getHomeList,getSearchCondition,getCityList,getAreaList,getCityWithLng} from 'api/home'
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
      this.$refs.scroll.refresh()
    },
    mounted() {
      this._initPage()
      if(localStorage.getItem('cityid') && localStorage.getItem('cityname')){
        return
      }
      let _this = this
      var geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition(function(r){
        if(this.getStatus() == BMAP_STATUS_SUCCESS){
          _this._getCityWithLng({
            longitude: r.point.lng,
            latitude: r.point.lat
          })
          
        }
        else {
          alert('failed'+this.getStatus());
        }        
      },{enableHighAccuracy: true})
    },
    methods: {
      _initPage() {
        this._getLocalCity()
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
        if(this.homeList.length<10){
          return
        }
        this.serachCont.limit = this.homeList.length+10
        this._getHomeList(this.serachCont)
      },  
      searchChange(query) {
        let _this = this
        let params = {
          limit : 100,
          cityid:this.homeCity.cityid,
          keyword: query
        }
        this._getHomeList(params,'search')
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
      loadImage() {
        if (!this.checkloaded) {
          this.checkloaded = true
          this.$refs.scroll.refresh()
        }
      },
      loaderror(event) {
        event.target.src = require('common/image/default_house.png')
      },
      toSelectCity() {
         this.$router.push({
            path:'/searchPage/city'
          })
      },
      _getLocalCity() {
        if(localStorage.getItem('cityid') && localStorage.getItem('cityname')) {
          this.setHomeCity({
            cityname: localStorage.getItem('cityname'),
            cityid: localStorage.getItem('cityid')
          })
        }else{
          this.setHomeCity({
            cityname: '厦门市',
            cityid: "350200"
          })
        }
        this._getHomeList({cityid:this.homeCity.cityid})
        this._initSearchCondition(this.homeCity.cityid)
        this._getAreaList(this.homeCity.cityid)
      },
      _getCityWithLng(obj) {
        let _this = this
        getCityWithLng(localStorage.getItem('usertoken'), obj).then((res) => {
          if(!res.code){
            _this.setHomeCity(res.data)
            localStorage.setItem('cityid', res.data.cityid)
            localStorage.setItem('cityname', res.data.cityname)
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
      _getHomeList(listObj,type) {
        let _this = this
        getHomeList(localStorage.getItem('usertoken'), listObj).then((res) => {
          if(!res.code){
            if(type === 'search'){
              _this.setHomeList(res.data)
              _this.$router.push({
                path:'/searchResult'
              })
              _this.$refs.searchBox.blur()
              return 
            }
            _this.homeList = res.data
          }else{
            alert(res.msg)
          }
        })
      },
      selcetHome(item) {
        this.$refs.dropMenu.showContent = false
        this.$router.push({
          path:`/home/detail/${item.listid}`
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
        localStorage.setItem('cityid', to.cityid)
        localStorage.setItem('cityname', to.cityname)
      }
    },
    components: {
      Scroll,
      SearchBox,
      DropMenu
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  #homePage
    .selectTab
      display flex
      align-items center
      justify-content space-between
      font-size $font-size-medium-x
      height 45px 
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
          margin 0 20px
    .home-list 
      position fixed
      width 100%
      top 135px
      height calc(100% - 185px)
      .home-list-content 
        height 100%
        overflow hidden
      ul 
        width 100%
        font-size $font-size-medium-x
        .list-content
          display block
          padding 15px
          margin-bottom 5px
          background-color #fff
          img
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