<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>权限列表</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <el-table :data="rightsList" border stripe>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column label="权限" prop="authName"></el-table-column>
      <el-table-column label="路径" prop="path"></el-table-column>
      <el-table-column label="权限等级" prop="level">
        <template #default="scope">
          <el-tag v-if="scope.row.level === '0'">一级</el-tag>
          <el-tag v-if="scope.row.level === '1'" type="success">二级</el-tag>
          <el-tag v-if="scope.row.level === '2'" type="warning">三级</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import { getCurrentInstance, onMounted, reactive, toRefs } from 'vue'
export default {
  name: 'rights',
  setup(){
    const {proxy} =getCurrentInstance()
      const state =reactive({
        rightsList:[]
      })
    async function getRightsList(){
       const {data:res} =  await proxy.$axios.get('rights/list')
      if (res.meta.status !==200){
        return proxy.$message.err('获取权限列表失败')
      }
      state.rightsList = res.data

    }
    onMounted(() =>{
      getRightsList()
    })
    return {
        state,
      getRightsList,
      ...toRefs(state)
    }
  }

}
</script>

<style scoped lang="less">

</style>
