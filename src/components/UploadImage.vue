<template>
  <div class="upload-image-component" :class="{ 'hide': hideUploadIcon }">
    <el-upload ref="upload"
      :headers="headers"
      :action="`${baseURL}${url}`"
      list-type="picture-card"
      :multiple="false"
      :on-success="onSuccess"
      :on-error="onError"
      :on-remove="onRemove"
      :file-list="exitsFiles"
      :before-upload="beforeUpload"
      :httpRequest="uploadRequest"
    >
      <i class="el-icon-plus" />
      <div slot="tip">{{ tip }}</div>
    </el-upload>
  </div>
</template>

<script>
import { baseURL, headersTokenKey } from '@/config'

export default {
  name: 'UploadImage',
  components: {},
  props: {
    url: { // 上传地址
      type: String,
      required: true
    },
    tip: { // 提示说明文字
      type: String,
      default: ''
    },
    value: { // 双向绑定的图片URL
      type: String,
      default: ''
    }
  },
  data() {
    return {
      baseURL: baseURL,
      // 隐藏+号
      hideUploadIcon: false
    }
  },
  computed: {
    headers() { // 请求头部里添加token
      const obj = {}
      obj[headersTokenKey] = this.$store.getters.token
      return obj
    },
    exitsFiles() { // 显示已有的图片
      if (this.value === '' || this.value === null) {
        this.hideUploadIcon = false
        return []
      } else {
        this.hideUploadIcon = true
        return [{name: 'tempName', url: this.value}]
      }
    }
  },
  created() {
  },
  mounted() {},
  methods: {
    onSuccess(response, file, fileList) { // 上传成功回调
      // console.log('onSuccess res=>', response)
      // console.log('onSuccess file=>', file)
      // console.log('onSuccess fileList=>', fileList)
      this.hideUploadIcon = true
      this.$emit('input', response)
    },
    onError(err, file, fileList) {
      this.clear()
    },
    onRemove(file, fileList) { // 删除回调
//       console.log('onRemove file=>', file)
//       console.log('onRemove fileList=>', fileList)
      this.hideUploadIcon = false
      this.$emit('input', '')
    },
    clear() {
      this.$refs['upload'].clearFiles()
      this.$emit('input', '')
    },
    // 上传前校验格式和大小
    beforeUpload(file) {
      let type = ['image/png', 'image/jpeg', 'image/jpg']
      const isType = type.includes(file.type)
      const isSize = file.size / 1024 / 1024 < 1
      if (!isType) {
        this.$message.error('图片格式只能是png，jpg， jpeg')
      }
      if (!isSize) {
        this.$message.error('图片大小不能超过 1MB!')
      }
      return isType && isSize
    },
    uploadRequest(data) {
      const _file = data.file
      var formData = new FormData()
      formData.append("file", _file)

      return new Promise((resolve, reject) => {
        this.$post(data.action, formData).then((res)=>{
          resolve(res)
        }).catch((err)=>{
          reject()
        })
      })
    }
  },
  watch: {

  }
}
</script>

<style lang="scss" scoped>
</style>
<style lang="scss">
@mixin uploadSize(){
  width: 100px !important;
  height: 100px !important;
}
.upload-image-component{
  line-height: 25px;
  &.hide{
    .el-upload--picture-card{
      display: none;
    }
  }
  .el-upload--picture-card{
    @include uploadSize();
    line-height: 106px;
  }
  .el-upload-list__item{
    @include uploadSize();
  }
  .el-upload-list--picture-card .el-progress {
    @include uploadSize();
  }
  .el-progress-circle{
    @include uploadSize();
  }
}
</style>
