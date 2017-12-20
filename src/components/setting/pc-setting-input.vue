<template>
  <div class = "settingView">
    <p class="pTitle">{{pTitle}}</p>
    <section class="member" v-if="type ==='member'">
      <loading v-show="showloading"></loading>
      <div class="box">
        <p class="titleLine">个人头像</p>
        <div class="uploadBox">
          <img :src="userimg"  @click="selectImg" class="needsclick" @error="_loadError">
          <uploader ref="uploadFiles"  @selectFinish="selectDone" v-show="false"></uploader>
          <b class="uploBtn"  @click="selectImg">上传头像</b>
        </div>
        <p class="titleLine">个人资料</p>
        <div class="inputBox">
          <span>手机号</span>
          <input v-model="userInfo.phone" ref="userInput" :readonly="isEdite" style="background-color:#f0f0f0"/>
          <b @click="modify">修改绑定</b>
        </div>
        <div class="inputBox">
          <span>昵称</span>
          <input v-model="username" ref="userInput" placeholder="云租房客" />
        </div>
      </div>
      <div class="buttonC" @click="editUserInfo" style="margin: 50px 0">保存</div>
    </section>
    <section class="bindPhone" v-if="type ==='bindPhone'">
      <ul class="bindTitle">
        <li :class="{'active':bindstep === 0}"><span>解绑手机</span></li>
        <li :class="{'active':bindstep === 1}"><span>绑定手机</span></li>
        <li :class="{'active':bindstep === 2}"><span>完成</span></li>
      </ul>
      <ul class="bindContent">
        <li v-show="bindstep === 0" >
          <div class="inputBox">
            <input  v-model="relesePhone" type="text" placeholder="请输入手机号">
          </div>
          <div class="inputBox">
            <input v-model="releseVeri"  type="text" placeholder="请输入验证码">
            <span @click="getVeri($data.relesePhone)" class="sendVeri" >{{getVercode?'发送验证码':'重新发送('+count+')'}}</span>
          </div>
          <div class="cBtnG">
            <span @click="releseBind">解绑</span>
          </div>
        </li>
        <li v-show="bindstep === 1" >
          <div class="inputBox">
            <input v-model="newPhone" type="text" placeholder="请输入需要绑定的手机号">
          </div>
          <div class="inputBox">
            <input  v-model="newPhoneVeri" type="text" placeholder="请输入需验证码">
            <span @click="getVeri($data.newPhone)"  class="sendVeri" >{{getVercode?'发送验证码':'重新发送('+count+')'}}</span>
          </div>
          <div class="cBtnG">
            <span @click="newBind">绑定</span>
          </div>
        </li>
        <li v-show="bindstep === 2" >
          <div class="bindFin">
            <div class="img">
              <img src="~common/image/state_finish.png" alt="">
            </div>
            <span>换绑完成</span>
            <div class="cBtnG" style="width:200px">
              <span @click="type = 'member' ">返回</span>
            </div>
          </div>
        </li>
      </ul>

    </section>
    <section class="suggest" v-if="type ==='suggest'" >
      <div class="box">
        <textarea v-model="suggestText" placeholder="请输入您的意见,我们将与你取的联系"></textarea>
      </div>
      <div class="buttonC" @click="suggestSubmit">提交</div>
    </section>
    <section class="connect" v-if="type ==='connect'" >
      <div class="connectBox">
        <div class="gText">您好,如果您有什么需要可以直接拨打客服热线</div>
        <div class="tText">17750660008</div>
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
    <section class="member" v-if="type ==='system'">
      <div class="box">
        <div class="inputBox">
          <span>手机号码</span>
          {{userInfo.phone}}
        </div>
        <div class="inputBox">
          <span>旧密码<i>*</i></span>
          <input v-model="modifyObj.oldpw"  placeholder="请输入旧密码" />
        </div>
        <div class="inputBox">
          <span>新密码<i>*</i></span>
          <input type="password" v-model="modifyObj.password"  placeholder="6-16个字符" />
        </div>
        <div class="inputBox">
          <span>确认密码<i>*</i></span>
          <input type="password" v-model="modifyObj.confirm"  placeholder="请再次输入密码" />
          <i v-show="modifyObj.confirm !== modifyObj.password"> &nbsp两次密码不一致</i>
        </div>
        <div class="inputBox">
          <span>验证码<i>*</i></span>
          <input v-model="modifyObj.verify"  placeholder="请输入验证码" />
        </div>  
      </div>
      <div class="buttonC" @click="modifyPassWord">确认修改</div>
      <div class="buttonC" style="background-color:#1da2fd" @click="logout">退出账号</div>
    </section>
    
  </div>
</template>

<script type="text/ecmascript-6">
import {userLogout} from 'api/login'
import loading from 'base/loading/loading'
import {userInfo,modifyUserInfo,uploadImg,adviceCommit} from 'api/setting'
import {modifyPW ,bindPhone,getVerifycode} from 'api/login'
import {mapGetters, mapMutations} from 'vuex'
import uploader from 'base/uploader/uploader'
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
        username:'',
        phone:'',
        imgFile:null,
        suggestText:'',
        modifyObj:{},
        type:'',
        pTitle:'',
        isEdite:true,
        bindstep:0,
        getVercode: true,
        count:60,
        relesePhone:'',
        releseVeri:'',
        newPhoneVeri:'',
        newPhone:''
      }
    },
    mounted() {
      this._showpage(this.$route.path)
    },  
    methods: {
      _showpage( url) {
        switch(url) {
          case '/pc/setting/member':
            this.type = 'member'
            this.username = this.userInfo.nickname 
            this.pTitle = '个人中心'
          break;
          case '/pc/setting/suggest':
            this.type = 'suggest'
            this.pTitle = '意见反馈'
          break;
          case '/pc/setting/system':
            this.type = 'system'
            this.pTitle = '密码设置'
          break;
          case '/pc/setting/connect':
            this.type = 'connect'
            this.pTitle = '联系我们'
          break;
          default : 
            console.log('no such page')
          break
        }
      },
      selectImg() {
        this.$refs.uploadFiles.$refs.file.click()
      },
      _loadError(event) {
        event.target.src = require('common/image/tab_center_normal.png')
      },
      modify() {
        this.relesePhone = this.userInfo.phone
        this.bindstep = 0
        this.type = 'bindPhone'
      },
      releseBind() {
        bindPhone(localStorage.getItem('usertoken'),this.relesePhone,this.releseVeri,1).then((res) => {
          if(!res.code){
            this.bindstep = 1
            this.getVercode = true
            this.count = 60
            this.releseVeri = ''
          }else{
            alert(res.msg)
          }
        })
      },
      newBind() {
        bindPhone(localStorage.getItem('usertoken'),this.newPhone,this.newPhoneVeri,0).then((res) => {
          if(!res.code){
            this.bindstep = 2
            this.getVercode = true
            this.count = 60
            this.newPhoneVeri = ''
          }else{
            alert(res.msg)
          }
        })
      },
      getVeri(phone) {
        if(!this.getVercode){
          return
        }
        var that = this
        if(!this.testPhone(phone)){
          alert('请输入正确的手机号')
          return
        }
        getVerifycode(phone).then((res) => {
          if(!res.code){
            alert('验证码已发送')
            that.getVercode = false
            let timer = setInterval(updateCount,1000)
            function updateCount() {
              that.count--
              if(that.count<1){
                clearInterval(timer)
                that.getVercode = true
                that.count = 60
              }
            }
          }
        })
      },
      testPhone(phone) {
        let re = /^1\d{10}$/
        return re.test(phone)
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
              path: "/pc/setting"
            })
          }else{
            alert(res.msg)
          }
        })
      },
      selectDone(file) {
        this.file = file[0]['file']
        this.imgFile = file[0]['src']
        this.$refs.uploadFiles.finished()
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
        modifyUserInfo(localStorage.getItem('usertoken'),{nickname:this.username,logo:url}).then((res) => {
          if(!res.code){
            this.setUserInfo(res.data)
            alert('保存成功')
            _this.$router.replace({
              path: '/pc/setting/member'
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
      },
      modifyPassWord() {
        if(!this.modifyObj.oldpw){
          alert('请输入旧密码')
          return
        }
        if(!this.modifyObj.password){
          alert('请输入新密码')
          return
        }
        if(!this.modifyObj.verify){
          alert('请输入验证码')
          return
        }
        modifyPW(this.userInfo.phone,this.modifyObj.oldpw,this.modifyObj.password).then((res) => {
          if(!res.code){
            alert('修改成功')
            this.$router.push('/pc/setting/member')
          }else{
            alert(res.msg)
          }
          console.log('modifyPW',res)
        })
      },
      logout() {
        userLogout(localStorage.getItem('usertoken')).then((res) => {
          if(!res.code){
            this.$router.replace({
              path:'/pc/login'
            })
          localStorage.setItem('usertoken','')
          }else{
            alert(res.msg)
          }
        })
      },
      ...mapMutations({
        setUserInfo: 'SET_USER_INFO'
      })
    },
    watch: {
      $route: function(to,from) {
        this._showpage(to.path)
      }
    },
    components: {
      uploader,
      loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .settingView 
    width 100%
    .pTitle
      font-size $font-size-large-x
      color $color-theme
      padding 20px 10px
  .box
    background: $color-white
    padding 0 10px
    width 100%
    box-sizing border-box
    line-height: 30px
    position relative
    .titleLine
      width 100%
      line-height 40px
      border-bottom 1px solid $color-border
    textarea
      border 1px solid $color-border
      resize none
      border-radius 10px
      text-indent 10px 
      height 300px
      width 100%
      font-size $font-size-medium-x
      box-sizing border-box
      padding 10px 0
      line-height 20px
      overflow hidden
      color: $color-text
      &::placeholder
        color: $color-text-d
    .uploadBox
      padding 10px 0
      img
        width 100px
        height 100px
        border-radius 50%
      .uploBtn
        display block
        width 100px
        line-height 40px
        cursor pointer
        background-color $color-theme
        color white
        text-align center
        border-radius 10px
    .inputBox 
      padding 10px 0
      position relative
      display flex
      align-items center
      line-height 30px
      width 100%
      span 
        display inline-block
        width 95px
        color #909090
        font-weight bold
      img
        width 60px
        height 60px
      b
        cursor pointer
        margin-left 50px
        color $color-theme
      i
        color $color-theme
        font-style normal
      .icon
        width 15px
        height 15px
      input
        outline none
        line-height 40px
        text-indent 10px
        background: $color-white
        border 1px solid $color-border
        border-radius 3px
        color: $color-text
        font-size: $font-size-medium-x
        &::placeholder
          color: $color-text-d

  .buttonC
    color $color-white
    cursor pointer
    background-color $color-theme
    buttonD()
    width 300px
    margin 50px auto
  .bindPhone
    width 700px
    margin 0 auto
    .bindTitle
      display flex
      color #cbcbcb
      li
        border-bottom 1px solid $color-border
        line-height 50px
        font-size $font-size-large
        text-align center
        margin 20px 10px
        flex 1
    .bindContent
      display flex
      margin 0 auto
      width 400px
      li
        line-height 60px
        width 100%
        .inputBox
          display flex
          margin 20px 0
          .sendVeri
            width 120px
            margin-left 10px
            border 1px solid $color-border
            text-align center
            cursor pointer
          input
            border 1px solid $color-border
            height 60px
            text-indent 30px
            flex 1
        .cBtnG 
          cursor pointer
          span
            display block
            background-color #ff8867
            color white
            text-align center
            border-radius 10px
            width 100%
        .bindFin
          display flex
          align-items center
          flex-direction column
          justify-content center
          .img  
            margin-top 20px
  .active
    color $color-theme
  .connectBox
    margin 20px 0 
    font-size $font-size-medium-x
    line-height 35px
    .inline
      display inline-block
    .bText
      color black
    .tText
      color $color-theme
    .gText
      color #cfcfcf
</style>