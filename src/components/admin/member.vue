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
      <p class="listCount">会员列表 (共{{tabListNumber}}条记录) <b class="refresh" @click="refresh">刷新</b></p>
      <input-box @serachClick="_serachByPhone" class="inputBox" placeholder='请输入手机号...'></input-box>
    </div>
    <table-list 
      :tabData="tabData" 
      :tabTitle="tabTitle" 
      :tabControls="tabControls" 
      :showTabControls="true"
      @control="controls"
      @toPage = "toPage"
      :total="tabListNumber">
    </table-list>
  </section>
</template>

<script type="text/ecmascript-6">
import TableList from 'base/table-list/table-list'
import InputBox from 'components/admin/input-box'
import MDialog from 'base/dialog/dialog'
import {managerUserList, managerSearchUser} from 'api/admin'
import {formatD} from 'common/js/util'

  export default {
    props: {
    },
    computed: {
   
    },
    data() {
      return {
        showDialog:false,
        tabListNumber:0,
        tabData:[],
        tabTitle:[],
        tabControls:[],
        page:1
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
      this.tabTitle = ['ID', '会员昵称', '注册日期', '缴交押金', '头像', '手机号码']
      this.tabControls = [{
        text:'删除',
        icon: require('common/image/btn_trash.png'),
        funname:'delete',
        color :'#ef5b5c'
      }]
      this._getManagerUserList(1)
    },
    methods: {
      refresh() {
        this._getManagerUserList( this.page )
      },
      _serachByPhone(query) {
        managerSearchUser(query).then((res) => {
          if(!res.code){
            this._formTabList(res.data.list)
            this.tabListNumber = parseInt(res.data.usernum)
          }else{
            alert(res.msg)
          }
        })
      },
      cancel() {
        this.showDialog = false
      },
      confirm() {
        this.showDialog = false
      },
      toPage(index) {
        this.page = index
        this._getManagerUserList( this.page )
      },
      controls(type,item) {
        console.log(type,item)
        this.showDialog = true
      },
      _getManagerUserList( page ) {
        managerUserList(page*10-9, page*10).then((res) => {
          if(!res.code){
            this._formTabList(res.data.list)
            this.tabListNumber = parseInt(res.data.usernum)
          }else{
            alert(res.msg)
          }
        })
      },
      _formTabList(list) {
        let newList = [];
        list.forEach(element => {
          newList.push(
            [
              {
                type:'text',
                id:'userid',
                text:element.userid
              },
              {
                type:'text',
                id:'nickname',
                text:element.nickname
              },
              {
                type:'text',
                id:'createdate',
                text:formatD('yyyy.MM.dd',new Date(element.createdate))
              },
              {
                type:'text',
                id:'paycash',
                text:element.paycash == '1' ? '是' : '否'
              },
              {
                type:'img',
                id:'headimg',
                text:element.headimg
              },
              {
                type:'text',
                id:'mobile',
                text:element.mobile
              }
            ]
          )
        });
        this.tabData = newList
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