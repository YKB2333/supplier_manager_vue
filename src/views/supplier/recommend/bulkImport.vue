<template>
  <div class="userlist-page">
   
    <!-- 表单 -->
       <div slot="before-table">
         <div class="col">
           <el-button-group class="pb14">
             <el-button v-permission-button="'import'" type="warning" size="small" @click="importRecommendProduct">导入</el-button>
             <el-button v-permission-button="'remove'" type="danger" size="small" :loading="batchDeleteLoading" @click="onBatchDelete">移除</el-button>
             <el-button v-permission-button="'bulkImport'" style="float:right;" type="warning" size="small" @click="dialogOnBatch = true" :disabled="tableData.length > 0 ? false:true">批量导入</el-button>
           </el-button-group>
         </div>
      </div>
      <el-table
        :data="tableData"
        border
        stripe
        v-loading="tableLoading"
        @selection-change="handleSelectionChange"
        element-loading-text="拼命加载中"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="导后状态" prop="status"  fixed="left" width="100" sortable>
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status==='0'" effect="plain">{{ '已新增' }}</el-tag>
            <el-tag v-if="scope.row.status==='1'" effect="plain">{{' 已更新' }}</el-tag>
            <el-tag v-if="scope.row.status==='2'"type='danger' effect="plain">{{ '提交失败' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="供应商ID" prop="id" fixed="left" width="160"></el-table-column>
        <el-table-column label="分类名称" prop="cateName" width="160"></el-table-column>
        <el-table-column label="品牌名称" prop="brandName" width="160"></el-table-column>
        <el-table-column label="商品名称" prop="name" fixed="left" width="160"></el-table-column>
        <el-table-column label="商品类型" prop="proType" width="80">
          <template slot-scope="scope">
            <span>{{getProTypeName(scope.row.proType)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="商品材质" prop="materialQuality" width="80"></el-table-column>
        <el-table-column label="包装方式" prop="packingMethod" width="80"></el-table-column>
        <el-table-column label="销售渠道" prop="salesChannels" width="80"></el-table-column>
        <el-table-column label="是否支持定制" prop="isSupportOdm" width="100">
          <template slot-scope="scope">{{scope.row.isSupportOdm?"是":"否"}}</template>
        </el-table-column>
        <el-table-column label="商品描述" prop="productDescribe" width="200"></el-table-column>
        <el-table-column label="采购价" prop="price" width="100">
          <template slot-scope="scope">￥{{scope.row.price | toThousandFilter(4)}}</template>
        </el-table-column>
        <el-table-column label="建议零售价" prop="price" width="100">
          <template slot-scope="scope">￥{{scope.row.msrp | toThousandFilter(4)}}</template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createDate">
          <template slot-scope="scope">{{scope.row.createDate | formatDate('Y-M-D h:m:s')}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
             <el-button v-permission-button="'edit'" type="text" @click="edit(scope.row)">编辑</el-button>
            <el-button v-permission-button="'viewDetails'" type="text" @click="lookDetails(scope.row)">查看详情</el-button>
             <el-button v-permission-button="'delete'" type="text" @click="del(scope.row,scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>



    <el-dialog
      :title="dialogTitle"
      v-loading="formLoading"
      @close="resetForm"
      :visible.sync="dialogVisible"
      fullscreen
      center
    >

      <el-form :model="form" ref="form" :rules="formRules" inline :label-width="labelWidth">
        <el-form-item label="客户信息：">
          <el-select v-model="form.supId" filterable placeholder="请选择客户" clearable :loading="customerLoading"  >
            <el-option
              v-for="item in supList"
              :key="item.value"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="form.name" :style="inputStyle" />
        </el-form-item>
        <el-form-item label="商品条码" prop="code">
          <el-input v-model="form.code" :style="inputStyle" />
        </el-form-item>
        <el-form-item label="商品类型" prop="proType">
          <el-select clearable v-model="form.proType" :style="inputStyle">
            <el-option
              v-for="item in proTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="cateCode" v-if="form.proType == 1" label="成品分类">
          <goods-cate-cascader
            v-model="form.cateCode"
            :props="{
                  expandTrigger: 'hover',
                  value: 'code',
                  label: 'name',
                  multiple: false
                }"
            :collapseTags="true"
            :cateLevel="2"
          ></goods-cate-cascader>
        </el-form-item>
        <el-form-item prop="cateCode" v-if="form.proType == 2" label="配件分类">
          <parts-cate-cascader
            :style="inputStyle"
            v-model="form.cateCode"
            :props="{
                  expandTrigger: 'hover',
                  value: 'code',
                  label: 'name',
                  multiple: false
                }"
            :collapseTags="true"
          ></parts-cate-cascader>
        </el-form-item>
        <el-form-item label="推荐等级" prop="level">
          <el-select clearable v-model="form.level" :style="inputStyle">
            <el-option
              v-for="item in recommendLevel"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生产类型" prop="supType">
          <el-select clearable v-model="form.supType" :style="inputStyle">
            <el-option
              v-for="item in supType.properties"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品规格" prop="materialSpecs">
          <el-input v-model="form.materialSpecs" :style="inputStyle" />
        </el-form-item>
        <el-form-item label="带包装的商品尺寸，长mm" prop="length">
          <el-input v-model="form.length" :style="inputStyle" />
        </el-form-item>
        <el-form-item label="带包装的商品尺寸，宽mm" prop="weight">
          <el-input v-model="form.weight" :style="inputStyle" />
        </el-form-item>
        <el-form-item label="带包装的商品尺寸，高mm" prop="height">
          <el-input v-model="form.height" :style="inputStyle" />
        </el-form-item>
        <!--<el-form-item label="商品主图" prop="titleImage">
          <div :style="inputStyle">
            <file-list
              v-model="form.titleImage"
              :addible="!form.titleImage || form.titleImage.length < 1"
            ></file-list>
          </div>
        </el-form-item>-->
        <!--<el-form-item label="商品附图" prop="attaImages">
          <div :style="inputStyle">
            <file-list v-model="form.attaImages"></file-list>
          </div>
        </el-form-item>-->
        <el-form-item label="品牌名" prop="brandName" v-if="form.supType === 1">
          <el-input v-model="form.brandName" :style="inputStyle" />
        </el-form-item>
        <el-form-item label="商品采购价" prop="price">
          <el-input-number v-model.number="form.price" :min="0" :style="inputStyle" />
        </el-form-item>
        <el-form-item label="是否含税" prop="isTax">
          <el-select clearable v-model="form.isTax" :style="inputStyle">
            <el-option
              v-for="item in tax"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!--
        <el-form-item label="单价" prop="taxFreePrice">
          <el-input-number v-model.number="form.taxFreePrice" :min="0" :style="inputStyle" />
        </el-form-item>
        -->
        <el-form-item label="商品建议零售价" prop="msrp">
          <el-input-number v-model.number="form.msrp" :min="0" :style="inputStyle" />
        </el-form-item>
        <el-form-item label="保质期" prop="shelfLife">
          <el-input v-model="form.shelfLife" :style="inputStyle" />
        </el-form-item>
        <el-form-item label="起订量" prop="moq">
          <el-input v-model="form.moq" :style="inputStyle" />
        </el-form-item>
        <el-form-item label="正常货期" prop="deliveryCycle">
          <el-input v-model="form.deliveryCycle" :style="inputStyle" />
        </el-form-item>
        <el-form-item label="商品材质" prop="materialQuality" v-if="form.supType === 2">
          <el-input v-model="form.materialQuality" :style="inputStyle" />
        </el-form-item>
        <el-form-item label="包装方式" prop="packingMethod" v-if="form.supType === 2">
          <el-input v-model="form.packingMethod" :style="inputStyle" />
        </el-form-item>
        <el-form-item label="已做渠道" prop="salesChannels" v-if="form.supType === 1">
          <el-input v-model="form.salesChannels" :style="inputStyle" />
        </el-form-item>
        <el-form-item label="是否可定制" prop="isSupportOdm" v-if="form.supType === 2">
          <el-select clearable v-model="form.isSupportOdm" :style="inputStyle">
            <el-option
              v-for="item in simpleStatus.properties"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="打样费" prop="proofingPrice" v-if="form.supType === 2">
          <el-input-number v-model.number="form.proofingPrice" :min="0" :style="inputStyle" />
        </el-form-item>
        <el-form-item label="打样时长" prop="proofingCycle" v-if="form.supType === 2">
          <el-input v-model="form.proofingCycle" :style="inputStyle" />
        </el-form-item>
        <el-form-item label="商品核心介绍/功能介绍" prop="productDescribe">
          <el-input type="textarea" v-model="form.productDescribe" :rows="5" :style="inputStyle" />
        </el-form-item>
        <el-form-item label="创建时间" prop="createDate">
          <el-date-picker
            :style="inputStyle"
            v-model="form.createDate"
            type="date"
            placeholder="选择日期"
            disabled
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="修改时间" prop="modifyDate">
          <el-date-picker
            :style="inputStyle"
            v-model="form.modifyDate"
            type="date"
            placeholder="选择日期"
            disabled
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="algin-center" v-if="dialogType !== 'look'">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRecommend">保 存</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="dialogOnBatch"
      width="30%"
    >
      <span>确定要进行提交操作？提交后将新增{{cacheData.length}}条商品信息，请一定仔细检查数据是否有误</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogOnBatch = false">取 消</el-button>
        <el-button type="primary" @click="onImportSpus" :loading="loading" > {{ loading ? '上传中' : '开始导入' }}</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="导入结果"
      :visible.sync="dialogResult"
      width="30%"
    >
      <span>已批量更新{{importResult.updateNum}}条商品信息，新增{{importResult.addNum}}条商品信息提交失败{{importResult.faultNum}}条商品信息，请检查后重新提交</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogResult = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAllSup,
  batchUpdateRecommendProduct,
  saveRecommend,
  updateRecommend,
} from "@/api/supplier/recommend";
import { getSupTypes } from "@/api/supplier";
import { supType, proType, simpleStatus } from "@/const/supplier/recommend";
import GoodsCateCascader from "@/components/GoodsCateCascader";
import PartsCateCascader from "_c/PartsCateCascader";
import FileList from "@/components/FileList";
import FileSaver from 'file-saver'
export default {
  name: "RecommendProductList",
  components: { GoodsCateCascader, PartsCateCascader, FileList },
  data() {
    return {
      dialogOnBatch:false,
      selectionList: [], // 选中的行数据
      batchDeleteLoading:false,
      importResult:{},
      dialogWarn:false,
      dialogResult:false,
      loading:false,
      searchQuery: {
        pageIndex: 1,
        pageSize: 10,
        orderStr: "id desc",
        total: 0 // 总条数
      },
      cacheData: [],
      supplier:{},
      customerLoading:true,
      supList:[],
      labelWidth: "200px",
      inputStyle: { width: "200px" },
      proTypes: [],
      supType,
      simpleStatus,
      proType,
      testName:'',
      tableData: [],
      tableLoading: false,
      form: {},
      formRules:  {
        name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
        cateCode: [
          { required: true, message: "请选择商品分类", trigger: "blur" }
        ],
        cateName: [
          { required: true, message: "请输入商品分类名称", trigger: "blur" }
        ],
        brandName: [
          { required: true, message: "请输入品牌名", trigger: "blur" }
        ],
        materialQuality: [
          { required: true, message: "请输入商品材质", trigger: "blur" }
        ],
        packingMethod: [
          { required: true, message: "请输入打包方式", trigger: "blur" }
        ],
        salesChannels: [
          { required: true, message: "请输入已做渠道", trigger: "blur" }
        ],
        isSupportOdm: [
          { required: true, message: "请选择是否可定制", trigger: "blur" }
        ],
        proofingPrice: [
          { required: true, message: "请输入打样费", trigger: "blur" }
        ],
        proofingCycle: [
          { required: true, message: "请输入打样时长", trigger: "blur" }
        ],
        titleImage: [
          { required: true, message: "请上传商品主图", trigger: "blur" }
        ],
        price: [
          { required: true, message: "请输入采购价（成本价）", trigger: "blur" }
        ],
        proType: [
          { required: true, message: "请选择商品类型", trigger: "blur" }
        ],
        supType: [
          { required: true, message: "请选择生产类型", trigger: "blur" }
        ],
      },
      formLoading: false,
      dialogVisible: false,
      dialogType: true,
      recommendLevel: [
        {label:'非常推荐', value: '非常推荐'},
        {label:'一般推荐', value: '一般推荐'},
      ],
      tax: [
        {label:'是', value: true},
        {label:'否', value: false},
      ]
    };
  },
  computed: {
    selectionIds() {
      const ids = this.selectionList.map(item => item.sid)
      return ids
    },
    dialogTitle() {
      switch (this.dialogType) {
        case "add":
          return "新增推荐商品";
        case "edit":
          return "编辑推荐商品";
        case "look":
          return "推荐商品详情";
      }
    }
  },
  methods: {
    handleSelectionChange(selection) {
      this.selectionList = selection
    },
    // 批量删除
    onBatchDelete() {
      if (!this.selectionIds.length) {
        this.$message.warning('未选中数据！')
        return
      }
      // 弹窗确认
      this.$confirm('确定移除吗？', {
        type: 'warning'
      }).then(() => {
        console.log(this.selectionIds)
        this.removeSpuBySid(this.selectionIds)
      }).catch(() => {
      })
    },
    onImportSpus() {
      this.cacheData = JSON.parse(localStorage.getItem('importSpuData'))
      console.log("数据",this.cacheData)
      const data = []
      for ( var i in this.cacheData) {
        data.push(this.cacheData[i])
      }
      this.loading = true
      batchUpdateRecommendProduct(data).then(
        res => {
          this.importResult = res
          this.$message.success('操作成功')

          console.log('页面数据')
          console.log(res)
          const data = {}
          for (const i in res.list) {
            data[res.list[i].sid] = res.list[i]
          }
          localStorage.setItem('importSpuData', JSON.stringify(data))
          this.tableData = res.list
          this.fetchSpuList()
        }).catch(
        () => {
          this.$message.error('失败')
        }).finally(() => {
        this.loading = false
        this.dialogOnBatch = false
        this.dialogResult = true
      })


    },
    async fetchSpuList() {
      try {
        this.$store.commit('SHOW_LOADING')
        // console.log(JSON.parse(localStorage.getItem("importSpuData")))
        //console.log("获取的缓存数据",JSON.parse(localStorage.getItem('importSpuData')))
        if(localStorage.getItem('importSpuData')){
          this.tableData = JSON.parse(localStorage.getItem('importSpuData'))
          this.tableData = Object.keys(this.tableData).filter(item => this.tableData[item]).map(item => {
            const obj = this.tableData[item]
            return obj
          })
        }
      } catch (error) {
        console.log('catch', error)
      } finally {
        this.$store.commit('SHOW_LOADING', false)
      }
    },
    getCacheData(){
      this.cacheData = JSON.parse(localStorage.getItem('importSpuData'))
      const data = []
      for ( var i in this.cacheData) {
        data.push(this.cacheData[i])
      }
      this.cacheData = data;
      console.log("数据",this.cacheData)
    },
    importRecommendProduct() {
      const view = this.$instantCompt(require('../import-spu/index.vue').default)
      view.show()
      // 监听导入成功事件
      this.$bus.on('importSpuSuccess', (res) => {
        // 导入成功后刷新列表
        console.log("后台拿到的数据",res)
        this.tableData = res
        const data = {}
        for (const i in res) {
          data[res[i].sid] = res[i]
        }
        localStorage.setItem('importSpuData', JSON.stringify(data))
        this.fetchSpuList()
        // 隐藏弹窗
        view.hide()
      })
    },
    fetchProTypes(){
      return getSupTypes().then(res => {
        this.proTypes = res.map(item => {
          return { label: item.text, value: item.code }
        })
      })
    },
    // 加载表格数据
    fetchTableData() {
      this.findAllSup()
      this.fetchSpuList();
    },
    del(row, index) {
      // 弹窗确认
      this.$confirm('确定移除吗？', {
        type: 'warning'
      }).then(() => {
        this.removeSpuBySid([row.sid])
      }).catch(() => {
      })
    },
    removeSpuBySid(sids) {
      var _arr = JSON.parse(localStorage.getItem('importSpuData'))
      for (const item in sids) {
        const delId = sids[item]
        console.log("delId",delId)
        console.info('移除', delId)
        delete _arr[delId]
      }
      console.info('_arr', _arr)
      localStorage.setItem('importSpuData', JSON.stringify(_arr))
      this.$message.success('操作成功')
      this.fetchSpuList()
    },
    add() {
      this.dialogType = "add";
      this.form = {};
      this.showDialog();
    },
    async edit(id) {
      this.dialogType = "edit";
      await this.fetchDetails(id);
      this.showDialog();
    },
    async lookDetails(id) {
      this.dialogType = "look";
      await this.fetchDetails(id);
      this.showDialog();
    },
    fetchDetails(id) {
      /*return getById(id + "").then(res => {
        if (res.titleImage) {
          let arr = res.titleImage.split(".");
          let fileType = arr[arr.length - 1];
          res.titleImage = [
            { attaUrl: res.titleImage, fileName: "", fileType }
          ];
        } else {
          res.titleImage = [];
        }
        this.form = res;
        this.form.supId+=""
        console.log("编辑拿到的数据",this.form)
      });*/
      this.form = id
    },
    showDialog() {
      this.dialogVisible = true;
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    saveRecommend() {
      this.$refs.form.validate(valid => {
        if (!valid) return;
        this.formLoading = true;
        let http;
        if (!this.form.id) {
          http = saveRecommend;
        } else {
          http = updateRecommend;
        }
        let params = this.$lodash.cloneDeep(this.form);
        console.log("供应商数据",params)
        let sid = this.form.sid
        http(params)
          .then(res => {
            this.$message.success("保存成功");
            //修改缓存数据
            var _arr = JSON.parse(localStorage.getItem("importSpuData"))
            _arr[sid] = this.form
            localStorage.setItem("importSpuData",JSON.stringify(_arr))
          })
          .finally(() => {
            this.formLoading = false;
            this.closeDialog();
            this.fetchTableData();
          });
      });
    },
    resetForm() {
      this.$refs.form.resetFields();
    },
    findAllSup(){
      console.log("接口前")
      getAllSup().then(
        res =>{
          res.forEach(i=>{
              i.id = i.id+""
          })
          this.supList = res
          this.customerLoading = false
        }
      )
      console.log("接口后")
    },
    getProTypeName(type){
      for(let index in this.proTypes){
        if(type == this.proTypes[index].value){
          return this.proTypes[index].label
        }
      }
      return ''
    }
  },
  watch: {},
  async created() {
    await this.fetchProTypes();
    this.fetchTableData(); // 加载表格数据
    this.getCacheData();//获取缓存数据

  },
  mounted() {}
};
</script>

<style lang='scss' scoped>
</style>
<style lang="scss">
</style>
