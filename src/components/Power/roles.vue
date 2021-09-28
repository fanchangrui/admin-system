<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>角色列表</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <el-row>
      <el-col>
        <el-button type="primary" @click="addDialogVisible=true">添加角色</el-button>
      </el-col>
    </el-row>
    <el-table :data="rolelist" border stripe>
      <el-table-column type="expand" label="展开">
        <template #default="scope">
          <el-row :class="['tagBot', i1 === 0 ? 'tagTop' : '','vcenter']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
            <el-col :span="5" >
              <el-tag closable @close="removeRight(scope.row,item1.id)">
                {{item1.authName}}
              </el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <el-col :span="19">
              <el-row :class="[i2 ===0 ? '' : 'tagTop','vcenter']" v-for="(item2,i2) in item1.children"  :key="item2.id" >
                <el-col :span="6">
                  <el-tag type="success" closable @close="removeRight(scope.row,item2.id)">
                    {{item2.authName}}
                  </el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="18" >
                  <el-tag  type="warning" v-for="(item3,i3) in item2.children" :key="item3.id" closable @close="removeRight(scope.row,item3.id)">
                    {{item3.authName}}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作" >
        <template #default="scope">
          <el-button size="small" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)">编辑</el-button>
          <el-button size="small" type="danger" icon="el-icon-delete" @click="removeRules(scope.row.id)">删除</el-button>
          <el-button size="small" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  <el-dialog
    v-model="editDialogVisible"
    title="添加角色"
    width="50%" @close="editDialogClosed">
    <el-form
      ref="editFormRef"
      :model="editForm"
      :rules="addFormRules"
      label-width="100px"
    >
      <el-form-item label="角色名称" prop="roleName" label-width="100px">
        <el-input v-model="editForm.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc">
        <el-input v-model="editForm.roleDesc"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="editRules"
        >确认</el-button
        >
      </span>
    </template>
  </el-dialog>
  <el-dialog
    v-model="addDialogVisible"
    title="添加角色"
    width="50%" @close="addDialogClosed">
    <el-form
      ref="addFormRef"
      :model="addForm"
      :rules="addFormRules"
      label-width="100px"
    >
      <el-form-item label="角色名称" prop="roleName" label-width="100px">
        <el-input v-model="addForm.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc" label-width="100px">
        <el-input v-model="addForm.roleDesc"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addRules"
        >确认</el-button
        >
      </span>
    </template>
  </el-dialog>
<!--  分配权限-->
  <el-dialog
    v-model="setRightDialogVisible"
    title="分配权限"
    width="50%"
    @close="setRightDialogClosed"
  >
    <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key="id" :default-expand-all="true"
             :default-checked-keys="defKeys" ref="treeRef"
    />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="setRights"
        >确认</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { getCurrentInstance, onMounted, reactive, ref, toRefs } from 'vue'

export default {
  name: 'roles',
  setup(){
    const {proxy} =getCurrentInstance()
    const state =reactive({
      rolelist:[],
      editForm:{},
      rightslist:[],
      defKeys:[105],
      roleId:''
    })
    const addForm = reactive({
      roleName:'',
      roleDesc:''
    })
    const treeProps = reactive({
      label:'authName',
      children:'children'
    })
    let addDialogVisible = ref(false)
    let addFormRef =ref()
    let editFormRef=ref()
    let treeRef =ref()
    let setRightDialogVisible=ref(false)
    let editDialogVisible =ref(false)
    const addFormRules = reactive({
      roleName: [{
        required: true,
        message: '请输入角色名称',
        trigger: 'blur',
      },
        {
          min: 3,
          max: 10,
          message: '角色名称的长度在3到10个字符之间',
          trigger: 'blur',
        }],
      roleDesc: [{
        required: true,
        message: '请输入角色描述',
        trigger: 'blur',
      },
        {
          min: 5,
          max: 20,
          message: '角色描述的长度在3到10个字符之间',
          trigger: 'blur',
        }
      ],
    })
    function addDialogClosed(){
      addFormRef.value.resetFields()
    }
    function editDialogClosed(){
      editFormRef.value.resetFields()
    }
    function  addRules(){
      addFormRef.value.validate(async valid =>{
        if(!valid) return proxy.$message.err('角色数据不合法')
        const {data:res} = await proxy.$axios.post('roles',addForm)
        if (res.meta.status !== 201) {
          proxy.$message.err('添加角色失败')
        }
        proxy.$message.success('添加角色成功')
        addDialogVisible.value = false
        getRolesList()

      })
    }
    function editRules(){
      console.log(editFormRef.value)
      editFormRef.value.validate(async valid =>{
        if (!valid) return proxy.$message.err('修改用户数据不合法')
        const {data:res} = await proxy.$axios.put('roles/' + state.editForm.roleId,{roleName:state.editForm.roleName,roleDesc:state.editForm.roleDesc})
        if (res.meta.status !== 200) {
          return proxy.$message.err('修改用户数据失败')
        }
        editDialogVisible.value =false
        getRolesList()
        proxy.$message.success('修改用户数据成功')
      })
    }
    function getLeafKeys (node,arr) {
      if(!node.children){
        return arr.push(node.id)
      }
      node.children.forEach(item =>{
        getLeafKeys(item,arr)
      })
    }
    function setRightDialogClosed(){
      state.defKeys=[]
    }
    async function setRights(){
      const keys =[
        ...treeRef.value.getCheckedKeys(),
        ...treeRef.value.getHalfCheckedKeys()
      ]
      const idStr =keys.join(',')
      const {data:res} =await proxy.$axios.post(`roles/${state.roleId}/rights`,{rids:idStr})
      if (res.meta.status !==200){
        return proxy.$message.err('分配权限失败')
      }
      proxy.$message.success('分配权限成功')
      getRolesList()
      setRightDialogVisible.value=false
    }

    async function showSetRightDialog(role){
      state.roleId =role.id
      const {data:res} =await proxy.$axios.get('rights/tree')
      if (res.meta.status !== 200){
        proxy.$message.err('获取权限数据失败')
      }
      state.rightslist =res.data
      console.log(state.rightslist)
      getLeafKeys(role,state.defKeys)
        setRightDialogVisible.value =true
    }
    async function removeRight(role,rightId){
      const confirmResult = await proxy.$messageBox.confirm(
        '是否删除该权限',
        '提示',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch(err =>err)
      if(confirmResult !=='confirm') return
      const {data:res} = await proxy.$axios.delete(`roles/${role.id}/rights/${rightId}`)
      if(res.meta.status !== 200){
          return proxy.$message.err('删除权限失败')
      }
      role.children =res.data
      proxy.$message.success('删除权限成功')
    }
    async function removeRules(id){
      const confirmResult = await proxy.$messageBox.confirm(
        '是否删除该角色',
        '提示',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch(err =>err)
      if(confirmResult !=='confirm') return
      const {data:res} = await proxy.$axios.delete('roles/' +id)
      if (res.meta.status !== 200){
        return proxy.$message.err('删除角色失败')
      }
      proxy.$message.success('删除角色成功')
      getRolesList()
    }
    async  function getRolesList(){
      const {data:res} =await proxy.$axios.get('roles')
      if (res.meta.status !== 200){
        proxy.$message.err('获取角色列表失败')
      }
       state.rolelist = res.data

    }
    async function showEditDialog(id){

      const {data:res} = await proxy.$axios.get('roles/'+ id)
      if(res.meta.status !== 200){
        return proxy.$message.err('获取用户信息失败')
      }
      state.editForm =res.data

      editDialogVisible.value = true

    }
    onMounted(() => {
      getRolesList()
    })
    return {
        ...toRefs(state),
      getRolesList,
      addForm,
      addFormRules,
    addDialogVisible,
      addDialogClosed,
      addRules,
      addFormRef,
      editDialogVisible,
      editFormRef,
      editDialogClosed,
      editRules,
      showEditDialog,
      removeRules,
      removeRight,
      showSetRightDialog,
      setRightDialogVisible,
      treeProps,
      getLeafKeys,
      setRightDialogClosed,
      setRights,
      treeRef
    }
  }
}
</script>

<style scoped lang="less">
.el-tag {
  margin-top: 8px;
  margin-left: 50px;
}
.tagTop {
  border-top: 1px solid #eee;
}
.tagBot {
  border-bottom: 1px solid #eee;
}
.vcenter{
  display: flex;
  align-items: center;
}
</style>
