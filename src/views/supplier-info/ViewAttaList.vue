<template>
  <el-dialog title="查看附件列表" :visible.sync="visible" @close="whenClose">
    <el-table :data="attaList">
      <el-table-column label="附件">
        <template slot-scope="scope">
          <a :href="scope.row.attaUrl" target="_blank">{{ scope.row.fileName }}</a>
        </template>
      </el-table-column>
      <el-table-column label="大小" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.size | formatFileSize }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template slot-scope="scope">
          <div style="display: flex;">
            <el-button type="danger" size="mini" @click="onDelete(scope.row, scope.$index)" v-permission-button="'deleteAtta'">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog> 
</template>

<script>
import { getAttaList, deleteAtta } from '@/api/cms'

export default {
  name: 'ViewAttaList',
  data() {
    return {
      visible: false,
      attaList: [],
      currentInfoId: null
    }
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    show(infoId) {
      this.visible = true
      this.currentInfoId = infoId
      getAttaList(infoId).then(res => {
        this.attaList = res
      })
    },
    // 删除附件
    onDelete(row, index) {
      this.$confirm('确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAtta(row.id).then(res => {
          this.$message.success('删除成功!')
          this.attaList.splice(index, 1)
          this.$emit('delete-success')
        })
      }).catch(() => {})
    },
    whenClose() {
      console.log('whenClose')
      this.$emit('whenClose')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
