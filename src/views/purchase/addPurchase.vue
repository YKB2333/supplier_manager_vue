<template>
  <div id="message-page" class="wpct70" style="width:50%">
    <el-form ref="form" :model="message" label-width="80px" label-position="top" size='medium'>
      <el-form-item label="采购标题">
        <el-input v-model="message.title"></el-input>
      </el-form-item>
      
      <el-form-item label="需求内容">
        <el-input type="textarea" v-model="message.content"></el-input>
      </el-form-item>
      <el-form-item>

      <el-form-item label="附件">
        <file-list  v-model="message.attachments"></file-list>
      </el-form-item>

        <el-button v-permission-button="'add'" type="primary" @click="onSubmit">发起采购需求</el-button>
        <el-button @click="$router.go(-1)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import FileList from "_c/FileList";
import { msgAdd } from "@/api/supplier/common";

export default {
  name: "AddPurchase",
  components: { FileList },
  data() {
    return {
        message: {
          msgType:'3', // 1发送, 2通知, 3采购
          title: '', // 主题
          content: '', // 留言
          attachments:[],
          sysTag:'supplier'
        },
    };
  },
  created() {
  },
  computed: {},
  methods: {
    onSubmit() {
        this.$confirm('确认发起采购需求吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.message.attachments.forEach(item => {
            item.filePath = item.attaUrl
          });
          msgAdd(this.message).then(res=>{
            console.log(res);
            this.$message({
              type: 'success',
              message: '发起采购需求留言成功!'
            });
            this.$router.go(-1)
          })
        })
      console.log('submit!');
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
