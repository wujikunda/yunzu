<template>
　　<div id="div1" :style="style"></div>
</template>
<script type="text/ecmascript-6">
export default{
  data() {
    return{
      style:{
        width:'100%',
        height:this.height+'px'
      }
  }
},
  props:{	//里面存放的也是数据，与data里面的数据不同的是，这里的数据是从其他地方得到的数据
    height:{
      type:Number,
      default:300
    },
    longitude:{},	//定义经度
    latitude:{}	//定义纬度
  },
  methods: {
    updateMap() {
      var map = new BMap.Map("div1");
      var point = new BMap.Point(this.longitude,this.latitude);
      map.centerAndZoom(point, 12);
      var marker = new BMap.Marker(point);// 创建标注
      map.addOverlay(marker);
    }
  },
  mounted(){
    this.updateMap()
  }
}
</script>