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
        <el-button type="primary">
          添加用户
        </el-button>
      </el-col>
    </el-row>
    <el-table :data="userList" style="width: 100%" border stripe>
      <el-table-column type="index" label="#" />
      <el-table-column prop="username" label="姓名"  />
      <el-table-column prop="email" label="邮箱"  />
      <el-table-column prop="mobile" label="电话" />
      <el-table-column prop="role_name" label="角色" />
      <el-table-column label="状态">
        <template #default="scope">
          <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column  label="操作" >
        <template #default="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
          <el-tooltip placement="top" content="分配角色" :enterable="false">
            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
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
</template>

<script>
import { onMounted, getCurrentInstance, reactive, ref } from 'vue'

export default {
  name: 'users',
  setup(){
    const {proxy} =getCurrentInstance()
    const info = reactive({
      query:'',
      pagenum:1,
      pagesize:2
    })
    let userList =reactive([])
    let total =ref(0)
    async  function getUserList(){

      const {data:res} =await proxy.$axios.get('users',{params:info})
      if (res.meta.status !== 200) return proxy.$message.err('获取用户列表失败')
      userList.splice(0,userList.length)
      userList.push(...res.data.users)
      total.value =res.data.total
      proxy.$message.success('获取用户列表成功')
      console.log(res)
    }
    function handleSizeChange(newSize) {
        info.pagesize=newSize
      getUserList()
    }
    function handleCurrentChange(newPage){
        info.pagenum =newPage
      getUserList()
    }
    async function userStateChanged(userInfo){
    const {data:res} = await proxy.$axios.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return proxy.$message.err('更新用户状态失败')
      }
      proxy.$message.success('更新用户状态成功')

    }
    onMounted(() =>{
      getUserList()
    })
    return{
      getUserList,
      info,
      userList,
      total,
      handleSizeChange,
      handleCurrentChange,
      userStateChanged
    }
  }
}
</script>

<style scoped lang="less">

</style>
