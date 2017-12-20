<template>
  <div id="app" @touchmove.prevent>
    <section v-if="type === 'app'">
      <header v-if="!this.Platform">
        <head-list></head-list>
      </header>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
      <footer v-if="this.Platform">
        <tab></tab>
      </footer>
    </section>
    <section v-if="type === 'admin'">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
import Tab from 'components/tab/tab'
import HeadList from 'components/head-list/head-list'
import {getPlatform} from 'api/login'
export default {
  data() {
    return {
      Platform: 1,
      type:''
    }
  },
  mounted() {
    this.Platform = getPlatform()
    if(this.$route.path.indexOf('admin') < 0 && this.$route.path !== '/'){
      this.type = 'app'
    }else{
      this.type = 'admin'
    }
  },
  watch: {
    $route(to, from){
      if(to.path.indexOf('admin') < 0){
        this.type = 'app'
      }else{
        this.type = 'admin'
      }
    }
  },
  components: {
    Tab,
    HeadList
  }
}
</script>

<style scoped lang="stylus" >
  @import "~common/stylus/variable"
  footer
    position: fixed
    width:100%
    bottom: 0
    
</style>