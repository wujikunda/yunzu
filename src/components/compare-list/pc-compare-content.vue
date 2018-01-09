<template>
    <div id = "compareContent">
      <div class="listContentS">
        <div class="listContent">
          <div class="comparePicCont">
            <div class="picLs">
              <div class="compPictureBox"  v-for="(item, index) in selectList" :key="index">
                <img class="posImg" :src="item.picurl" @error="_loadError" >
              </div>
            </div>
            <div class="compareBtn"  @click="reCompare" style="cursor:pointer"><span>重新选择</span></div>
          </div>
          <p>对比信息</p>
          <ul class="tableBox" v-if="compareCont[1].title">
            <li v-for="(item, index, key ) in compareCont[1]" :key="key" v-if="showID.hasOwnProperty(index)">
              <span>{{showID[index]}}</span><div>{{compareCont[0][index] || '--'}}</div><div>{{compareCont[1][index] || '--'}}</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
  import {loadError} from 'common/js/dom'
  import {getCompareCont} from 'api/compare'
  import {getHomeDetial} from 'api/home'
  import {mapGetters} from 'vuex'
  export default {
    props: {
    },
    
    data() {
      return {
        compareCont:[
          {},{}
        ],
        showID:{
          address:'导航地址',
          addressdesc:'周边描述',
          affect:'扰民程度',
          ageround:'年限',
          awaywater:'排水量',
          carportarea:'车位面积',
          carportnum:'车位个数',
          carwidth:'车辆进出长度',
          checkin:'装修期',
          drain:'排污量:',
          firecontrol:'消防措施',
          floor:'楼层',
          housedec:'房源描述',
          nearpark:'附近停车场',
          orientation:'朝向',
          payway:'付款方式',
          power:'供电',
          powersupply:'供电率',
          powercharge:'电费',
          propertyright:'产权',
          pricename:'价格',
          register:'能否注册公司',
          redchart:'红线图',
          rentway:'租金递增方式',
          source:'来源',
          structure:'结构',
          tenancy:'租期',
          title:'名称',
          totalprice:'总价',
          transportation:'交通',
          type:'类型',
          watercharge:'水费',
          hourseage:'年代',
          propertycharge:'物业费',
          balcony:'是否有阳台',
          developers:'开发商',
          propertycompany:'物业公司',
          sharedarea:'公摊比例',
          households:'总户数',
          plotratio:'容积率',
          brandmessage:'品牌信息',
          style:'装修风格',
          furniture:'家具',
          stylelevel:'装修程度',
          nearby:'附近',
          lighting:'采光',
          monitoring:'保安监控',
          noise:'噪音',
          elevator:'电梯'
        }
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
        this._getHomeDetial(this.selectList[0].listid,this.selectList[0].housetype,0)
        this._getHomeDetial(this.selectList[1].listid,this.selectList[1].housetype,1)
      },
      _getHomeDetial( listid, housetype, index) {
        getHomeDetial(localStorage.getItem('usertoken'), listid, housetype).then((res) => {
          if(!res.code){
            this.$set(this.compareCont, index, res.data)
          }else{
            this.$router.back()
            alert(res.msg)
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
    position relative
    width 100%
    height 100%
    z-index 102
    top 0px
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
              width 109px
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