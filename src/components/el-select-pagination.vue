<template>
  <el-select 
    v-bind="$attrs" 
    v-on="$listeners" 
    filterable 
    clearable
    :filter-method="filterMethod" 
    :loading="loading" 
    popper-class="multi-select-page"
    :popper-append-to-body="false"
    @change="onChange">
    <el-option
      v-for="item in list"
      :key="item[valueKeyName]"
      :label="item[labelKeyName]"
      :value="item[valueKeyName]"
    ></el-option>
    <div class="mt6">
      <el-pagination
        small
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        :page-size="pageSize"
        :total="total"
        layout="prev, pager,next,total"
      ></el-pagination>
    </div>
  </el-select>
</template>

<script>
export default {
  props: {
    api: Function,
    valueKeyName: {
      type: String,
      defautl: 'id'
    },
    labelKeyName: {
      type: String,
      defautl: 'name'
    },
    pageSize: {
      type: Number,
      default: 10
    },
    query: {
      type: Object,
      default: () => {
        return {}
      }
    },
    idKeyName: {
      type: String,
      default: 'id'
    }
  },
  data() {
    return {
      list: [],
      total: 0,
      pageIndex: 1,
      searchVal: '',
      loading: false,
      queryId: '',
    }
  },
  created() {
    // console.log(this, 'value')
    // this.fetchList()
  },
  methods: {
    init() {
      this.queryId = this.$attrs.value
      this.pageIndex = 1
      this.fetchList()
    },

    fetchList() {
      let params = Object.assign(this.query, { pageIndex: this.pageIndex, pageSize: this.pageSize })
      params[this.labelKeyName] = this.searchVal
      params[this.idKeyName] = this.queryId
      this.loading = true
      this.api(params).then(res => {
        // console.log(res)
        this.list = res.records || []
        this.total = res.total
      }).finally(() => {
        this.loading = false
      })
    },

    handleSizeChange(val) {
      this.pageIndex = 1
      this.fetchList()
    },

    handleCurrentChange(val) {
      this.pageIndex = val
      this.fetchList()
    },

    filterMethod(val) {
      // console.log(val)
      this.queryId = ''
      this.pageIndex = 1
      this.searchVal = val
      this.fetchList()
    },

    onChange(val) {
      // console.log('change', val)
      if (!val) {
        this.queryId = ''
        this.pageIndex = 1
        this.fetchList()
      }
    },

    clear() {
      this.queryId = ''
      this.pageIndex = 1
      this.list = []
    }
  },
};
</script>

<style lang="scss" scoped>
/deep/ .multi-select-page .el-select-dropdown__wrap {
  max-height: none !important;
}
</style>