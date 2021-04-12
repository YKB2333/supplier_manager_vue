<template>
  <div class="userlist-page">
    <!-- 表单 -->
    <my-table v-model="searchQuery" :searchForm="searchForm" @change="onChange">
      <div slot="before-table">
        <div class="pb10">
          <el-button  v-permission-button="'addCoopGoods'" type="primary" size="small" @click="addCoopGoods">新增合作商品</el-button>
        </div>
      </div>
      <el-table
        :data="tableData"
        border
        stripe
        v-loading="tableLoading"
        element-loading-text="拼命加载中"
      >
        <el-table-column label="分类名称" prop="spuCateName" width="120"></el-table-column>
        <el-table-column label="品牌名称" prop="spuBrandName" width="120"></el-table-column>
        <el-table-column label="商品名称" prop="name" width="180"></el-table-column>
        <el-table-column label="主图" prop="spuTitleImage" width="180">
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.spuTitleImage"
              :preview-src-list="[scope.row.spuTitleImage]"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column label="规格编码" prop="skuSn" width="180"></el-table-column>
        <el-table-column label="商品条码" prop="codeBar" width="180"></el-table-column>
        <el-table-column label="主属性值" prop="firstAtbValue" width="150"></el-table-column>
        <el-table-column label="副属性值" prop="secondAtbValue" width="150"></el-table-column>
        <el-table-column label="供应商物料编码" prop="supplierGoodsCode" width="150"></el-table-column>
        <el-table-column label="供应商名字" prop="supplierName" width="150"></el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <el-button  type="text" size="small"  v-permission-button="'search'" @click="preview(scope.row, scope.$index)">查看</el-button>
            <el-button  type="text" size="small" v-permission-button="'enable'"  v-if="scope.row.disable"  @click="enable(scope.row, scope.$index)">恢复</el-button>
            <el-button  type="text" size="small" v-permission-button="'disEnable'"  v-else @click="disEnable(scope.row, scope.$index)">禁用</el-button>
            <el-button  type="text" size="small" v-permission-button="'updateSupplierCode'"  @click="updateSupplierCode(scope.row, scope.$index)">修改供应商物料编码</el-button>
          </template>
        </el-table-column>
      </el-table>
    </my-table>

    <!-- 弹窗 -->
    <my-dialog
      v-model="dialogVisible"
      :close-on-click-modal="false"
      width="1100px"
      max-height
      @close="closeDialog"
    >
      <el-form
        :model="ruleForm"
        ref="ruleForm"
        label-width="120px"
        :rules="rules"
        inline
        style="width: 1000px"
      >
        <el-form-item label="所属供应商" prop="supplierId">
          <el-select
            v-model="ruleForm.supplierId"
            filterable
            placeholder="请选择供应商"
            style="width: 300px"
          >
            <el-option
              v-for="(item, index) in AllCompanys"
              :key="index"
              :label="item.name"
              :value="item.baseInfoId"
            ></el-option>
          </el-select>
        </el-form-item>
          <el-form-item label="所属商品SPU" prop="spuId">
            <el-select
              v-model="ruleForm.spuId"
              filterable
              @change="changeSpu"
              placeholder="请选择商品SPU"
              style="width: 300px"
            >
              <el-option
                v-for="(item, index) in spuList"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
        </el-form-item>
        <div>
            <el-table
              :data="skuList"
              @selection-change="handleSelectionChange">
              <el-table-column
                type="selection"
                width="55"
                >
              </el-table-column>
              <el-table-column label="id" prop="id" width="100"></el-table-column>
              <el-table-column label="规格编码" prop="skuSn" width="150"></el-table-column>
              <el-table-column label="商品名称" prop="name" width="200" ></el-table-column>
              <el-table-column label="商品条码" prop="codeBar" width="150"></el-table-column>
              <el-table-column label="主属性" prop="firstAtbValue" width="200"></el-table-column>
              <el-table-column label="副属性" prop="secondAtbValue" width="200"></el-table-column>
            </el-table>
        </div>
      </el-form>
      <el-footer style="float: right;">
        <el-button  type="primary"   :loading="saveBtnLoading" @click="submit('ruleForm')">保存</el-button>
        <el-button  @click="closeDialog"   >关 闭</el-button>
      </el-footer>
    </my-dialog>
    <!--编辑物料编码-->
    <el-dialog
      title="物料编码管理"
      :visible.sync="supplierCodeVisible"
      width="20%"
      center>
        <el-form
          :model="supplierCodeForm"
          ref="codeForm"
       >
          <el-form-item label="物料编码" prop="SupplierCode">
            <el-input v-model="supplierCodeForm.supplierGoodsCode" placeholder="请输入物料编码"  width="15%"></el-input>
          </el-form-item>
          <el-form-item style="display: block; text-align: left; padding-left: 80px">
            <el-button type="primary" @click="saveSupplierCode('codeForm')">保存</el-button>
            <el-button @click="closeCodeVisible">关 闭</el-button>
          </el-form-item>
        </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getCoopGoods,getAllSuppliers,getAllSup,getSkusByspuId,addCoopGoods,disable,enable ,updateSupplierCode,getCoopGoodsBySearch} from "@/api/supplier/cooperation";
export default {
  name: "CooperationGoodsList",
  components: {},
  data() {
    return {
      searchForm: [
        {
          key: "supId",
          label: "供应商",
          placeholder: "请选择供应商",
          type: "supplier_select"
        },
        {
          key: "goodsCate",
          label: "商品分类",
          placeholder: "请选择商品分类",
          type: "cate_cascader"
        },
        {
          key: "goodsName",
          label: "商品名称",
          placeholder: "请输入商品名称",
          type: "input"
        },
        {
          key: "skuSn",
          label: "规格编码",
          placeholder: "请输入规格编码",
          type: "input"
        },
        {
          key: "supplierGoodsCode",
          label: "供应商物料编码",
          placeholder: "请输入供应商物料编码",
          type: "input"
        }
      ],
      rules: {
        supplierId:[{ required: true, message: "请选择供应商", trigger: "change" }],
        spuId: [{ required: true, message: "请选择SPU商品", trigger: "change" }],
      },
      searchQuery: {
        supId:"",
        goodsCate: "",
        goodsName: "",
        goodsTag: "",
        pageIndex: 1,
        pageSize: 10,
        orderStr: "id desc",
        total: 0 // 总条数
      },
      supplierCodeVisible:false,
      tableData: [],
      tableLoading: false,
      spuList:[],
      skuList:[],
      AllCompanys:[],
      ruleForm:{
        supplierId:'', //供应商id
        spuId:'',//商品spuId
        skuIds:[],
      },
      supplierCodeForm:{
        coopId:null,
        supplierGoodsCode:'',
      },
      dialogVisible:false,
      saveBtnLoading: false, // 保存按钮的loading状态
      saveSupplierCodeLoading: false, // 保存按钮的loading状态
      selectionList :[], //选中的数据
    };
  },
  computed: {
    selectionIds() {
      let ids = this.selectionList.map(item => item.id)
      console.log(ids)
      return ids
    },
  },
  methods: {
    disEnable(data, index) {
      disable(data.coopId)
        .then(res => {
          this.$message.success("成功禁用");
          this.fetchTableData();
        })
    },
    enable(data, index) {
      enable(data.coopId)
        .then(res => {
          this.$message.success("恢复成功");
          this.fetchTableData();
        })
    },
    updateSupplierCode(date, index) {
      this.supplierCodeForm.coopId = date.coopId
      this.supplierCodeForm.supplierGoodsCode = date.supplierGoodsCode
      this.supplierCodeVisible = true;
    },
    // 预览
    preview(data, index) {
      let previewPage = this.$instantCompt(require('./Preview').default, {
        dialogWidth: '80%'
      })
      previewPage.init(data.spuId,data.id)
    },
    onChange() {
      this.fetchTableData();
    },
    handleSelectionChange(selection) {
      this.selectionList = selection
      console.log(this.selectionList)
    },

    changeSpu(){
      this.getAllSkusByspuid(this.ruleForm.spuId);
    },
    // 保存提交
    saveSupplierCode(date) {
      console.log(date)
      this.$refs.codeForm.validate(valid => {
        console.log("保存供应商编码的数据",this.supplierCodeForm.coopId+"")
        updateSupplierCode(this.supplierCodeForm)
          .then(res => {
            this.$message.success("修改成功");
            this.fetchTableData();
            this.closeCodeVisible();
          })
          .finally(() => {
            this.supplierCodeVisible = false;
          });
      });
    },
    // 合作商品保存
    submit() {
      this.$refs.ruleForm.validate(valid => {
        if (!valid) return false;
        if (!this.selectionList.length) {
          this.$message.error("请选择SKU商品");
          return false;
        }
        this.ruleForm.skuIds =  this.selectionIds;
        this.dialogVisible = true;
        console.log("保存的数据",this.ruleForm)
        addCoopGoods(this.ruleForm)
          .then(res => {
            this.$message.success("添加成功");
            this.fetchTableData();
            this.closeDialog();
          })
          .finally(() => {
          });
      });
    },
    closeDialog() {
      this.skuList = []
      this.ruleForm = {};
      this.dialogVisible = false;
      this.$refs['ruleForm'].clearValidate();
    },
    closeCodeVisible() {
      this.supplierCodeForm = {
        supplierId:null,
        skuId:null,
        supplierGoodsCode:'',
      }

      this.supplierCodeVisible = false;
      this.$refs['codeForm'].clearValidate();
    },
    //获取所有公司信息
    fetchSupData() {
      return getAllSuppliers().then(res => {
        this.AllCompanys = res;
      });
    },
    //所有Spu商品
    getAllSpus(){
      return getAllSup().then(res => {
        this.spuList = res;
      });
    },
    //获得sku商品信息
    getAllSkusByspuid(id){
      return getSkusByspuId(id).then(res => {
        this.skuList = res;
      });
      },
    //新增合作商品
    addCoopGoods(){
      this.dialogVisible = true
    },
    // 加载表格数据
    fetchTableData() {
      this.tableLoading = true;
      getCoopGoodsBySearch(this.searchQuery)
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
    }
  },
  watch: {},
  async created() {
    this.fetchSupData()
    this.fetchTableData()
    this.getAllSpus()
    // this.fetchTableData(); // 加载表格数据
  },
  mounted() {}
};
</script>

<style lang='scss' scoped>
</style>
<style lang="scss">
</style>
