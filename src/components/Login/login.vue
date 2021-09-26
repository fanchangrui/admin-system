<template>
  <div class="login-container">
    <div class="bg-img">
      <img src="../../assets/login.svg" alt="" />
    </div>
    <div class="login-box">
      <div class="avatar-box">
        <img src="../../assets/antd.png" alt="" />
      </div>
      <el-form label-width="80px" class="login-form" :model="loginForm" :rules="rules" ref="loginFormRef">
        <el-form-item label="用户名" prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input prefix-icon="iconfont icon-3702mima" v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <div>
          <el-button type="primary" class="btn1" @click="login">登录</el-button>
          <el-button class="btn2" @click="reset">重置</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, ref, toRefs,getCurrentInstance } from 'vue'
export default {
  setup() {
    const loginFormRef =ref(null)
    const {proxy} =getCurrentInstance()
    const loginForm =reactive({
      username:'admin',
      password:'123456'
    })
    const  rules =reactive({
      username:[
        {
          required: true,
          message: '请输入用户名',
          trigger: 'blur',
        },
        {
          min: 3,
          max: 10,
          message: '用户名在3到10个字符之间',
          trigger: 'blur',
        },
      ],
      password:[
        {
          required: true,
          message: '请输入密码',
          trigger: 'blur',
        },
        {
          min: 6,
          max: 15,
          message: '用户名在6到15个字符之间',
          trigger: 'blur',
        },
      ]
    })
    function reset(){

      loginFormRef.value.resetFields()

    }
    function login(){
      loginFormRef.value.validate(async valid =>{
        if (!valid) return
        const { data:res } =await proxy.$axios.post('login',loginForm)
        console.log(res)
        if (res.meta.status!=200)return proxy.$message.error('登录失败')
        proxy.$message.success('登录成功')

        window.sessionStorage.setItem("token",res.data.token)
        proxy.$router.push('/home')
      })
    }

    onMounted(() => {
      reset()

    })
    return {
      loginForm,
      rules,
      reset,
      loginFormRef,
      login


    }
  },
};
</script>

<style lang="less" scoped>
.login-container {
  height: 100%;
  .bg-img {
    height: 100%;
    width: 100%;
  }
  img {
    height: 100%;
  }
}
.login-box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border: 2px solid #eee;
  border-radius: 3px;
  box-shadow: 0px 5px 10px #cccc;
  position: absolute;
  left: 80%;
  top: 40%;
  transform: translate(-50%, -50%);

  .avatar-box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.login-form {
  position: absolute;
  bottom: 60px;
  width: 80%;
}
.btn2 {
  position: fixed;
  right: 120px;
  bottom: 20px;
}
.btn1 {
  position: fixed;
  left: 120px;
  bottom: 20px;
}
</style>
