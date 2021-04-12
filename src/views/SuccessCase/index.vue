<template>
  <my-dialog ref="dialog" width="80%" :title="title" :closeOnClickModal="false">
    <el-tabs type="border-card">
      <el-tab-pane label="查看" v-loading="tableLoading">
        <el-table :data="tableData" border stripe size="mini">
          <el-table-column label="文件" prop="fileName">
            <template slot-scope="scope">
              <el-link type="primary" :href="scope.row.attaUrl" target="_blank">{{ scope.row.fileName }}</el-link>
            </template>
          </el-table-column>
          <el-table-column label="大小" prop="size">
            <template slot-scope="scope">
              <span>{{ scope.row.size | formatFileSize }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="danger" @click="onDeleteAtta(scope.row, scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="添加">
        <upload-file 
          v-model="fileList" 
          action="uploadSupplierAtta"
          :size="15"
        />
        <div class="mt30">
          <!-- <el-button size="small" type="success" @click="onAdd">添加</el-button> -->
          <el-popover
            placement="right"
            width="160"
            v-model="addPopover">
            <p>确定添加？</p>
            <div style="">
              <el-button size="mini" type="text" @click="addPopover = false">取消</el-button>
              <el-button type="primary" size="mini" @click="onAdd">确定</el-button>
            </div>
            <el-button slot="reference" type="success" @click="addPopover = true" :loading="addLoading">添加</el-button>
          </el-popover>
        </div>
      </el-tab-pane>
    </el-tabs>
  </my-dialog>
</template>

<script>
import MyDialog from '@/components/Dialog'
import UploadFile from './UploadFile'
import { getAttaListBySupId, addSupAttachment, deleteAtta } from '@/api/attachment'

export default {
  name: 'SuccessCase',
  components: { MyDialog, UploadFile },
  props: {
    title: {
      type: String,
      default: '成功案例'
    }
  },
  data() {
    return {
      supId: null,
      fileList: [],
      addPopover: false,
      addLoading: false,
      tableLoading: false,
      tableData: []
    }
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    init(supId) {
      console.log('供应商id', supId)
      this.supId = supId
      this.$refs['dialog'].show()
      this.fetchTableList()
    },
    fetchTableList() {
      this.tableLoading = true
      getAttaListBySupId(this.supId).then(res => {
        console.log('附件列表', res)
        this.tableData = res
      }).finally(() => {
        this.tableLoading = false
      })
    },
    // 添加
    async onAdd() {
      console.log(this.fileList)
      this.addPopover = false
      try {
        this.addLoading = true
        for(let i = 0; i < this.fileList.length; i++) {
          let vo = this.fileList[i]
          await addSupAttachment(this.supId, {
            attaUrl: vo.url,
            fileName: vo.fileName,
            fileType: vo.fileType,
            size: vo.size
          }).then(res => {
            console.log('添加', res)
            this.$message.success(`添加成功${i + 1}`)
          })
        }
      } catch (error) {
      } finally {
        this.fileList = []
        this.addLoading = false
        this.fetchTableList()
      }
    },
    onDeleteAtta(row, index) {
      this.$confirm('确定删除').then(res => {
        deleteAtta(row.id).then(res => {
          this.$message.success('删除成功')
          this.tableData.splice(index, 1)
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
<style lang="scss">
</style>
