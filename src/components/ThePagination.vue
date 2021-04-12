<template>
  <div class="ptb12">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageIndex"
      :page-size="pageSize"
      :total="total"
      :page-sizes="[10, 30, 50, 100, 200, 500]"
      layout="total, sizes, prev, pager, next, jumper"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: '',
  components: {},
  props: {
    pageIndex: { // 当前页码
      type: Number,
      required: true
    },
    pageSize: { // 每页条数
      type: Number,
      required: true
    },
    total: { // 总条数
      type: Number,
      required: true
    }
  },
  data() {
    return {
      
    }
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    handleSizeChange(val) {
      this.$emit('onPageSizeChange', val)
    },
    handleCurrentChange(val) {
      this.$emit('onPageIndexChange', val)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
<style lang="scss">
</style>
