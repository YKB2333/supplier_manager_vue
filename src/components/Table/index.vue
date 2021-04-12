<template>
  <div class="table-component">
    <div class="search-box" v-if="searchForm.length">
      <div class="form">
        <el-form :model="query" ref="search" label-width="100px" inline>
          <el-form-item
            v-for="(item, index) in searchForm"
            :key="index"
            :label="item.label || ''"
            :prop="item.key"
          >
            <!-- 输入框 -->
            <el-input
              v-if="item.type === 'input'"
              v-model="query[item.key]"
              :placeholder="item.placeholder || item.label"
              @keyup.enter.native="enterInput"
              clearable
              @clear="onInputClear"
            ></el-input>
            <!-- 单选 -->
            <el-select
              v-if="item.type === 'select'"
              v-model="query[item.key]"
              @change="onSelect"
              :clearable="item.clearable"
              :placeholder="item.placeholder || item.label"
            >
              <el-option
                v-for="option in item.options"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              ></el-option>
            </el-select>
            <!-- 品牌 -->
            <brand-select
              v-if="item.type === 'brand_select'"
              v-model="query[item.key]"
              :clearable="item.clearable"
              @change="onSelect"
              :placeholder="item.placeholder || item.label"
            ></brand-select>
            <!-- 供应商 -->
            <supplier-select
              v-if="item.type === 'supplier_select'"
              v-model="query[item.key]"
              :clearable="item.clearable"
              @change="onSelect"
              :placeholder="item.placeholder || item.label"
            ></supplier-select>
            <!-- 分类 -->
            <goods-cate-cascader
              v-if="item.type === 'cate_cascader'"
              v-model="query[item.key]"
              ref="cascader"
              :expandTrigger="item.expandTrigger ?'hover':'click'"
              :clearable="item.clearable"
              @change="onCascaderChange"
            ></goods-cate-cascader>
            <!-- <div v-if="item.type == 'cascader'"> {{ item.expandTrigger ?'hover':'click'}}</div> -->
            <el-date-picker
              v-if="item.type === 'date_picker'"
              v-model="query[item.key]"
              :type="item.pickerType"
              :format="item.format||'yyyy-MM-dd'"
              :value-format="item.valueFormat||'yyyy-MM-dd'"
              :default-time="item.defaultTime"
              align="right"
              unlink-panels
              range-separator="至"
              :clearable="item.clearable"
              :start-placeholder="item.startPlaceholder || item.label"
              :end-placeholder="item.endPlaceholder || item.label"
              :picker-options="item.pickerOptions"
              @change="onDatePicker"
            ></el-date-picker>
          </el-form-item>
        </el-form>
        <div v-permission-button="'search'" class="btns">
          <el-button type="primary" plain @click="onSearch">查询</el-button>
          <el-button type="primary" @click="onRefresh">刷新</el-button>
          <el-button type="danger" plain @click="onReset">重置</el-button>
        </div>
      </div>
    </div>
    <slot name="before-table"></slot>
    <el-card>
      <slot name="checkbox"></slot>
      <slot></slot>
    </el-card>
    <el-pagination
      class="mt20"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="query.pageIndex"
      :page-size="query.pageSize"
      :total="query.total"
      :page-sizes="[10, 20, 30, 40]"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
  </div>
</template>

<script>
import GoodsCateCascader from "../GoodsCateCascader";
import BrandSelect from "../BrandSelect";
import SupplierSelect from '../SupplierSelect'
export default {
  name: "Table",
  props: {
    value: {
      // query
      type: Object,
      required: true
    },
    searchForm: {
      // 查询表单
      type: Array,
      default: () => []
    },
    checkOptions: {
      type: Array,
      default: () => [{ label: "名称", value: "fileName" }]
    }
  },
  components: {GoodsCateCascader,BrandSelect,SupplierSelect},
  data() {
    return {
      query: this.value,
      temp: null,
      checkList: []
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.temp = this.$lodash.cloneDeep(this.value);
  },
  methods: {
    onReset() {
      this.query = this.$lodash.cloneDeep(this.temp);
      this.$emit("onReset");
      this.change();
    },
    onRefresh() {
      this.change();
    },
    onSearch() {
      this.query.pageIndex = 1;
      this.change();
    },
    handleSizeChange(val) {
      this.query.pageSize = val;
      this.change();
    },
    handleCurrentChange(val) {
      this.query.pageIndex = val;
      this.change();
    },
    enterInput(val) {
      this.change();
    },
    onSelect() {
      this.change();
    },
    onInputClear() {
      this.change();
    },
    onCascaderChange() {
      this.change();
    },
    onDatePicker() {
      this.change();
    },
    change() {
      this.$emit("input", this.query);
      this.$emit("change", this.query);
    }
  },
  watch: {
    // query: {
    //   handler: function(val) {
    //     console.log('watch', val)
    //     this.$emit('input', val)
    //     this.$emit('change', val)
    //   },
    //   deep: true
    // }
    checkList: {
      handler: function(val) {
        console.log(val);
      },
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
.table-component {
  .search-box {
    position: relative;
    width: 100%;
    // background-color: #ffffff;
    // border-radius: 6px;
    // padding-top: 10px;
    // padding-left: 10px;
    // margin-bottom: 10px;
    .form {
      // width: calc(100% - 170px);
      display: flex;
      width: 90%;
    }
    .btns {
      position: absolute;
      top: 0px;
      right: 10px;
    }
  }
}
</style>
