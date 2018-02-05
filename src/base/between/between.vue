<template>
  <div class="inputBox">
    <b v-html="title"></b>
    {{surText.left}}
    <input ref="inputf" @click.stop.prevent="" type="text" @change.stop="pricenameIn($event,'min')">
    {{surText.mid}} 
    <input  @click.stop.prevent=""   ref="inputb" type="text" @change.stop="pricenameIn($event,'max')">
    {{surText.right}}
    <span v-show="confirmBtn" style="margin-top:5px"  class="inputBtn" @click.stop="pricenameIn($event,'confirm')">确认</span>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      confirmBtn: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: ""
      },
      surText:{
        type: Object,
        default() {
          return {
            left: "",
            mid: "",
            right: ""
          }
        }
      }
    },
    data() {
      return {
        pricename:{
          min:'',
          max:'',
        },
      }
    },
    methods: {
      pricenameIn(event,id){
        this.pricename[id] = event.target.value
        if(this.pricename.max && this.pricename.min ){
          let text = this.surText.left + this.pricename.min + this.surText.mid + this.pricename.max + this.surText.right
          this.$emit('getValue', text)
        }
      },
      _refresh() {
        this.$refs.inputf.value = ''
        this.$refs.inputb.value = '' 
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .inputBox
    color #909090
    padding 5px
    line-height 30px
    input
      width 60px
      text-indent 5px
      border 1px solid $color-border
      line-height 30px
      border-radius 3px
    .inputBtn
      background-color $color-theme
      color white
      display inline-block
      line-height 30px
      padding 0 10px
      border-radius 5px
</style>