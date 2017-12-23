<template>
  <div id = "searchPage" ref="homePage">
    <search-box></search-box>
    <div class="searchType">
      <p>选择搜索类别</p>
      <ul class="typeList">
        <li @click="serchType(1)"><div><img src="~common/image/type_cangfang.png"><span>厂房/仓库</span></div></li>
        <li @click="serchType(2)"><div><img src="~common/image/type_xiezilou.png"><span>办公写字楼</span></div></li>
        <li @click="serchType(3)"><div><img src="~common/image/type_dianmian.png"><span>店面</span></div></li>
        <li @click="serchType(4)"><div><img src="~common/image/type_zhuzhai.png"><span>住房</span></div></li>
      </ul>
    </div>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import SearchBox from 'base/search-box/search-box'
  export default {
    props: {
    },
    data() {
      return {
        posName : '厦门',
        sortObjects: [
        ]
      }
    },
    mounted() {
    },
    methods: {
      serchType( type ) {
        this.$router.replace({
          path:`/searchPage/${type}`
        })
      }
    },
    components: {
      SearchBox
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  #searchPage
    position  fixed
    width 100%
    height 100%
    background-color $color-background
    z-index 2
    .searchType
      p
        font-size $font-size-medium-x
        padding 15px
      .typeList
        li
          box-sizing border-box
          background-color #fff
          display inline-block
          border 1px solid $color-border
          width 50%
          float left
          height 0
          padding-bottom 50%
          position relative
          div
            position absolute
            width 100%
            height 100%
            display flex
            align-items center
            justify-content center
            flex-direction column
            img 
              width 40%
              height 40%
              margin 20px

</style>