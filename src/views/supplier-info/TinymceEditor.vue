<template>
  <editor :id="tinymceId" 
    v-model="myValue" 
    :init="init"
    :disabled="disabled">
  </editor>
</template>

<script>
import tinymce from 'tinymce/tinymce'
import '@/assets/tinymce/langs/zh_CN.js'
import 'tinymce/themes/silver/theme'
import 'tinymce/icons/default'
import 'tinymce/skins/ui/oxide/skin.min.css'
import Editor from '@tinymce/tinymce-vue'

// 插件
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/anchor'
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/autoresize'
import 'tinymce/plugins/autosave'
import 'tinymce/plugins/bbcode'
import 'tinymce/plugins/charmap'
import 'tinymce/plugins/code'
import 'tinymce/plugins/codesample'
import 'tinymce/plugins/colorpicker'
import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/directionality'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/help'
import 'tinymce/plugins/hr'
import 'tinymce/plugins/image'
import 'tinymce/plugins/imagetools'
import 'tinymce/plugins/importcss'
import 'tinymce/plugins/insertdatetime'
import 'tinymce/plugins/legacyoutput'
import 'tinymce/plugins/link'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/media'
import 'tinymce/plugins/nonbreaking'
import 'tinymce/plugins/noneditable'
import 'tinymce/plugins/pagebreak'
import 'tinymce/plugins/paste'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/print'
import 'tinymce/plugins/quickbars'
import 'tinymce/plugins/save'
import 'tinymce/plugins/searchreplace'
import 'tinymce/plugins/spellchecker'
import 'tinymce/plugins/tabfocus'
import 'tinymce/plugins/table'
import 'tinymce/plugins/template'
import 'tinymce/plugins/textpattern'
import 'tinymce/plugins/toc'
import 'tinymce/plugins/visualblocks'
import 'tinymce/plugins/visualchars'
import 'tinymce/plugins/wordcount'
import '@/assets/tinymce/plugins/lineheight'

import { uploadIfImages } from '@/api/cms'

export default {
  name: 'TinymceEditor',
  components: { Editor },
  props: {
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: function() {
        return 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
      }
    },
    height: {
      type: Number,
      default: 400
    }
  },
  data() {
    return {
      myValue: '',
      tinymceId: this.id,
      init: {
        selector: `#${this.tinymceId}`,
        language: 'zh_CN',
        height: this.height, // 编辑器高度
        branding: true, // 是否禁用“Powered by TinyMCE”
        menubar: false, // 顶部菜单栏显示
        image_advtab: true,
        paste_data_images: true,  // 设置粘帖图片
        // 工具栏
        toolbar: ['template paste undo redo visualaid bold italic underline strikethrough alignleft aligncenter alignright alignjustify alignnone formatselect fontsizeselect fontselect outdent indent removeformat subscript superscript insert hr bullist numlist link unlink openlink image charmap preview anchor searchreplace code visualblocks help fullscreen media nonbreaking table forecolor backcolor wordcount quickimage editimage lineheight'],
        plugins: ['template paste hr lists link image charmap preview anchor searchreplace code visualblocks help fullscreen media nonbreaking table wordcount imagetools lineheight'],
        fontsize_formats: "10px 11px 12px 13px 14px 15px 16px 17px 18px 20px 22px 24px 26px 28px 30px 32px 34px",
        lineheight_val: '1 1.5 1.6 1.75 1.8 2 3 4 5 14px 15px 16px 18px 20px 22px 24px 26px 28px 30px 32px',
        imagetools_toolbar: 'rotateleft rotateright | flipv fliph | editimage imageoptions',
        style_formats_merge: true,
        style_formats_autohide: true,
        valid_elements : "*[*]", // 防止tinymce过滤部分标签或js事件
        images_upload_handler (blobInfo, success, failure) {
          console.log('blob', blobInfo.blob())
          let formData = new FormData()
          formData.append('file', blobInfo.blob(), blobInfo.filename())
          // formData.append('file', blobInfo.blob())
          uploadIfImages(formData).then(res => {
            success(res)
          }).catch(err => {
            failure(err)
          })
        }
      }
    }
  },
  computed: {},
  created() {},
  mounted() {
  },
  methods: {
  },
  watch: {
    value(newValue) {
      this.myValue = newValue
    },
    myValue(newValue) {
      this.$emit('input', newValue)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
<style lang="scss">
.tox-tinymce-aux{
  z-index: 99999999;
  .tox-dialog-wrap{
    z-index: 9999999999;
  }
}
</style>
