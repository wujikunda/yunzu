<template>
  <div id = "compareList">
    <section class="compareListCont">
      <div class="listContentS">
        <div class="listContent">
          <div class="comparePicCont">
            <div class="picLs">
              <div class="compPictureBox"  v-for="(item, index) in selectList" :key="index">
                <img class="posImg" :src="item.picurl" @error="_loadError" >
                <img class="deleBtn" @click="selectToCompare(item)" src="~common/image/button_shanchu.png" alt="删除" style="cursor:pointer">
              </div>
            </div>
            <div class="compareBtn"  style="cursor:pointer" @click="compareStart"  v-show="selectList.length > 1"><span>开始对比</span></div>
          </div>
          <ul>
            <li v-for="(item, index) in conpareList" :key="index" class="needsclick"  @click="selcetHome(item)" style="cursor:pointer">
              <img class="posImg" :src="item.picurl" @error="_loadError" >
              <div class="textBox">
                <div class="textCont">
                  <b>{{item.title}}</b>
                </div>
                <div class="textCont">
                  {{item.pricename}}元/㎡
                  | {{item.spacename}}㎡
                   | {{houseType(item.housetype)}}
                </div>
                <div class="textCont contBtnBox">
                  <div class="hotNum"><img src="~common/image/icon_fire.png" alt="">{{item.hot}}</div>
                  <div class="contBtn">
                    <span @click.stop="deleteToCompare(item,index)">移出列表</span>
                    <span @click.stop="selectToCompare(item)" class="active" v-if="selectList.indexOf(item) > -1">取消对比</span>
                    <span  @click.stop="selectToCompare(item)" v-else>开始对比</span>
                  </div>
                </div>
              </div>
            </li>
          </ul>
          <div class="blank"></div>
        </div>
      </div>
    </section>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getCompareList, addComparison} from 'api/compare'
  import {changeImage,loadError} from 'common/js/dom'
  import {mapMutations} from 'vuex'
  export default {
    props: {
    },
    data() {
      return {
        conpareList:[
        ],
        selectList:[
        ]
      }
    },
    activated() {
      this._getCompareList()
    },
    mounted() {
      this.listenScroll()
    },
    methods: {
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
      _getCompareList(obj) {
        getCompareList(localStorage.getItem('usertoken'),obj).then((res) => {
          if(!res.code){
            this.conpareList = res.data
          }else{
            alert(res.msg)
          }
        })
      },
      compareStart() {
        var that = this
        let type = [];
        if(that.selectList.length<2){
          alert('请选择两个同一类型房源进行对比')
          return
        }
        that.conpareList.forEach(function(element, index) {
          that.selectList.forEach(function(item,i) {
            if(item.listid === element.listid){
              type.push(element.housetype)
            }
          });
        });
        if(type[0]!==type[1]){
          alert('请对比同一类型房源')
          return
        }
        this.$router.push({
          path:'/pc/compareList/comp'
        })
        this.setSelectList([this.selectList[0], this.selectList[1]])
        
      },
      updateLoad() {
        if(this.conpareList.length<10){
          return
        }
        this._getCompareList({limit: this.conpareList.length+10})
      }, 
      listenScroll(event) {
        let _this = this
        window.addEventListener('scroll',function(){  
          if(document.documentElement.scrollTop + window.innerHeight >= document.body.offsetHeight) { 
            _this.updateLoad()
          }
        })
      },
      _loadError(event){
        loadError(event)
      },
      deleteToCompare(item,index) {
        let id = item.listid
        addComparison(localStorage.getItem('usertoken'),id,1).then((res) => {
          if(!res.code){
            this.conpareList.splice(index,1)
          }else{
            alert(res.msg)
          }
        })
      },
      selectToCompare(item) {
        let id = item.listid
        var index = this.selectList.indexOf(item)
        if(index < 0){
          if(this.selectList.length < 2){
            this.selectList.push(item)
          }
        }else{
          this.selectList.splice(index, 1)
        }
      },
      selcetHome(item) {
        this.$router.push({
          path:`/pc/home/detail/${item.listid}`
        })
        this.setHomeDetial(item)
      },
      ...mapMutations({
        setSelectList: 'SET_SELECT_LIST',
        setHomeDetial:'SET_HOME_DETIAL'
      })
    },
    components: {
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  #compareList
    .compareListCont
      width 100%
      background-color $color-white
    .listContentS
      width 1200px 
      margin 0 auto
      .listContent
        width 100%
        .blank
          height 150px
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
        ul
          width 100%
          padding 0 15px
          border 1px solid $color-border
          box-sizing border-box
          li
            height 160px
            display flex
            border-bottom 1px solid $color-border
            align-items center
            .contBtnBox
              display flex
              justify-content space-between
              img
                width 15px
                margin-right 10px
                margin-bottom -2px
            .textBox
              flex 1
              margin-left 15px
              font-size $font-size-medium-x
              justify-content space-between
              flex-direction column
              display flex
            .textCont
              padding 2px 0
              line-height 40px
              height 40px
              b
                font-size $font-size-large
                font-weight bold
              span
                margin-left 10px
                border-radius 5px
                padding 5px 10px
                border 1px solid $color-theme
                color $color-theme
                cursor pointer
                &.active 
                  color $color-white
                  background-color $color-theme
            .selImg
              height 15px
              width 15px
</style>