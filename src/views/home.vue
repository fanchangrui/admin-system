<template>

  <el-container class="home-container">
    <el-header>
      <div class="before">
        <img src="../assets/antd.png" alt="">
        <span>后台管理系统</span>

      </div>
      <div class="flow">
        <img class="img1" src="../assets/logo.png" alt="" @click="goVue">
        <img class="img2" src="../assets/ele.png" alt="" @click="goelp">
        <img class="img3" src="../assets/github.png" alt="" @click="goGithub">
<!--        <el-button type="info" @click="loginOut">
          退出
        </el-button>-->
        <div class="flow2">
          <el-tooltip placement="bottom" content="退出登录" :enterable="false">
          <img class="img4" src="../assets/tc.gif" @click="loginOut" >
          </el-tooltip>
        </div>

      </div>

    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleClick">|||</div>
        <el-menu
          active-text-color="#409fff"
          background-color="#333744"
          class="el-menu-vertical-demo"
          text-color="#fff"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath1"
        >
          <el-sub-menu :index="'/'+item.path" v-for="item in menulist" :key="item.id">
            <template #title>
              <i :class="icon[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item :index="'/'+subitem.path" v-for="subitem in item.children" :key="subitem.id" @click="saveState('/'+subitem.path)">
              <template #title>
                <i class="el-icon-menu"></i>
                <span>{{ subitem.authName }}</span>
              </template>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getCurrentInstance, onMounted, reactive, ref } from 'vue'

export default {
  name: 'home',
  setup(){
    const {proxy} =getCurrentInstance()
    const menulist =reactive([])
    const icon =reactive({
      125:'iconfont icon-user',
      103:'iconfont icon-tijikongjian',
      101:'iconfont icon-shangpin',
      102:'iconfont icon-danju',
      145:'iconfont icon-baobiao'
    })
    const activePath1 =ref('')
    let isCollapse =ref(false)
    function loginOut(){
      window.sessionStorage.clear()
      proxy.$router.push('/login')
    }
    onMounted(() =>{
      getMenuList()
      /*activePath1.value=window.sessionStorage.getItem('activePath')*/

    })
    async  function getMenuList(){
      const {data:res} = await proxy.$axios.get('menus')
      if(res.meta.status !==200) return proxy.$message.error(res.meta.msg)
      menulist.push(...res.data)

    }
    function toggleClick(){
      isCollapse.value = !isCollapse.value
    }
    function saveState(activePath){
      window.sessionStorage.setItem('activePath',activePath)
      activePath1.value = activePath
    }
    function goGithub(){
      window.location.href = 'https://github.com/fanchangrui/'
    }
    function goVue(){
      window.location.href = 'https://v3.cn.vuejs.org/'
    }
    function goelp(){
      window.location.href = 'https://element-plus.gitee.io/zh-CN/'
    }
    return{
      loginOut,
      getMenuList,
      menulist,
      icon,
      toggleClick,
      isCollapse,
      saveState,
      activePath1,
      goGithub,
      goVue,
      goelp
    }
  }
}
</script>

<style scoped lang="less">
.home-container{
  height: 100%;
}
.el-header{
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  .before {
    display: flex;
    align-items: center;
    span{
      margin-left: 20px;
      font-size: 20px;
    }
    img {

      width: 50px;
      height: 50px;
    }
  }
  .flow{
    display: flex;
    align-items: center;
    .img1{
      width: 50px;
      height: 40px;
      margin-right: 20px;
      cursor: pointer;
    }
    .img2{
      width: 100px;
      height: 40px;
      margin-right: 20px;
      cursor: pointer;
    }
    .img3{
      width: 50px;
      height: 40px;
      margin-right: 20px;
      cursor: pointer;
    }
    .img4{
      width: 50px;
      height: 40px;
      margin-right: 20px;
      cursor: pointer;
    }



  }

}
.el-aside{
  background-color: #333744;
  .el-menu{
    border-right: 0;
  }
}
.el-main{
  background-color: #eee;
}
.iconfont{
  margin-right: 10px;
}
.toggle-button{
  background-color: #333744;
  font-size: 10px;
  line-height: 24px;
  color: #fffdef;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
