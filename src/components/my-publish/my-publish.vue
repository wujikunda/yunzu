<template>
    <div id = "myPublish">
    <section class="myPublishCont">
      <scroll :data = "publishList" class="listContentS" :pullup="true" @scrollToEnd="updateLoad">
        <div class="listContent">
          <ul>
            <li v-for="(item, index) in publishList" :key="index" @click="selcetHome(item)">
              <img class="posImg" :src="item.picurl" @error="_loadError">
              <div class="textBox">
                <div class="textCont">
                  <b>{{item.title}}</b>
                </div>
                <div class="textCont">
                  浏览量: {{item.hot}}
                  <span class="color-theme">{{houseType(item.housetype)}}</span>
                </div>
                <div class="textCont">
                  价格: {{item.pricename}}元/㎡
                </div>
              </div>
              <span class="color-theme">{{item.typename}}</span>
            </li>
          </ul>
          <div class="blank"></div>
        </div>
      </scroll>
    </section>
    <footer>
      <div class="buttonG" @click="toPublish">上传房源</div>
    </footer>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getPublishList} from 'api/publish'
  import Scroll from 'base/scroll/scroll'
  import {loadError} from 'common/js/dom'
  import {mapMutations} from 'vuex'
  export default {
    props: {
    },
    data() {
      return {
        publishList:[
        ]
      }
    },
    mounted() {
      this._getPublishList()
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
      _getPublishList(obj) {
        getPublishList(localStorage.getItem('usertoken'),obj).then((res) => {
          if(!res.code){
            if(!res.data){
              return 
            }
            this.publishList = res.data
          }else{
            alert(res.msg)
          }
        })
      },
      selcetHome(item) {
        this.$router.push({
          path:`/home/detail/${item.listid}`
        })
        this.setHomeDetial(item)
      },
      toPublish() {
        this.$router.push({
          path:'/myPublish/publishType'
        })
      },
      _loadError(event) {
        loadError(event)
      },
      updateLoad() {
        if(this.publishList.length<10){
          return
        }
        this._getPublishList({limit: this.publishList.length+10})
      }, 
      ...mapMutations({
        setHomeDetial: 'SET_HOME_DETIAL'
      })
    },
    watch: {
      $route(to, form) {
        if(to.path.indexOf('myPublish') > -1){
          this._getPublishList()
        }
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
  #myPublish
    .myPublishCont
      height 100%
      width 100%
      position fixed
    footer
      position fixed
      bottom 50px
      width 100%
      .buttonG
        color $color-white
        width 100%
        height 50px
        text-align center
        line-height 50px
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
            height 99px
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