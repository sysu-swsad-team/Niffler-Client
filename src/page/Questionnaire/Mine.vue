<template>
<el-row>
  <el-col :span="24" class="toolbar" sytle="padding-bottom: 0px;">
    <el-form :inline="true" :model="filters">
      <el-form-item>
        <el-input v-model="filters.title" placeholder="问卷标题"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="el-icon-search" @click="getQNList"> 查询</el-button>
      </el-form-item>
    </el-form>
  </el-col>
  <el-table :data="questionnaireList" :row-style="rowStyle" highlight-current-row style="width: 100%;" stripe @row-click="lookOverQN" v-loading="listLoading" element-loading-spinner="el-icon-loading">
    <el-table-column type="index" width="50"></el-table-column>
    <el-table-column prop="title" label="问卷标题" width="200"></el-table-column>
    <el-table-column prop="remaining_quota" label="剩余量" width="100" sortable></el-table-column>
    <el-table-column prop="fee" label="闲钱币" width="100" sortable></el-table-column>
    <el-table-column prop="created_date" label="创建日期" width="200" sortable></el-table-column>
    <el-table-column prop="due_date" label="结束日期" width="200" sortable></el-table-column>
    <el-table-column prop="tag" label="标签" width="100" :filters="[{ text: '商业', value: '商业' }, {text: '学校', value: '学校' }]" :filter-method="filterTag" filter-placement="bottom-end">
      <template slot-scope="scope">
        <el-tag :type="scope.row.tag === '商业' ? 'primary' : 'success'"
        disable-transitions>{{ scope.row.tag }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="操作和描述" min-width="200" prop="status" :filters="[{text: '进行中', value: 'UNDERWAY'}, {text: '已取消', value: 'CANCELLED'}, {text: '已过期', value: 'CLOSED'}, {text: '被举报', value: 'INVALID'}, {text: '已完成', value: 'QUOTA FULL'}]" :filter-method="filterTask" filter-placement="bottom-end">
      <template slot-scope="scope">
        <el-tooltip placement="top">
          <div slot="content">{{ scope.row.description }}</div>
          <el-button v-if="scope.row.status === 'UNDERWAY'" size="small" type="primary" @click="checkQustionnair(scope.row.id)">查看</el-button>
          <el-button v-if="scope.row.status === 'CANCELLED'" size="small" type="info">已取消</el-button>
          <el-button v-if="scope.row.status === 'CLOSED'" size="small" type="info">已过期</el-button>
          <el-button v-if="scope.row.status === 'INVALID'" size="small" type="warning">被举报</el-button>
          <el-button v-if="scope.row.status === 'QUOTA FULL'" size="small" type="success" @click="checkQustionnair(scope.row.id)">已结束</el-button>
        </el-tooltip>
      <el-button :disabled="scope.row.status !== 'UNDERWAY'" size="small" type="danger" @click="deleteQuestionnair(scope.row.id)">取消问卷</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-col :span="24" class="toolbar">
    <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:left;">
    </el-pagination>
  </el-col>
  <el-dialog :visible.sync="isEdit" :close-on-click-model="false" :show-close="false" :close-on-press-escape="false" width="60%" height="auto" class="infinite-list" title="问卷编辑">
    <EditQuestionair :ruleForm="editingQN" style="background-color:white;padding:10px"></EditQuestionair>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" size="medium" @click="summitEdit">提交</el-button>
      <el-button type="primary" size="medium" @click="resetEdit">重置</el-button>
      <el-button type="warning" size="medium" @click="cancelEdit">取消</el-button>
    </div>
  </el-dialog>
  <el-dialog :visible.sync="isCheck" :close-on-click-model="false" :show-close="true" :close-on-press-escape="true" width="60%" height="auto" class="infinite-list" title="问卷填写情况" :center="true">
    <el-table v-if="answerList.length > 0" :data="answerList" style="width: 100%" stripe highlight-current-row max-height="500" fit border>
      <el-table-column prop="userName" label="回答者" width="150"></el-table-column>
      <el-table-column label="问题的答案">
        <template slot-scope="scope">
          <el-table-column v-for="(an, index) in scope.row.answer" :label="'问题' + index" width="100" :key="index">{{ an }}</el-table-column>
        </template>
      </el-table-column>
    </el-table>
    <div v-else>暂无人填写该问卷</div>
  </el-dialog>
  <el-dialog :visible.sync="isLookOver" :close-on-click-model="true" :show-close="true" :close-on-press-escape="true" width="80%" height="auto" class="infinite-list" title="问卷详细内容" :center="true" append-to-body>
    <el-col :span="24" class="content-wrapper" style="background-color: #eee;padding: 10px; margin: 0px;">
      <el-form :model="detailQN" label-position="left" label-width="80px" disabled style="font-weight: bold;" >
        <el-form-item label="题目：" prop="title">
          <p>{{ detailQN.title }}</p>
        </el-form-item>
        <el-form-item label="简介：" prop="description">
          <div>{{ detailQN.description }}</div>
        </el-form-item>
        <el-form-item label="结束时间：" prop="dueDate" label-width="120px">
          <span>{{ detailQN.dueDate }}</span>
        </el-form-item>
        <el-form-item lable-width="10px">
          <el-col :span="7">
            <el-form-item label="最大填写份数：" label-width="150px">
              <span>{{ detailQN.maxNumber }} 份</span>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="报酬（闲钱币个数）" label-width="160px">
              <span>{{ detailQN.fee }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="标签：" label-width="80px">
              <el-tag type="success">学校</el-tag>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-divider content-position="center">问卷内容</el-divider>
        <el-form-item
          v-for="(question, index) in detailQN.questions" :label="(index + 1) + ''" :key="index">
          <el-form-item v-if="question.type === 0">
            <h6>（单选）{{ question.title }}</h6>
            <el-radio v-for="(option, indexP) in question.options" :key="indexP" :label="indexP + ''">{{ option.value }}</el-radio>
          </el-form-item>
          <el-form-item v-if="question.type === 1">
            <h6>（多选）{{ question.title }}</h6>
            <el-checkbox-group>
              <el-checkbox v-for="(option, indexP) in question.options" :key="indexP" :label="indexP + ''">{{ option.value }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item v-if="question.type === 2">
            <h6>（填空）{{ question.title }}</h6>
            <el-input style="margin-bottom: 5px"></el-input>
          </el-form-item>
        </el-form-item>
        <el-divider></el-divider>
      </el-form>
    </el-col>
  </el-dialog>
</el-row>
</template>

<script>
import EditQuestionair from '../components/EditQuestionair'
import ShowQuestionnaire from '../components/ShowQuestionnaire'
import {getQNDetail, queryTask, cancelTask} from '../../api/api'
import querystring from 'querystring'
export default {
  data () {
    return {
      questionnaireList: [ ],
      filters: {
        title: ''
      },
      editingQN: {
        title: '',
        description: '',
        maxNumber: 1,
        fee: 0.01,
        dueDate: '',
        questions: [{
          title: '',
          type: -1,
          options: [{
            value: ''
          }]
        }]
      },
      isEdit: false,
      isCheck: false,
      isLookOver: false,
      answerList: [],
      detailQN: { },
      total: 0,
      listLoading: false
    }
  },
  computed: {
    isCollapse () {
      // 返回./store/index.js中的全局变量
      return this.$store.getters.getIsCollapse
    },
    getInfo () {
      return this.$store.getters.getInfo
    }
  },
  methods: {
    getTags (tagSet) {
      var str = ''
      for (var i = 0; i < tagSet.length; i++) {
        str = str + tagSet[i]
      }
      return str
    },
    getQNList () {
      this.listLoading = true
      const queryParams = {
        /* 去除所有空格 */
        title: this.filters.title.replace(/\s*/g, '')
      }
      var params = {
        type: '问卷',
        asIssuer: true
      }
      if (queryParams.title !== '') {
        params.title = queryParams.title
      }
      params = '?' + querystring.stringify(params)
      queryTask(params).then(res => {
        if (res.status === 200) {
          this.questionnaireList = []
          for (var i = 0; i < res.data.length; i++) {
            this.questionnaireList.push({
              id: res.data[i].id,
              title: res.data[i].title,
              issuer: res.data[i].issuer_first_name,
              remaining_quota: res.data[i].remaining_quota,
              fee: res.data[i].fee,
              due_date: this.convertUTCTimeToLocalTime(res.data[i].due_date),
              tag: this.getTags(res.data[i].tag_set),
              description: res.data[i].description,
              questions: res.data[i].poll,
              status: res.data[i].status,
              created_date: this.convertUTCTimeToLocalTime(res.data[i].created_date)
            })
          }
          this.$message({
            message: `获取问卷成功`,
            type: 'success'
          })
          this.listLoading = false
        } else {
          this.$message({
            message: `获取问卷失败 ${res.data.msg}`,
            type: 'error'
          })
          this.listLoading = false
        }
      }).catch(err => {
        this.$message({
          message: '获取问卷失败 ' + err,
          type: 'error'
        })
        this.listLoading = false
      })
    },
    handleCurrentChange (val) {
      this.page = val
      this.getQNList()
    },
    editQustionnair (index) {
      // 根据this.questionnaireList[index].id 从后端获取完整问卷，存放在editingQN中
      this.isEdit = true
    },
    deleteQuestionnair (id) {
      event.cancelBubble = true
      // 根据this.questionnaireList[index].id 想后端请求删除该问卷，如果返回success，在前端的
      // this.questionnaireList删除对应问卷
      this.$confirm('确认删除该问卷吗？', '提示', {
        type: 'warning'
      }).then(() => {
        let para = {
          id: id
        }
        cancelTask(para).then(res => {
          if (res.status === 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: `删除失败 ${res.data.msg}`,
              type: 'error'
            })
          }
          this.getQNList()
        }).catch(err => {
          this.$message({
            message: err,
            type: 'error'
          })
        })
      })
    },
    checkQustionnair (id) {
      // 根据this.questionnaireList[index].id 向后端求情该问卷的所有填写情况，如果返回success，则
      // 弹出对话框，以表格的形式{'id', 'Q1', 'Q2',...}显示，建议dialog为Fullscreen,存于answerList
      event.cancelBubble = true
      let params = {
        id: id
      }
      getQNDetail(params).then(res => {
        console.log('data:', res.data)
        this.answerList = []
        if (res.status === 200) {
          for (var i = 0; i < res.data.questionnaire.participantship_set.length; i++) {
            this.answerList.push({
              userName: res.data.questionnaire.participantship_set[i].userName,
              answer: JSON.parse(res.data.questionnaire.participantship_set[i].answer)
            })
          }
          console.log(this.answerList)
          this.isCheck = true
        } else {
          this.$message({
            message: '获取问卷失败' + res.data.msg,
            type: 'error'
          })
        }
      }).catch(err => {
        this.$message({
          message: '获取问卷失败' + err,
          type: 'error'
        })
      })
    },
    filterTag (value, row) {
      return row.tag === value
    },
    filterTask (value, row) {
      return row.status === value
    },
    summitEdit () {
      if (this.editingQN.title === '') {
        this.$message.error('请输入问卷标题')
      } else if (this.editingQN.dueDate === '') {
        this.$message.error('请输入问卷截止时间')
      } else {
        // 向后端发送更改信息，成功则返回下面提示
        this.$message({
          message: '问卷更改成功',
          type: 'success'
        })
        this.isEdit = false
      }
    },
    resetEdit () {
      // 使用个临时变量存储更改前问卷，
      alert('resetEdit')
    },
    cancelEdit () {
      // 注意重置问卷
      this.editingQN = {
        title: '',
        description: '',
        maxNumber: 1,
        fee: 0.01,
        dueDate: '',
        questions: [{
          title: '',
          type: -1,
          options: [{
            value: ''
          }]
        }]
      }
      this.isEdit = false
    },
    convertUTCTimeToLocalTime (UTCDateString) {
      if (!UTCDateString) {
        return '-'
      }
      function formatFunc (str) {
        return str > 9 ? str : '0' + str
      }
      var date2 = new Date(UTCDateString)
      var year = date2.getFullYear()
      var mon = formatFunc(date2.getMonth() + 1)
      var day = formatFunc(date2.getDate())
      var hour = date2.getHours()
      var noon = hour >= 12 ? 'PM' : 'AM'
      hour = hour >= 12 ? hour - 12 : hour
      hour = formatFunc(hour)
      var min = formatFunc(date2.getMinutes())
      var dateStr = year + '-' + mon + '-' + day + ' ' + hour + ':' + min + ' ' + noon
      return dateStr
    },
    lookOverQN: function (row) {
      // 通过row.id获取问卷详细内容,放于detailQN
      let params = {
        id: row.id
      }
      getQNDetail(params).then(res => {
        if (res.status === 200) {
          this.detailQN = {
            id: res.data.questionnaire.id,
            title: res.data.questionnaire.title,
            description: res.data.questionnaire.description,
            maxNumber: res.data.questionnaire.participant_quota,
            fee: res.data.questionnaire.fee,
            dueDate: res.data.questionnaire.due_date,
            questions: JSON.parse(res.data.questionnaire.poll)
          }
          this.isLookOver = true
        } else {
          this.$message({
            message: '获取问卷失败' + res.data.msg,
            type: 'error'
          })
        }
      }).catch(err => {
        this.$message({
          message: '获取问卷失败' + err,
          type: 'error'
        })
      })
    },
    /* 表格行的样式设置 */
    rowStyle ({row, rowIndex}) {
      return 'cursor: pointer;'
    }
  },
  mounted () {
    this.getQNList()
  },
  components: {
    EditQuestionair,
    ShowQuestionnaire
  }
}
</script>
<style scoped lang="scss">
@import '@/styles/pages.scss';
.el-dialog .el-dialog__body {
  padding: 0px;
}
</style>
