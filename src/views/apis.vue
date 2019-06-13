<template>
  <div>
    <div class="inline-item between-item">
      <div><i class="el-icon-arrow-left" @click="goBack"></i><span class="title">{{$route.params.host}}</span></div>
      <el-button type="primary" plain @click="addApiToast">创建接口</el-button>
    </div>
    <div class="">
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="method"
          label="METHOD"
          width="180">
        </el-table-column>
        <el-table-column
          prop="path"
          label="PATH"
          width="180">
        </el-table-column>
        <el-table-column
          prop="responseCode"
          label="ResponseCode"
          width="180">
        </el-table-column>
        <el-table-column
          prop="responseBody"
          label="ResponseBody">
        </el-table-column>
        <el-table-column
          prop="date"
          label="操作"
          width="250">
          <template slot-scope="scope">
            <el-button @click="goHis(scope.row)" type="text" size="small">请求历史</el-button>
            <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="handleConfig(scope.row)" type="text" size="small">配置</el-button>
            <el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      background
      layout="prev, pager, next"
      @current-change="pageChange"
      :current-page.sync="page"
      :total="total">
    </el-pagination>
    <el-dialog
      :title="type === 'add' ? '创建接口' :'编辑接口'"
      :visible.sync="dialogVisible"
      width="30%">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="90px" class="demo-ruleForm">
        <el-form-item label="METHOD" prop="method">
          <el-select v-model="ruleForm.method" placeholder="请选择">
            <el-option key="GET" label="GET" value="GET"></el-option>
            <el-option key="POST" label="POST" value="POST"></el-option>
            <el-option key="DELETE" label="DELETE" value="DELETE"></el-option>
            <el-option key="PUT" label="PUT" value="PUT"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="PATH" prop="path">
          <el-input v-model="ruleForm.path" placeholder="path"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button  @click="resetForm('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="confirmForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="配置响应"
      :visible.sync="dialogVisible2"
      width="30%">
      <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="140px" class="demo-ruleForm">
        <el-form-item label="ResponseCode" prop="responseCode">
          <el-input v-model="ruleForm2.responseCode" placeholder="responseCode"></el-input>
        </el-form-item>
        <el-form-item label="ResponseBody" prop="responseBody">
          <el-input v-model="ruleForm2.responseBody" placeholder="responseBody"  type="textarea"  :rows="5"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button  @click="resetForm('ruleForm2')">取 消</el-button>
        <el-button type="primary" @click="confirmForm2('ruleForm2')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        page: 1,
        count: 10,
        total: 0,
        type: '',
        apiId: '',
        tableData: [],
        ruleForm2: {},
        rules2: {
          responseCode: [
            { required: true, message: '请输入内容', trigger: 'blur' }
          ],
          responseBody: [
            { required: true, message: '请输入内容', trigger: 'blur' }
          ]
        },
        ruleForm: {},
        rules: {
          method: [
            { required: true, message: '请输入内容', trigger: 'blur' }
          ],
          path: [
            { required: true, message: '请输入内容', trigger: 'blur' }
          ]
        },
        dialogVisible: false,
        dialogVisible2: false
      }
    },
    created () {
      this.projectId = this.$route.params.projectId
      this.getApiList(this.projectId)
    },
    methods: {
      goBack () {
        this.$router.back()
      },
      pageChange (e) {
        this.page = e
        this.getApiList(this.projectId)
      },
      getApiList (projectId) {
        const data = {
          page: this.page,
          count: this.count
        }
        this.$axios.get(`/projects/${projectId}`, {params: data}).then(res => {
          this.tableData = res.items
          this.total = res.totalCount
          this.count = res.curCount
        })
      },
      addApiToast () {
        this.ruleForm = {
          method: '',
          path: ''
        }
        this.type = 'add'
        this.dialogVisible = true
      },
      handleEdit (item) {
        this.apiId = item.id
        this.ruleForm = {
          method: item.method,
          path: item.path
        }
        this.type = 'edit'
        this.dialogVisible = true
      },
      handleConfig (item) {
        this.apiId = item.id
        this.ruleForm2 = {
          responseCode: item.responseCode,
          responseBody: item.responseBody
        }
        this.dialogVisible2 = true
      },
      handleDelete (item) {
        this.$confirm('确认删除该接口, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.delete(`/projects/${this.projectId}/${item.id}`).then(res => {
            this.$message.success('删除成功')
            this.getApiList(this.projectId)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
        this.dialogVisible = false
        this.dialogVisible2 = false
      },
      confirmForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.type === 'add') {
              this.$axios.post(`/projects/${this.projectId}`, {method: this.ruleForm.method, path: this.ruleForm.path}).then(res => {
                this.$message.success('创建成功')
                this.dialogVisible = false
                this.getApiList(this.projectId)
              })
            } else {
              this.$axios.put(`/projects/${this.projectId}/${this.apiId}`, {method: this.ruleForm.method, path: this.ruleForm.path}).then(res => {
                this.$message.success('更新成功')
                this.dialogVisible = false
                this.getApiList(this.projectId)
              })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      confirmForm2 (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$axios.put(`/projects/${this.projectId}/${this.apiId}/response`, {responseCode: this.ruleForm2.responseCode, responseBody: this.ruleForm2.responseBody}).then(res => {
              this.$message.success('编辑成功')
              this.dialogVisible2 = false
              this.getApiList(this.projectId)
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      goHis (item) {
        this.$router.push(`/dashboard/rqhis/${this.projectId}/${item.id}/${this.$route.params.host}${item.path}`)
      }
    }
  }
</script>
