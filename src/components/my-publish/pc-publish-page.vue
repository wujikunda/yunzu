<template>
    <div id = "publishPage">
    <loading v-show="showloading"></loading>
    <picker @select="handleSelect(1,arguments)" :data="pickerData" :selected-index="pickerSelected"
            ref="picker" :title="''" :cancelTxt="'取消'"
            :confirmTxt="'完成'"></picker>
      <div class="listContentS">
      <p class="title">{{typeName}}</p>
      <div class="listContent">
        <ul v-if="!isPre">
          <li ><b>上传房源照片<i>*</i></b></li>
          <div class="picList">
            <div class="listBox">
              <div class="uploadImgBox" v-for="(item, index) in uploadImgs" :key="index">
                <img class="uploadItem" :src="item.src" >
                <img class="deletBtn" @click="deleteUploadImg(index)" style="cursor:pointer" src="~common/image/button_shanchu.png" alt="删除">
              </div>
              <div class="addButton"><img @click="selectImg" class="needsclick" style="cursor:pointer" src="~common/image/button_addHouse.png" alt="上传照片"></div>
            </div>
            <uploader ref="uploadFiles"  @selectFinish="selectDone" v-show="false" :hideImg="true"></uploader>
          </div>
        </ul>
        <ul>
            <li v-for="(item, index) in publishTypeList" :key="index">
            <b v-if="!item.select">{{item.title}} <i v-if="item.needs">*</i></b>
            <input type="text" v-model="formDate[item.id]" v-if="item.placeholder"  :placeholder="item.placeholder"/>
            <select v-model="formDate[item.id]" v-if="!item.placeholder && !item.select && !item.udefine" >
              <option v-for="(ele, i) in item.list" :key="i">{{ele}}</option>
            </select>
            <div class="udefine"  v-if="item.udefine" >
              <between @getValue="_getValue($event, item)" :surText="item.defineText" ref="between"></between>
            </div>
            <div class="arrBox" v-if="item.select">
              <b>{{item.title}} <i v-if="item.needs">*</i></b>
              <div class="arrSelect">
                <span  @click="arrSelect(item,a)" style="cursor:pointer" class="arrItem" :class="{'active': item.arrSelectIndex.indexOf(a)>-1}" v-for="(arr,a) in item.list" :key="a">
                  {{arr}}
                </span>
              </div>
            </div>
          </li>
          <li v-if="isPre">
            <textarea placeholder="请输入其他要求..." v-model="formDate.instruction"></textarea>
          </li>
          <li v-if="!isPre">
            <textarea placeholder="请输入您对房源的简单描述..." v-model="formDate.housedec"></textarea>
          </li>
          <li v-if="!isPre">
            <textarea placeholder="请输入您对房源周边的简单描述..." v-model="formDate.addressdesc"></textarea>
          </li>
        </ul>
        <div class="buttonG" style="cursor:pointer" @click="submitBtn">{{isPre? "确认提交" : "立即发布"}}</div>
        <div class="blank"></div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import Picker from 'base/picker/picker'
  import Uploader from 'base/uploader/uploader'
  import Between from 'base/between/between'
  import Loading from 'base/loading/loading'
  import {getPubliList, getAreaList} from 'api/home' 
  import {deepCopy} from 'common/js/util'
  import {houseUpload, addBefore} from 'api/publish'
  import {uploadImg} from 'api/setting'
  import {mapGetters, mapMutations} from 'vuex'
  import iMlrz from 'lrz'
  export default {
    props: {
    },
    computed: {
      areaidListobj (){
        let obj = { "id": "areaid","selectIndex":-1, "title": "区域","needs":true,"selectIndex":-1, "list": [] }
        let arr = Object.keys(this.areaList)
        arr.forEach(element => {
          obj['list'].push(this.areaList[element].areaname)
        });
        return obj
      },
      ...mapGetters([
        'areaList',
        'homeCity'
      ])
    },
    data() {
      return {
        typeName: '',
        pickerData: [[]],
        pickerSelected: [-1],
        formDate:{
          'picAry':[
          ],
          'showtypeAry':[
          ],
          'nearby': [],
          'furniture': []
        },
        publishTypeList:[],
        showloading:false,
        uploadImgs: [],
        isPre:false
      }
    },
    mounted() {
      this._getPublishType()
    },
    activated() {
      this._getPublishType()
    },
    methods: {
      _getValue(event,item) {
        this.formDate[item.id] = event
      },
      _getPublishType() {
        var search  = deepCopy(getPubliList())
        this.publishTypeList = []
        this.uploadImgs = []
        if(this.$refs.between) {
          for (let index = 0; index < this.$refs.between.length; index++) {
            const element = this.$refs.between[index]._refresh()
          }
        }
        this.formDate = {
          'picAry':[
          ],
          'showtypeAry':[
          ],
          'cityid':this.homeCity.cityid
        }
        switch (this.$route.params.id) {
          case '1':
            this.publishTypeList = [
              search.title,
              search.ownname,
              search.owntel,
              this.areaidListobj,
              search.address,
              search.areaname,
              search.pricename,
              search.totalprice,
              search.rentway,
              search.showtype_ary,
              search.ageround,
              search.checkin,
              search.payway,
              search.floor,
              search.floorheight,
              search.structure,
              search.transportation,
              search.powercharge,
              search.watercharge,
              search.propertycharge,
              search.healthcharge,
              search.carwidth,
              search.carportnum,
              search.carportarea,
              search.source,
              search.orientation,
              search.affect,
              search.awaywater,
              search.drain,
              search.propertyright,
              search.firecontrol,
              search.redchart,
              search.power,
              search.powersupply,
              search.haslift,
              search.liftnum
            ]
            this.typeName = '厂房仓库发布'
            break;
          case '2':
            this.publishTypeList = [
              search.title,
              search.ownname,
              search.owntel,
              this.areaidListobj,
              search.address,
              search.areaname,
              search.pricename,
              search.totalprice,
              search.rentway,
              search.showtype_ary,
              search.ageround,
              search.checkin,
              search.payway,
              search.nearpark,
              search.carportnum,
              search.carportarea,
              search.register,
              search.floor,
              search.floorheight,
              search.structure,
              search.powercharge,
              search.watercharge,
              search.propertycharge,
              search.healthcharge,
              search.source,
              search.propertyright,
              search.redchart,
              search.firecontrol,
              search.orientation,
              search.haslift,
              search.liftnum
            ]
            this.typeName = '办公写字楼发布'
            break;
          case '3':
            this.publishTypeList = [
              search.title,
              search.ownname,
              search.owntel,
              this.areaidListobj,
              search.address,
              search.areaname,
              search.pricename,
              search.totalprice,
              search.rentway,
              search.place,
              search.showtype_ary,
              search.ageround,
              search.checkin,
              search.payway,
              search.nearpark,
              search.carportnum,
              search.carportarea,
              search.floor,
              search.floorheight,
              search.structure,
              search.transportation,
              search.powercharge,
              search.watercharge,
              search.source,
              search.propertyright,
              search.propertycharge,
              search.healthcharge,
              search.redchart,
              search.firecontrol,
              search.power,
              search.powersupply,
              search.haslift,
              search.liftnum
            ]
            this.typeName = '店面发布'
            break;
          case '4':
            this.publishTypeList = [
              search.title,
              search.ownname,
              search.owntel,
              this.areaidListobj,
              search.address,
              search.areaname,
              { "id": "pricename", "title": "价格 (元/㎡)", "placeholder":"请输入价格"  },
              { "id": "totalprice", "title": "总价格 (元)", "needs":true, "placeholder":"请输入总价格"},
              search.rentway,
              search.payway,
              search.completetime,
              search.showtype_ary,
              search.ageround,
              search.source,
              search.checkin,
              search.floor,
              search.floorheight,
              search.orientation,
              search.hourseage,
              search.powercharge,
              search.watercharge,
              search.propertycharge,
              search.healthcharge,
              search.type,
              search.balcony,
              { "id": "developers","title": "开发商", "placeholder":"请输入开发商" },
              { "id": "propertycompany","title": "物业公司", "placeholder":"请输入物业公司" },
              { "id": "sharedarea","title": "公摊比例", "placeholder":"请输入公摊比例" },
              { "id": "households","title": "总户数", "placeholder":"请输入总户数" },
              { "id": "plotratio","title": "容积率", "placeholder":"请输入容积率" },
              { "id": "greenrate","title": "绿化率", "placeholder":"请输入绿化率" },
              { "id": "brandmessage","title": "品牌信息", "placeholder":"请输入品牌信息" },
              { "id": "style","title": "装修风格", "placeholder":"请输入装修风格" },
              search.furniture,
              { "id": "stylelevel","title": "装修程度", "placeholder":"请输入装修程度" },
              search.nearby,
              search.carportarea,
              search.lighting,
              search.monitoring,
              search.parknum,
              search.noise,
              search.haslift,
              search.liftnum
            ]
            this.formDate.nearbyAry = []
            this.formDate.furnitureAry = []
            this.typeName = '住房发布'
            break;
          case 'preLease':
            this.publishTypeList = [
              { "id": "name","title": "姓名","needs":true, "placeholder":"请输入您的姓名" },
              { "id": "phone","title": "电话","needs":true, "placeholder":"请输入您的电话" },
              { "id": "business","title": "业务范围","needs":true, "placeholder":"请详细填写业务范围" },
              search.areaname,
              { "id": "houseType","selectIndex":-1,"needs":true, "title": "房源类型", "list": ["厂房仓库", "办公写字楼", "店铺", "住房"] },
              { "id": "address","title": "区域","needs":true, "placeholder":"请输入区域"},
              { "id": "transportation","title": "交通/车流量","needs":true, "placeholder":"请输入交通/车流量要求" },
              search.floor,
              { "id": "floorheight","title": "层高","needs":true, "placeholder":"请输入层高" },
              search.structure,
              search.pricename,
            ]
            this.isPre = true
            this.typeName = '我要预租'
            break
          default:
            break;
        }
      },
      selectDone(file) {
        let _this = this
        lrz(file,{
          quality:0.3,
          width:600,
          fieldName: 'headimg'
        }).then(function (rst) {
          _this.uploadImgs.push({
            src: rst.base64,
            file: rst.formData
          })
          _this.$refs.uploadFiles.finished()
        }).catch(function (err) {
          alert('浏览器不支持上传图片')
        });
      },
      selectImg() {
        this.$refs.uploadFiles.$refs.file.click()
      },
      deleteUploadImg(index) {
        this.uploadImgs.splice(index,1)
      },
      arrSelect(item , index) {
        var iIndex = item.arrSelectIndex.indexOf(index)
        if(iIndex < 0){
          this.formDate[item.id][item.arrSelectIndex.length] = {}
          this.formDate[item.id][item.arrSelectIndex.length][item.keyVal] = item.list[index]
          item.arrSelectIndex.push(index)
        }else{
          item.arrSelectIndex.splice(iIndex,1)
          this.formDate[item.id].splice(iIndex,1)
        }
      },
      showPicker(item,index) {
        let picker = this.$refs.picker
        let listCreat = []
        item.list.forEach(function(element) {
          listCreat.push({text:element,value:index})
        });
        if(!listCreat.length && item.id == 'areaid'){
          alert('请选择城市')
          return
        }
        this.pickerData = [listCreat]
        this.pickerSelected = [item.selectIndex]
        picker.scrollTo(0,item.selectIndex)
        picker.show()
      },
      handleSelect(index, args) {
        let id = args[3]
        let text = args[2]
        let number = args[1]
        let obj = this.publishTypeList[id]
        obj['selectIndex'] =  number[0]
        this.formDate[obj.id] = text[0]
      },
      submitBtn() {
        
        let _this = this
        let allneeds = true
        _this.publishTypeList.forEach(element => {
          if(element.needs && !_this.formDate[element.id]){
            allneeds = false
            console.log(element.id)
          }
        });
        if((!this.uploadImgs.length && !this.isPre) || !allneeds){
          alert('请上传带*号的必要描述')
          return
        }
        _this.formDate.areaname = parseFloat(_this.formDate.areaname)
        if(_this.formDate.pricename) {
          _this.formDate.pricename = parseFloat(_this.formDate.pricename)
        }
        if(_this.formDate.floor){
           if(_this.formDate.floor === '10层以上'){
             _this.formDate.floor = 11
           }else{
             _this.formDate.floor = parseFloat(_this.formDate.floor)
           }
        }
        if(_this.formDate.carportnum){
           if(_this.formDate.carportnum === '5个以上'){
             _this.formDate.carportnum = 6
           }else{
             _this.formDate.carportnum = parseFloat(_this.formDate.carportnum)
           }
        }
        if(_this.formDate.powercharge){
           _this.formDate.powercharge = parseFloat(_this.formDate.powercharge)
        }
        if(_this.formDate.watercharge){
           _this.formDate.watercharge = parseFloat(_this.formDate.watercharge)
        }
        if(_this.formDate.powersupply){
           _this.formDate.powersupply = parseFloat(_this.formDate.powersupply)
        }
        if(_this.formDate.healthcharge){
           _this.formDate.healthcharge = parseFloat(_this.formDate.healthcharge)
        }
        if(_this.formDate.ageround){
            let ageroundArr = _this.formDate.ageround.split('-')
           _this.formDate.ageroundone = parseFloat(ageroundArr[0])
           _this.formDate.ageroundtwo = parseFloat(ageroundArr[1])
        }
        
        
         //预租
        if(this.isPre){
          _this._preRentHouse()
          return
        }
        for(let x in _this.areaList){
          if(_this.areaList[x].areaname === _this.formDate.areaid){
            _this.formDate.areaid = _this.areaList[x].areaid
          }
        }
        
        _this.showloading = true
        if(_this.formDate.picAry.length === _this.uploadImgs.length){
          _this.showloading = false
          _this.uploadHouse()
          return
        }
        this.uploadImgs.forEach(element => {
          uploadImg(localStorage.getItem('usertoken'),element.file).then((res) => {
            if(!res.code){
              _this.formDate.picAry.push({picurl: res.data.headimg})
              if(_this.formDate.picAry.length === _this.uploadImgs.length){
                _this.showloading = false
                _this.uploadHouse()
              }
            }else{
              alert(res.msg)
            }
          })
        });
        return
      },
      uploadHouse() {
        let _this = this
        houseUpload(localStorage.getItem('usertoken'),this.formDate,this.$route.params.id).then((res) => {
          if(!res.code){
            alert('上传成功')
            this.$router.push({
              path: '/pc/myPublish'
            })
          }else{
            alert(res.msg)
            // this.$router.go({
            // })
          }
        })
      },
      _preRentHouse() {
        let _this = this
        if(_this.formDate.houseType){
          switch (_this.formDate.houseType) {
            case "厂房仓库":
              _this.formDate.houseType = 1
              break;
            case "办公写字楼":
              _this.formDate.houseType = 2
              break;
            case "店铺":
              _this.formDate.houseType = 3
              break;
            case "住房":
              _this.formDate.houseType = 4
              break;
            default:
              break;
          }
        }
          delete _this.formDate.picAry
          delete _this.formDate.showtypeAry
        addBefore(localStorage.getItem('usertoken'),this.formDate).then((res) => {
          if(!res.code){
            alert('提交成功')
            _this._getPublishType()
          }else{
            alert(res.msg)
          }
        })
      },
      _getAreaList(cirtyId){
        let _this = this
        getAreaList(localStorage.getItem('usertoken'), cirtyId).then((res) => {
          if(!res.code){
            let arealist = {}
            res.data.forEach(element => {
              arealist[element.areaid] = {}
              arealist[element.areaid]['areaname'] = element.areaname
              arealist[element.areaid]['areaid'] = element.areaid
            });
            _this.setAreaList(arealist)
          }else{
            alert(res.msg)
          }
        })
      },
      ...mapMutations({
        setAreaList: 'SET_AREA_LIST'
      })
    },
    watch: {
      areaList(to , from) {
        if(from === to){
          return
        }
        this.publishTypeList[3].list = this.areaidListobj.list
      },
      homeCity(to , from) {
        if(from === to){
          return
        }
        this._getAreaList(to.cityid)
      }
    },
    components: {
      Picker,
      Uploader,
      Loading,
      Between
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  #publishPage
    width 100%
    padding 10px 0
    background-color $color-white
    z-index 2
    .listContentS
      height 100%
      width 800px
      margin 0 auto
      p.title
        margin-bottom 10px
      .listContent
        width 100%
        border 1px solid $color-border
        .buttonG
          color $color-white
          width 400px
          height 40px
          text-align center
          border-radius 10px
          margin 50px auto
          line-height 40px
          background-color $color-theme
         ul
          width 100%
          padding 0 15px
          background-color #fff
          color #909090
          box-sizing border-box
          margin-bottom 10px
          .picList
            padding 10px 0
            .listBox
              .addButton
                display inline-block
              .uploadImgBox
                position relative
                display inline-block
                padding 10px 10px 10px 0
                .uploadItem
                  width 58px
                  height 58px
                  border-radius 3px
                  border 1px solid $color-theme
                .deletBtn
                  position absolute
                  top 2px
                  right 2px
                  width 16px
                  height 16px
            img
              width 60px
              height 60px
          i
            color $color-theme
            text-decoration none
            font-style normal
          li
            min-height 49px
            display flex
            font-size: $font-size-medium
            align-items center
            b
              width 95px
            img 
              width 15px
              margin 0 0 0 10px
            .arrBox
              b
                width 100%
                display block
                line-height 49px
                font-weight bold
                border-bottom 1px solid $color-border
              .arrSelect
                display flex
                padding 10px 0
                flex-flow row wrap
                flex 1
                .arrItem
                  border 1px solid $color-border
                  border-radius 3px
                  padding 5px 10px
                  margin 5px
                  color #909090
                  &.active 
                    border 1px solid $color-theme
                    color $color-theme
            textarea
              flex 1
              resize none
              margin 10px 0
              height 80px
              border 1px solid $color-border
              box-sizing border-box
              font-size $font-size-medium
              padding 10px 0
              text-indent 20px
              line-height 20px
              overflow hidden
              color: $color-text
              &::placeholder
                color: $color-text-d
            select
              flex 1
              line-height 30px
              text-align left
              text-indent 20px
              height 32px
              border 1px solid $color-border
              background: $color-white
              color: $color-text
            input
              flex 1
              line-height 30px
              text-align left
              text-indent 20px
              border 1px solid $color-border
              background: $color-white
              color: $color-text
              &::placeholder
                color: $color-text-d

            
      
</style>