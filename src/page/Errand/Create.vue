<template>
    <el-row>
      <el-col :span="24" class="content-wrapper">
          <el-form :model="ruleForm" :rules="rules" label-position="left" label-width="80px" ref="ruleForm">
            <el-form-item label="标题" prop="title">
              <el-input v-model="ruleForm.title" maxlength="30" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="结束时间" prop="dueDate">
              <el-date-picker v-model="ruleForm.dueDate" type="datetime"></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-col :span="11">
                <el-form-item label="闲钱币：" prop="fee" label-width="120px">
                  <el-input-number v-model="ruleForm.fee" :min="1" :max="9999" :step="1"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="1">
                <el-form-item label="类型" label-width="100px" prop="tag">
                  <el-select v-model="ruleForm.tag" placeholder="请选择类型">
                    <el-option v-for="item in tags" :key="item.value" :label="item.value" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="任务描述" prop="description">
              <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 10 }" v-model="ruleForm.description" maxlength="500" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="" label-width="80px">
              <el-button type="primary" icon="el-icon-s-claim" @click.prevent="summitForm('ruleForm')" style="width:30%;margin-left:calc(30% + 20px)">提交任务</el-button>
            </el-form-item>
          </el-form>
      </el-col>
    </el-row>
</template>

<script>
import Vue from 'vue'
import {summitTask} from '../../api/api'
Vue.component('anchored-heading', {
  render: function (createElement) {
    return createElement(
      'h' + this.level, // 标签名称
      this.$slots.default // 子节点数组
    )
  },
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
export default {
  data () {
    return {
      ruleForm: {
        title: '',
        dueDate: '',
        fee: 0.01,
        tag: '',
        description: ''
      },
      tags: [{
        value: '快递'
      }, {
        value: '外卖'
      }],
      rules: {
        title: [
          { required: true, message: '请输入题目', triggr: 'blur' }
        ],
        description: [
          { required: true }
        ],
        fee: [
          { required: true }
        ],
        tag: [
          { required: true }
        ],
        dueDate: [
          { type: 'date', required: true, message: '', triggr: 'blur' }
        ]
      }
    }
  },
  computed: {
    getInfo () {
      return this.$store.getters.getInfo
    }
  },
  methods: {
    summitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('确定提交该任务吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'success'
          }).then(() => {
            this.isLoading = true
            let summitParams = {
              taskType: '跑腿',
              title: this.ruleForm.title,
              description: this.ruleForm.description,
              dueDate: this.ruleForm.dueDate.toString(),
              fee: this.ruleForm.fee,
              maxNumber: 1,
              tag: [this.ruleForm.tag],
              question: ''
            }
            summitTask(summitParams).then(res => {
              if (res.status === 200) {
                this.$message({
                  message: '提交成功',
                  type: 'success'
                })
              } else {
                this.$message({
                  message: `提交 ${res.data.msg}`,
                  type: 'error'
                })
              }
            })
          }).catch((err) => {
            this.$message({
              message: `接取任务失败 ${err}`,
              type: 'error'
            })
          })
        }
      })
    }
  }
}
</script>
