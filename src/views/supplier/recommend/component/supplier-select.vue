<template>
  <el-select
    :value="value"
    filterable
    remote
    :disabled="disabled"
    reserve-keyword
    :placeholder="placeholder"
    :remote-method="remoteMethod"
    :loading="loding"
    @change="onChange">
    <el-option
      v-for="(item, i) in supplierOptions"
      :key="i"
      :label="item.label"
      :value="item.value"
    ></el-option>
  </el-select>
</template>

<script>
import {getAllSuppliers} from "@/api/supplier/cooperation";
//  内部联系人
export default {
  name: 'SupplierSelect',
  props: {
    placeholder: {
      type: String,
      default: '请输入供应商'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ''
    },
    labelProp: {
      type: String,
      default: 'name'
    },
    valueProp: {
      type: String,
      default: 'baseInfoId'
    }
  },
  data() {
    return {
      supplierOptions: [],
      loding: false,
      supplierList: []
    }
  },
  watch: {
    value(v) {
      if (!v) {
        this.supplierOptions = [];
      }
      this.supplierOptions = this.supplierList.filter(item => item.value === v);
    }
  },
  created() {
    getAllSuppliers().then(res => {
      this.supplierList = res.map(item => {
        return { value: item[this.valueProp], label: item[this.labelProp]}
      })

      if (this.value) {
        this.supplierOptions = this.supplierList.filter(item => item.value === this.value);
      }
    })
  },
  methods: {
    remoteMethod(query) {
      if (query !== "") {
        this.loding = true
        setTimeout(() => {
          this.loding = false
          this.supplierOptions = this.supplierList.filter(item => {
            return item.label.indexOf(query) > -1
          })
          if (Array.isArray(this.supplierOptions) && this.supplierOptions.length === 1) {
            let item = this.supplierOptions[0]
            this.onChange(item.value)
          }
        }, 200)
      } else {
        this.supplierOptions = []
      }
    },

    onChange(e) {
      this.$emit('input', e)
      this.$emit('change',e)
      let item =  this.supplierOptions.find(v => v.value === e);
      this.$emit('select-change', item)
    },
    
  }
}
</script>

<style>

</style>