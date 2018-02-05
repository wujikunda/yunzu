<template>
    <div id = "myPublish">
    <section class="myPublishCont">
      <div class="listContentS">
        <div class="listContent">
          <div class="publishHeader">
            <p class="headerTitle">选择上传房源属性</p>
            <div class="picLs">
              <div class="iconBox"  v-for="(item, index) in publishType" :key="index" @click="toPublish(item.id)" style="cursor:pointer">
                <img class="iconPic" :src="item.iconSrc" @error="_loadError" >
                <span v-html="item.text"></span>
              </div>
            </div>
          </div>
          <ul>
            <li v-for="(item, index) in publishList" :key="index" @click="selcetHome(item)" style="cursor:pointer">
              <img class="posImg" :src="item.picurl" @error="_loadError">
              <div class="textBox">
                <div class="textCont">
                  <b>{{item.title}}</b>
                </div>
                <div class="textCont">
                  {{item.pricename}}元/㎡
                  &nbsp&nbsp {{item.spacename}}㎡
                  <span class="color-theme">{{houseType(item.housetype)}}</span>
                </div>
                <div class="textCont">
                  <div class="hotNum"><img src="~common/image/icon_fire.png" alt="">{{item.hot}}</div>
                  <span :style="'color:' + getStateColor(item.state)">{{getStateText(item.state)}}</span>
                </div>
              </div>
            </li>
          </ul>
          <div class="blank"></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getPublishList} from 'api/publish'
  import {loadError} from 'common/js/dom'
  import {mapMutations} from 'vuex'
  export default {
    props: {
    },
    data() {
      return {
        publishList:[
        ],
        publishType:[
          {
            iconSrc : require('common/image/type_cangfang.png'),
            text: '厂房/仓库',
            id: 1
          },
          {
            iconSrc : require('common/image/type_xiezilou.png'),
            text: '办公写字楼',
            id: 2
          },
          {
            iconSrc : require('common/image/type_dianmian.png'),
            text: '店面',
            id: 3
          },
          {
            iconSrc : require('common/image/type_zhuzhai.png'),
            text: '住房',
            id: 4
          }
        ]
      }
    },
    mounted() {
      this._getPublishList()
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
      getStateText(id) {
        switch (id) {
          case '0':
            return '未审核'
            break;
          case '1':
            return '审核通过'
            break;
          case '2':
            return '审核未通过'
            break;
          default: return '未审核'
            break;
        }
      },
      getStateColor(id) {
        switch (id) {
          case '0':
            return '#909090'
            break;
          case '1':
            return '#59d33d'
            break;
          case '2':
            return '#ef5b5c'
            break;
          default: return '#909090'
            break;
        }
      },
      _getPublishList(obj) {
        getPublishList(localStorage.getItem('usertoken'),obj).then((res) => {
          if(!res.code){
            this.publishList = res.data
          }else{
            alert(res.msg)
          }
        })
      },
      selcetHome(item) {
        this.$router.push({
          path:`/pc/home/detail/${item.listid}`
        })
        this.setHomeDetial(item)
      },
      toPublish(type) {
        this.$router.push({
          path:`/pc/publishPage/${type}`
        })
      },
      _loadError(event) {
        loadError(event)
      },
      listenScroll(event) {
        let _this = this
        window.addEventListener('scroll',function(){  
          if(document.documentElement.scrollTop + window.innerHeight >= document.body.offsetHeight) { 
            if(_this.$route.path.indexOf('myPublish') > -1){
              _this.updateLoad()
            }
          }
        })
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
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  #myPublish
    .myPublishCont
      width 100%
      background-color $color-white
    footer
      position fixed
      bottom 70px
      width 100%
      .buttonG
        color $color-white
        width 100%
        height 40px
        text-align center
        line-height 40px
        background-color $color-theme
    .listContentS
      width 1200px 
      margin 0 auto
      .listContent
        width 100%
        .blank
          height 150px
        .publishHeader
          width 100%
          height 160px
          padding-top 30px
          display flex
          align-items center
          justify-content center
          .headerTitle
            color #909090
            font-size $font-size-large-x
          .picLs
            display flex
            .iconBox
              margin-left 100px
              display flex
              flex-direction column
              align-items center
              justify-content center
              .iconPic
                width 70px
                margin-bottom 10px
              span
                font-size $font-size-large
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
            .posImg
              width 160px
              height 120px
              background-color $color-theme
              object-fit cover
            .selImg
              height 15px
              width 15px


</style>