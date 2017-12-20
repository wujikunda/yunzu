<template>
  <div class="tab" >
    <div v-for="(item,index) in routerObj" :key="index"  class="tab-items">
      <router-link tag="div" class="tab-item" :to="item.path">
        <img class="tab-icon" :src="tabIconList[index]" alt="对比"/>
        <span class="tab-link">{{item.title}}</span>
      </router-link>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {changeImage} from 'common/js/dom'
  export default{
    data() {
      return {
        routerObj: [
          {path: '/home', incoPath: 'tab_home', title: '首页'},
          {path: '/compareList', incoPath: 'tab_compare', title: '房源对比'},
          {path: '/myPublish', incoPath: 'tab_fabu', title: '我的发布'},
          {path: '/setting', incoPath: 'tab_center', title: '个人中心'}
        ],
        tabIconList: []
      }
    },
    computed: {
    },
    mounted() {
      this.initIconlist()
    },
    watch: {
      '$route': 'initIconlist'
    },
    methods: {
      gets() {
      },
      initIconlist() {
        let arr = [];
        for(let i = 0; i < 4; i++) {
          let type = 'normal'
          if(this.$route.path === this.routerObj[i].path){
            type = 'checked'
          }
          arr.push( changeImage(this.routerObj[i].incoPath, type) )
        }
        this.tabIconList = arr
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.tab {
  display: flex;
  border-top 1px $color-border solid;
  background-color: $color-white;
  height: 50px;
  font-size: $font-size-medium;
  .tab-items {
    flex: 1;
    &>.router-link-active {
      .tab-link {
        color: $color-theme;
      }
    }
  }
  .tab-item {
    display block;
    padding 3px;
    box-sizing border-box;
    text-align center;
    .tab-icon {
      width: 25px;
      height: 25px;
    }
    .tab-link {
      color: $color-text-l;
      line-height: 18px;
      display : block;
    }
  }
  
}
</style>