<template>
  <section class="listBox">
    <m-dialog v-show="showDialog">
      <div class="dialog">
        <div class="icon">
          <img src="~common/image/button_shanchu.png" alt="删除">
        </div>
        <div class="text">确定要删除吗?</div>
        <div class="btnBox">
          <span class="confirm" @click="confirm">确认</span>
          <span class="cancel" @click="cancel">取消</span>
        </div>
      </div>
    </m-dialog>
    <div class="headerBox">
      <p class="listCount">会员列表 (共{{listNumber}}条记录) <b class="refresh" @click="refresh">刷新</b></p>
      <input-box class="inputBox" placeholder='请输入手机号...'></input-box>
    </div>
    <table-list 
      :tabData="tabData" 
      :tabTitle="tabTitle" 
      :tabControls="tabControls" 
      :showTabControls="true"
      @control="controls"
      @toPage = "toPage"
      :total="111">
    </table-list>
  </section>
</template>

<script type="text/ecmascript-6">
import TableList from 'base/table-list/table-list'
import InputBox from 'components/admin/input-box'
import MDialog from 'base/dialog/dialog'
  export default {
    props: {
    },
    computed: {
      listNumber() {
        return this.tabData.length
      }
    },
    data() {
      return {
        showDialog:false,
        tabData:[],
        tabTitle:[],
        tabControls:[]
      }
    },
    mounted() {
      let arr = []
      let obj = {
        id: 1,
        name: 'dawang',
        date: '1991-02-98',
        money: '1000',
        phone:'111111111568'
      }
      for (let index = 0; index < 10; index++) {
        arr[index] = obj
      }
      this.tabData = arr
      this.tabTitle = ['ID','房源名称 ', '分类', '详情', '审核']
      this.tabControls = [{
        text:'删除',
        icon:'',
        funname:'delete'
      },{
        text:'详情',
        icon:'',
        funname:'detial'
      },{
        text:'通过',
        icon:'',
        funname:'ensure'
      },{
        text:'不通过',
        icon:'',
        funname:'ensure'
      }]

    },
    methods: {
      refresh() {

      },
      cancel() {
        this.showDialog = false
      },
      confirm() {
        this.showDialog = false
      },
      toPage(index) {
        console.log(index)
      },
      controls(type,item) {
        console.log(type,item)
        this.showDialog = true
      }
    },
    components: {
      TableList,
      InputBox,
      MDialog
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .listBox
    width 100%
    .dialog
      background-color #fff
      border-radius 10px
      width 350px
      height 200px
      line-height 30px
      display flex
      flex-direction column
      align-items center
      box-sizing border-box
      padding 20px 0
      .icon
        margin-top 10px
        img
          width 60px
      .btnBox
        display flex
        .confirm,.cancel 
          cursor pointer
          padding 0 20px
          margin 10px
          border 1px solid $color-border
          line-height 35px
          height 35px
          display block
          border-radius 10px
        .confirm 
          background-color $color-theme
          color white
    .headerBox
      padding 20px
      display flex
      line-height 50px
      justify-content space-between
      .refresh
        color $color-theme
        cursor pointer
        margin-left 20px
        &:hover
          text-decoration underline
      .inputBox
        width 400px
</style>