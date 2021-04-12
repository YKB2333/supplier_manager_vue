<template>
  <div id="message-page">
      <!-- <my-table v-model="searchQuery" :searchForm="searchForm" @change="onChange">
        <el-table
          :data="tableData"
          border stripe
          v-loading="tableLoading"
          element-loading-text="拼命加载中">
          <el-table-column prop="userId" label="客户姓名" width="150"></el-table-column>
          <el-table-column prop="title" label="留言概述" width="250"></el-table-column>
         <el-table-column prop="content" label="留言详情" width="450"></el-table-column>
          <el-table-column prop="createTimestamp" label="创建时间" sortable  width="150" ></el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <el-button type="text"  @click="addOneReply(scope.row)">回复</el-button>
              <el-button type="text"  @click="getMessageResponselist(scope.row)">留言回复列表</el-button>
            </template>
          </el-table-column>
        </el-table>
      </my-table> -->

    <the-search @onSearch="onSearch" @onReset="onReset">
      <el-form :model="searchQuery" ref="searchQuery" label-width="100px" inline size="mini">
        <el-form-item prop="keyWord">
          <el-input v-model="searchQuery.keyWord" placeholder="关键字" style="width: 200px;" @keyup.enter.native="fetchTableData"></el-input>
        </el-form-item>
        <el-form-item prop="userId">
          <el-input v-model="searchQuery.userId" placeholder="留言用户ID" style="width: 200px;" @keyup.enter.native="fetchTableData"></el-input>
        </el-form-item>
      </el-form>
    </the-search>
    <el-timeline style="max-width: 1200px;">
      <el-timeline-item 
        v-for="(item, index) in tableData" :key="index"
        :timestamp="formatDate(item.createTimestamp, 'Y/M/D h:m:s')" 
        placement="top"
        icon="el-icon-chat-dot-round"
        size='large'
      >
         <el-card>
          <div class="pb10">
            <span class="fw600 mr30 fs16">{{ item.userName }}</span>
            <el-button v-permission-button="'reply'" type="text"  @click="addOneReply(item)"  >回复</el-button>
            <el-button v-permission-button="'replyList'" type="text"  @click="getMessageResponselist(item)"  >回复消息列表</el-button>
            <el-button v-permission-button="'delete'" type="text " style="float: right;color:red"  @click="delMessage(item,index)" >删除</el-button>
          </div>
          <div class="pb10 fs14">标题：{{ item.title }}</div>
          <div class="fs12" style="word-break: break-all; color: #909399;">{{ item.content }}</div>
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
    <!-- 留言回复列表 -->
    <el-dialog title="留言回复列表" :visible.sync="dialogTableVisible2" width="700px" class="reply-list-dialog">
      <div>
        <div class="item" v-for="item in replyListData" :key="item.id">
          <div class="pl10">
            <div style="font-size: 16px;">
              <!--<span v-show="item.replyId==='401499739371761664'">管理员</span>-->
              <span>{{item.userName}}</span>
              <span>回复</span>
              <span >{{item.replyName}}</span>
              <span style="color: #ccc; font-size: 12px; padding-left: 6px;">{{ item.createTimestamp | formatDate('Y/M/D h:m:s') }}</span>
            </div>
            <div class="row space-between">
              <p class="flex-1" v-if="!item.isDelete">{{item.content}}</p>
              <p class="flex-1" v-else><del>已删除</del></p>
              <el-button type="text" @click="addReply(item)" v-if="!item.isDelete">回复</el-button>
              <el-button type="text" @click="Deletereply(item)" v-if="!item.isDelete">删除</el-button>
            </div>
          </div>
          <el-divider></el-divider>
        </div>

      </div>
    </el-dialog>
    <!--回复表单-->
    <el-dialog title="回复表单" :visible.sync="dialogTableVisible3" width="70%" >
      <el-form :model="replyData" ref="replyData" label-width="100px" class="demo-ruleForm">
        <el-form-item
          label="回复信息"
          :rules="[{ required: true, message: '内容不能为空'}]"
          type="textarea"
          prop="content"
        >
          <el-input type="textarea" v-model="replyData.content" clearable autosize></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm()">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>

</template>

<script>
import { msgPage,msgDetail,replyList,replyAdd,replyDelete,getSupInfoByUserId,msgDelete} from '@/api/supplier/common'
import { formatDate } from '@/utils'
import Pagination from '@/components/Pagination'
import TheSearch from '@/components/SearchForm'

export default {
  name: "reportData",
  components: { Pagination, TheSearch },
  data() {
    return {
      searchForm: [
        {
          key: 'keyWord',
          placeholder: '关键字',
          type: "input"
        },
        {
          key: 'userId',
          placeholder: '留言用户ID',
          type: "input"
        },
      ],
      tableLoading: false,
      dialogTableVisible1:false,
      dialogTableVisible2:false,
      dialogTableVisible3:false,
      searchQuery: {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        sysTag:"supplier_client",
        msgType:'1',
      },
      replyListData:[],
      tableData: [],
      replyData: {
        msgId: '',
        content:'',
        replyId:'',
        sysTag: 'supplier_client',
      },
      SupInfoByUse:[],
    }
  },
  created() {
    this.fetchTableData()
  },
  computed: {
  },
  methods: {
    // 加载表格数据
    async fetchTableData() {
      try {
        this.tableLoading = true
        let res = await this.fetchMassageList()
        this.searchQuery.total = res.count // 总条数
        console.log(this.tableData)
        for(let i = 0; i < res.list.length; i++) {
          if(!this.SupInfoByUse[res.list[i].userId]){
            this.SupInfoByUse[res.list[i].userId] = await getSupInfoByUserId(res.list[i].userId)
          }
          res.list[i].userName =  this.SupInfoByUse[res.list[i].userId] &&  this.SupInfoByUse[res.list[i].userId].name || '-'
        }
        this.tableData = res.list // 数据
      } catch (error) {
        console.log('catch', error)
      } finally {
        this.tableLoading = false
      }
    },
    fetchMassageList() {
      return new Promise((resolve, reject) => {
        msgPage(this.searchQuery)
          .then(res => {
            resolve(res)
          }).catch(error => {
          reject(error)
        })
      })
    },
    handleSizeChange(val) { // 每页条数改变时
      this.searchQuery['pageSize'] = val
      this.searchQuery['pageIndex'] = 1
      this.fetchTableData()
    },
    handleCurrentChange(val) { // 页码改变时
      this.searchQuery['pageIndex'] = val
      this.fetchTableData()
    },
    //数组去重
    unique1(arr){
      var hash=[];
      for (var i = 0; i < arr.length; i++) {
        if(hash.indexOf(arr[i])==-1){
          hash.push(arr[i]);
        }
      }
      return hash;
    },
    //获取留言回复列表
    getMessageResponselist(data){
      replyList(data.id).then(
        res=>{
          res.sort(function(a,b){
            return a.createTimestamp < b.createTimestamp ? -1 : 1
          });
          this.replyListData=res
          this.replyListData.forEach((item, index) => {
            if (item.replyId==='0') {
                item.userName = "我"
                item.replyName = data.userName

             }else {
              item.userName = data.userName
              item.replyName = "我"
            }
           })
        }
      )
      this.dialogTableVisible2 = !this.dialogTableVisible2;
    },
    //回复message的消息列表弹出框
    addReply(data){
      this.replyData.msgId=data.msgId
      this.replyData.replyId="0"
      this.dialogTableVisible3 = !this.dialogTableVisible3
    },
    //回复message弹出框
    addOneReply(data){
      this.replyData.msgId=data.id
      this.replyData.replyId="0"
      this.dialogTableVisible3 = !this.dialogTableVisible3;
    },
    submitForm(){
      replyAdd(this.replyData).then(res=>{
          this.$message({message: '回复成功',type: 'success'})
          this.replyData.content=''
          this.$refs['replyData'].resetFields()
          this.dialogTableVisible3 = !this.dialogTableVisible3;
          this.dialogTableVisible2 = false
        }).catch(error => { 
          console.log(error)
        })
    },
     //删除回复
    Deletereply(item){
        this.$confirm('此操作将删除该留言, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        replyDelete(item.id).then(res=>{
          this.$message({message: '删除成功',type: 'success'})
          item.isDelete = true
        }).catch(
          error =>{
            console.log(error)
          }
        )
      })
    },
    formatDate,
    onSearch() {
      this.fetchTableData()
    },
    onReset() {
      this.$refs['searchQuery'].resetFields()
      this.searchQuery['pageIndex'] = 1
      this.fetchTableData()
    },
    delMessage(item,index){
      this.$confirm('此操作将删除留言, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        msgDelete(item.id).then(res=>{
          this.$message({message: '删除成功',type: 'success'})
          this.tableData.splice(index,1)
        }).catch(
          error =>{
            console.log(error)
          }
        )
      })
    },
  }
}
</script>

<style lang="scss" scoped>
#message-page{
  /deep/ .el-divider--horizontal{
    margin: 16px 0;
  }
  .reply-list-dialog{
    /deep/ .el-dialog{
      height: 80%;
      overflow-y: auto;
    }
  }
  /deep/ .el-card__body{
    padding: 10px 15px;
  }
  /deep/ .el-timeline-item__icon{
    color: #409eff;
  }
}
</style>
