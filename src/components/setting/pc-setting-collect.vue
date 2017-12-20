<template>
  <div id = "compareList">
    <section class="compareListCont">
      <p class="pTitle">我的收藏</p>
      <div class="listContentS">
        <div class="listContent">
          <ul>
            <li v-for="(item, index) in collectList" :key="index" @click="selcetHome(item)" class="needsclick">
              <img class="posImg" :src="item.picurl" @error="_loadError" alt="">
              <div class="textBox">
                <div class="textCont">
                  <b>{{item.title}}</b>
                </div>
                <div class="textCont">
                  {{item.pricename}}元/㎡
                  <span class="color-theme">{{houseType(item.housetype)}}</span>
                </div>
                <div class="textCont">
                  <div class="hotNum"><img src="~common/image/icon_fire.png" alt="">{{item.hot}}</div>
                  <span @click.stop="removeCollect(item,index)" style="color:#5cb5f2;cursor:pointer">删除</span>
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
  import {collectList, collectOperation} from 'api/setting'
  
  import {changeImage, loadError} from 'common/js/dom'
  import {mapMutations} from 'vuex'
  export default {
    props: {
    },
    data() {
      return {
        collectList:[
        ],
        selectList:[
        ]
      }
    },
    mounted() {
      this._getCollectList()
    },
    methods: {
      _getCollectList(obj) {
        let _this = this
        collectList(localStorage.getItem('usertoken'),obj).then((res) => {
          if(!res.code){
            _this.collectList = res.data
          }else{
            alert(res.msg)
          }
          // console.log('getHomeList',res)
        })
      },
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
      updateLoad() {
        if(this.collectList.length<10){
          return
        }
        this._getCollectList({limit: this.collectList.length+10})
      }, 
      _loadError(event) {
        loadError(event)
      },
      removeCollect(item,index) {
        let houseid = item.listid
        let coltype = 1;
        collectOperation(localStorage.getItem('usertoken'), houseid, coltype).then((res) => {
          if(!res.code){
            this.collectList.splice(index,1)
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
      ...mapMutations({
        setHomeDetial: 'SET_HOME_DETIAL'
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
    .listContentS
      .listContent
        width 100%
        .blank
          height 150px
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
            .posImg
              width 160px
              height 120px
              background-color $color-border
              object-fit cover
            .selImg
              height 15px
              width 15px


</style>