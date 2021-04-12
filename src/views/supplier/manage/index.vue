<template>
  <div>
    <!-- 表单 -->
    <my-table v-model="searchQuery" :searchForm="searchForm" @change="onChange">
      <!-- 插槽内容 -->
      <div slot="before-table">
        <div v-permission-button="'add'" class="pb10">
          <el-button type="primary" @click="add" >新增供应商</el-button>
        </div>
      </div>
      <el-table
        :data="tableData"
        border
        stripe
        v-loading="tableLoading"
        element-loading-text="拼命加载中"
        highlight-current-row
        height=500>
        <el-table-column label="供应商NC编码" prop="code" fixed="left" ></el-table-column>
        <el-table-column label="供应商名称" prop="name" fixed="left" min-width="160"></el-table-column>
        <el-table-column label="风险等级" prop="riskCategory" ></el-table-column>
        <el-table-column label="客户类型" prop="customerType" ></el-table-column>
        <el-table-column label="企业性质" prop="nature" width="80"></el-table-column>
        <el-table-column label="主要业务类型" prop="businessType" width="80"></el-table-column>
        <el-table-column label="合作等级" prop="coopType" width="80"></el-table-column>
        <el-table-column label="经营品牌" prop="manageBrank" width="100"></el-table-column>
       <!-- <el-table-column label="商品服务类型" prop="goodsServiceType" width="160"></el-table-column>-->
        <el-table-column label="建档状态" prop="checkedStatus" fixed="left" width="130">
          <template slot-scope="scope">
            <el-tag size="mini">{{ checkStatus[scope.row.checkedStatus] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" prop="checkedStatus" fixed="left" width="120">
          <template slot-scope="scope">
            <el-tag
              size="mini"
              v-if="scope.row.accessStatus"
            >{{ accessStatus[scope.row.accessStatus]}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否启用" prop="isEnable" fixed="left" width="70">
          <template slot-scope="scope">
            <el-tag
              size="mini"
              type="success"
              v-if="scope.row.isEnable != null"
            >{{ enableStatus[scope.row.isEnable] }}</el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column label="备注" prop="remark" width="200"></el-table-column> -->
        <el-table-column label="创建人" prop="createUserName"></el-table-column>
        <el-table-column label="创建时间" prop="createDate" width="140">
          <template
            v-if="scope.row.createDate"
            slot-scope="scope"
          >{{scope.row.createDate | formatDate('Y-M-D h:m:s')}}</template>
        </el-table-column>
        <el-table-column label="更新时间" prop="updateDate" width="140">
          <template
            v-if="scope.row.updateDate"
            slot-scope="scope"
          >{{scope.row.updateDate | formatDate('Y-M-D h:m:s')}}</template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template slot-scope="scope">
            <el-button
              v-permission-button="'viewDetails'"
              type="text"
              @click="lookDetails(scope.row.id)"
            >查看</el-button>
            <el-button
              v-permission-button="'edit'"
              type="text"
              @click="edit(scope.row.id)"
              :disabled="scope.row.checkedStatus == '3'||[  '40', '50', '55', '60','70','75', '80',  '95'].includes(scope.row.accessStatus)"
            >编辑</el-button>
            <el-button
              v-show="scope.row.checkedStatus !== '1'"
              v-permission-button="'addCheck'"
              :disabled="scope.row.checkedStatus == '3'"
              type="text"
              @click="checkApply(scope.row)"
            >建档审核</el-button>
            
            <el-button
              v-show="!scope.row.isEnable"
              v-permission-button="'cease'"
              type="text"
              @click="enable(scope.row.id,true)"
            > 启用</el-button>
            <el-button
              v-show="scope.row.isEnable"
              v-permission-button="'cease'"
              type="text"
              @click="enable(scope.row.id,false)"
            > 禁用</el-button>
            <el-button
              v-permission-button="'searchSupUser'"
              type="text"
              @click="routeSupUser(scope.row)"
            >查看账号</el-button>
             <el-button
              v-show="scope.row.checkedStatus == '1'"
              type="text"
              @click="showAccess(scope.row)"
            >准入改进</el-button>
            <!-- <el-button
              v-permission-button="'InternalContactInformation'"
              type="text"
              @click="getInnerPerson(scope.row.id)"
            >内部联系人信息</el-button> -->
            <!-- <el-button type="text" @click="onSuccessCase(scope.row)">成功案例</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </my-table>

    <access 
      title="准入改进"
      :visible.sync="accessVisible"
      width="1200px"
      :row-data="currentSupInfo"
      :departments="departments"
      custom-class="dialog-class"
      @success="onSuccess"
    />

    <supplier 
      title="供应商信息"
      :type="supDialogType"
      :visible.sync="visibleSup"
      :sup-types-options="searchForm[1].options"
      fullscreen center
      :id="supId"
      @success="onSuccess"
    />
  </div>
</template>

<script>
import {
  selectSupInfoPage, getSupTypes, enable, disEnable, getAllCompanyInfo,
  checkApply,
} from "@/api/supplier";
import { brandCategory } from "@/const/goods";
import { checkStatus, enableStatus, supplierType, accessStatus } from "@/const/supplier/index";
import Access from './dialog/access'
import Supplier from './dialog/supplier'

export default {
  name: "SupplierList",
  components: {
    Access,
    Supplier
  },
  data() {
    return {
      departments: [],//所属公司
      accessVisible: false,
      checkStatus,
      accessStatus,
      enableStatus,
      searchForm: [
        // {
        //   key: "id",
        //   label: "供应商ID",
        //   placeholder: "供应商ID",
        //   type: "input"
        // },
        {
          key: "name",
          label: "供应商名称",
          placeholder: "供应商名称",
          type: "input"
        },
        {
          key: "type",
          label: "供货类型",
          placeholder: "供货类型",
          options: [],
          clearable: true,
          type: "select"
        },
        {
          key: "tag",
          label: "标签",
          placeholder: "供应商标签",
          type: "input"
        },
        {
          key: "goodsServiceType",
          label: "商品服务类型",
          placeholder: "商品服务类型",
          options:brandCategory.properties,
          clearable: true,
          type: "select"
        },
        {
          key: "isEnable",
          label: "启用状态",
          placeholder: "启用状态",
          options: enableStatus.properties,
          clearable: true,
          type: "select"
        },
        {
          key: "checkedStatus",
          label: "建档状态",
          placeholder: "建档状态",
          options: checkStatus.properties,
          clearable: true,
          type: "select"
        },
        {
          key: "supContactMobile",
          label: "手机号码",
          placeholder: "手机号码",
          type: "input"
        },
        {
          key: "supContactEmail",
          label: "邮箱",
          placeholder: "邮箱",
          type: "input"
        },
        {
          key: "manageBrank",
          label: "经营品牌",
          placeholder: "经营品牌",
          type: "input"
        },
        {
          key: "supplierType",
          label: "供应商类型",
          placeholder: "供应商类型",
          options:supplierType.properties,
          clearable: true,
          type: "select"
        }
      ],
      searchQuery: {
        id: "",
        name: "",
        tag: "",
        type: "",
        checkedStatus: "",
        isEnable: "",
        pageIndex: 1,
        pageSize: 10,
        orderStr: "createDate desc",
        total: 0, // 总条数
        supContactMobile: "",
        supContactEmail: ""
      },
      tableData: [],
      tableLoading: false,
      currentSupInfo: {}, // 当前供应商信息
      supId: "", // 客户弹窗id
      visibleSup: false,
      supDialogType: '', // add edit preview
    };
  },
  computed: {},
  async created() {
    await this.initSupTypesOptions();
    this.fetchTableData(); // 加载表格数据
    this.getAllCompanyInfo(); //加载所有公司
  },
  methods: {
    onSuccess() {
      this.fetchTableData()
    },
    getAllCompanyInfo(){
      getAllCompanyInfo().then(res => {
        let data = this.$lodash.cloneDeep(res);
          data.forEach(ele => {
          ele["_departmentid"] = ele._subcompanyid;
          });
        this.departments = data;
      });
    },
    // 准入改进
    showAccess(row) {
      this.currentSupInfo = _.cloneDeep(row)
      this.accessVisible = true
    },
    initSupTypesOptions() {
      return getSupTypes().then(res => {
        res.forEach(e => {
          this.searchForm[1].options.push({ label: e.text, value: e.code });
        });
      });
    },
    onChange() {
      this.fetchTableData();
    },
    // 加载表格数据
    fetchTableData() {
      //console.log("aaa",brandCategory.properties.)
      this.tableLoading = true;
      selectSupInfoPage(this.searchQuery)
        .then(res => {
          this.searchQuery.total = Number(res.total); // 总条数
          this.tableData = res.records.map(row => {
            row.id += "";
            return row;
          });
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    checkApply({id}) {
      this.$confirm("确认发起建档申请吗(支持供应链采购部、ODM、商品部人员。)?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$store.commit("SHOW_LOADING", "建档提交中");
        checkApply(id).then(res => {
          this.$message({
            type: "success",
            message: "申请成功"
          });
          this.fetchTableData();
        }).finally(() => {
          this.$store.commit("SHOW_LOADING", false);
        });
      })
    },
    enable(id, result) {
      let http;
      if (result) {
        http = enable(id);
      } else {
        http = disEnable(id);
      }
      this.tableLoading = true;
      http
        .then(res => {
          this.fetchTableData();
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    add() {
      this.supId = ''
      this.supDialogType = 'add'
      this.visibleSup = true
    },
    edit(id) {
      this.supId = id
      this.supDialogType = 'edit'
      this.visibleSup = true
    },
    lookDetails(id) {
      this.supId = id
      this.supDialogType = 'preview'
      this.visibleSup = true
    },
    onSuccessCase(row) {
      let view = this.$instantCompt(require("@/views/SuccessCase").default, {
        title: "成功案例"
      });
      view.init(row.id);
    },
    routeSupUser(row){
      this.$router.push({ path: `/user/${row.id}` });
    }
  }
};
</script>

<style lang='scss' scoped>
.el-button + .el-button {
  margin-left: 0px;
}

/deep/ .el-select{
  overflow: hidden;
}
/deep/ .el-cascader__tags{
  top:51%;
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

/deep/ table th.must div:before {
  content: "* ";
  color: #ff1818;
}

/deep/ .dialog-class{
  height: 80%;
  overflow-y: auto;
}
</style>
