<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>分类参数</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <el-alert
      title="注意:只允许为第三级分类设置相关参数"
      type="warning"
      show-icon
      :closable="false"
    >
    </el-alert>
    <el-row class="cat-opt">
      <el-col :span="4">
        <span>选择商品分类：</span>
      </el-col>
      <el-col :span="8">
        <el-cascader
          v-model="selectedCateKeys"
          :options="catelist"
          :props="cateProps"
          @change="handleChange"
          expand-trigger="hover"
          placeholder="请选择"
        ></el-cascader>
      </el-col>
    </el-row>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="动态参数" name="first">动态参数</el-tab-pane>
      <el-tab-pane label="静态属性" name="second">静态属性</el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import {getCurrentInstance, onMounted, reactive, toRefs} from "vue";
export default {
  name: "params",
  setup(){
    const {proxy} =getCurrentInstance()
    const state =reactive({
        catelist:[],
        selectedCateKeys:[],
      activeName:'first'
    })
    const cateProps=reactive({
      value:'cat_id',
      label:'cat_name',
      children:'children'
    })
    function handleChange(){
        if(state.selectedCateKeys.length !==3){
          state.selectedCateKeys =[]
          return
        }

    }
    function  handleClick(){
      console.log(state.activeName)
    }
    async function getCateList(){
     const {data:res} = await proxy.$axios.get('categories')
      if(res.meta.status !==200){
        return proxy.$message.error('获取分类数据失败')
      }
     state.catelist=res.data

    }
    onMounted(() =>{
      getCateList()
    })
    return{
      ...toRefs(state),
      getCateList,
      cateProps,
      handleChange,
      handleClick
    }
  }
}
</script>

<style scoped>
.cat-opt{
  margin: 15px 0;
}
</style>
