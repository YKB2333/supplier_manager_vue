<template>
  <div style="display: inline-block;">
    <el-select 
      v-model="typeValue"
      :filterable="search" 
      :multiple="multiple"
      :disabled="disabled"
      clearable
      @change="onChange">
      <el-option
        v-for="item in allChannelList" :key="item.code"
        :label="item.name"
        :value="item[returnVal]"
      />
    </el-select>
    <el-button v-if="!disabled" type="default" icon="el-icon-refresh" size="mini" @click="fetchAllChannelType"></el-button>
  </div>
</template>

<script>
import { getChannelType } from '@/api/channel'

export default {
  name: 'ChannelTypeSelect',
  props: {
    search: { // 搜索选项
      type: Boolean,
      default: true
    },
    multiple: { // 多选
      type: Boolean,
      default: false
    },
    returnVal: { // 返回值
      type: String,
      default: 'code'
    },
    disabled: { // 是否禁用
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Number, Array]
    }
  },
  data() {
    return {
      allChannelList: [],
      typeValue: ''
    }
  },
  computed: {},
  created() {
    this.fetchAllChannelType()
  },
  methods: {
    onChange(val) {
      // console.log(val)
      this.$emit('input', val)
      this.$emit('change', val)
    },
    fetchAllChannelType() {
      getChannelType().then(res => {
        this.allChannelList = res
      })
    },
  },
  watch: {
    value: {
      handler: function(val) {
        this.typeValue = val
      },
      immediate: true,
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
