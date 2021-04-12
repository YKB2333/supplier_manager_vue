<template>
  <div class="userlist-page">
    <!-- 表单 -->
    <my-table v-model="searchQuery" @change="onChange">
      <!-- 插槽内容 -->
      <div slot="before-table">
        <div v-permission-button="'add'" class="pb10">
          <el-button
            type="primary"
            v-permission-button="'add'"
            @click="saveDialogVisible = true"
          >新增账号</el-button>
        </div>
      </div>
      <el-table
        :data="tableData"
        border
        stripe
        v-loading="tableLoading"
        element-loading-text="拼命加载中"
      >
        <el-table-column label="登录帐号" prop="loginAcount"></el-table-column>
        <el-table-column label="手机" prop="mobile"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="备注" prop="remark"></el-table-column>
        <el-table-column label="状态" prop="isEnable">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isEnable">启用</el-tag>
            <el-tag v-else type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="主账号" prop="isMaster">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isMaster">主账号</el-tag>
            <el-tag v-else type="info">子账号</el-tag>
            <el-switch
              v-permission-button="'edit'"
              v-model="scope.row.isMaster"
              :disabled="scope.row.isMaster"
              @change="beMaster(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <!-- <el-table-column label="备注" prop="remark" width="200"></el-table-column> -->
        <el-table-column label="创建时间" prop="createTimestamp" width="140">
          <template
            v-if="scope.row.createTimestamp"
            slot-scope="scope"
          >{{scope.row.createTimestamp | formatDate('Y-M-D h:m:s')}}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <el-button
              v-if="!scope.row.isEnable"
              v-permission-button="'edit'"
              type="text"
              @click="enable(scope.row)"
            >启用</el-button>
            <el-button
              v-else-if="scope.row.isEnable"
              v-permission-button="'edit'"
              type="text"
              @click="disable(scope.row)"
            >禁用</el-button>
            <el-button
              v-permission-button="'delete'"
              type="text"
              @click="remove(scope.row)"
            >解除账号</el-button>
          </template>
        </el-table-column>
      </el-table>
    </my-table>

    <el-dialog
      title="账号管理"
      :visible.sync="saveDialogVisible"
      v-loading="saveLoading"
      :close-on-click-modal="false"
      @close="resetForm"
      width="30%"
      center
    >
      <el-form
        :model="accountForm"
        :rules="accountRules"
        ref="accountForm"
        label-width="80px"
        size="mini"
      >
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="accountForm.mobile" />
        </el-form-item>
        <!--
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="accountForm.email" />
        </el-form-item>
        <el-form-item label="登录密码" prop="loginPassword">
          <el-input type="password" v-model="accountForm.loginPassword" />
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPassword">
          <el-input type="password" v-model="accountForm.checkPassword" />
        </el-form-item>
        -->
      </el-form>
      <div slot="footer" class="algin-center">
        <el-button @click="saveDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  supUserPage,
  saveSupUser,
  enableSupUser,
  disableSupUser,
  beMasterSupUser,
  removeSupUser
} from "@/api/supplier/user";
import { mobile as mobileValidator } from "@/utils/validator";

export default {
  name: "SupplierUserIndex",
  components: {
    mobileValidator
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value == null) {
        callback(new Error("请输入密码"));
      } else {
        if (this.accountForm.checkPassword !== "") {
          this.$refs.accountForm.validateField("checkPassword");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value == null) {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.accountForm.loginPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      searchQuery: {
        supId: "",
        pageIndex: 1,
        pageSize: 10,
        orderStr: "createTimestamp desc",
        total: 0 // 总条数
      },
      tableData: [],
      tableLoading: false,
      saveLoading: false,
      saveDialogVisible: false,
      accountForm: {
        supId: "",
        mobile: "",
        email: "",
        loginPassword: "",
        checkPassword: ""
      },
      accountRules: {
        tel: [{ required: true, message: "请输入电话", trigger: "blur" }],
        mobile: [
          {
            required: true,
            message: "请维护供应商联系人手机号码",
            trigger: "blur"
          },
          {
            validator: mobileValidator,
            message: "请维护供应商联系人手机号码",
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            message: "请维护供应商联系人邮箱",
            trigger: "blur"
          },
          {
            type: "email",
            message: "请维护供应商联系人邮箱",
            trigger: ["blur", "change"]
          }
        ],
        loginPassword: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          { validator: validatePass, trigger: "blur" }
        ],
        checkPassword: [
          { required: true, message: "请再次输入登录密码", trigger: "blur" },
          { validator: validatePass2, trigger: "blur" }
        ]
      }
    };
  },
  computed: {},
  methods: {
    onChange() {
      this.fetchTableData();
    },
    fetchTableData() {
      this.tableLoading = true;
      supUserPage(this.searchQuery)
        .then(data => {
          this.searchQuery.total = data.total;
          this.tableData = data.records;
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    save() {
      this.$refs.accountForm.validate(valid => {
        if (!valid) return;
        this.saveLoading = true;
        saveSupUser(this.accountForm)
          .then(res => {
            this.fetchTableData();
            this.$message.success(res);
            this.saveDialogVisible = false
          })
          .finally(() => {
            this.saveLoading = false;
          });
      });
    },
    enable(row) {
      enableSupUser(row.supId, row.id).then(res => {
        row.isEnable = true;
        this.$message.success("启用成功");
      });
    },
    disable(row) {
      disableSupUser(row.supId, row.id).then(res => {
        row.isEnable = false;
        this.$message.success("禁用成功");
      });
    },
    beMaster(row) {
      beMasterSupUser(row.supId, row.id).then(data => {
        this.$lodash.forEach(this.tableData, v => {
          v.isMaster = false;
        });
        row.isMaster = true;
      });
    },
    remove(row) {
      this.$confirm("确认解除账号绑定吗，解除后需重新绑定?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.tableLoading = true;
        removeSupUser(row.supId, row.id)
          .then(res => {
            this.fetchTableData();
          })
          .finally(() => {
            this.tableLoading = false;
          });
      });
    },
    resetForm() {
      this.$refs.accountForm.resetFields();
      this.accountForm.supId = this.$route.params.supId;
    }
  },
  watch: {},
  async created() {
    this.searchQuery.supId = this.$route.params.supId;
    this.accountForm.supId = this.$route.params.supId;
    this.fetchTableData(); // 加载表格数据
  },
  mounted() {}
};
</script>

<style lang='scss' scoped>
.el-button + .el-button {
  margin-left: 0px;
}
.large-form-item {
  width: 99.9%;
  /deep/ .el-form-item__content {
    width: 99.9%;
  }
}

/deep/ .el-select {
  overflow: hidden;
}
/deep/ .el-cascader__tags {
  top: 51%;
}

/deep/ .el-cascader-node {
  position: relative;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  padding: 0 30px 0 20px;
  height: 34px;
  overflow: hidden;
  line-height: 34px;
  outline: 0;
}

/deep/ .picture-card-box {
  width: 100%;
  height: 100%;
  .box-img {
    cursor: pointer;
    width: 100%;
    height: 100%;
  }
}
/deep/ .el-upload-list .upload-item {
  overflow: hidden;
  background-color: #fff;
  border-radius: 6px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 50px;
  height: 50px;
  margin: 0;
  margin-top: 4px;
  display: inline-block;
}
/deep/ .el-upload--picture-card {
  background-color: #fbfdff;
  border: 1px dashed #c0ccda;
  border-radius: 6px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 50px;
  height: 50px;
  line-height: 60px;
  vertical-align: center;
}

/deep/ .el-upload-list--picture-card .el-upload-list__item {
  overflow: hidden;
  background-color: #fff;
  border: 1px solid #c0ccda;
  border-radius: 6px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 50px;
  height: 50px;
  margin: 0 2px;
  margin-top: 4px;
  display: inline-block;
}
/deep/ table th.must div:before {
  content: "* ";
  color: #ff1818;
}
.checkMessage {
  list-style: none;
  padding: 0;
  margin: 0;
  // line-height: 1;
  li {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    height: 100px;
    margin-bottom: 10px;
    display: flex;
    width: 50%;
    justify-content: space-between;
    align-items: center;
    img {
      width: 60px;
      height: 60px;
      margin: 4px 10px;
    }
    div {
      flex: 1;
    }
    .detail {
      > p:nth-child(1) {
        color: #409eff;
      }
      > p:nth-child(2) {
        color: #bbb;
      }
    }
    .detailMessage {
      color: #888;
      > p:nth-child(1) {
        color: red;
      }
      > p:nth-child(2) {
        color: #222;
      }
    }
  }
}
</style>
