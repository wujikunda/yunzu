<template>
  <div class = "settingView">
    <Modal
      v-model="showdialog"
      title="云租房产"
      ok-text="支付完成"
      @on-ok="_closeBtn"
      @on-cancel="dialog=false">
      <div class="dialog">
        <div id="qrcode"></div>
        <p style="font-size:18px">请用微信扫描完成押金充值</p>
      </div>
    </Modal>
    <Modal
      v-model="dialog"
      title="云租房产"
      ok-text="确认"
      @on-ok="_refund"
      @on-cancel="dialog=false">
      <p style="font-size:18px">是否确认退还押金?</p>
    </Modal>
    <section class="member">
      <div class="box">
        <img src="~common/image/wodeqianbao.png" alt="">
        <span>余额</span>
        <p>{{money}}元</p>
        <div style="color:#cbcbcb">({{checkPay() ? '已': '未'}}缴纳押金)</div>
      </div>
      <div class="buttonC" @click="_managerCashGet" style="cursor:pointer">缴纳押金</div>
      <div class="buttonB" @click="dialog=true" style="cursor:pointer">退还押金</div>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getAccountMoney, payForRent, refund, userInfo, managerCashGet} from 'api/setting'
  import QRcode from 'common/js/qrcode'
  import MDialog from 'base/dialog/dialog'
  export default {
    props: {
    },
    data() {
      return {
        money:'0.00',
        showdialog:false,
        dialog:false,
        timer:null,
        amount:''
      }
    },
    mounted() {
      this._showMoney()
    },  
    methods: {
      _showMoney() {
        getAccountMoney(localStorage.getItem('usertoken')).then((res) => {
          if(!res.code){
            this.money = parseFloat(res.data.money).toFixed(2)
          }else{
            alert(res.msg)
          }
        })
      },
      checkPay() {
        return !!parseInt(localStorage.getItem('__paycash__'))
      },
      _managerCashGet() { 
        managerCashGet().then((res) => {
          if(!res.code){
            this.amount = parseFloat(res.data)
            this._payForRent(this.amount)
          }else{
            alert(res.msg)
          }
        })
      },
      _payForRent(amount) {
        if(this.haspay){
          this.showdialog = true
          return
        }
        let _this = this
        payForRent(localStorage.getItem('usertoken'), amount).then((res) => {
          if(!res.code){
            this.showdialog = true
            this.haspay = true
            this._getQart(res.data.redirect_url)
            // location.href = res.data.redirect_url
            this.timer = setInterval(this.updateCount,1000)
          }else{
            alert(res.msg)
          }
        })
      },
      _closeBtn(){
        this.showdialog = false
        clearInterval(this.timer)
      },
      updateCount() {
        userInfo(localStorage.getItem('usertoken')).then((res) => {
          if(!res.code){
            localStorage.setItem('__paycash__',res.data.paycash)
            if(!!parseInt(res.data.paycash)){
              clearInterval(this.timer)
              _this.showdialog = false
              alert('缴纳成功')
            }
          }
        })
      },
      _refund() {
        refund(localStorage.getItem('usertoken')).then((res) => {
          if(!res.code){
            alert('退款成功')
            this._showMoney()
            localStorage.setItem('__paycash__','0')
          }else{
            alert(res.msg)
          }
        })
      },
      _getQart(url) {
        var qrcode = new QRcode(document.getElementById("qrcode"), {
          width : 200,//设置宽高  
          height : 200
        });
        qrcode.makeCode(url);
      }
    },
    components:{
      MDialog
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .settingView 
    width 100%
  .box
    background: $color-white
    padding 0 20px
    width 100%
    box-sizing border-box
    height 250px
    line-height: 30px
    position relative
    display flex
    flex-direction column
    align-items center
    justify-content center
    font-size $font-size-large
    span
      margin 10px
    p
      font-size $font-size-large-xx
      color $color-theme
  .dialog
    background-color #fff
    width 100%
    height 100%
    display flex
    justify-content center
    align-items center
    flex-direction column
    line-height 30px
    position relative
    .closeBtn
      position absolute
      right 0
      top 0
  .buttonC
    color $color-white
    background-color $color-theme
    buttonD()
    width 400px
    left 0
    margin 20px auto
  .buttonB
    color $color-white
    background-color #5cb5f2
    buttonD()
    width 400px
    left 0
    margin 20px auto
</style>