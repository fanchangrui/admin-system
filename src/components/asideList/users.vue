<template xmlns:el-col="http://www.w3.org/1999/html">
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card class="box-card">

    <el-row :gutter="20">
      <el-col :span="7">
        <el-input
          placeholder="请输入内容"
          class="input-with-select"
          v-model="info.query"
          clearable
          @clear="getUserList"
        >
          <template #append>
            <el-button icon="el-icon-search" @click="getUserList"></el-button>
          </template>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="addDialogVisible = true">
          添加用户
        </el-button>
      </el-col>
    </el-row>
    <el-table :data="userList" style="width: 100%" border stripe>
      <el-table-column type="index" label="#"/>
      <el-table-column prop="username" label="姓名"/>
      <el-table-column prop="email" label="邮箱"/>
      <el-table-column prop="mobile" label="电话"/>
      <el-table-column prop="role_name" label="角色"/>
      <el-table-column label="状态">
        <template #default="scope">
          <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUser(scope.row.id)"></el-button>
          <el-tooltip placement="top" content="分配角色" :enterable="false">
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="info.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="info.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </el-card>
  <el-dialog
    v-model="addDialogVisible"
    title="添加用户"
    width="50%" @close="addDialogClosed">
    <el-form
      ref="addFormRef"
      :model="addForm"
      :rules="addFormRules"
      label-width="70px"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="addForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="addForm.password"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="addForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="addForm.mobile"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addUser"
        >确认</el-button
        >
      </span>
    </template>
  </el-dialog>
  <el-dialog
    v-model="editDialogVisible"
    title="修改用户信息"
    width="50%"
    @close="editDialogClosed"
  >
    <el-form
      ref="editFormRef"
      :model="state.editForm"
      :rules="addFormRules"
      label-width="70px"
    >
      <el-form-item label="用户名" >
        <el-input v-model="state.editForm.username" disabled></el-input>

      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="state.editForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="state.editForm.mobile"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="editUserInfo"
        >确定</el-button
        >
      </span>
    </template>
  </el-dialog>
<!--  分配角色-->
  <el-dialog
    v-model="setRoleDialogVisible"
    title="分配角色"
    width="50%"
    @close="setRoleDialogClosed"
  >
    <div>
      <p>当前用户：{{userInfo.username}}</p>
      <p>当前角色：{{userInfo.role_name}}</p>
      <p>分配新角色：
        <el-select v-model="selectedRoleId" placeholder="请选择角色">
          <el-option
            v-for="item in roleslist"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </p>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveRoleInfo"
        >确定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { onMounted, getCurrentInstance, reactive, ref, toRefs } from 'vue'

export default {
  name: 'users',
  setup () {
    const { proxy } = getCurrentInstance()
    const info = reactive({
      query: '',
      pagenum: 1,
      pagesize: 5
    })
    const addForm = reactive({
      username: '',
      password: '',
      email: '',
      mobile: ''
    })
    let state =reactive({
      editForm:{},
      userInfo:{},
      roleslist:[],
      selectedRoleId:''
    })
    const checkEmail =(rules,value,callback) =>{
      const regEmail=/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if(regEmail.test(value)){
        return callback()
      }
      callback(new Error('请输入正确的邮箱'))
    }
    const checkMobile=(rules,value,callback) =>{
      const regMobile =/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的手机号'))
    }
    const addFormRules = reactive(({
      username: [{
        required: true,
        message: '请输入用户名',
        trigger: 'blur',
      },
        {
          min: 3,
          max: 10,
          message: '用户名的长度在3到10个字符之间',
          trigger: 'blur',
        }],
      password: [{
        required: true,
        message: '请输入密码',
        trigger: 'blur',
      },
        {
          min: 6,
          max: 15,
          message: '密码的长度在3到10个字符之间',
          trigger: 'blur',
        }
      ],
      email: [
        {
          required: true,
          message: '请输入邮箱',
          trigger: 'blur',
        },
        {
          validator:checkEmail,
          trigger: 'blur',
        }

      ],
      mobile: [
        {
          required: true,
          message: '请输入手机号',
          trigger: 'blur',
        },
        {
          validator:checkMobile,
          trigger: 'blur',
        }
      ]
    }))

    let addFormRef = ref()
    let userList = reactive([])
    let total = ref(0)
    let editFormRef =ref()
    let addDialogVisible = ref(false)
    let editDialogVisible =ref(false)
    let setRoleDialogVisible=ref(false)
    async function getUserList () {

      const { data: res } = await proxy.$axios.get('users', { params: info })
      if (res.meta.status !== 200) return proxy.$message.err('获取用户列表失败')
      userList.splice(0, userList.length)
      userList.push(...res.data.users)
      total.value = res.data.total
      /*proxy.$message.success('获取用户列表成功')
      console.log(res)*/
    }

    function handleSizeChange (newSize) {
      info.pagesize = newSize
      getUserList()
    }

    function handleCurrentChange (newPage) {
      info.pagenum = newPage
      getUserList()
    }

    function addDialogClosed(){
      addFormRef.value.resetFields()
    }

    function editDialogClosed(){
      editFormRef.value.resetFields()
    }
   async function removeUser(id){
     const confirmResult = await proxy.$messageBox.confirm(
        '是否删除该用户',
        '提示',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch(err =>err)
     if(confirmResult !=='confirm') return
     const {data:res} = await proxy.$axios.delete('users/' +id)
     if (res.meta.status !== 200){
       return proxy.$message.err('删除用户失败')
     }
     proxy.$message.success('删除用户成功')
     getUserList()
    }
     function editUserInfo(){

      editFormRef.value.validate(async valid =>{
        if (!valid) return proxy.$message.err('修改用户数据不合法')
         const {data:res} = await proxy.$axios.put('users/' + state.editForm.id,{email:state.editForm.email,mobile:state.editForm.mobile})
        if (res.meta.status !== 200) return proxy.$message.err('修改用户数据失败')
        editDialogVisible.value =false
        getUserList()
        proxy.$message.success('修改用户数据成功')
      })
    }
    async function showEditDialog(id){

      const {data:res} = await proxy.$axios.get('users/'+ id)
      if(res.meta.status !== 200){
        return proxy.$message.err('获取用户信息失败')
      }
      state.editForm =res.data

      editDialogVisible.value = true

    }
    function  addUser(){
      addFormRef.value.validate(async valid =>{
        if(!valid) return proxy.$message.err('用户数据不合法')
        const {data:res} = await proxy.$axios.post('users',addForm)
        if (res.meta.status !== 201) {
           proxy.$message.err('添加用户失败')
        }
        proxy.$message.success('添加用户成功')
        addDialogVisible.value = false
        getUserList()

      })
    }
    async function saveRoleInfo(){
      if(!state.selectedRoleId){
        return proxy.$message.error('请选择要分配的角色')
      }
     const {data:res} = await proxy.$axios.put(`users/${state.userInfo.id}/role`,{rid:state.selectedRoleId})
      if(res.meta.status !==200){
        return proxy.$message.error('更新角色失败')
      }
      proxy.$message.success('更新角色成功')
      getUserList()
      setRoleDialogVisible.value =false
    }
    function setRoleDialogClosed () {
      state.selectedRoleId= ''
      state.userInfo ={}
    }
    async function setRole(userInfo){
      state.userInfo=userInfo
      const { data: res } = await proxy.$axios.get('roles')
      if (res.meta.status !==200){
        return proxy.$message.err('获取角色列表失败')
      }
      state.roleslist=res.data
      setRoleDialogVisible.value=true
    }
    async function userStateChanged (userInfo) {
      const { data: res } = await proxy.$axios.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return proxy.$message.err('更新用户状态失败')
      }
      proxy.$message.success('更新用户状态成功')

    }

    onMounted(() => {
      getUserList()
    })
    return {
      getUserList,
      info,
      userList,
      total,
      handleSizeChange,
      handleCurrentChange,
      userStateChanged,
      addDialogVisible,
      addForm,
      addFormRules,
      addFormRef,
      checkEmail,
      checkMobile,
      addDialogClosed,
      addUser,
      showEditDialog,
      editDialogVisible,
      state,
      ...toRefs(state),
      editDialogClosed,
      editFormRef,
      editUserInfo,
      removeUser,
      setRoleDialogVisible,
      setRole,
      saveRoleInfo,
      setRoleDialogClosed
    }
  }
}
</script>

<style scoped lang="less">

</style>
