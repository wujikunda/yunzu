<template>
  <div id = "compareList">
    
    <section class="compareListCont">
      <p class="no-title" v-show="!conpareList.length">无对比房源</p>
      <scroll :data = "conpareList" class="listContentS" :pullup="true" @scrollToEnd="updateLoad">
        <div class="listContent">
          <ul>
            <li v-for="(item, index) in conpareList" :key="index" @click="selectToCompare(item)" class="needsclick">
              <img class="posImg" :src="item.picurl" @error="_loadError" >
              <div class="textBox">
                <div class="textCont">
                  <b>{{item.title}}</b>
                </div>
                <div class="textCont">
                  浏览量: {{item.hot}}
                   <span class="color-theme">{{houseType(item.housetype)}}</span>
                </div>
                <div class="textCont">
                  {{item.pricename}}元/㎡
                  &nbsp&nbsp {{item.spacename}}㎡
                </div>
              </div>
              <img class="selImg" v-show="selectList.indexOf(item) > -1" src="~common/image/secect_checked.png" alt="">
              <img class="selImg" v-show="selectList.indexOf(item) < 0" src="~common/image/select_normal.png" alt="">
            </li>
          </ul>
          <div class="blank"></div>
        </div>
      </scroll>
    </section>
    
    <footer>
      <div class="buttonG" v-show="selectList.length > 1" @click="compareStart">开始对比</div>
    </footer>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import {getCompareList} from 'api/compare'
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
      this._getCompareList()
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
      _getCompareList() {
        this.selectList=[]
        getCompareList(localStorage.getItem('usertoken')).then((res) => {
          if(!res.code){
            if(!res.data){
              return
            }
            this.conpareList = res.data
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
          path:'/compareList/comp'
        })
        this.setSelectList([this.selectList[0],this.selectList[1]])
        
      },
      updateLoad() {
        if(this.conpareList.length<10){
          return
        }
        this._getCompareList({limit: this.conpareList.length+10})
      }, 
      _loadError(event) {
        loadError(event)
      },
      selectToCompare(id) {
        var index = this.selectList.indexOf(id)
        if(index < 0){
          if(this.selectList.length < 2){
            this.selectList.push(id)
          }
        }else{
          this.selectList.splice(index, 1)
        }
      },
      ...mapMutations({
        setSelectList: 'SET_SELECT_LIST'
      })
    },
    components: {
      Scroll
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  #compareList
    .compareListCont
      height 100%
      width 100%
      position fixed
      background-color $color-background
      top 0
      left 0
      z-index 200
    .no-title
      text-align center
      line-height 100px
      font-size 30px
    footer
      position fixed
      z-index 201
      bottom 0px
      width 100%
      .buttonG
        color $color-white
        width 100%
        height 40px
        text-align center
        line-height 40px
        background-color $color-theme
    .listContentS
      height 100%
      overflow hidden
      .listContent
        width 100%
        .blank
          height 150px
          background-color $color-background
        ul
          width 100%
          padding 0 15px
          background-color #fff
          box-sizing border-box
          li
            height 89px
            display flex
            border-bottom 1px solid $color-border
            align-items center
            .textBox
              flex 1
              line-height 20px
              font-size $font-size-medium-x
            .textCont
              padding 2px 0
              span
                padding-left 10px
                border-left 1px solid $color-border
            .posImg
              width 60px
              height 60px
              border-radius 50%
              margin-right 15px
            .selImg
              height 15px
              width 15px


</style>