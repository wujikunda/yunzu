<template>
    <div id = "publishPage">
    <loading v-show="showloading"></loading>
    <picker @select="handleSelect(1,arguments)" :data="pickerData" :selected-index="pickerSelected"
            ref="picker" :title="''" :cancelTxt="'取消'"
            :confirmTxt="'完成'"></picker>
    <scroll :data = "publishTypeList" class="listContentS">
      <div class="listContent">
        <div class="selectTab" v-if="!isPre">
          <div class="title">
            <img src="~common/image/icon_pos_checked.png" alt="pos">
            <span>城市选择</span>
          </div>
          <div class="title" @click='toSelectCity'>
            <span>{{homeCity.cityname}}</span>
            <img src="~common/image/icon_arror_right.png" alt="pos">
          </div>
        </div>
        <ul v-if="!isPre">
          <li ><b>上传房源照片<i>*</i></b></li>
          <div class="picList">
            <div class="listBox">
              <div class="uploadImgBox" v-for="(item, index) in uploadImgs" :key="index">
                <img class="uploadItem" :src="item.src" >
                <img class="deletBtn" @click="deleteUploadImg(index)" src="~common/image/button_shanchu.png" alt="删除">
              </div>
              <div class="addButton"><img @click="selectImg" class="needsclick" src="~common/image/button_addHouse.png" alt="上传照片"></div>
            </div>
            <uploader ref="uploadFiles"  @selectFinish="selectDone" v-show="false" :hideImg="true"></uploader>
          </div>
        </ul>
        <ul>
          <li v-for="(item, index) in publishTypeList" :key="index">
            <b v-if="!item.select" :style="item.fontColor? 'color:'+item.fontColor : ''">{{item.title}} <i v-if="item.needs">*</i></b>
            <input type="text" v-model="formDate[item.id]" v-if="item.placeholder"  :placeholder="item.placeholder"/>
            <div class="pickerSelect" @click="showPicker(item,index)" v-if="!item.placeholder && !item.select && !item.udefine">{{item.selectIndex !== -1 ? item.list[item.selectIndex] : '请选择'}}</div>
            <img v-if="!item.placeholder && !item.select && !item.udefine" src="~common/image/icon_arror_right.png">
            <div class="udefine"  v-if="item.udefine" >
              <between @getValue="_getValue($event, item)"></between>
            </div>
            <div class="arrBox" v-if="item.select">
              <b>{{item.title}} <i v-if="item.needs">*</i></b>
              <div class="arrSelect">
                <span  @click="arrSelect(item,a)" class="arrItem" :class="{'active': item.arrSelectIndex.indexOf(a)>-1}" v-for="(arr,a) in item.list" :key="a">
                  {{arr}}
                </span>
              </div>
            </div>
          </li>
          <li v-if="isPre">
            <textarea placeholder="请输入其他要求..." v-model="formDate.desc"></textarea>
          </li>
          <li v-if="!isPre">
            <textarea placeholder="请输入您对房源的简单描述..." v-model="formDate.housedec"></textarea>
          </li>
          <li v-if="!isPre">
            <textarea placeholder="请输入您对房源周边的简单描述..." v-model="formDate.addressdesc"></textarea>
          </li>
          
        </ul>
        <div class="blank"></div>
      </div>
    </scroll>
    <footer>
      <div class="buttonG" @click="submitBtn">{{isPre? "确认提交" : "立即发布"}}</div>
    </footer>
  </div>
</template>

<script type="text/ecmascript-6">
  import Picker from 'base/picker/picker'
  import Uploader from 'base/uploader/uploader'
  import Between from 'base/between/between'
  import Loading from 'base/loading/loading'
  import Scroll from 'base/scroll/scroll'
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
        pickerData: [[]],
        pickerSelected: [-1],
        formDate:{
          'picAry':[
          ],
          'showtypeAry':[
          ],
          'nearby': []
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
        this.formDate[item.id] = event + '年'
      },
      _getPublishType() {
        var search  = deepCopy(getPubliList())
        this.publishTypeList = []
        this.uploadImgs = []
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
              search.floorheight,
              search.structure,
              search.transportation,
              search.carwidth,
              search.carportnum,
              search.carportarea,
              search.source,
              search.orientation,
              search.affect,
              search.awaywater,
              search.drain,
              search.powercharge,
              search.watercharge,
              search.propertyright,
              search.firecontrol,
              search.redchart,
              search.power,
              search.powersupply
            ]
            this.typeName = '厂房仓库高级筛选'
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
              search.structure,
              search.source,
              search.propertyright,
              search.redchart,
              search.firecontrol,
              search.orientation
            ]
            this.typeName = '办公写字楼高级筛选'
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
              search.transportation,
              search.floor,
              search.structure,
              search.source,
              search.propertyright,
              search.redchart,
              search.firecontrol,
              search.power,
              search.powersupply
            ]
            this.typeName = '店面高级筛选'
            break;
          case '4':
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
              search.payway,
              search.completetime,
              search.showtype_ary,
              search.ageround,
              search.source,
              search.checkin,
              search.floorheight,
              search.orientation,
              search.hourseage,
              search.powercharge,
              search.watercharge,
              { "id": "propertycharge","title": "物业费(元/月)","needs":true, "placeholder":"请输入物业费" },
              search.type,
              search.balcony,
              { "id": "developers","title": "开发商","needs":true, "placeholder":"请输入开发商" },
              { "id": "propertycompany","title": "物业公司","needs":true, "placeholder":"请输入物业公司" },
              { "id": "sharedarea","title": "公摊比例","needs":true, "placeholder":"请输入公摊比例" },
              { "id": "households","title": "总户数", "placeholder":"请输入总户数" },
              { "id": "plotratio","title": "容积率", "placeholder":"请输入容积率" },
              { "id": "greenrate","title": "绿化率", "placeholder":"请输入绿化率" },
              { "id": "brandmessage","title": "品牌信息", "placeholder":"请输入品牌信息" },
              { "id": "style","title": "装修风格", "placeholder":"请输入装修风格" },
              { "id": "furniture","title": "家具", "placeholder":"请输入家具" },
              { "id": "stylelevel","title": "装修程度", "placeholder":"请输入装修程度" },
              search.nearby,
              search.carportnum,
              search.carportarea,
              search.lighting,
              search.monitoring,
              search.parknum,
              search.noise,
              search.elevator
            ]
            this.formDate.nearbyAry = []
            this.typeName = '住房高级筛选'
            break;
          case 'preLease':
            this.publishTypeList = [
              { "id": "name","title": "姓名","needs":true, "placeholder":"请输入您的姓名" },
              { "id": "phone","title": "电话","needs":true, "placeholder":"请输入您的电话" },
              { "id": "business","title": "业务范围","needs":true, "placeholder":"请输入业务范围" },
              search.areaname,
              search.address,
              { "id": "transportation","title": "交通/车流量","needs":true, "placeholder":"请输入交通/车流量要求" },
              search.floor,
              { "id": "floorheight","title": "层高","needs":true, "placeholder":"请输入层高" },
              search.structure,
              search.pricename
            ]
            this.isPre = true
            this.typeName = '我要预租'
            break
          default:
            break;
        }
        
      },
      toSelectCity() {
        this.$router.push({
          path:'/searchPage/city'
        })
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
        picker.refresh()
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
          }
        });
        if((!this.uploadImgs.length && !this.isPre) || !allneeds){
          alert('请上传带*号的必要描述')
          return
        }
        _this.formDate.areaname = parseFloat(_this.formDate.areaname)
        _this.formDate.pricename = parseFloat(_this.formDate.pricename)
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
              path: '/myPublish'
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
        addBefore(localStorage.getItem('usertoken'),this.formDate).then((res) => {
          if(!res.code){
            alert('提交成功')
            _this.$router.back()
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
      Scroll,
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
    height 100%
    left 0
    top 0
    width 100%
    position fixed
    background-color $color-background
    z-index 2
    .listContentS
      height 100%
      overflow hidden
      .listContent
        width 100%
        .blank
          height 80px
          background-color $color-background
        .selectTab
          display flex
          align-items center
          justify-content space-between
          font-size $font-size-medium-x
          height 40px 
          width 100%
          padding 0 5px
          margin-bottom 10px
          box-sizing border-box
          background-color #fff
          border-top 1px solid $color-border
          border-bottom 1px solid $color-border
          .title
            display flex
            align-items center
            img 
              width 18px
              height 18px
              margin 0 10px
        ul
          width 100%
          padding 0 15px
          background-color #fff
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
            border-bottom 1px solid $color-border
            b
              width 95px
              font-weight bold
            img 
              width 15px
              margin 0 0 0 10px
            .pickerSelect 
              flex 1
              line-height 40px
              text-align right
            .udefine
              flex 1
              display flex
              flex-direction row-reverse
              line-height 30px
              input
                outline none
                flex 0
                width 60px
                margin 0 5px
                line-height 30px
                border 1px solid $color-border
                background: $color-white
                color: $color-text
                &::placeholder
                  color: $color-text-d
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
              border none 
              outline none
              font-size $font-size-medium
              resize none
              height 80px
              box-sizing border-box
              padding 10px 0
              line-height 20px
              overflow hidden
              color: $color-text
              &::placeholder
                color: $color-text-d
            input
              outline none
              flex 1
              line-height 40px
              text-align right
              background: $color-white
              color: $color-text
              &::placeholder
                color: $color-text-d

            
    footer
      position fixed
      bottom 0px
      width 100%
      .buttonG
        color $color-white
        width 100%
        height 40px
        text-align center
        line-height 40px
        background-color $color-theme
</style>