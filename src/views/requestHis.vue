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
          label="Body">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.body" placement="bottom">
              <span class="body-span">{{scope.row.body}}</span>
            </el-tooltip>
          </template>
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
          <p class="info1">
            <span>{{method}}</span>
            <span>{{path}}</span>
          </p>
          <div class="content-box" v-html="ajaxInfo.head"></div>
          <div class="body-content" v-html="ajaxInfo.body" v-show="ajaxInfo.body!=='null'"></div>
        </div>
      <span slot="footer" class="dialog-footer">
        <el-button  @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {handleTime} from '@/tools/util'
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
        method: '',
        tableData: [],
        dialogVisible: false,
        ajaxInfo: {

        }
      }
    },
    mounted () {
      this.projectId = this.$route.query.projectId
      this.apiId = this.$route.query.apiId
      this.path = this.$route.query.host + this.$route.query.path
      this.method = this.$route.query.method
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
        this.$axios.get(`/projects/${this.apiId}/history`, {params: data}).then(res => {
          this.tableData = res.items
          this.total = res.totalCount
          this.count = res.curCount
          this.tableData.map((item) => {
            item.time = handleTime(item.time)
          })
        })
      },
      getAjaxInfo (item) {
        this.$axios.get(`/projects/history/${item.id}`).then((res) => {
          this.dialogVisible = true
          this.ajaxInfo = Object.assign(this.ajaxInfo, res)
          this.ajaxInfo.head = this.ajaxInfo.head.replace(/\n/g, '</br>')
          this.ajaxInfo.head = this.ajaxInfo.head.replace(/:/g, ' : ')
          this.ajaxInfo.body = JSON.stringify(JSON.parse(this.ajaxInfo.body), null, 2)
          this.ajaxInfo.body = this.ajaxInfo.body.replace(/\n/g, '</br>')
        })
      }
    }
  }
</script>
<style scoped>
.info1{
  display: flex;
  font-weight: bold;
  font-size: 18px;
}
.info1 span:first-child{
  margin-right: 15px;
}
.content-box,.body-content{
  text-align: left;
  font-size: 16px;
  line-height: 26px;
  color: #0c0c0c;
}
.body-content{
  margin-top: 30px;
  border:1px solid #ddd;
  padding: 33px;
}
.body-span{
  display: inline-block;
  max-width: 10%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
