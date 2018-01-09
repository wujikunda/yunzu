<template>
  <div id = "compareList">
    <section class="compareListCont">
      <p class="pTitle">我的对比</p>
      <div class="listContentS">
        <div class="listContent">
          <div class="comparePicCont">
            <div class="picLs">
              <div class="compPictureBox"  v-for="(item, index) in selectList" :key="index">
                <img class="posImg" :src="item.picurl" @error="_loadError" >
                <img class="deleBtn" @click="selectToCompare(item)" src="~common/image/button_shanchu.png" alt="删除" style="cursor:pointer">
              </div>
            </div>
            <div class="compareBtn"  @click="compareStart"  style="cursor:pointer" v-show="selectList.length > 1"><span>开始对比</span></div>
          </div>
          <p class="no-title" v-show="!conpareList.length">无对比房源</p>

          <ul>
            <li v-for="(item, index) in conpareList" :key="index" style="cursor:pointer" class="needsclick"  @click="selcetHome(item)">
              <img class="posImg" :src="item.picurl" @error="_loadError" >
              <div class="textBox">
                <div class="textCont">
                  <b>{{item.title}}</b>
                </div>
                <div class="textCont">
                  {{item.pricename}}元/㎡
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
        </div>
      </div>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getCompareList,addComparison} from 'api/compare'
  import {changeImage, loadError} from 'common/js/dom'
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
    mounted() {
      this._getHomeList()
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
      _getHomeList() {
        let _this = this
        getCompareList(localStorage.getItem('usertoken')).then((res) => {
          if(!res.code){
            _this.conpareList = res.data
          }else{
            alert(res.msg)
          }
        })
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
      compareStart() {
        var that = this
        let type = [];
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
        this.setSelectList([this.selectList[0],this.selectList[1]])
        
      },
      _loadError(event) {
        loadError(event)
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
      .pTitle
        font-size $font-size-large-x
        color $color-theme
        padding 20px 10px
    .no-title
      text-align center
      line-height 100px
      font-size 30px

    .listContentS
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
            margin-left 15px
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
          box-sizing border-box
          li
            height 160px
            display flex
            border-bottom 1px solid $color-border
            align-items center
            .textBox
              flex 1
              margin-left 15px
              line-height 40px
              font-size $font-size-medium-x
              .textCont
                display flex
                justify-content space-between
                padding 2px 0
                line-height 40px
                height 40px
                b
                  font-size $font-size-large
                  font-weight bold
                img
                  width 15px
                  margin-right 10px
                  margin-bottom -2px
                .contBtn
                  display flex
                  justify-content space-between
                  span
                    margin-left 10px
                    border-radius 5px
                    display block
                    line-height 20px
                    padding 5px 10px
                    border 1px solid $color-theme
                    color $color-theme
                    cursor pointer
                    &.active 
                      color $color-white
                      background-color $color-theme
            .posImg
              width 160px
              height 120px
              background-color $color-border
              object-fit cover
            .selImg
              height 15px
              width 15px
    footer
      margin-top 100px
      .buttonG
        width 300px
        display block
        height 40px
        margin 0 auto
        line-height 40px
        text-align center
        background-color $color-theme
        color $color-white
        font-size $font-size-medium-x
        border-radius 10px


</style>