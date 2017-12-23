<template>
  <div class = "settingView">
    <section class="member" v-if="type ==='member'">
      <loading v-show="showloading"></loading>
      <div class="box">
        <div class="inputBox">
          <span>头像</span>
          <img :src="userimg"  @click="selectImg" class="needsclick" @error="_loadError">
          <uploader ref="uploadFiles"  @selectFinish="selectDone" v-show="false"></uploader>
        </div>
        <div class="inputBox">
          <span>昵称</span>
          <input v-model="username"  placeholder="云租房客"/>
        </div>
      </div>
      <div class="buttonC" @click="editUserInfo">保存</div>
    </section>
    <section class="connect" v-if="type ==='connect'" >
      <wave class="waveBox">
        <div class="warpContent">
          <div class="imgBox">
            <img :src="userimg" alt="">
          </div>
        </div>
      </wave>
      <div class="connectBox">
        <div class="gText">您好,如果您有什么需要</div>
        <div class="gText">可以直接拨打客服热线</div>
      </div>
      <div class="connectBox">
        <div class="tText">17750660008</div>
      </div>
      <div class="connectBox">
        <div class="gText">感谢您的支持</div>
        <div class="gText">谢谢</div>
      </div>
      <div class="connectBox">
        <div class="bText">商业合作联系微信: <div class="tText inline">ly710353029</div></div>
        <div class="bText">联系QQ: <div class="tText inline">710353029</div></div>
        <div class="bText">手机: <div class="tText inline">17750660008</div></div>
        <div class="bText">邮箱: <div class="tText inline">710353029@qq.com</div></div>
      </div>
    </section>
    <section class="suggest" v-if="type ==='suggest'" >
      <div class="box">
        <textarea v-model="suggestText" placeholder="请输入您的意见,我们将与你取的联系"></textarea>
      </div>
      <div class="buttonC" @click="suggestSubmit">提交</div>
    </section>
    <section class="member" v-if="type ==='system'">
      <div class="box">
        <router-link tag="div" class="inputBox" to="/register/3">
          <span>修改密码</span>
          <img class="icon" src="~common/image/icon_arror_right.png" alt="">
        </router-link>
        <div class="inputBox" @click="logout">
          <span>退出账号</span>
          <img class="icon" src="~common/image/icon_arror_right.png" alt="">
        </div>
      </div>
    </section>
    
  </div>
</template>

<script type="text/ecmascript-6">
import Wave from 'base/wave/wave'
import {userLogout} from 'api/login'
import {payForRent} from 'api/home'
import loading from 'base/loading/loading'
import {userInfo,modifyUserInfo,uploadImg,adviceCommit} from 'api/setting'
import {mapGetters, mapMutations} from 'vuex'
import uploader from 'base/uploader/uploader'
import iMlrz from 'lrz'
  export default {
    props: {
    },
    computed: {
      userimg() {
        if(this.imgFile){
          return this.imgFile
        }
        return this.userInfo.logo || require('common/image/tab_center_normal.png')
      },
      ...mapGetters([
        'userInfo'
      ])
    },
    data() {
      return {
        showloading:false,
        file:null,
        imgFile:null,
        suggestText:'',
        type:'',
        username:''
      }
    },
    mounted() {
      this._showpage(this.$route.path)
      
    },  
    methods: {
      _showpage( url) {
        switch(url) {
          case '/setting/member':
            this.type = 'member'
            this.username = this.userInfo.nickname
          break;
          case '/setting/suggest':
            this.type = 'suggest'
          break;
          case '/setting/system':
            this.type = 'system'
          break;
          case '/setting/connect':
            this.type = 'connect'
          break;
          default : 
            console.log('no such page')
          break
        }
      },
      selectImg() {
        this.$refs.uploadFiles.$refs.file.click()
      },
      suggestSubmit() {
        let _this = this
        if(!this.suggestText){
          alert('请输入您的宝贵意见')
          return
        }
        adviceCommit(localStorage.getItem('usertoken'),this.suggestText).then((res) => {
          if(!res.code){
            alert('感谢您的宝贵建议')
            _this.$router.push({
              path: "/setting"
            })
          }else{
            alert(res.msg)
          }
        })
      },
      _loadError(event) {
        event.target.src = require('common/image/tab_center_normal.png')
      },
      selectDone(file) {
        let _this = this
        lrz(file,{
          quality:0.3,
          width:600,
          fieldName: 'headimg'
        }).then(function (rst) {
          _this.file = rst.formData
          _this.imgFile = rst.base64
          _this.$refs.uploadFiles.finished()
        }).catch(function (err) {
          alert('浏览器不支持上传图片')
        });
      },
      _uploadImg(imgObj) {
        let _this = this
        uploadImg(localStorage.getItem('usertoken'),imgObj).then((res) => {
          if(!res.code){
            // console.log(res)
            _this.showloading =false
            _this._modifyUserInfo(res.data.headimg)
          }else{
            alert(res.msg)
            _this.showloading =false
          }
        })
      },
      _modifyUserInfo(url) {
        let _this = this
        modifyUserInfo(localStorage.getItem('usertoken'),{nickname:this.username,logo:url,mobile:this.userInfo.phone }).then((res) => {
          if(!res.code){
            _this.setUserInfo(res.data)
            alert('保存成功')
            _this.$router.replace({
              path: '/setting'
            })
          }else{
            alert(res.msg)
          }
        })
      },
      editUserInfo() {
        if(this.file){
          this.showloading =true
          this._uploadImg(this.file)
        }else{
          this._modifyUserInfo(this.userInfo.logo)
        }
        
        // 
      },
      logout() {
        userLogout(localStorage.getItem('usertoken')).then((res) => {
          if(!res.code){
            this.$router.replace({
              path:'/login'
            })
          localStorage.setItem('usertoken','')
          }else{
            alert(res.msg)
            this.$router.replace({
              path:'/login'
            })
          }
        })
      },
      ...mapMutations({
        setUserInfo: 'SET_USER_INFO'
      })
    },
    watch: {
      $route: function(to,from) {
      }
    },
    components: {
      uploader,
      loading,
      Wave,
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .settingView 
    position fixed
    z-index 120
    background-color $color-background
    height 100%
    left 0
    top 0
    width 100%
  .box
    background: $color-white
    padding 0 20px
    width 100%
    box-sizing border-box
    line-height: 30px
    position relative
    textarea
      border none 
      outline none
      resize none
      height 300px
      width 100%
      font-size $font-size-medium
      box-sizing border-box
      padding 10px 0
      line-height 20px
      overflow hidden
      color: $color-text
      &::placeholder
        color: $color-text-d
    .inputBox 
      border-bottom 1px solid $color-border
      padding 10px 0
      position relative
      display flex
      align-items center
      justify-content space-between
      line-height 30px
      width 100%
      span 
        display inline-block
        width 95px
        font-weight bold
      img
        width 60px
        height 60px
      .icon
        width 15px
        height 15px
      input
        outline none
        flex 1
        line-height 30px
        text-align right
        background: $color-white
        color: $color-text
        font-size: $font-size-medium-x
        &::placeholder
          color: $color-text-d
  .buttonC
    color $color-white
    background-color $color-theme
    buttonD()
    margin-top 50px
  .connectBox
    background-color $color-white
    padding 5px 0 
    width 100%
    text-align center
    font-size $font-size-medium
    line-height 35px
    .inline
      display inline-block
    .bText
      color black
    .tText
      color $color-theme
    .gText
      color #cfcfcf
  .waveBox
    .warpContent
      height 100px
      top 25px
      width 50%
      color white
      .imgBox
        position relative
        left 50%
        width 60px
        height 60px
        border none
        margin 10px 0px 10px -30px
        background-color #fff
        border-radius 50%
        img
          border none
          width 60px
          height 60px
</style>