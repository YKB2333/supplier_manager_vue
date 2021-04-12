<template>
  <div>
    <el-cascader
      @change="onChangeSelected"
      v-model="selectedVal"
      :disabled="disabled"
      :clearable="clearable"
      :options="partsCate"
      :props="props"
      filterable
      placeholder="全部"
      :collapse-tags="collapseTags"
      style="width:200px"
    ></el-cascader>
  </div>
</template>

<script>
import { listToTree } from "@/utils";
import { getPartsCategoryList } from "@/api/category";

export default {
  name: "PartsCateCascader",
  components: {},
  props: {
    value: null,
    cateList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    props: {
      type: Object,
      default: () => {
        return {
          checkStrictly: true,
          expandTrigger: "hover",
          value: "id",
          label: "name"
        };
      }
    },
    collapseTags: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      partsCate: this.cateList,
      options: this.options,
      selectedVal: this.value
    };
  },
  computed: {},
  methods: {
    initPartsCateList() {
      getPartsCategoryList().then(res => {
        res = res.filter(r => {
          return r.cateLevel < 3;
        });
        this.partsCate = listToTree(res, "id", "superId");
      });
    },
    onChangeSelected(value) {
      if (this.props.checkStrictly) {
        this.$emit("input", value[value.length - 1]);
        return;
      }
      let temp;
      if (value instanceof Array) {
        temp = value.map(v => {
          return v[v.length - 1];
        });
      } else {
        temp = value[value.length - 1];
      }
      this.$emit("input", temp);
    }
  },
  created() {
    if (this.selectedVal) {
      if (this.selectedVal instanceof Array) {
        this.selectedVal = this.selectedVal.map(v => {
          let arr = v.split("-");
          arr[arr.length - 1] = v;
          return arr;
        });
      } else {
        let arr = this.selectedVal.split("-");
        arr[arr.length - 1] = this.selectedVal;
        this.selectedVal = arr;
      }
    }
    if (this.partsCate.length === 0) {
      this.initPartsCateList();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
<style lang="scss">
</style>
