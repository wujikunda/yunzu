<template>
  <div id = "searchType" >
    <div class="searchType-content">
      <div class="typeContent">
        <p>{{typeName}}</p>
        <ul class="typeContentList" v-if="sortObjects.length">
          <li>
            <b>类别:</b>
            <div class="selectBox">
              <router-link tag="span" v-for="(item,index) in searchPage" :key="index" v-html="item.text"  :to="item.path" style="cursor:pointer"></router-link>
            </div>
          </li>
          <li>
            <b>{{areaidListobj.title}}:</b>
            <div class="selectBox">
              <span :class="{'active': num==areaselectIndex}" @click="selectItem(areaidListobj,num)" v-for="(list, num) in areaidListobj.list" :key="num">{{list.areaname}}</span>
            </div>
          </li>
          <li v-for="(item, index) in sortObjects" :key="index">
            <b>{{item.title}}:</b>
            <div class="selectBox">
              <span :class="{'active': num==item.selectIndex}" @click="selectItem(item,num)" v-for="(list, num) in item.list" :key="num">{{list}}</span>
              <div class="inputBox" v-if="item.id === 'spacename'" >
                自定义: <input type="number" @change="spacenameIn($event,'min')"> - <input  type="number" @change="spacenameIn($event,'max')">
              </div>
            </div>
          </li>
        </ul>
      </div>
      <footer>
        <div @click="toIndex()">筛选</div>
      </footer>
    </div>
    <div class="cityList" v-show="showCity">
      <ul>
        <li v-for="(item, index) in cityList" :key="index" @click="selectCity(item,index)">{{item.cityname}}</li>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getSearchList,getCityList,getHomeSearch} from 'api/home'
  import {deepCopy} from 'common/js/util'
  import {mapMutations, mapGetters} from 'vuex'
  export default {
    props: {
    },
    computed: {
      areaidListobj (){
        let obj = { "id": "areaid","selectIndex":-1, "title": "区域", "list": [] }
        let arr = Object.keys(this.areaList)
        arr.forEach(element => {
          obj['list'].push(this.areaList[element])
        });
        return obj
      },
      ...mapGetters([
        'areaList'
      ])
    },
    data() {
      return {
        typeName : '',
        searchPage:[
          {text:'厂房/仓库',path:'/pc/searchPage/1'},
          {text:'办公写字楼',path:'/pc/searchPage/2'},
          {text:'店面',path:'/pc/searchPage/3'},
          {text:'住房',path:'/pc/searchPage/4'}
        ],
        areaselectIndex: -1,
        spacename:{
          min:'',
          max:'',
        },
        showCity : false,
        sortObjects: [
        ],
        formData: {

        },
        cityList: [
          '厦门','福州','宁德','三明'
        ]
      }
    },
    mounted() {
      this._getSearchDate()
      console.log(this.areaidListobj)
    },
    watch: {
      '$route':['_getSearchDate']
    },
    methods: {
      
      _getSearchDate() {
        let search = deepCopy(getSearchList())
        this.sortObjects = []
        this.formData = {}
        this.areaselectIndex = -1
        this.showCity = false
        switch (this.$route.params.id) {
          case 'city':
            this._getCityList()
            this.showCity = true
            break;
          case '1':
            this.sortObjects = [
              search.area,
              search.areaprice,
              search.floor,
              search.structure,
              search.transportation,
              search.carwidth,
              search.source,
              search.propertyright,
              search.firecontrol,
              search.power
            ]
            this.typeName = '厂房仓库高级筛选'
            break;
          case '2':
            this.sortObjects = [
              search.area,
              search.areaprice,
              search.ageround,
              search.floorheight,
              search.structure,
              search.carportnum,
              search.nearpark,
              search.register,
              search.source,
              search.propertyright,
              search.firecontrol,
              search.power
            ]
            this.typeName = '办公写字楼高级筛选'
            break;
          case '3':
            this.sortObjects = [
              search.area,
              search.areaprice,
              search.storepis,
              search.ageround,
              search.floorheight,
              search.structure,
              search.carportnum,
              search.nearpark,
              search.transportation,
              search.source,
              search.propertyright,
              search.firecontrol,
              search.power
            ]
            this.typeName = '店面高级筛选'
            break;
          case '4':
            this.sortObjects = [
              search.area,
              search.areaprice,
              search.payway,
              search.ageround,
              search.floorheight,
              search.orientation,
              search.type,
              search.balcony,
              search.furniture,
              search.stylelevel,
              search.lighting,
              search.monitoring,
              search.parknum,
              search.elevator
            ]
            this.typeName = '住房高级筛选'
            break;
          default:
            break;
        }
      },
      selectItem(item,num) {
        let key = item.id
        if(this.areaselectIndex === num){
          this.areaselectIndex = -1
          this.formData[key] = ''
          return
        }
        if(item.selectIndex === num){
          item.selectIndex = -1
          this.formData[key] = ''
          return
        }
        item.selectIndex = num
        
        if(num !== -1) {
          this.formData[key] = item['list'][item.selectIndex]
          switch (item.id) {
            case 'areaid':
              this.formData[key] = item['list'][item.selectIndex]['areaid']
              this.areaselectIndex = num
              break;
            case 'spacename':
              if(this.formData[key] === '100以内'){
                this.formData[key] = '0-100'
              }else if(this.formData[key] === '1000以上'){
                this.formData[key] = '1000-100000000'
              }
              break;
            case 'rentname':
              if(this.formData[key] === '150以上'){
                this.formData[key] = '150-100000000'
              }
              break;
            case 'rentage':
              // if(this.formData[key] === '1年以内'){
              //   this.formData[key] = '0-1'
              // }else if(this.formData[key] === '20年以上'){
              //   this.formData[key] = '20-10000'
              // }else{
              //   this.formData[key] = this.formData[key].substring(0,this.formData[key].length-1)
              // }
              break;
            case 'floorname':
              if(this.formData[key] === '3米以内'){
                this.formData[key] = '0-3'
              }else if(this.formData[key] === '15米以上'){
                this.formData[key] = '15-100000000'
              }else if(this.formData[key] === '10层以上'){
                this.formData[key] = '10-10000'
              }else{
                this.formData[key] = this.formData[key].substring(0,this.formData[key].length-1)
              }
              break;
            case 'carwidthname':
            case 'parknum':
                this.formData[key] = this.formData[key].substring(0,this.formData[key].length-1)
              break;  
            default:
              break;
          }
        }
      },
      _getCityList() {
        getCityList(localStorage.getItem('usertoken')).then((res) => {
          if(!res.code){
            this.cityList = res.data
          }else{
            alert(res.msg)
          }
          // console.log('getCityList',res)
        })
      },
      spacenameIn(event,id){
        this.spacename[id] = event.target.value
        this.sortObjects[0].selectIndex = -1
        if(this.spacename.max && this.spacename.min){
          this.formData['spacename'] = this.spacename.min + '-' + this.spacename.max
        }
      },
      selectCity(item, index){
        this.setHomeCity(item)
        this.$router.replace({
          path:'/pc/home'
        })
      },
      toIndex(  ){
        let _this = this
        getHomeSearch(localStorage.getItem('usertoken'), _this.formData,this.$route.params.id).then((res) => {
          if(!res.code){
            _this.setHomeList(res.data)
            _this.$router.push({
              path:'/pc/searchResult'
            })
          }else{
            alert(res.msg)
            return
          }
        })
        
      },
      ...mapMutations({
        setHomeCity: 'SET_HOME_CITY',
        setHomeList: 'SET_HOME_LIST'
      })
    },
    components: {
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  #searchType
    width 100%
    background-color $color-white
    z-index 2
    .cityList
      position  fixed
      width 100%
      height 100%
      top: 0px
      z-index 3
      background-color $color-background
      ul
        width 100%
        padding 0 20px
        box-sizing border-box
        background-color $color-white
        line-height 50px
        li
          border-bottom 1px solid $color-border 
    .searchType-content
      width 1200px
      margin 0 auto
      
    footer
      width 100%
      color $color-white
      padding 40px 0 
      div
        width 600px 
        margin 0 auto
        line-height 50px
        border-radius 10px
        background-color $color-theme
        text-align center
    .typeContent
      p
        font-size $font-size-medium-x
        color $text-color-l
        padding  15px 20px 
      .typeContentList
        background-color $color-white
        border 1px solid $color-border
        padding 0 10px
        li
          box-sizing border-box
          background-color #fff
          line-height 45px
          display flex
          b
            font-size $font-size-medium-x
            display block
            white-space nowrap
            margin 0 10px
          .selectBox
            box-sizing border-box
            display flex
            flex-flow row wrap
            text-align center
            .inputBox
              color #909090
              input
                width 80px
                border 1px solid $color-border
                line-height 30px
                border-radius 3px
            span 
              margin 0 10px
              box-sizing border-box
              cursor pointer
              font-size $font-size-medium-x
              color $color-text-l
              &.active,&.router-link-active 
                color $color-theme
              
                
</style>