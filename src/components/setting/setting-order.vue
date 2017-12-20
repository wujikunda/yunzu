<template>
  <div id = "compareList">
    <section class="compareListCont">
      <scroll :data = "conpareList" class="listContentS">
        <div class="listContent">
          <ul>
            <li v-for="(item, index) in conpareList" :key="index" @click="selectToCompare(item.listid)" class="needsclick">
              <img class="posImg" :src="item.pic" alt="">
              <div class="textBox">
                <div class="textCont">
                  <b>{{item.title}}</b>
                </div>
                <div class="textCont">
                  销量: {{item.hot}}
                </div>
                <div class="textCont">
                  价格: {{item.pricename}}元/㎡
                </div>
              </div>
                  <div class="textCont color-theme">{{item.typename}}</div>  
            </li>
          </ul>
          <div class="blank"></div>
        </div>
      </scroll>
    </section>

    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import {getOrderList} from 'api/setting'
  export default {
    props: {
    },
    data() {
      return {
        orderList:[
        ],
        rentList:[
        ],
        selectList:[
        ]
      }
    },
    mounted() {
      this._getOrderList()
    },
    methods: {
      _getOrderList() {
        let _this = this
        getOrderList(localStorage.getItem('usertoken')).then((res) => {
          if(!res.code){
            _this.orderList = res.data
          }else{
            alert(res.msg)
          }
        })
      },
      compareStart() {
        var that = this
        that.conpareList.forEach(function(element, index) {
          that.selectList.forEach(function(item) {
            if(item === element.listid){
              // console.log(element.typename,element.listid)
            }
          });
        });
        this.$router.push({
          path:'/compareList/comp'
        })
      },
      selectToCompare(id) {
        console.log("selectToCompare",id)
      }
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
            .posImg
              width 60px
              height 60px
              border-radius 50%
              margin-right 15px
            .selImg
              height 15px
              width 15px


</style>