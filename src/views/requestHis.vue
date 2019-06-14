<template>
  <div>
    <div class="inline-item between-item">
      <div><i class="el-icon-arrow-left" @click="goBack"></i><span class="title">{{path}}</span></div>
    </div>
    <div class="">
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="time"
          label="Time"
          width="180">
        </el-table-column>
        <el-table-column
          prop="path"
          label="FullPATH"
          width="180">
        </el-table-column>
        <el-table-column
          prop="body"
          label="Body">
        </el-table-column>
        <el-table-column
          label="操作"
          width="180">
          <template slot-scope="scope">
            <el-button @click="getAjaxInfo(scope.row)" type="text" size="small">完整请求</el-button>
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
      title="请求详情"
      :visible.sync="dialogVisible"
      width="30%">
        <div>
            <code>{{ajaxInfo}}</code>
        </div>
      <span slot="footer" class="dialog-footer">
        <el-button  @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
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
        projectId: '',
        apiId: '',
        path: '',
        tableData: [],
        dialogVisible: false,
        ajaxInfo: {}
      }
    },
    mounted () {
      this.projectId = this.$route.query.projectId
      this.apiId = this.$route.query.apiId
      this.path = this.$route.query.host + '/' + this.$route.query.path
      this.getData()
    },
    methods: {
      goBack () {
        this.$router.back()
      },
      pageChange (e) {
        this.page = e
        this.getData(this.projectId)
      },
      getData () {
        const data = {
          page: this.page,
          count: this.count
        }
        this.$axios.get(`/projects/${this.projectId}/${this.apiId}/history`, {params: data}).then(res => {
          this.tableData = res.items
          this.total = res.totalCount
          this.count = res.curCount
        })
      },
      getAjaxInfo (item) {
        this.$axios.get(`/projects/${this.projectId}/${this.apiId}/history/${item.id}`).then((res) => {
          this.dialogVisible = true
          this.ajaxInfo = res
        })
      }
    }
  }
</script>
