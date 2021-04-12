<template>
  <my-table v-model="searchQuery" :searchForm="searchForm" @change="onChange">
    <el-table
      :data="tableData"
      border
      stripe
      v-loading="tableLoading"
      @current-change="onCurrentChange"
      highlight-current-row
      element-loading-text="拼命加载中"
    >
      <el-table-column label="商品ID" prop="id"></el-table-column>
      <el-table-column label="商品名称" prop="name"></el-table-column>
      <el-table-column label="商品主图">
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.titleImage"
            :preview-src-list="[scope.row.titleImage]"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="分类名称" prop="cateName"></el-table-column>
      <el-table-column label="品牌名称" prop="brandName"></el-table-column>
    </el-table>
  </my-table>
</template>

<script>
import { searchSpu } from "@/api/supplier/recommend";
export default {
  name: "SearchSpu",
  props: {},
  data() {
    return {
      searchForm: [
        {
          key: "name",
          label: "商品名称",
          placeholder: "请输入商品名称",
          type: "input"
        },
        {
          key: "cateId",
          label: "商品分类",
          placeholder: "请选择商品分类名称",
          type: "cate_cascader"
        }
      ],
      searchQuery: {
        name: "",
        cateId: "",
        pageIndex: 1,
        pageSize: 3,
        orderStr: "id desc",
        total: 0 // 总条数
      },
      tableData: [],
      tableLoading: false
    };
  },
  computed: {},
  methods: {
    onChange() {
      this.fetchTableData();
    },
    fetchTableData() {
        searchSpu(this.searchQuery).then(res =>{
            this.tableData = res.records;
            this.searchQuery.total = res.total;
        })
    },
    onCurrentChange(currentRow, oldCurrentRow) {
      this.$emit("currentRowChange", currentRow);
    }
  },
  watch: {},
  created() {}
};
</script>

<style lang="scss" scoped>
</style>
