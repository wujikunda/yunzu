<template>
  <div id = "publishType">
    <div class="searchType">
      <ul class="typeList">
        <li @click="toPublishType(1)"><div><img src="~common/image/type_cangfang.png"></div><span>厂房/仓库</span></li>
        <li @click="toPublishType(2)"><div><img src="~common/image/type_xiezilou.png"></div><span>办公写字楼</span></li>
        <li @click="toPublishType(3)"><div><img src="~common/image/type_dianmian.png"></div><span>店面</span></li>
        <li @click="toPublishType(4)"><div><img src="~common/image/type_zhuzhai.png"></div><span>住房</span></li>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        selList:[
        ]
      }
    },
    methods: {
      toPublishType(id) {
        this.$router.replace({
          path:`/myPublish/publishPage/${id}`
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  #publishType
    height 100%
    width 100%
    position fixed
    z-index 2
    top 0
    left 0
    background-color $color-background
    .typeList
      background-color #fff
      padding 10px 0
      li
        padding 5px 0
        display flex
        align-items center
        line-height 20px
        flex-direction column
        justify-content center
        img 
          width 60px
          height 60px
          padding 5px
</style>