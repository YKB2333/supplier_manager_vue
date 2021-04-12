<template>
  <div>
    <!-- 表格数据 -->
    <div class="col">
      <div class="align-self-start">
        <el-table
          id="table"
          :data="cacheList"
          border
          v-loading="tableLoading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
        >
          <el-table-column type="index" label="序号" width="60"></el-table-column>
          <el-table-column prop="area" label="缓存区域" width="250"></el-table-column>
          <el-table-column prop="name" label="缓存名称" width="250"></el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button v-permission-button="'flush'" type="text" size="small" @click="flush(scope.row)">刷新</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { qywxUserReflush } from '@/api/setting'
export default {
  name: 'CacheManager',
  components: {},
  data() {
    return {
      tableLoading: false,
      searchQuery: {},
      cacheList: [
        // { area: '客户中心', key: 'customer', name: '企业微信用户' },
        { area: '供应商中心', key: 'supplier', name: '企业微信用户' },
        // { area: '客户中心', key: 'customer', name: '企业微信用户' },
      ]
    }
  },
  created() {},
  computed: {},
  methods: {
    flush(data) {
      this.$confirm(`确定要刷新缓存<${data.area}-${data.name}>吗？`)
        .then(async () => {
          qywxUserReflush(data.key).then(() => {
            this.$message({
              message: `缓存刷新成功`,
              type: 'success'
            })
          })
        })
        .catch(() => {})
    }
  }
}
</script>
