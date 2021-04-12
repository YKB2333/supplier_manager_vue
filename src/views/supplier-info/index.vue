<template>
  <div>
    <the-search @onSearch="onSearch" @onReset="resetSearch">
      <el-form :model="queryParams" ref="searchQuery" label-width="100px" inline size="mini">
        <el-form-item label="主标题" prop="title">
          <el-input v-model="queryParams.title" placeholder="请输入" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="资讯分类" prop="cmsInfoType">
          <el-select v-model="queryParams.cmsInfoType">
            <el-option label="全部" value=""></el-option>
            <el-option label="已合作供应商" value="1"></el-option>
            <el-option label="市场资讯" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </the-search>
    <div class="mb10">
      <el-button type="success" icon="el-icon-plus" @click="onAddClick" v-permission-button="'add'">添加</el-button>
    </div>
    <el-table 
      :data="tableData"
      border 
      stripe 
      size="mini"
      v-loading="tableLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)">
      <el-table-column label="#" type="index" width="60">
      </el-table-column>
      <el-table-column label="资讯ID" prop="id" width="60">
      </el-table-column>
      <el-table-column label="主标题">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            width="300"
            trigger="hover"
            :content="scope.row.title">
            <span slot="reference" class="ellipsis">{{ scope.row.title }}</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="主题图片" min-width="120">
        <template slot-scope="scope">
          <div class="row center-y">
            <el-image 
              style="max-width: 100px; max-height: 60px;"
              :src="scope.row.titleImage || require('@/assets/images/logo.png')" 
              :preview-src-list="[scope.row.titleImage]">
            </el-image>
            <span class="pl10">{{ scope.row.imageInfo }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="排序等级" prop="orderLevel" width="80">
      </el-table-column>
      <el-table-column label="资讯分类" prop="cmsInfoType" width="120">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.cmsInfoType === '1'">已合作供应商</el-tag>
          <el-tag v-if="scope.row.cmsInfoType === '2'">市场资讯</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="附件数量" prop="attaCount" width="100" >
        <template slot-scope="scope">
          <el-tag class="pointer" @click="showAttaList(scope.row)">{{ scope.row.attaCount}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="90">
        <template slot-scope="scope">
          <p class="fs13">{{  scope.row.createTimestamp | formatDate('Y/M/D h:m') }}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="onUpdate(scope.row, scope.$index)" v-permission-button="'edit'">修改</el-button>
          <el-button type="text" @click="showUploadAtta(scope.row)" v-permission-button="'uploadAtta'">上传附件</el-button>
          <el-button type="text" @click="onView(scope.row, scope.$index)" v-permission-button="'search'">查看详情</el-button>
          <el-button type="text" @click="onDelete(scope.row)" v-permission-button="'delete'">删除</el-button>
          <el-button type="text" @click="onCopy(scope.row)" v-permission-button="'copyLink'">复制链接</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="mt20"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryParams.pageIndex"
      :page-size="queryParams.pageSize"
      :total="total"
      :page-sizes="[10, 20, 30, 40]"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 查看附件列表 -->
    <view-atta-list 
      ref="view-atta" 
      @delete-success="init"
    />
    <!-- 上传附件 -->
    <atta-upload 
      action="#"
      ref="atta-upload" 
      @add-success="init"
    />
    <!-- 添加/编辑资讯 -->
    <add-edit-info 
      :visible.sync="visible"
      :info-id="currentInfoId"
      :page-type="type"
      @success="init"
      fullscreen
      center
    />
  </div>
</template>

<script>
import { 
  selectInfoPage, getInfoAttachmentList, deleteInfo,
} from '@/api/cms'
import TheSearch from '@/components/SearchForm'
import ViewAttaList from './ViewAttaList'
import AttaUpload from './AttaUpload'
import AddEditInfo from './add-edit-info'
import { supplierInfoLink } from '@/config'
import { copyContent } from '@/utils'

export default {
  name: 'SupplierInfoIndex',
  components: {
    TheSearch,
    ViewAttaList,
    AttaUpload,
    AddEditInfo
  },
  data() {
    return {
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        title: '',
        cmsInfoType: ''
      },
      total: 0,
      tableLoading: false,
      tableData: [],
      currentInfoId: null,
      type: 'add', // 
      visible: false,
    }
  },
  computed: {},
  created() {
    this.init()
  },
  methods: {
    async init() {
      try {
        this.tableLoading = true
        let data = await selectInfoPage(this.queryParams)
        this.total = data['total']
        if (data['records'].length) {
          let spuIds = data['records'].map(item => item.id)
          let atta = await getInfoAttachmentList(spuIds)
          data['records'].forEach((item, index) => {
            atta.forEach((json, i) => {
              if(item.id == json.infoId) {
                item.attaCount = json.count
              }
            })
          })
          this.tableData = data['records']
        } else {
          this.tableData = data['records']
        }
      } catch (error) {
        console.error(error)
      } finally {
        this.tableLoading = false
      }
    },
    handleSizeChange(val) { // 每页条数改变时
      this.queryParams['pageSize'] = val
      this.queryParams['pageIndex'] = 1
      this.init()
    },
    handleCurrentChange(val) { // 页码改变时
      this.queryParams['pageIndex'] = val
      this.init()
    },
    // 搜索
    onSearch() {
      this.queryParams['pageIndex'] = 1
      this.init()
    },
    // 搜索重置
    resetSearch() {
      this.$refs['searchQuery'].resetFields()
      this.queryParams['pageIndex'] = 1
      this.init()
    },
    onAddClick() {
      this.type = 'add'
      this.visible = true
    },
    onView(row) {
      this.type = 'view'
      this.currentInfoId = row.id
      this.visible = true
    },
    // 显示附件列表
    showAttaList(row) {
      if (row.attaCount > 0) {
        this.$refs['view-atta'].show(row.id)
      } else {
        this.$message.warning('暂无附件')
      }
    },
    // 显示弹窗
    showUploadAtta(row) {
      this.$refs['atta-upload'].show(row.id)
    },
    onDelete(data) {
      this.$confirm('确定删除吗？', {
        confirmButtonText: '删除',
        cancelButtonText: '取消'
      }).then(() => {
        deleteInfo(data.id).then(() => {
          this.$message.success('删除成功')
          this.init()
        })
      }).catch(() => {
      })
    },
    onUpdate(data, index) {
      console.log(data)
      // return
      this.type = 'edit'
      this.currentInfoId = data.id
      this.visible = true
      // this.pageType = 'update'
      // this.dialogVisible = true
      // this.$nextTick(() => {
      //   this.ruleForm = _.cloneDeep(data)
      //   let arr = this.ruleForm.tagList.split("|")
      //   this.ruleForm['tagList'] = arr.filter(n => n)
      // })
    },
    onCopy(row) {
      let url = `${supplierInfoLink}?id=${row.id}`
      copyContent(url)
      this.$message.success(`复制成功${url}`)
    }
  }
};
</script>

<style lang="scss" scoped>
</style>