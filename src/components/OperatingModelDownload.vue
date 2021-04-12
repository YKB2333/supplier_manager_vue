<template>
  <el-button 
    :type="btnType" 
    :icon="showIcon && btnType !== 'text' ? 'el-icon-download' : ''" 
    :plain="plain && btnType !== 'text'"
    :loading="loading"
    @click="onClick">
    下载
  </el-button>
</template>

<script>
import FileSaver from 'file-saver'
import { downloadAtta } from '@/api/attachment'

export default {
  name: 'Download',
  components: {},
  // props: ['attaId', 'fileName'],
  props: {
    attaId: {
      type: Number,
      required: true
    },
    fileName: {
      type: String,
      required: true
    },
    btnType: {
      type: String,
      default: 'primary'
    },
    showIcon: {
      type: Boolean,
      default: true
    },
    plain: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {},
  created() {},
  methods: {
    // 点击下载附件
    onClick() {
      this.loading = true
      downloadAtta(`/customer/operating-model-info/download/${this.attaId}`)
      .then(blob => {
        // console.log(blob)
        FileSaver.saveAs(blob, this.fileName)
      }).catch(error => {
        console.error(error)
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
