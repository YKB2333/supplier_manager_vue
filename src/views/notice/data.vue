<template>
  <div id="notice-page">
      <div class="pb10">
        <el-button v-permission-button="'add'" type="primary" size="small" @click="showDialog()">新增</el-button>
      </div>
      <el-timeline style="max-width: 1200px;">
        <el-timeline-item 
          v-for="(item, index) in tableData" :key="index"
          :timestamp="formatDate(item.createTimestamp, 'Y/M/D h:m:s')" 
          placement="top"
          icon="el-icon-message-solid"
          size='large'
        >
          <el-card>
            <div class="fw600 pb10">{{ item.title }}</div>
            <div style="word-break: break-all;">{{ item.content }}</div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
      <pagination 
        :pageIndex="searchQuery.pageIndex"
        :pageSize="searchQuery.pageSize"
        :total="searchQuery.total"
        @onPageSizeChange="handleSizeChange"
        @onPageIndexChange="handleCurrentChange"
      />
    <!--公告表单-->
    <el-dialog title="发布公告" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="form">
        <el-form-item label="公告标题" label-width="120px">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="公告内容" label-width="120px">
          <el-input v-model="form.content" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog()">取消</el-button>
        <el-button type="primary" @click="addNotice()">确定</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
import {noticePage,noticeSave} from '@/api/supplier/common'
import { formatDate } from '@/utils'
import { noticeTypes } from "@/const/supplier/recommend"
import Pagination from '@/components/Pagination'

export default {
  name: "reportData",
  components: { Pagination },
  data() {
    return {
      tableLoading: false,
      dialogFormVisible:false,
      form :{
        title:'',
        content:'',
        sendUserId:'0',
        readStatus:"0",
        receiveUserId:'0',
        noticeType:3,
        sysTag:"supplier",
      },
      searchQuery: {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        sysTag:"supplier",
        noticeType: 3,
      },
      replyListData:[],
      tableData: [],
    }
  },
  created() {
    this.fetchTableData()
  },
  computed: {
  },
  methods: {
    handleSizeChange(val) { // 每页条数改变时
      this.searchQuery['pageSize'] = val
      this.searchQuery['pageIndex'] = 1
      this.fetchTableData()
    },
    handleCurrentChange(val) { // 页码改变时
      this.searchQuery['pageIndex'] = val
      this.fetchTableData()
    },
    // 加载表格数据
    fetchTableData() {
      this.tableLoading = true
      noticePage(this.searchQuery).then(res => {
        this.searchQuery.total = res.count // 总条数
        this.tableData = res.list // 列表数据
        console.log('列表数据', res.list)
      }).catch(error => {
        console.log(error)
      }).finally(() => {
        this.tableLoading = false
      })
    },
    formatDate,
    showDialog(){
      this.dialogFormVisible = true
    },
    //保存信息
    addNotice(){
      console.log(this.form)
      noticeSave(this.form)
        .then(res => {
          this.$message({message: '发布成功',type: 'success'})
          this.$refs['form'].resetFields()
          this.form['title'] = ''
          this.form['content'] = ''
          this.dialogFormVisible = false
          this.fetchTableData()
        }).catch(error => {
          console.log(error)
        })
    },
    //关闭表单
   closeDialog(){
      this.dialogFormVisible=false;
      this.form.title=''
      this.form.content=''
    },

  }
}
</script>

<style lang="scss" scoped>
#notice-page{
  /deep/ .el-card__body{
    padding: 10px 15px;
  }
  /deep/ .el-timeline-item__icon{
    color: #0bbd87;
  }
}
</style>


