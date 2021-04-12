<template>
  <div class="file-list">
    <el-upload
      action
      :before-upload="handleFileBefore"
      :on-success="handleFileSuccess"
      :http-request="handleFileRequest"
      v-loading="loading"
      :disabled="loading"
      list-type="picture-card"
    >
      <ul
        v-if="showPlus"
        slot="trigger"
        class="el-upload-list el-upload-list--picture-card"
        style="border:;margin:;"
      >
        <li v-if="addible" class="upload-item is-success">
          <div class="el-upload el-upload--picture-card">
            <i class="el-icon-plus"></i>
            <input type="file" name="file" class="el-upload__input" />
          </div>
        </li>
      </ul>
      <ul class="el-upload-list el-upload-list--picture-card">
        <li v-for="file in fileList" :key="file.attUrl" class="el-upload-list__item is-success">
          <div class="picture-card-box align-center-column">
            <img class="box-img" :src="getFileImg(file)" @click="handleDownload(file.attaUrl)" />
            <span class="el-upload-list__item-actions op1">
               <i @click="handleDownload(file.attaUrl)" class="el-icon-download"></i>
               <i v-if="showPlus" @click="handleRemove(file)" class="el-icon-delete"></i>
            </span>
          </div>
        </li>
      </ul>
    </el-upload>
  </div>
</template>
<script>
import { uploadOss } from "@/api/uploadOss";
export default {
  name: "FileList",
  props: {
    value: {
      type: Array,
      default: () => {
        return new Array();
      }
    },
    uploadOss: {
      type: Function,
      default: () => {
        return uploadOss;
      }
    },
    addible: {
      type: Boolean,
      default: true
    },
    showPlus: {
      type: Boolean,
      default: true
    },
    removable: {
      type: Boolean,
      default: true
    },
    //是否为异步操作
    async: {
      type: Boolean,
      default: false
    },
    //异步的上传操作
    uploadPromise: {
      type: Function
    },
    //异步的删除操作
    removePromise: {
      type: Function
    },
    limitType: {
      type: Array,
      default: () => {
        return new Array();
      }
    }
  },
  data() {
    return {
      loading: false,
      fileList: this.value
    };
  },
  compute: {},
  methods: {
    getFileImg(file) {
      switch (file.fileType) {
        case "jpeg":
        case "jpg":
        case "bmp":
        case "gif":
        case "psd":
        case "tiff":
        case "mpeg":
        case "png":
        case "svg":
        case "swf":
        case "wmf":
          return file.attaUrl;
        case "avi":
          return require("@/assets/images/file/avi.png");
        case "doc":
        case "docx":
          return require("@/assets/images/file/docx_win.png");
        case "fla":
          return require("@/assets/images/file/fla.png");
        case "html":
          return require("@/assets/images/file/html.png");
        case "jsf":
          return require("@/assets/images/file/jsf.png");
        case "midi":
          return require("@/assets/images/file/midi.png");
        case "mov":
          return require("@/assets/images/file/mov.png");
        case "mp3":
          return require("@/assets/images/file/mp3.png");
        case "pdf":
          return require("@/assets/images/file/pdf.png");
        case "ppt":
        case "pptx":
          return require("@/assets/images/file/pptx_win.png");
        case "rar":
          return require("@/assets/images/file/rar.png");
        case "txt":
          return require("@/assets/images/file/text.png");
        case "vsd":
        case "vsdx":
          return require("@/assets/images/file/vsd.png");
        case "wav":
          return require("@/assets/images/file/wav.png");
        case "wma":
          return require("@/assets/images/file/wma.png");
        case "wmv":
          return require("@/assets/images/file/wmv.png");
        case "xls":
        case "xlsx":
          return require("@/assets/images/file/xlsx_win.png");
        case "zip":
          return require("@/assets/images/file/zip.png");
        default:
          return require("@/assets/images/file/file.png");
      }
    },
    handleRemove(file) {
      if (this.async) {
        this.loading = true;
        this.removePromise(file)
          .then(res => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.fileList = res
          })
          .finally(() => {
            this.loading = false;
          });
      } else {
        let arr = this.$lodash.cloneDeep(this.fileList);
        if (file.id) {
          arr = arr.filter(a => {
            return a.id != file.id;
          });
        } else {
          arr = arr.filter(a => {
            return a.uid != file.uid;
          });
        }
        this.$emit("input", arr);
      }
    },
    handleDownload(path) {
      window.open(path, "_blank");
    },
    handleFileBefore(file) {
      if (file.size > 1024 * 1024 * 5) {
        this.$message.error("文件大小超过5MB，不可上传");
        return false;
      }
      if (this.limitType.length > 0) {
        for (let type of this.limitType) {
          if (file.type.includes(type)) return true;
        }
        this.$message.error("上传失败！该上传只支持" + this.limitType);
        return false;
      }
      return true;
    },
    handleFileSuccess(res, file, fileList) {
      if (this.async) {
        this.loading = true;
        this.uploadPromise(res)
          .then(res => {
            this.$message({
              type: "success",
              message: "上传成功!"
            });
            this.fileList = res
          })
          .finally(() => {
            this.loading = false;
          });
      } else {
        let arr = this.$lodash.cloneDeep(this.fileList);
        arr.push(res);
        this.$emit("input", arr);
      }
    },
    handleFileRequest(upload) {
      this.loading = true;
      let formData = new FormData();
      formData.append("file", upload.file);
      uploadOss(formData)
        .then(file => {
          let form = {
            attaUrl: file.url,
            fileType: file.fileType,
            fileName: file.fileName,
            size: upload.file.size
          };
          upload.onSuccess(form);
        })
        .catch(e => {
          upload.onError(e);
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.picture-card-box {
  width: 100%;
  height: 100%;
  .box-img {
    cursor: pointer;
    width: 100px;
    height: 100px;
  }
}

.op1{
  display: flex;
  justify-content: center;
  align-items: center;
  i{
    cursor: pointer;
    font-size: 18px;
    color:#bbb;
    margin:1px;
    &:hover{
      color:#fff;
    }
  }
}
</style>
