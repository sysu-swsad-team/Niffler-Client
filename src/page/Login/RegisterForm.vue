<template>
<el-row>
  <el-col :span="24">
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-position="right" label-width="78px" size="mini" class="demo-ruleForm">
      <el-form-item label="姓名" prop="name" inline-message="true">
        <el-input v-model="ruleForm.name" placeholder="请输入您的真实姓名"></el-input>
      </el-form-item>
      <el-form-item label="学号" prop="stuId">
        <el-input v-model="ruleForm.stuId" placeholder="请输入您的学号"></el-input>
      </el-form-item>
      <el-form-item label="生日" prop="birth">
          <el-date-picker :editable="false" style="width: 100%;"
            v-model="ruleForm.birth"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="请选择您的出生日期">
          </el-date-picker>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="ruleForm.sex" style="width: 100%;">
          <el-radio border label="男" style="width: 44%; margin: 0px;"></el-radio>
          <el-radio border label="女" style="width: 48%; margin-left: 8%;"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="年级" prop="grade">
        <el-select v-model="ruleForm.grade" placeholder="请选择年级" style="width: 100%;">
          <el-option label="大一" value="大一"></el-option>
          <el-option label="大二" value="大二"></el-option>
          <el-option label="大三" value="大三"></el-option>
          <el-option label="大四" value="大四"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="专业" prop="major">
        <el-select v-model="ruleForm.major" placeholder="请输入您的专业" style="width: 100%;">
          <el-option label="软件工程" value="软件工程"></el-option>
          <el-option label="工商管理" value="工商管理"></el-option>
          <el-option label="计算机科学与技术" value="计算机科学与技术"></el-option>
          <el-option label="历史学系" value="历史学系"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="ruleForm.email" placeholder="请输入您的邮箱"></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="verCode">
        <el-input v-model="ruleForm.verCode" style="width: 46%;" placeholder="验证码"></el-input>
        <el-button type="primary" style="width: 52%; font-size: 12px; letter-spacing: 0px;"
        @click="getVercode"
        :loading="isRequestVercodeLoading"
        :disabled="verDisable">{{ verBtnText }}</el-button>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="ruleForm.password" show-password placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="ackPassword">
        <el-input v-model="ruleForm.ackPassword" show-password placeholder="请再次输入密码"></el-input>
      </el-form-item>
      <el-form-item style="width:100%">
        <el-button :loading="isLoading" type="primary" @click="submitForm('ruleForm')" style="margin:0 auto; width: 45%; padding: 10px;">注册</el-button>
        <el-button :loading="isLoading" @click="resetForm('ruleForm')" style="margin:0 auto; width: 45%; padding: 10px; color: #1D365D; background: #fff;">重置</el-button>
      </el-form-item>
    </el-form>
  </el-col>
</el-row>
</template>

<script>
/* 引入api */
import {postRegister, requestSendVercode} from '../../api/api'

export default {
  data () {
    let validID = (rule, value, callback) => {
      /* reg应该加开始符号和结束符号 */
      let reg = /^[0-9]{8}$/
      if (!reg.test(value)) {
        callback(new Error('学号必须是由8位数字组成'))
      } else {
        callback()
      }
    }
    let validVarCode = (rule, value, callback) => {
      let reg = /^[0-9a-zA-z]{6}$/
      if (!reg.test(value)) {
        callback(new Error('验证码应为6位字符'))
      } else {
        callback()
      }
    }
    let validPassword = (rule, value, callback) => {
      if (value !== this.ruleForm.password) {
        callback(new Error('两次密码应一样'))
      } else {
        callback()
      }
    }
    return {
      isLoading: false,
      isRequestVercodeLoading: false,
      ruleForm: {
        name: '',
        stuId: '',
        birth: '',
        sex: '',
        grade: '',
        major: '',
        email: '',
        verCode: '',
        password: '',
        ackPassword: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'change' }
        ],
        stuId: [
          { required: true, message: '请输入学号', trigger: 'change' },
          { validator: validID, trigger: 'change' }
        ],
        birth: [
          { required: true, message: '请输入出生年月', trigger: 'change' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        grade: [
          { required: true, message: '请选择年级', trigger: 'change' }
        ],
        major: [
          { required: true, message: '请输入专业', trigger: 'change' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        verCode: [
          { required: true, message: '请输入验证码', trigger: 'change' },
          { validator: validVarCode, trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度不小于6，不大于20', trigger: 'change' }
        ],
        ackPassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: validPassword, trigger: 'change' }
        ]
      },
      verDisable: false,
      verBtnText: '获取验证码'
    }
  },
  methods: {
    getSeconds (wait) {
      let _this = this
      let _wait = wait
      if (wait === 0) {
        this.verDisable = false
        this.isRequestVercodeLoading = false
        this.verBtnText = '获取验证码'
        wait = _wait
      } else {
        this.verDisable = true
        this.verBtnText = '验证码(' + wait + 's)'
        wait--
        setTimeout(function () {
          _this.getSeconds(wait)
        }, 1000)
      }
    },
    getVercode () {
      /* 验证email字段 */
      this.$refs.ruleForm.validateField('email', (errorMessage) => {
        if (errorMessage === '') {
          this.isLoading = true
          this.isRequestVercodeLoading = true
          var params = `?email=${this.ruleForm.email}`
          requestSendVercode(params).then(res => {
            if (res.status === 200) {
              this.$message({
                message: `${res.data.msg}`,
                type: res.status === 200 ? 'success' : 'error'
              })
            } else if (res.status <= 300) {
              this.$message({
                message: `${res.data.msg}`,
                type: res.status === 200 ? 'success' : 'error'
              })
            } else {
              this.$message({
                message: `发送验证码错误`,
                type: res.status === 200 ? 'success' : 'error'
              })
            }
            this.getSeconds(60)
            this.isRequestVercodeLoading = false
            this.isLoading = false
          }).catch(err => {
            this.$message({
              message: '验证码发送错误' + err,
              type: 'error'
            })
            this.isRequestVercodeLoading = false
            this.isLoading = false
          })
        } else {
          return false
        }
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isLoading = true
          this.isRequestVercodeLoading = true
          let registerParams = {
            name: this.ruleForm.name,
            stuId: this.ruleForm.stuId,
            birth: this.ruleForm.birth,
            sex: this.ruleForm.sex,
            grade: this.ruleForm.grade,
            major: this.ruleForm.major,
            code: this.ruleForm.verCode,
            email: this.ruleForm.email,
            password: this.ruleForm.password
          }
          /* 调用axios注册接口 */
          postRegister(registerParams).then(res => {
            if (res.status === 200) {
              this.$message({
                message: `${res.data.msg}`,
                type: res.status === 200 ? 'success' : 'error'
              })
              // 调用父组件Login.vue的方法slide，滑动到登录界面
              this.$parent.slide()
            } else if (res.status <= 300) {
              this.$message({
                message: `${res.data.msg}`,
                type: res.status === 200 ? 'success' : 'error'
              })
            } else {
              this.$message({
                message: `注册失败`,
                type: res.status === 200 ? 'success' : 'error'
              })
            }
            this.isLoading = false
            this.isRequestVercodeLoading = false
          }).catch(err => {
            this.$message({
              message: '注册错误' + err,
              type: 'error'
            })
            this.isLoading = false
            this.isRequestVercodeLoading = false
            return false
          })
        } else {
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~scss_vars';
button, button:hover, button:focus {
  outline: none;
  cursor: pointer;
  color: #fff;
  font-family: inherit;

  background: $color-primary;
  border: 1px solid currentColor;
  border-radius: 50px;
  // text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.1rem;
}
</style>
