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
    <el-tabs :tab-position="'left'"  v-model="activeIndex" :before-leave="beforeLeave" @tab-click="tabClick">
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
        <el-form-item label="商品分类" prop="goods_cat">
          <el-cascader
            v-model="addForm.goods_cat"
            :options="catelist"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="商品参数" name="1">
        <el-form-item :label="item.attr_name" v-for="(item) in manyTableDate" :key="item.attr_id">
          <el-checkbox-group v-model="item.attr_vals">
            <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i" border/>
          </el-checkbox-group>
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="商品属性" name="2">
        <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
            <el-input v-model="item.attr_vals"></el-input>
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="3">
        <el-upload
          :action="uploadURL"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          list-type="picture"
          :headers="headerObj"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <template #tip>
          </template>
        </el-upload>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
    </el-tabs>
    </el-form>
  </el-card>
  <el-dialog
    v-model="previewVisible"
    title="图片预览"
    width="50%"
  >
    <img :src="previewPath" class="previewImg">
  </el-dialog>
</template>

<script>
import {computed, getCurrentInstance, onMounted, reactive, ref, toRefs} from "vue";

export default {
  name: "add",
  setup(){
    const {proxy} =getCurrentInstance()
    const state =reactive({
      activeIndex:'0',
      catelist:[],
      manyTableDate:[],
      onlyTableData:[],
      uploadURL:'http://127.0.0.1:8888/api/private/v1/upload',
      previewPath:'',
      previewVisible:false
    })
    const addForm=reactive({
      goods_name:'',
      goods_price:0,
      goods_weight:0,
      goods_number:0,
      goods_cat:[],
      pics:[]
    })
    const cateProps =reactive({
      label:'cat_name',
      value:'cat_id',
      children:'children'
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
      }],
      goods_cat:[
        {
          required: true,
          message: '请选择商品分类',
          trigger: 'blur'
        }
      ]
    })
    const addFormRef=ref()

    const headerObj =reactive({
      Authorization:window.sessionStorage.getItem('token')
    })
    const cateId = computed(() => {
      if (addForm.goods_cat.length === 3) {
        return addForm.goods_cat[2]
      }
      return null
    })
    function handleChange(){
      if (addForm.goods_cat.length !==3){
        addForm.goods_cat =[]
      }
    }
    function beforeLeave(activeName,oldActiveName){
      if (oldActiveName ==='0'&& addForm.goods_cat.length !==3){
        proxy.$message.error('请选择商品分类')
        return false
      }
    }
    function handlePreview(file){
      console.log(file)
      state.previewPath = file.response.data.url
      state.previewVisible =true
    }
    function handleRemove(file){
      const filePath =file.response.data.tmp_path
      const i  = addForm.pics.findIndex(x =>x.pic ===filePath)
      addForm.pics.splice(i,1)
    }
    function handleSuccess(response){
      const picInfo ={pic:response.data.tmp_path}
      addForm.pics.push(picInfo)
    }
    async function tabClick(){
      if (state.activeIndex ==='1'){
        const {data:res} =await proxy.$axios.get(`categories/${cateId.value}/attributes`,{params:{sel:'many'}})
        if (res.meta.status !==200){
          return proxy.$message.error('获取动态参数失败')
        }
      res.data.forEach(item =>{
        item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')

      })
      state.manyTableDate =res.data
      }
      else if (state.activeIndex ==='2'){
        const {data:res} =await proxy.$axios.get(`categories/${cateId.value}/attributes`,{params:{sel:'only'}})
        if (res.meta.status !==200){
          return proxy.$message.error('获取静态属性失败')
        }
        state.onlyTableData =res.data
      }
    }
    async function getCateList(){
      const {data:res} =await proxy.$axios.get('categories')
      if (res.meta.status !==200){
        return proxy.$message.error('获取分类数据失败')
      }
      proxy.$message.success('获取分类数据成功')
      state.catelist =res.data
    }
    onMounted(() =>{
      getCateList()
    })
    return{
      ...toRefs(state),
      addFormRules,
      addForm,
      addFormRef,
      getCateList,
      cateProps,
      handleChange,
      beforeLeave,
      tabClick,
      cateId,
      handlePreview,
      handleRemove,
      handleSuccess,
      headerObj,

    }
  }
}
</script>

<style scoped>
.el-step{
  margin: 15px 0;
}
.previewImg{
  width: 100%;
}
</style>
