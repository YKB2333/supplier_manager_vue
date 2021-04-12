<template>
  <el-dialog v-bind="$attrs" v-on="$listeners" @open="onOpen" @close="onClose" :title="pageType === 'add' ? '添加资讯': '修改资讯'" v-loading="loading">
    <el-form ref="form" :model="formData" :rules="rules" label-width="140px">
      <div class="rule-form">
        <el-form-item label="主标题" prop="title">
          <el-input style="width: 400px"  v-model="formData.title" placeholder="请输入" :readonly="pageType === 'view'"></el-input>
        </el-form-item>
        <!-- <el-form-item label="副标题" prop="subhead">
          <el-input v-model="formData.subhead" placeholder="请输入" :readonly="pageType === 'view'"></el-input>
        </el-form-item>
        <el-form-item label="摘要" prop="summary">
          <el-input v-model="formData.summary" placeholder="摘要" :readonly="pageType === 'view'"></el-input>
        </el-form-item>
        <el-form-item label="推荐到首页标题" prop="indexTitle" label-width="140px">
          <el-input v-model="formData.indexTitle" placeholder="推荐到首页标题" :readonly="pageType === 'view'"></el-input>
        </el-form-item>
        <el-form-item label="来源" prop="source">
          <el-input v-model="formData.source" placeholder="来源" :readonly="pageType === 'view'"></el-input>
        </el-form-item>
        <el-form-item label="来源地址" prop="sourceLink">
          <el-input v-model="formData.sourceLink" placeholder="来源地址" :readonly="pageType === 'view'"></el-input>
        </el-form-item>
        <el-form-item label="跳转地址" prop="skipUrl">
          <el-input v-model="formData.skipUrl" placeholder="跳转地址(人为干预)" :readonly="pageType === 'view'"></el-input>
        </el-form-item>
        <el-form-item label="资讯关键字" prop="infoKeyword">
          <el-input v-model="formData.infoKeyword" placeholder="资讯关键字" :readonly="pageType === 'view'"></el-input>
        </el-form-item>
        <el-form-item label="关键字" prop="keyword" >
          <el-input v-model="formData.keyword" placeholder="关键字(seo)" :readonly="pageType === 'view'"></el-input>
        </el-form-item>
        <el-form-item label="作者" prop="copyreader">
          <el-input v-model="formData.copyreader" placeholder="作者" :readonly="pageType === 'view'"></el-input>
        </el-form-item> -->
        <el-form-item label="排序等级" prop="orderLevel">
          <el-input-number step-strictly v-model="formData.orderLevel" placeholder="排序等级" :readonly="pageType === 'view'"></el-input-number>
          <!-- <el-input v-model.number="formData.orderLevel" ></el-input> -->
        </el-form-item>
        <!-- <el-form-item label="发布时间" prop="pubTimestamp">
          <el-date-picker
            v-model="formData.pubTimestamp"
            type="date"
            :disabled="pageType === 'view'"
            placeholder="选择日期"
            value-format="timestamp">
          </el-date-picker>
        </el-form-item> -->
        <el-form-item label="主题图片" prop="titleImage">
          <upload-image 
            :disabled="pageType === 'view'"
            url="/supplier/cmsInfo/uploadIfImages"
            v-model="formData.titleImage"
          />
        </el-form-item>
        <el-form-item></el-form-item>
        <!-- <el-form-item label="图片文字" prop="imageInfo" style="width: 400px;">
          <el-input v-model="formData.imageInfo" placeholder="图片文字" :readonly="pageType === 'view'"></el-input>
        </el-form-item> -->
        <el-form-item label="资讯分类" prop="cmsInfoType">
          <el-select
            v-model="formData.cmsInfoType"
            :disabled="pageType === 'view'"
            placeholder="选择资讯分类">
            <el-option label="已合作供应商" value="1"></el-option>
            <el-option label="市场资讯" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="绑定供应商" prop="supplierId" v-show="formData.cmsInfoType == '1'">
          <select-pagination
            ref="select-pagination"
            v-model="formData.supplierId"
            placeholder="请选择"
            :disabled="pageType === 'view'"
            label-key-name="name"
            value-key-name="id"
            :api="selectSupInfoPage"
            :query="{ country: '日本' }"
          ></select-pagination>
        </el-form-item>
      </div>
      <!-- <el-form-item label="标签" prop="tagList">
        <el-tag
          v-for="(tag,index) in formData.tagList"
          :key="index"
          closable
          :disable-transitions="false"
          class="mr10"
          @close="handleClose(tag)">{{ tag }}
        </el-tag>
        <el-input
          style="width:160px;"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
          :readonly="pageType === 'view'"
        >
        </el-input>
        <el-button class="ml10" @click="showInput" v-if="pageType !== 'view'">+ 点击输入标签</el-button>
      </el-form-item> -->
      <el-form-item label="文章内容" prop="content" style="width: 100%;">
        <tinymce-editor v-model="formData.content" :disabled="pageType === 'view'" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="close">关闭</el-button>
      <el-button type="primary" @click="handelConfirm" v-if="pageType !== 'view'">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getInfoOne, addInfo, updateInfo } from '@/api/cms'
import TinymceEditor from './TinymceEditor'
import UploadImage from '@/components/UploadImage'
import SelectPagination from '@/components/el-select-pagination'
import { selectSupInfoPage } from '@/api/supplier'

export default {
  inheritAttrs: false,
  props: {
    pageType: {
      type: String,
      default: 'add'
    },
    infoId: [String, Number]
  },
  components: {
    TinymceEditor,
    UploadImage,
    SelectPagination
  },
  data() {
    return {
      formData: {
        content: '',
        copyreader: '',
        imageInfo: '',
        indexTitle: '',
        infoKeyword: '',
        keyword: '',
        orderLevel: '',
        skipUrl: '',
        source: '',
        sourceLink: '',
        subhead: '',
        summary: '',
        tagList: [],
        title: '',
        titleImage: ''
      },
      loading: false,
      inputVisible: false,
      inputValue: '',
      // supplierList: []
    }
  },
  computed: {
    rules() {
      let rule = {
        cmsInfoType: [{required: true, message:'请选择资讯分类', trigger: 'change'}],
        supplierId: [],
      }
      if (this.formData.cmsInfoType === '1') {
        rule['supplierId'].push({required: true, message:'请选择绑定供应商', trigger: 'change'})
      }
      this.$nextTick(() => {
        if (this.$refs['form']) this.$refs['form'].clearValidate()
      })
      return rule
    }
  },
  created() {},
  methods: {
    selectSupInfoPage,
    async onOpen() {
      try {
        if (['edit', 'view'].includes(this.pageType)) {
          this.loading = true
          let res = await getInfoOne(this.infoId)
          // console.log(res, '资讯详情')
          this.formData = _.cloneDeep(res)
          this.formData['tagList'] = res.tagList.split("|").filter(n => n)
        }
        this.$nextTick(() => {
          if (this.$refs['select-pagination'])
            this.$refs['select-pagination'].init()
        })
        // selectSupInfoPage({
        //   pageIndex: 1,
        //   pageSize: 999999,
        //   country: '日本'
        // }).then(res => {
        //   this.supplierList = res.records || []
        // })
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    onClose() {
      this.$refs['form'].resetFields()
    },
    close() {
      this.$emit('update:visible', false)
    },
    handelConfirm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$confirm('确定保存？', {
            confirmBtnText: '确定',
            cancelBtnText: '取消'
          }).then(() => {
            // 循环标签数组
            let fetch = {
              'add': addInfo,
              'edit': updateInfo
            }
            let params = _.cloneDeep(this.formData)
            for(let i in this.formData.tagList){
              this.formData.tagList[i] =  `|${this.formData.tagList[i]}|`
            }
            params['tagList'] = this.formData.tagList.join('')
            params['orderLevel'] = params['orderLevel'] || 0
            if(params.cmsInfoType === '2') {
              params.supplierId = null
            }
            console.log('参数', params)
            this.loading = true
            fetch[this.pageType](params).then(res => {
              this.$message.success('保存成功')
              this.close()
              this.$emit('success')
            }).finally(() => {
              this.loading = false
            })
          })
        }
      })
    },
    handleClose(tag) {
      this.formData.tagList.splice(this.formData.tagList.indexOf(tag), 1)
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm() {
      let inputValue = this.inputValue
      if (inputValue) {
        this.formData.tagList.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
  }
};
</script>

<style lang="scss" scoped>
.rule-form{
  display: flex;
  flex-wrap: wrap;
  /deep/ .el-form-item{
    width: 50%;
  }
}
</style>