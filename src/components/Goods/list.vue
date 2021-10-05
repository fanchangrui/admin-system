<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品列表</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
          <template #append>
            <el-button icon="el-icon-search" @click="getGoodsList"></el-button>
          </template>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="goAdd">添加商品</el-button>
      </el-col>
    </el-row>
    <el-table :data="goodslist" border stripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="商品名称" prop="goods_name"></el-table-column>
      <el-table-column label="商品价格" prop="goods_price" width="90px"></el-table-column>
      <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
      <el-table-column label="创建时间" width="200">
        <template v-slot="time">
          {{ DateFilters(time.row.add_time).value }}
        </template>
      </el-table-column>
        <el-table-column label="操作" width="130px">
          <template v-slot="scope">
            <el-button type="primary" size="small" icon="el-icon-edit"></el-button>
            <el-button type="danger" size="small" icon="el-icon-delete" @click="removeBuId(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
    </el-table>
    <el-pagination
      v-model:currentPage="queryInfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </el-card>
</template>

<script>
import {computed, getCurrentInstance, onMounted, reactive, toRefs} from "vue";
export default {
  name: "list",
  setup(){
    const {proxy} =getCurrentInstance()
    const state =reactive({
      goodslist:[],
      total:0
    })
    const queryInfo =reactive({
      query:'',
      pagenum:1,
      pagesize:10
    })
    const DateFilters = (origalVal) => {
      return computed(() => {
        const dt = new Date(origalVal)
        const y = dt.getFullYear()
        const m = (dt.getMonth() + 1 + '').padStart(2, '0')
        const d = (dt.getDate() + '').padStart(2, '0')
        const hh = (dt.getHours() + '').padStart(2, '0')
        const mm = (dt.getMinutes() + '').padStart(2, '0')
        const ss = (dt.getSeconds() + '').padStart(2, '0')
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
      })
    }
    function handleSizeChange(newSize){
      queryInfo.pagesize = newSize
      getGoodsList()
    }
    function handleCurrentChange(newPage){
      queryInfo.pagenum = newPage
      getGoodsList()
    }
    function goAdd(){
      proxy.$router.push('/goods/add')
    }
    async function getGoodsList(){
      const {data:res} =await proxy.$axios.get('goods',{params:queryInfo})
      if (res.meta.status !==200){
        return proxy.$message.error('获取商品列表失败')
      }
      proxy.$message.success('获取商品列表成功')
      state.goodslist =res.data.goods
      state.total =res.data.total
      console.log(res.data.goods)
    }
    async function removeBuId(id){
      const confirmResult = await proxy.$messageBox.confirm(
        '是否删除该商品',
        '提示',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch(err =>err)
      if(confirmResult !=='confirm') return
      const {data:res} = await proxy.$axios.delete(`goods/${id}`)
      if (res.meta.status !== 200){
        return proxy.$message.error('删除商品失败')
      }
      proxy.$message.success('删除商品成功')
      getGoodsList()
    }
    onMounted(() =>{
      getGoodsList()
    })
    return{
      getGoodsList,
      ...toRefs(state),
      queryInfo,
      DateFilters,
      handleSizeChange,
      handleCurrentChange,
      removeBuId,
      goAdd
    }
  }
}
</script>

<style scoped>

</style>
