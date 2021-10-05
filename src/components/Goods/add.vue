<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>添加商品</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <el-alert title="添加商品信息" type="info" center show-icon :closable="false"> </el-alert>
    <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>
    <el-form
      ref="addFormRef"
      :model="addForm"
      label-width="80px"
      :rules="addFormRules"
      label-position="top"
    >
    <el-tabs :tab-position="'left'"  v-model="activeIndex">
      <el-tab-pane label="基本信息" name="0">
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="addForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="addForm.goods_price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="addForm.goods_weight" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model="addForm.goods_number" type="number"></el-input>
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
      <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
      <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
      <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
    </el-tabs>
    </el-form>
  </el-card>
</template>

<script>
import {getCurrentInstance, onMounted, reactive, ref, toRefs} from "vue";

export default {
  name: "add",
  setup(){
    const {proxy} =getCurrentInstance()
    const state =reactive({
      activeIndex:'0',
      catelist:[]
    })
    const addForm=reactive({
      goods_name:'',
      goods_price:0,
      goods_weight:0,
      goods_number:0
    })
    const addFormRules=reactive({
      goods_name:[
        {
          required: true,
          message: '请输入商品名称',
          trigger: 'blur'
        }
      ],
      goods_price:[
        {
          required: true,
          message: '请输入商品价格',
          trigger: 'blur'
        }
      ],
      goods_weight:[
        {
          required: true,
          message: '请输入商品重量',
          trigger: 'blur'
        }
      ],
      goods_number:[{
        required: true,
        message: '请输入商品数量',
        trigger: 'blur'
      }]
    })
    const addFormRef=ref()
    async function getCateList(){
      const {data:res} =await proxy.$axios.get('categories')
      if (res.meta.status !==200){
        return proxy.$message.error('获取分类数据失败')
      }
      proxy.$message.success('获取分类数据成功')
      state.catelist =res.data.goods
    }
    onMounted(() =>{
      getCateList()
    })
    return{
      ...toRefs(state),
      addFormRules,
      addForm,
      addFormRef,
      getCateList
    }
  }
}
</script>

<style scoped>
.el-step{
  margin: 15px 0;
}
</style>
