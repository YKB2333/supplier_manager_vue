<template>
  <div>
    <el-cascader
      @change="onChangeSelected"
      v-model="selectedVal"
      :disabled="disabled"
      :clearable="clearable"
      :options="goodsCate"
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
import { getGoodsCategoryList } from "@/api/category";

export default {
  name: "GoodsCateCascader",
  components: {},
  props: {
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
    },
    cateLevel: {
      type: Number,
      default: 3
    },
    value: {
      type: [String, Number, Array],
      default: ''
    },
  },
  data() {
    return {
      goodsCate: this.cateList,
      options: this.options,
      selectedVal: []
    };
  },
  computed: {},
  methods: {
    initGoodsCateList() {
      getGoodsCategoryList().then(res => {
        res = res.filter(r => {
          return r.cateLevel <= this.cateLevel;
        });
        this.goodsCate = listToTree(res, "id", "superId");
        
      });
    },
    onChangeSelected(value) {
      console.log(value)
      console.log("成品组件值0",this.props.checkStrictly)
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
    },
    mutipleValue(newValue) {
      this.selectedVal = newValue.map(v => {
        let arr = v.split("-");
        let value = []
        arr.forEach((item,index) => {
          let valueText = value.length ? `${value[index-1]}-${item}` : item
          value.push(valueText)
        })
        return value
      });
    }
  },
  created() {
    if (this.goodsCate.length === 0) {
      this.initGoodsCateList();
    }
  },
  watch:{
    value:{
      handler(newValue) {
        if(!newValue)return
        if (newValue instanceof Array) {
          // 如果是多选
          if (this.props.multiple) {
            this.mutipleValue(newValue)
          } else {
            this.selectedVal = newValue.map(v => {
              let arr = v.split("-");
              arr[arr.length - 1] = v;
              return arr;
            });
          }
        } else {
          let arr = newValue.split("-");
          arr[arr.length - 1] = newValue;
          this.selectedVal = arr;
        }
      },
      immediate:true,
      deep:true
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
<style lang="scss">
</style>
