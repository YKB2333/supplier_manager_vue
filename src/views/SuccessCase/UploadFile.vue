<template>
  <div style="max-width: 400px;">
    <el-upload
      ref="upload"
      :action="action"
      :on-remove="handleRemove"
      :before-upload="handleBeforeUpload"
      :multiple="multiple"
      :limit="limit"
      :disabled="disabled"
      :http-request="handleHttpRequest"
      :on-success="handleSuccess"
      :on-exceed="handleExceed">
        <el-button size="small" type="primary" :loading="uploadLoaing">选择上传</el-button>
        <div slot="tip" class="fs12 mt10">
          <span>{{ `文件最多${limit}个，大小${size}M， 文件类型${JSON.stringify(whiteType)}` }}</span>
        </div>
    </el-upload>

  </div>
</template>

<script>
import axios from '@/utils/axios'

export default {
  name: 'UploadFile',
  props: {
    action: {
      type: String,
      required: true
    },
    multiple: {
      type: Boolean,
      default: true
    },
    limit: {
      type: Number,
      default: 9
    },
    size: { // 2M
      type: Number,
      default: 2,
    },
    disabled: { // 是否禁用
      type: Boolean,
      default: false
    },
    value: {
      type: [Array]
    }
  },
  data() {
    return {
      uploadLoaing: false,
      whiteType: ['txt', 'pdf', 'docx', 'doc', 'xls', 'xlsx'], // 文件类型白名单
    }
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    handleRemove(file) {
      console.log(file)
      let delUrl = file.response['url']
      // 将文件从文件列表中删除
      let list = _.cloneDeep(this.value)
      let delIndex = this.value.findIndex(val => val['url'] === delUrl)  // 查找相同的文件url
      if (delIndex >= 0) {
        list.splice(delIndex, 1)
        this.$emit('input', list)
      }
    },
    // 上传前校验
    handleBeforeUpload(file) {
      console.log('上传前校验', file)
      let fileType = file.name.substring(file.name.lastIndexOf('.') + 1) // 获取文件后缀
      console.log(fileType)
      let isType = this.whiteType.includes(fileType)
      if (!isType) {
        this.$message.error('文件格式不正确')
      }
      let isSize = file.size / 1024 / 1024 < this.size
      if (!isSize) {
        this.$message.error(`文件大小不能超过${this.size}M`)
      }
      return isType && isSize
    },
    // 文件超出
    handleExceed() {
      this.$message.warning(`最多只能选择${this.limit}个文件！`)
    },
    handleHttpRequest(data) {
      var formData = new FormData()
      formData.append('file', data.file)
      return new Promise((resolve, reject) => {
        this.uploadLoaing = true
        axios.post(data.action, formData).then(res => {
          resolve(res)
        }).catch(error=>{
          reject(error)
        }).finally(() => {
          this.uploadLoaing = false
        })
      })
    },
    handleSuccess(res, file, fileList) {
      console.log(res)
      let list = _.cloneDeep(this.value)
      list.push(res)
      // console.log('list', list)
      this.$emit('input', list)
    }
  },
  watch: {
    value: {
      handler: function(val) {
        if (val.length === 0) {
          // 清空
          this.$refs['upload'].clearFiles()
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

