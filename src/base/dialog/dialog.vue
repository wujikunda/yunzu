<template>
  <div class="mask">
    <slot></slot>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String,
        default: '加载中'
      }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .mask
    position fixed
    width 100%
    left 0
    top 0
    height 100%
    z-index 999
    display flex
    background-color $color-background-d
    align-items center
    justify-content center
    .dialog
      background-color #fff
  
</style>
