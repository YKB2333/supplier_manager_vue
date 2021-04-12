<template>
  <the-dialog width="500px" :close-on-click-modal="false" ref="dialog" title="导入商品文件" @close="whenClose">
    <el-upload
      action="#"
      :on-remove="handleRemove"
      :httpRequest="uploadRequest"
      :multiple="false"
      accept=".xls,.xlsx">
      <el-button size="mini" type="primary" :disabled="file !== null">选择文件</el-button>
    </el-upload>
    <el-button class="mt30" type="success" size="mini" @click="onSubmit" :loading="loading" :disabled="file === null">
      {{ loading ? '上传中' : '开始导入' }}
    </el-button>
  </the-dialog>
</template>

<script>
import TheDialog from '@/components/TheDialog'
import { importRecommendProduct } from '@/api/supplier/recommend'

export default {
  name: 'ProductImport',
  components: { TheDialog },
  data() {
    return {
      loading: false,
      // 要上传的文件
      file: null
    }
  },
  computed: {
  },
  created() {
  },
  methods: {
    show() {
      this.$refs['dialog'].show()
    },
    hide() {
      this.$refs['dialog'].hide()
    },
    uploadRequest(data) {
      // console.info(data)
      // 获取选择的文件
      this.file = data.file
    },
    // 提交
    onSubmit() {
      let formData = new FormData()
      formData.append("file", this.file)
      this.loading = true
      importRecommendProduct(formData).then(res => {
        console.log(res)
        this.$bus.emit('importSpuSuccess',res)

      }).catch(err => {
        console.log(err)
        //this.$message.error("失败")
      }).finally(() => {
        this.loading = false
      })
    },
    // 删除时触发
    handleRemove(file, fileList) {
      this.file = null
    },
    whenClose() {
      // 注销bus事件
      this.$bus.off('importSpuSuccess')
    }
  },
}
</script>

<style lang="scss">
.custom-dialog-class-1{
  height: auto !important;
}
</style>
