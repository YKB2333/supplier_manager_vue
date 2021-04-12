<template>
  <el-popover
    placement="top"
    v-model="visible">
    <p v-if="title">{{ title }}</p>
    <div style="text-align: center;">
      <el-button size="mini" type="danger" @click="onCancel">{{ cancelText }}</el-button>
      <el-button size="mini" type="primary" @click="onConfirm">{{ confirmText }}</el-button>
    </div>
    <el-button slot="reference" :type="type" :size="size" :loading="btnLoading">
      <slot></slot>
    </el-button>
  </el-popover>
</template>

<script>
export default {
  name: 'PopoverButton',
  props: {
    type: {
      type: String,
      default: 'primary'
    },
    size: {
      type: String,
      default: 'mini'
    },
    confirmText: {
      type: String,
      default: '确定'
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    title: {
      type: String
    }
  },
  data() {
    return {
      visible: false,
      btnLoading: false
    }
  },
  created() {},
  methods: {
    onCancel() {
      this.visible = false
      this.$emit('cancel')
    },
    onConfirm() {
      this.visible = false
      this.$emit('confirm')
    },
    loading(show = true) {
      this.btnLoading = show
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
<style lang="scss">
</style>
