<template>
  <div>
    <div class="inline-item between-item">
      <div class="inline-item">
        <el-input v-model="queryName" placeholder="项目名称"></el-input>
        <el-button type="primary" @click="search" plain>搜索</el-button>
      </div>
      <el-button type="primary" @click="addProjectToast" plain>创建项目</el-button>
    </div>
    <div class="">
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="id"
          label="ID"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="项目名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="host"
          label="项目HOST"
          >
        </el-table-column>
        <el-table-column
          prop="date"
          label="操作"
          width="250">
          <template slot-scope="scope">
            <el-button @click="goApi(scope.row)" type="text" size="small">API管理</el-button>
            <el-button @click.stop="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click.stop="handleDelete(scope.row)" type="text" size="small">删除</el-button>
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
      :title="type === 'add' ? '新增项目' :'编辑项目'"
      :visible.sync="dialogVisible"
      width="40%">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="项目名称"></el-input>
        </el-form-item>
        <el-form-item label="项目HOST" prop="host">
          <el-input v-model="ruleForm.host" placeholder="服务域名"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button  @click="resetForm('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="confirmForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        type: '',
        queryName: '',
        count: 10,
        page: 1,
        name: '',
        total: 0,
        projectId: '',
        ruleForm: {
          name: '',
          host: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入项目名称', trigger: 'blur' }
          ],
          host: [
            { required: true, message: '请输入服务域名', trigger: 'blur' }
          ]
        },
        tableData: [],
        dialogVisible: false
      }
    },
    created () {
      // localStorage.setItem('token', 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJsaVV5UmhkV3lYNzBYc1JPUEZUX0dtdnZzanYtYVhjaXNwckUxTHpyRjZFIn0.eyJqdGkiOiJjMzU4NTM5Yi1iZjE0LTRjMjEtODkxYS1lMDYxNDAyYTZjODkiLCJleHAiOjE1NTkzNjEwMDUsIm5iZiI6MCwiaWF0IjoxNTU4OTI5MDA1LCJpc3MiOiJodHRwOi8vc3NvLmppbnVvLm1lL2F1dGgvcmVhbG1zL0ppbnVvUHJpdmF0ZU5ldHdvcmsiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiMjhiNmFmNWQtZDAyMC00YjY0LTljM2MtOTk4NGMyMmUyYWFkIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoibW9ja2VyIiwiYXV0aF90aW1lIjoxNTU4NjYzOTMwLCJzZXNzaW9uX3N0YXRlIjoiOWMwOWMyN2UtMTQ4MC00NGEyLThkMWYtYTY2MTc4ZTI3NzAxIiwiYWNyIjoiMCIsImFsbG93ZWQtb3JpZ2lucyI6WyJtb2NrZXIuamludW8ubWUiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6ImVtYWlsIHByb2ZpbGUiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6IuaVrOaWhyDpgpMiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJkZW5namluZ3dlbiIsImdpdmVuX25hbWUiOiLmlazmlociLCJsb2NhbGUiOiJ6aC1DTiIsImZhbWlseV9uYW1lIjoi6YKTIiwiZW1haWwiOiJkZW5namluZ3dlbkBqaW51by5tZSJ9.ZC2VGXBT03SRpvnqwk3QEm7CCOQZ4vUEstYdjIiDUGYdcpxVrS9R6JcC7tU2TaVBBiXZ83SzMl-lnpjE2VSbliBeDiZ2m1NlqJ7hwKP4FKZQN1h1mYMpcQtueCzgtazjOdiOFtyRVemJCjtGFeXy7RytwNOyOSoMEaeQahzv54YgSH1Rnk-veyAJlRSIJCYJXdNO54UH1l0Kzr28-zrKJtQw4WLdG1SpxbE40hB1DvoN47xW0Qy0DaTdD6lvUwPXZ0FSaK5-taOQQM5ebyg8oRI7e0kzxCJYfYg2QmNP7KwsVumKTB-tskO1EGK9SU5pUw4rtU0SjxLMlbvYcp28nw')
      this.search()
    },
    methods: {
      goApi (item) {
        console.log(item)
        this.$router.push(`/dashboard/apis/${item.id}/${item.host}`)
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
        this.dialogVisible = false
      },
      confirmForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.type === 'add') {
              this.$axios.post('/projects', {name: this.ruleForm.name, host: this.ruleForm.host}).then(res => {
                this.$message.success('创建成功')
                this.dialogVisible = false
                this.search()
              })
            } else {
              this.$axios.put(`/projects/${this.projectId}`, {name: this.ruleForm.name, host: this.ruleForm.host}).then(res => {
                this.$message.success('创建成功')
                this.dialogVisible = false
                this.search()
              })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      pageChange (e) {
        this.page = e
        this.search()
      },
      search () {
        const data = {
          count: this.count,
          page: this.page,
          name: this.queryName
        }
        this.$axios.get('/projects', {params: data}).then(res => {
          this.tableData = res.items
          this.total = res.totalCount
          this.count = res.curCount
        })
      },
      addProjectToast () {
        this.ruleForm = {
          name: '',
          host: ''
        }
        this.type = 'add'
        this.dialogVisible = true
      },
      handleEdit (item) {
        this.ruleForm = item
        this.projectId = item.id
        this.type = 'edit'
        this.dialogVisible = true
      },
      handleDelete (item) {
        this.$confirm('确认删除该项目, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.delete(`/projects/${item.id}`).then(res => {
            this.$message.success('删除成功')
            this.search()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    }
  }
</script>
<style>

</style>
