<template>
  <el-select
    :value="value"
    filterable
    remote
    :disabled="disabled"
    reserve-keyword
    :placeholder="placeholder"
    :remote-method="remoteMethod"
    :loading="innerPersonLoading"
    @change="onChange">
    <el-option
      v-for="(item, i) in innerPersonOptions"
      :key="i"
      :label="item.label"
      :value="item.value"
    ></el-option>
  </el-select>
</template>

<script>
import { getAllEcologyUsers } from '@/api/supplier'
//  内部联系人
export default {
  name: 'InnerPersonSelect',
  props: {
    placeholder: {
      type: String,
      default: '请输入姓名'
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
      default: 'lastname'
    },
    valueProp: {
      type: String,
      default: 'lastname'
    }
  },
  data() {
    return {
      innerPersonOptions: [],
      innerPersonLoading: false,
      ecologyUsers: []
    }
  },
  watch: {
    value(v) {
      if (!v) {
        this.innerPersonOptions = [];
      }
      this.innerPersonOptions = this.ecologyUsers.filter(item => item.value === v);
    }
  },
  created() {
    getAllEcologyUsers().then(res => {
      this.ecologyUsers = res.map(item => {
        return { value: item[this.valueProp], label: item[this.labelProp], userInfo: item, mobile: item.mobile }
      })
      if (this.value) {
        this.innerPersonOptions = this.ecologyUsers.filter(item => item.value === this.value);
      }
    })
  },
  methods: {
    remoteMethod(query) {
      if (query !== "") {
        this.innerPersonLoading = true
        setTimeout(() => {
          this.innerPersonLoading = false
          this.innerPersonOptions = this.ecologyUsers.filter(item => {
            return item.label.indexOf(query) > -1
          })
          if (Array.isArray(this.innerPersonOptions) && this.innerPersonOptions.length === 1) {
            let item = this.innerPersonOptions[0]
            this.onChange(item.value)
          }
        }, 200)
      } else {
        this.innerPersonOptions = []
      }
    },

    onChange(e) {
      setTimeout(() => {
        this.$emit('input', e)
        this.$emit('change',e)
        let item =  this.innerPersonOptions.find(v => v.value === e);
        this.$emit('select-change', item)
      }, 1);
    },
    
  }
}
</script>

<style>

</style>