<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>数据统计</el-breadcrumb-item>
    <el-breadcrumb-item>数据报表</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <div id="main" style="width: 750px; height: 450px"></div>
  </el-card>
</template>

<script>
import {onMounted, getCurrentInstance, reactive} from "vue";
import * as echarts from 'echarts'
import _ from 'lodash'
export default {
  name: "report",
  setup(){
    const {proxy} =getCurrentInstance()
    const state = reactive({
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    })
    onMounted(async () =>{
      const myChart = echarts.init(document.getElementById('main'))
      // 指定图表的配置项和数据
      const { data: res } = await proxy.$axios.get('reports/type/1')
      if (res.meta.status !== 200) {
        return proxy.$message.error('获取表失败')
      }
      //合并options
      const result = _.merge(state.options, res.data)
      // 使用刚指定的配置项和数据显示图表
      myChart.setOption(result)

    })
    return{

    }
  }
}
</script>

<style scoped>

</style>
