<template>
<el-row>
  <el-col :span="24">
   <el-form v-if="isRememberPW" :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="demo-ruleForm">
      <el-form-item prop="email">
        <el-input type="text" v-model="ruleForm.email" placeholder="Email"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" show-password v-model="ruleForm.password" placeholder="Password"></el-input>
      </el-form-item>
      <div class="link"><a href="/#/login" @click="isRememberPW = true">忘记密码?</a></div>
      <el-form-item style="width:100%">
        <el-button
        :loading="logining"
        @click.native.prevent="handleLogin"
        type="primary" class="form-btn">Sign in</el-button>
      </el-form-item>
   </el-form>
   <el-form v-else :model="ruleForm2" status-icon ref="ruleForm2" class="demo-ruleForm" label-width="85px" size="mini">
    <el-form-item label="邮箱" prop="email" :rules="{ required: true }">
        <el-input v-model="ruleForm2.email" placeholder="请输入您的邮箱"></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="verCode" :rules="{ required: true }">
        <el-input v-model="ruleForm2.verCode" style="width: 50%;" placeholder="验证码"></el-input>
        <el-button type="primary">获取验证码</el-button>
      </el-form-item>
      <el-form-item label="新密码" prop="password" :rules="{ required: true }">
        <el-input v-model="ruleForm2.newPassword" show-password placeholder="请输入新密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="ackPassword" :rules="{ required: true }">
        <el-input v-model="ruleForm2.ackPassword" show-password placeholder="请再次输入新密码"></el-input>
      </el-form-item>
      <el-form-item style="width:100%">
        <el-button type="primary" @click="submitForm2('ruleForm2')" style="margin:0 auto; width: 45%; padding: 10px;">重置密码</el-button>
        <el-button  @click="isRememberPW = true" style="margin:0 auto; width: 45%; padding: 10px; color: #000; background-color: #fff;">取消</el-button>
      </el-form-item>
    </el-form>
  </el-col>
</el-row>
</template>

<script>
/* 引入api */
import {postLogin} from '../../api/api'
// import axios from 'axios'
import utils from '../../utils'

export default {
  data () {
    return {
      logining: false,
      ruleForm: {
        email: '',
        password: ''
      },
      rules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' }
        ]
      },
      isRememberPW: true,
      ruleForm2: {
        email: '',
        verCode: '',
        newPassword: '',
        ackPassword: ''
      }
    }
  },
  methods: {
    submitForm2 () { },
    /* TODO */
    handleLogin () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.logining = true
          let loginParams = {
            email: this.ruleForm.email,
            password: this.ruleForm.password
          }
          /* 调用axios登录接口 */
          postLogin(loginParams).then(res => {
            this.logining = false
            if (res.status === 200) {
              var user = utils.getUserByProfile(res.data.profile, res.data.email)
              this.$store.dispatch('setUser', user)
              this.$router.push({ path: '/' })
            }
            this.$message({
              message: res.data.msg,
              type: res.status === 200 ? 'success' : 'error'
            })
          }).catch(err => {
            this.$message({
              message: err,
              type: 'error'
            })
            this.logining = false
            return false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~scss_vars';
.form-btn, .form-btn:hover, .form-btn:focus {
  text-align: center;
  height: 55px;
  width: 60%;
  margin: 0 20%;
  // padding: 19.5px 44px;
  padding: 0px;
  outline: none;
  cursor: pointer;
  color: #fff;
  font-family: inherit;
  background: $color-primary;
  border: 0px solid currentColor;
  border-radius: 50px;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.1rem;
}
.link {
  text-align: center;
  padding: 10px;
}
a {
  color: #697a79;
  content: '';
  border-bottom: 1px dashed currentColor;
  text-decoration: none;
  font-family: inherit;
}
</style>
