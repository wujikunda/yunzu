<template>
    <div class="detialBox">
      <div v-if="detial.house_type==1">
        <p class="title">其他信息</p>
        <div class="textBox">
          <div><span>来源:</span>{{detial.source || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>地址:</span>{{paycash? detial.address || '--' : '缴纳押金后可见'}}</div>
        </div>
        <div class="textBox">
          <div><span>装修期(天):</span>{{detial.checkin || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>楼层:</span>{{detial.floor || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>付款方式:</span>{{detial.payway || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>租金递增方式:</span>{{detial.rentway || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>年限:</span>{{detial.ageround || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>朝向:</span>{{detial.orientation || '--'}}</div>
          <div><span>扰民:</span>{{detial.affect || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>结构:</span>{{detial.structure || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>交通:</span>{{detial.transportation || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>水费:</span>{{detial.watercharge || '--'}}元/吨</div>
        </div>
        <div class="textBox">
          <div><span>电费:</span>{{detial.powercharge || '--'}}元/度</div>
        </div>
        <div class="textBox">
          <div><span>排水量:</span>{{detial.awaywater || '--'}}</div>
          <div><span>排污量:</span>{{detial.drain || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>物业费:</span>{{detial.propertycharge || '--'}}元/月</div>
        </div>
        <div class="textBox">
          <div><span>卫生费:</span>{{detial.healthcharge || '--'}}元/月</div>
        </div>
        <div class="textBox">
          <div><span>是否有电梯:</span>{{detial.haslift || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>电梯数:</span>{{detial.liftnum || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>红线图:</span>{{detial.redchart || '--'}}</div>
          <div><span>产权:</span>{{detial.propertyright}}</div>
        </div>
        <div class="textBox">
          <div><span>供电:</span>{{detial.power || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>供电率:</span>{{detial.powersupply || '--'}}千瓦</div>
        </div>
        <div class="textBox">
          <div><span>消防措施:</span>{{detial.firecontrol || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>车辆进出长度:</span>{{detial.carwidth || '--'}}米</div>
        </div>
        
        <div class="textBox">
          <div><span>车位个数:</span>{{detial.carportnum || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>车位面积:</span>{{detial.carportarea || '--'}}㎡</div>
        </div>
        <div class="textBox">
          <div><span>房源描述:</span>{{detial.housedec || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>周边描述:</span>{{detial.addressdesc || '--'}}</div>
        </div>
      </div>
      <div v-if="detial.house_type==2">
        <p class="title">其他信息</p>
        <div class="textBox">
          <div><span>来源:</span>{{detial.source || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>地址:</span>{{paycash? detial.address || '--' : '缴纳押金后可见'}}</div>
        </div>
        <div class="textBox">
          <div><span>装修期(天):</span>{{detial.checkin || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>楼层:</span>{{detial.floor || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>付款方式:</span>{{detial.payway || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>租金递增方式:</span>{{detial.rentway || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>年限:</span>{{detial.ageround || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>结构:</span>{{detial.structure || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>水费:</span>{{detial.watercharge || '--'}}元/吨</div>
        </div>
        <div class="textBox">
          <div><span>电费:</span>{{detial.powercharge || '--'}}元/度</div>
        </div>
        <div class="textBox">
          <div><span>物业费:</span>{{detial.propertycharge || '--'}}元/月</div>
        </div>
        <div class="textBox">
          <div><span>卫生费:</span>{{detial.healthcharge || '--'}}元/月</div>
        </div>
        <div class="textBox">
          <div><span>是否有电梯:</span>{{detial.haslift || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>电梯数:</span>{{detial.liftnum || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>车位个数:</span>{{detial.carportnum || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>车位面积:</span>{{detial.carportarea || '--'}}㎡</div>
        </div>
        <div class="textBox">
          <div><span>附近停车场:</span>{{detial.nearpark || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>红线图:</span>{{detial.redchart || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>消防措施:</span>{{detial.firecontrol || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>产权:</span>{{detial.propertyright}}</div>
        </div>
        <div class="textBox">
          <div><span>能否注册公司:</span>{{detial.register || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>房源描述:</span>{{detial.housedec || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>周边描述:</span>{{detial.addressdesc || '--'}}</div>
        </div>
      </div>
      <div v-if="detial.house_type==3">
        <p class="title">其他信息</p>
        <div class="textBox">
          <div><span>来源:</span>{{detial.source || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>地址:</span>{{paycash? detial.address || '--' : '缴纳押金后可见'}}</div>
        </div>
        <div class="textBox">
          <div><span>装修期(天):</span>{{detial.checkin || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>楼层:</span>{{detial.floor || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>付款方式:</span>{{detial.payway || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>租金递增方式:</span>{{detial.rentway || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>年限:</span>{{detial.ageround || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>供电:</span>{{detial.power || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>供电率:</span>{{detial.powersupply || '--'}}千瓦</div>
        </div>
        <div class="textBox">
          <div><span>车位个数:</span>{{detial.carportnum || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>车位面积:</span>{{detial.carportarea || '--'}}㎡</div>
        </div>
        <div class="textBox">
          <div><span>结构:</span>{{detial.structure || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>交通:</span>{{detial.transportation || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>水费:</span>{{detial.watercharge || '--'}}元/吨</div>
        </div>
        <div class="textBox">
          <div><span>电费:</span>{{detial.powercharge || '--'}}元/度</div>
        </div>
        <div class="textBox">
          <div><span>物业费:</span>{{detial.propertycharge || '--'}}元/月</div>
        </div>
        <div class="textBox">
          <div><span>卫生费:</span>{{detial.healthcharge || '--'}}元/月</div>
        </div>
        <div class="textBox">
          <div><span>是否有电梯:</span>{{detial.haslift || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>电梯数:</span>{{detial.liftnum || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>附近停车场:</span>{{detial.nearpark || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>产权:</span>{{detial.propertyright}}</div>
        </div>
        <div class="textBox">
          <div><span>红线图:</span>{{detial.redchart || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>消防措施:</span>{{detial.firecontrol || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>房源描述:</span>{{detial.housedec || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>周边描述:</span>{{detial.addressdesc || '--'}}</div>
        </div>
      </div>          
      <div v-if="detial.house_type==4">
        <p class="title">其他信息</p>
        <div class="textBox">
          <div><span>来源:</span>{{detial.source || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>地址:</span>{{paycash? detial.address || '--' : '缴纳押金后可见'}}</div>
        </div>
        <div class="textBox">
          <div><span>装修期(天):</span>{{detial.checkin || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>楼层:</span>{{detial.floor || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>付款方式:</span>{{detial.payway || '--'}}</div>
        </div>
        
        <div class="textBox">
          <div><span>出租年限:</span>{{detial.ageround || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>朝向:</span>{{detial.orientation || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>年代:</span>{{detial.hourseage || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>装修程度:</span>{{detial.stylelevel || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>电费:</span>{{detial.powercharge || '--'}}元/度</div>
        </div>
        <div class="textBox">
          <div><span>水费:</span>{{detial.watercharge || '--'}}元/吨</div>
        </div>
        <div class="textBox">
          <div><span>物业费:</span>{{detial.propertycharge || '--'}}元/月</div>
        </div>
        <div class="textBox">
          <div><span>卫生费:</span>{{detial.healthcharge || '--'}}元/月</div>
        </div>
        <div class="textBox">
          <div><span>类型:</span>{{detial.type || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>是否有阳台:</span>{{detial.balcony || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>开发商:</span>{{detial.developers || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>物业公司:</span>{{detial.propertycompany || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>公摊比例:</span>{{detial.sharedarea || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>总户数:</span>{{detial.households || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>容积率:</span>{{detial.plotratio || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>品牌信息:</span>{{detial.brandmessage || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>装修风格:</span>{{detial.style || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>家具:</span>
            <b v-for="place in detial.furniture_ary" v-html="place.furniturename +' | '"></b>
          </div>
        </div>
        <div class="textBox">
          <div><span>附近:</span>
            <b v-for="place in detial.nearby" v-html="place.nearbyname +' | '"></b>
          </div>
        </div>
        <div class="textBox">
          <div><span>车位面积:</span>{{detial.carportarea || '--'}}㎡</div>
        </div>
        <div class="textBox">
          <div><span>采光:</span>{{detial.lighting || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>保安监控:</span>{{detial.monitoring || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>停车位:</span>{{detial.parknum || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>噪音:</span>{{detial.noise || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>是否有电梯:</span>{{detial.haslift || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>电梯数:</span>{{detial.liftnum || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>竣工时间:</span>{{detial.completetime || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>房源描述:</span>{{detial.housedec || '--'}}</div>
        </div>
        <div class="textBox">
          <div><span>周边描述:</span>{{detial.addressdesc || '--'}}</div>
        </div>
      </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      detial: {
        type: Object,
        default: {}
      },
      paycash: {
        type: Boolean,
        default: false
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .detialBox
    position relative
    width 90%
    left 5%
    background-color #fff
    box-shadow 5px 5px 5px -5px #ccc
    border-radius 10px
    box-sizing border-box
    padding 15px
    margin 10px 0
    p
      font-size $font-size-large
      font-weight bold
      margin-bottom 15px
    .textBox
      display flex
      div 
        flex 1
        height 30px
      span 
        color $color-theme
        display inline-block
        text-indent 3px
        padding 0 3px
        border-left 5px solid $color-theme
</style>