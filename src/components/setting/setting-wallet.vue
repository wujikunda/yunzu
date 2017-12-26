<template>
  <div class = "settingView">
    <section class="member">
      <div class="box">
        <img src="~common/image/wodeqianbao.png" alt="">
        <div id="qrcode">

        </div>
        <span>余额</span>
        <p>{{money}}元</p>
        <div style="color:#cbcbcb">({{checkPay() ? '已': '未'}}缴纳押金)</div>
      </div>
      <div class="buttonC" @click="_managerCashGet">缴纳押金</div>
      <div class="buttonB" @click="_refund">退还押金</div>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getAccountMoney, payForRent, refund, userInfo, managerCashGet} from 'api/setting'
  import QRcode from 'common/js/qrcode'
  export default {
    props: {
    },
    data() {
      return {
        money:'0.00',
        amount:''
      }
    },
    mounted() {
      this._showMoney()
      this._getUserInfo()
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
      _getUserInfo() {
        userInfo(localStorage.getItem('usertoken')).then((res) => {
          if(!res.code){
            localStorage.setItem('__paycash__',res.data.paycash)
          }else{
            alert(res.msg)
          }
        })
      },
      checkPay() {
        return !!parseInt(localStorage.getItem('__paycash__'))
      },
      _payForRent(amount) {
        payForRent(localStorage.getItem('usertoken'), amount).then((res) => {
          if(!res.code){
            location.href = res.data.redirect_url
          }else{
            alert(res.msg)
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
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .settingView 
    position fixed
    z-index 120
    background-color $color-background
    height calc(100% - 50px)
    left 0
    top 0
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
  .buttonC
    color $color-white
    background-color $color-theme
    buttonD()
    margin-top 50px
  .buttonB
    color $color-white
    background-color #5cb5f2
    buttonD()
    margin-top 20px
</style>