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
      <el-tab-pane label="动态参数" name="many">
        <el-button type="primary" size="small" :disabled='isBtnDisabled' @click="addDialogVisible=true">添加参数</el-button>
        <el-table :data="manyData" border stripe>
          <el-table-column type="expand">
            <template v-slot="scope">
              <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i"  class="tag">
                {{item}}
              </el-tag>
<!--              <el-input
                v-if="scope.row.inputVisible"
                ref="saveTagInput"
                v-model="scope.row.inputValue"
                class="input-new-tag"
                size="mini"
                @keyup.enter="handleInputConfirm"
                @blur="handleInputConfirm"
              >
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)"
              >+ New Tag</el-button>-->
            </template>
          </el-table-column>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="参数名称" prop="attr_name"></el-table-column>
          <el-table-column label="操作" >
            <template v-slot="scope">
              <el-button type="primary" icon="el-icon-edit" size="small" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="small" @click="removeParams(scope.row.attr_id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态属性" name="only">
        <el-button type="primary" size="small" :disabled='isBtnDisabled' @click="addDialogVisible=true">添加属性</el-button>
        <el-table :data="onlyData" border stripe>
          <el-table-column type="expand">
            <template v-slot="scope">
              <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i"  class="tag">
                {{item}}
              </el-tag>
              <!--              <el-input
                              v-if="scope.row.inputVisible"
                              ref="saveTagInput"
                              v-model="scope.row.inputValue"
                              class="input-new-tag"
                              size="mini"
                              @keyup.enter="handleInputConfirm"
                              @blur="handleInputConfirm"
                            >
                            </el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)"
                            >+ New Tag</el-button>-->
            </template>
          </el-table-column>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="参数名称" prop="attr_name"></el-table-column>
          <el-table-column label="操作" >
            <template v-slot="scope">
              <el-button type="primary" icon="el-icon-edit" size="small" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="small" @click="removeParams(scope.row.attr_id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
<!--  添加参数对话框-->
  <el-dialog
    v-model="addDialogVisible"
    :title="'添加' + titleText"
    width="50%"
    @close="addDialogClosed"
  >
    <el-form
      ref="addFormRef"
      :model="addForm"
      :rules="addFormRules"
      label-width="100px"
    >
      <el-form-item :label="titleText" prop="attr_name">
        <el-input v-model="addForm.attr_name"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addParams"
        >确定</el-button
        >
      </span>
    </template>
  </el-dialog>
<!--  修改参数对象框-->
  <el-dialog
    v-model="editDialogVisible"
    :title="'修改' + titleText"
    width="50%"
    @close="editDialogClosed"
  >
    <el-form
      ref="editFormRef"
      :model="editForm"
      :rules="editFormRules"
      label-width="100px"
    >
      <el-form-item :label="titleText" prop="attr_name">
        <el-input v-model="editForm.attr_name"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="editParams"
        >确定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script>
import {computed, getCurrentInstance, onMounted, reactive, ref, toRefs} from "vue";
export default {
  name: "params",
  setup(){
    const {proxy} =getCurrentInstance()
    const state =reactive({
        catelist:[],
        selectedCateKeys:[],
      activeName:'many',
      manyData:[],
      onlyData:[],
      editForm:{},

    })
    const cateProps=reactive({
      value:'cat_id',
      label:'cat_name',
      children:'children'
    })
    const addForm =reactive({
      attr_name :''
    })

    const addFormRules =reactive({
      attr_name:[
        {
          required: true,
          message: '请输入参数名称',
          trigger: 'blur',
        }
      ]
    })
    const editFormRules =reactive({
      attr_name:[
        {
          required: true,
          message: '请输入参数名称',
          trigger: 'blur',
        }
      ]
    })
    const addDialogVisible =ref(false)
    const addFormRef =ref()
    const editDialogVisible=ref(false)
    const editFormRef=ref()
    const isBtnDisabled =computed(() =>{
      if (state.selectedCateKeys.length !== 3){
        return true
      }
      return false
    })
    const cateId =computed(() =>{
      if (state.selectedCateKeys.length === 3){
        return state.selectedCateKeys[2]
      }
      return null
    })
    const titleText =computed(() =>{
      if (state.activeName ==='many'){
        return '动态参数'
      }
      return '静态属性'
    })
     function handleChange(){
      getParamsData()

    }
    function  handleClick(){
      getParamsData()
    }
    function addDialogClosed(){
      addFormRef.value.resetFields()
    }
    /*function handleInputConfirm(){

    }*/
    /*function showInput(row){
      row.inputVisible =true
    }*/
     function addParams(){
      addFormRef.value.validate(async valid =>{
        if (!valid) return
       const {data:res} = await proxy.$axios.post(`categories/${cateId.value}/attributes`,{attr_name:addForm.attr_name,attr_sel:state.activeName})
        if (res.meta.status !==201){
          return proxy.$message.error('添加参数失败')
        }
         proxy.$message.success('添加参数失败')
        addDialogVisible.value =false
        getParamsData()

      })
    }
    async function removeParams(attr_id){
      const confirmResult = await proxy.$messageBox.confirm(
        '是否删除该参数',
        '提示',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch(err =>err)
      if(confirmResult !=='confirm') return
      const {data:res} = await proxy.$axios.delete(`categories/${cateId.value}/attributes/${attr_id}`)
      if (res.meta.status !== 200){
        return proxy.$message.err('删除参数失败')
      }
      proxy.$message.success('删除参数成功')
      getParamsData()
    }
    async function showEditDialog(attr_id){
      const {data:res} = await proxy.$axios.get(`categories/${cateId.value}/attributes/${attr_id}`,{params:{attr_sel:state.activeName}})
      if (res.meta.status !== 200){
        return proxy.$message.error('获取参数失败')
      }
      state.editForm =res.data
      editDialogVisible.value =true
    }
    function editDialogClosed(){
      editFormRef.value.resetFields()
    }
    function editParams(){
        editFormRef.value.validate(async valid =>{
          if (!valid) return
        const{data:res} = await proxy.$axios.put(`categories/${cateId.value}/attributes/${state.editForm.attr_id}`,{attr_name:state.editForm.attr_name,attr_sel:state.activeName})
          if (res.meta.status !==200){
            return proxy.$message.error('修改参数失败')
          }
          proxy.$message.success('修改参数成功')
          editDialogVisible.value =false
          getParamsData()
        })
    }
    async function getParamsData(){
      if(state.selectedCateKeys.length !==3){
        state.selectedCateKeys =[]
        state.manyData=[]
        state.onlyData=[]
        return
      }
      const {data:res} = await proxy.$axios.get(`categories/${cateId.value}/attributes`,{params:{sel:state.activeName}})
      if (res.meta.status !==200){
        return proxy.$message.error('获取参数失败')
      }
      res.data.forEach(item =>{
        item.attr_vals = item.attr_vals ?item.attr_vals.split(' ') :[]
        item.inputVisible =false
        item.inputValue =''

      })
      if (state.activeName === 'many'){
        state.manyData =res.data
      }else {
        state.onlyData =res.data
      }
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
      handleClick,
      isBtnDisabled,
      cateId,
      getParamsData,
      titleText,
      addDialogVisible,
      addFormRules,
      addForm,
      addDialogClosed,
      addFormRef,
      addParams,
      showEditDialog,
      editDialogVisible,
      editDialogClosed,
      editFormRef,
      editFormRules,
      editParams,
      removeParams,

    }
  }
}
</script>

<style scoped>
.cat-opt{
  margin: 15px 0;
}
.input-new-tag{
  width: 120px;
  margin-right: 10px;
}
.tag{
  margin-left: 10px;
}
</style>
