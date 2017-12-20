<template>
    <div id = "publishPage">
    <loading v-show="showloading"></loading>
    <picker @select="handleSelect(1,arguments)" :data="pickerData" :selected-index="pickerSelected"
            ref="picker" :title="''" :cancelTxt="'取消'"
            :confirmTxt="'完成'"></picker>
      <div class="listContentS">
      <div class="listContent">
        <ul>
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
            <b v-if="!item.select">{{item.title}} <i v-if="item.needs">*</i></b>
            <input type="text" v-model="formDate[item.id]" v-if="item.placeholder"  :placeholder="item.placeholder"/>
            <select v-model="formDate[item.id]" v-if="!item.placeholder && !item.select" >
              <option v-for="(ele, i) in item.list" :key="i">{{ele}}</option>
            </select>
            <div class="arrBox" v-if="item.select">
              <b>{{item.title}} <i v-if="item.needs">*</i></b>
              <div class="arrSelect">
                <span  @click="arrSelect(item,a)" class="arrItem" :class="{'active': item.arrSelectIndex.indexOf(a)>-1}" v-for="(arr,a) in item.list" :key="a">
                  {{arr}}
                </span>
              </div>
            </div>
          </li>
          <li>
            <textarea placeholder="请输入您对房源的简单描述" v-model="formDate.housedesc"></textarea>
          </li>
          <li>
            <textarea placeholder="请输入您对房源周边的简单描述" v-model="formDate.addressdesc"></textarea>
          </li>
        </ul>
        <div class="buttonG" @click="submitBtn">立即发布</div>
        <div class="blank"></div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import Picker from 'base/picker/picker'
  import Uploader from 'base/uploader/uploader'
  import Loading from 'base/loading/loading'
  import {getPubliList} from 'api/home'
  import {deepCopy} from 'common/js/util'
  import {houseUpload} from 'api/publish'
  import {uploadImg} from 'api/setting'
  import {mapGetters} from 'vuex'
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
        'areaList'
      ])
    },
    data() {
      return {
        pickerData: [[]],
        pickerSelected: [-1],
        formDate:{},
        publishTypeList:[],
        showloading:false,
        uploadImgs: []
      }
    },
    activated() {
      this._getPublishType()
    },
    methods: {
      _getPublishType() {
        var search  = deepCopy(getPubliList())
        this.publishTypeList = []
        this.uploadImgs = []
        this.formDate = {
          'picAry':[
          ],
          'showtypeAry':[
          ]
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
              search.rentway,
              search.showtype_ary,
              search.ageround,
              search.checkin,
              search.tenancy,
              search.payway,
              search.floorheight,
              search.structure,
              search.transportation,
              search.carwidth,
              search.source,
              search.orientation,
              search.affect,
              search.awaywater,
              search.drain,
              search.qs,
              search.powercharge,
              search.watercharge,
              search.propertyright,
              search.firecontrol,
              search.redchart,
              search.power
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
              search.rentway,
              search.showtype_ary,
              search.ageround,
              search.checkin,
              search.tenancy,
              search.payway,
              search.nearpark,
              search.carportnum,
              search.register,
              search.floor,
              search.structure,
              search.source,
              search.propertyright,
              search.redchart,
              search.qs,
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
              search.rentway,
              search.place,
              search.showtype_ary,
              search.ageround,
              search.checkin,
              search.tenancy,
              search.payway,
              search.nearpark,
              search.carportnum,
              search.transportation,
              search.floor,
              search.structure,
              search.source,
              search.propertyright,
              search.redchart,
              search.firecontrol,
              search.power,
              search.qs
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
              search.rentway,
              search.payway,
              search.completetime,
              search.showtype_ary,
              search.ageround,
              search.source,
              search.checkin,
              search.tenancy,
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
              search.lighting,
              search.monitoring,
              search.parknum,
              search.noise,
              search.elevator
            ]
            this.formDate.nearbyAry = []
            this.typeName = '住房高级筛选'
            break;
          default:
            break;
        }
      },
      selectDone(file) {
        this.uploadImgs = file
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
            console.log(element.id)
            allneeds = false
          }
        });
        console.log(_this.formDate)
        if(!this.uploadImgs.length || !allneeds){
          alert('请上传带*号的必要描述')
          return
        }
        for(let x in _this.areaList){
          if(_this.areaList[x].areaname === _this.formDate.areaid){
          console.log(_this.formDate.areaid)
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
              console.log(res)
              _this.formDate.picAry.push({picurl: res.data.headimg})
              console.log(_this.formDate)
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
      }
    },
    components: {
      Picker,
      Uploader,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  #publishPage
    width 100%
    position absolute
    left 0
    top 100px
    background-color $color-white
    z-index 2
    .listContentS
      height 100%
      width 800px
      margin 0 auto
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
              padding 0 0 0 10px
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
            textarea
              flex 1
              resize none
              margin 10px 0
              height 80px
              border 1px solid $color-border
              box-sizing border-box
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