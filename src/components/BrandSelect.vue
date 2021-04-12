<template>
  <div>
    <el-select v-model="selectVal" @change="onSelectChange" :clearable="clearable">
      <el-option
        v-for="(brand,index) in brandList"
        :key="'brand'+index"
        :value="brand.id"
        :label="brand.name"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
import { getMaxNumber } from "@/utils";
import { getBrandList } from "@/api/brand";

export default {
  name: "BrandSelect",
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
      brandList: []
    };
  },
  methods: {
    // 加载品牌下拉框数据
    fetchBrandData() {
      getBrandList().then(res => {
        this.brandList = res;
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
