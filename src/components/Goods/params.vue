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
    >
    </el-alert>
  </el-card>
</template>

<script>
export default {
  name: "params"
}
</script>

<style scoped>

</style>
