<template>
<el-button type="info" @click="loginOut">
  退出
</el-button>
</template>

<script>
import {getCurrentInstance} from 'vue'

export default {
  name: 'home',
  setup(){
    const {proxy} =getCurrentInstance()
    function loginOut(){
      window.sessionStorage.clear()
      proxy.$router.push('/login')
    }
    return{
      loginOut
    }
  }
}
</script>

<style scoped lang="less">

</style>
