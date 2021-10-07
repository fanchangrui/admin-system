<template xmlns:el-table="http://www.w3.org/1999/html">
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>订单管理</el-breadcrumb-item>
    <el-breadcrumb-item>订单列表</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <el-row>
      <el-col :span="8">
        <el-input
          placeholder="请输入内容"
        >
          <template #append>
            <el-button icon="el-icon-search"></el-button>
          </template>
        </el-input>
      </el-col>
    </el-row>
    <el-table :data="orderlist" border stripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="订单编号" prop="order_number"></el-table-column>
      <el-table-column label="订单价格" prop="order_price"></el-table-column>
      <el-table-column label="是否付款" prop="pay_status">
        <template v-slot="scope">
          <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
          <el-tag type="danger" v-else>未付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否发货" prop="is_send"></el-table-column>
      <el-table-column label="下单时间" prop="create_time">
        <template v-slot="scope">
          {{DateFilters(scope.row.create_time).value}}
        </template>
      </el-table-column>
      <el-table-column label="操作" >
        <template v-slot="scope">
          <el-button type="primary" icon="el-icon-edit"  size="small" @click="showBox"></el-button>
          <el-button type="success" icon="el-icon-location"  size="small" @click="showProgressBox"></el-button>
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
  <el-dialog
    v-model="addressVisible"
    title="修改地址"
    width="50%"
    @close="addressDialogClosed"
  >
    <el-form
      ref="addressFormRef"
      :model="addressForm"
      status-icon
      :rules="addressFormRules"
      label-width="120px"
    >
      <el-form-item label="省市区/县" prop="address1">
        <el-cascader :options="citydata" v-model="addressForm.address1"></el-cascader>
      </el-form-item>
      <el-form-item label="详细地址" prop="address2">
        <el-input
          v-model="addressForm.address2"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addressVisible = false">取消</el-button>
        <el-button type="primary" @click="addressVisible = false"
        >确定</el-button
        >
      </span>
    </template>
  </el-dialog>
  <el-dialog
    v-model="progressVisible"
    title="物流进度"
    width="50%"
  >
    <el-timeline>
      <el-timeline-item
        v-for="(activity, index) in progressInfo"
        :key="index"
        :timestamp="activity.time"
      >
        {{ activity.context }}
      </el-timeline-item>
    </el-timeline>
  </el-dialog>
</template>

<script>
import citydata from "./citydata";
import {computed, getCurrentInstance, onMounted, reactive, ref, toRefs} from "vue";
export default {
  name: "order",
  setup(){
    const {proxy} =getCurrentInstance()
    const state =reactive({
       orderlist:[],
       total:0,
       addressVisible:false,
      progressVisible:false,
      progressInfo:[],
        citydata
    })
    const queryInfo=reactive({
      query:'',
      pagenum:1,
      pagesize:10
    })
    const addressForm =reactive({
      address1:[],
      address2:''
    })
    const addressFormRules=reactive({
      address1:[
        {
          required: true,
          message: '请选择省市区/县',
          trigger: 'blur'
        }
      ],
      address2:[
        {
          required: true,
          message: '请填写详细地址',
          trigger: 'blur'
        }
      ]
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
    const addressFormRef =ref()
    function handleSizeChange(newSize){
      queryInfo.pagesize = newSize
      getOrderList()
    }
    function handleCurrentChange(newPage){
       queryInfo.pagenum = newPage
      getOrderList()
    }
    function showBox(){
      state.addressVisible = true
    }
    function addressDialogClosed(){
      addressFormRef.value.resetFields()
    }
    async function showProgressBox(){
      const {data:res} =await proxy.$axios.get('/kuaidi/1106975712662')
      if (res.meta.status !==200){
        return proxy.$message.error('获取物流信息失败')
      }
      state.progressInfo =res.data
      proxy.$message.success('获取物流信息成功')
        state.progressVisible =true
    }
    async function getOrderList(){
      const {data:res} =await proxy.$axios.get('orders', {params:queryInfo})
      if (res.meta.status !==200){
        return proxy.$message.error('查询订单列表失败')
      }
      proxy.$message.success('查询订单列表成功')
      state.orderlist=res.data.goods
      state.total=res.data.total
      console.log(state.orderlist)
    }
    onMounted(() =>{
        getOrderList()
    })
    return{
        ...toRefs(state),
      queryInfo,
      getOrderList,
      DateFilters,
      handleSizeChange,
      handleCurrentChange,
      showBox,
      addressForm,
      addressFormRules,
      addressDialogClosed,
      addressFormRef,
      showProgressBox
  }
}}
</script>

<style scoped>

</style>
