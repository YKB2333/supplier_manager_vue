<template>
  <el-dialog title="上传附件" :visible.sync="visible" @close="whenClose">
    <el-upload 
      class="inline-block"
      ref="upload" 
      :action="action"
      :on-success="(response, file) => onSuccessUpload(response, file)"
      :on-remove="(file) => onRemoveUpload(file)"
      :multiple="false"
      :httpRequest="uploadRequest"
      :disabled="uploadLoading">
        <el-button size="small" type="primary" v-show="showUploadBtn">选择文件上传</el-button>
    </el-upload>
    <div v-show="uploadLoading">
      <el-button type="text" :loading="uploadLoading">上传中</el-button>
    </div>
    <div class="mt30">
      <el-button type="success" @click="onAdd" :disabled="!uploadAttaForm.attaUrl" >添加附件</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { uploadAtta, addAttachment } from '@/api/cms'

export default {
  props: {
    action: {
      type: String, 
      required: true
    }
  },
  data() {
    return {
      visible: false, 
      showUploadBtn: true,
      uploadLoading: false,
      uploadAttaForm: {
        attaUrl: '', // 附件地址
        fileName: '', //附件原名
        fileType: '', // 附件类型.后缀
        size: 0, // 附件大小
      },
      infoId: null
    }
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    show(infoId) {
      this.visible = true
      this.infoId = infoId
    },
    // 覆盖默认的上传行为，可以自定义上传的实现
    uploadRequest(data) {
      const _file = data.file
      var formData = new FormData()
      formData.append("file", _file)
      return new Promise((resolve, reject) => {
        this.uploadLoading = true
        uploadAtta(formData).then(res =>{
          resolve(res)
        }).catch((err)=>{
          reject(err)
        }).finally(() => {
          this.uploadLoading = false
        })
      })
    },
    // 文件上传成功时的钩子
    onSuccessUpload(res, file) {
      this.uploadAttaForm['attaUrl'] = res
      this.uploadAttaForm['fileName'] = file.name
      this.uploadAttaForm['size'] = file.size
      let type = file.name.substring(file.name.lastIndexOf('.') + 1)
      this.uploadAttaForm['fileType'] = type
      this.showUploadBtn = false
    },
    // 文件列表移除文件时的钩子	
    onRemoveUpload(file) {
      // console.log(file)
      this.clearAttaForm()
    },
    onAdd() {
      let params = _.cloneDeep(this.uploadAttaForm)
      params['infoId'] = this.infoId
      addAttachment(params).then(res => {
        this.$message.success('添加成功!')
        this.clearAttaForm()
        this.$emit('add-success')
      })
      // this.$confirm('确定添加？', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消'
      // }).then(() => {
      // }).catch(() => {
      //   console.log('取消')      
      // })
    },
    clearAttaForm() {
      this.$refs['upload'].clearFiles() // 组件方法
      this.uploadAttaForm['fileName'] = ''
      this.uploadAttaForm['fileType'] = ''
      this.uploadAttaForm['size'] = ''
      this.uploadAttaForm['attaUrl'] = ''
      this.showUploadBtn = true
    },
    whenClose() {
      console.log('whenClose')
      this.clearAttaForm()
    },
    hide() {
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
<style lang="scss">
</style>
