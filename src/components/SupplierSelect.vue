<template>
  <div>
    <el-select v-model="selectVal" @change="onSelectChange" :clearable="clearable" filterable>
      <el-option
        v-for="(supplier,index) in supplierList"
        :key="'supplier'+index"
        :value="supplier.baseInfoId"
        :label="supplier.name"
      ></el-option>
    </el-select>
  </div>
</template>

<script>

import {getAllSuppliers} from "@/api/supplier/cooperation";

export default {
  name: "SupplierSelect",
  components: {},
  props: {
    value: null,
    clearable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      selectVal: this.value,
      supplierList: []
    };
  },
  methods: {
    // 加载品牌下拉框数据
    fetchBrandData() {
      getAllSuppliers().then(res => {
        this.supplierList = res;
      });
    },
    onSelectChange(currentVal) {
      this.$emit("input", currentVal);
      this.$emit("change", currentVal);
    }
  },
  created() {
    this.fetchBrandData();
  }
};
</script>

<style lang="scss" scoped>
</style>
<style lang="scss">
</style>
