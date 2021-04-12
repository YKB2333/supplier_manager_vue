<template>
  <div class="userlist-page">
    <!-- 表单 -->
    <my-table v-model="searchQuery" :searchForm="searchForm" @change="onChange">
      <el-table
        :data="tableData"
        border
        stripe
        v-loading="tableLoading"
        element-loading-text="拼命加载中"
      >
        <el-table-column label="供应商ID" prop="supId" width="160"></el-table-column>
        <el-table-column label="供应商名称" prop="supInfo.name" width="160"></el-table-column>
        <el-table-column label="主图" prop="titleImage" fixed="left" width="125">
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.titleImage"
              :preview-src-list="[scope.row.titleImage]"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" prop="name" fixed="left" width="160"></el-table-column>
        <el-table-column label="物料状态" prop="isOnSale" fixed="left" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isOnSale" type="success">正常</el-tag>
            <el-tag v-else type="info">异常</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="分类名称" prop="cateName" width="120"></el-table-column>
        <el-table-column label="品牌名称" prop="brandName" width="160"></el-table-column>
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
        <el-table-column label="创建时间" width="90" prop="createDate">
          <template slot-scope="scope">{{scope.row.createDate | formatDate('Y-M-D h:m:s')}}</template>
        </el-table-column>
        <el-table-column label="内部联系人" width="90" prop="oaUser">
          <template slot-scope="scope">{{ scope.row.oaUser && scope.row.oaUser.lastname}}</template>
        </el-table-column>
        <el-table-column label="创建人" width="90" prop="creatorName">
          <template slot-scope="scope">
            {{  scope.row.creatorName ||  (scope.row.supInfo  && scope.row.supInfo.name)}}
          </template>
        </el-table-column>
        <!-- innerPersonInfo -->
        <el-table-column label="操作" width="60" fixed="right">
          <template slot-scope="scope">
            <el-button v-permission-button="'approve'" type="text" @click="edit(scope.row)">审批</el-button>
          </template>
        </el-table-column>
      </el-table>
    </my-table>
    <!-- 编辑 - 查看详情 -->
    <el-dialog
      :title="dialogTitle"
      v-loading="formLoading"
      @close="resetForm"
      :visible.sync="dialogVisible"
      fullscreen
      center
      >
      <el-alert v-if="approveLog" title="推荐物料信息审批中" :closable="false" type="warning"></el-alert>
      <el-alert v-else-if="isDraft" title="推荐物料信息待审批生效" :closable="false" type="warning"></el-alert>
      <el-form
        :model="form"
        ref="form"
        :rules="formRules"
        inline
        :label-width="labelWidth"
        size="small"
        :disabled="true"
      >
        <div class="row space-between wrap max-width pt20">
          <el-form-item label="供应商" prop="supId" >
            <el-select
              v-model="form.supId"
              filterable
              placeholder="请选择供应商"
              :loading="customerLoading"
              :style="inputStyle"
            >
              <el-option
                v-for="item in supList"
                :key="item.value"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品名称" prop="name">
            <el-input v-model="form.name" :style="inputStyle" />
            <!-- <el-input v-model="form.name" :style="inputStyle" class="formItemDisabled" disabled /> -->
          </el-form-item>
          <el-form-item label="生产类型" prop="supType">
            <el-select v-model="form.supType" :style="inputStyle">
              <el-option
                v-for="item in supType.properties"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <!--
            <el-select v-model="form.supType" :style="inputStyle" class="formItemDisabled" disabled>
              <el-option
                v-for="item in supType.properties"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            -->
          </el-form-item>
          <el-form-item label="内部联系人" prop="name">
            <el-input v-model="form.innerPerson" :style="inputStyle" />
          </el-form-item>
          <div style="width:100%" class="row space-between">
            <el-form-item label="商品类型" prop="proType">
              <div class="row">
                <el-select v-model="form.proType" :style="inputStyle">
                  <el-option
                    v-for="item in proTypes"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </el-form-item>
            <el-form-item prop="cateCode" v-if="form.proType == 1" label="成品分类">
              <goods-cate-cascader
                v-model="form.cateCode"
                :props="{
                      expandTrigger: 'hover',
                      value: 'code',
                      label: 'name',
                      multiple: false,
                      checkStrictly:true
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
                      multiple: false,
                      checkStrictly:true
                    }"
                :collapseTags="true"
              ></parts-cate-cascader>
            </el-form-item>
          </div>
          <el-form-item label="品牌名" prop="brandName" v-if="form.supType === 1">
            <el-input v-model="form.brandName" :style="inputStyle" />
          </el-form-item>
          <el-form-item label="已做渠道" prop="salesChannels" v-if="form.supType === 1">
            <el-input v-model="form.salesChannels" :style="inputStyle" />
          </el-form-item>
          <el-form-item label="商品材质" prop="materialQuality" v-if="form.supType === 2">
            <el-input v-model="form.materialQuality" :style="inputStyle" />
          </el-form-item>
          <el-form-item label="包装方式" prop="packingMethod" v-if="form.supType === 2">
            <el-input v-model="form.packingMethod" :style="inputStyle" />
          </el-form-item>
          <el-form-item label="是否可定制" prop="isSupportOdm" v-if="form.supType === 2">
            <el-select v-model="form.isSupportOdm" :style="inputStyle">
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
          <el-form-item
            label="打样时长"
            prop="proofingCycle"
            v-if="form.supType === 2"
            style="width:100%"
          >
            <el-input v-model="form.proofingCycle" :style="inputStyle" />
          </el-form-item>

          <el-form-item label="保质期" prop="shelfLife">
            <el-input>
            <el-select v-model="isShelfLife" style="width:90px">
              <el-option
                v-for="item in tax"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-input-number
              v-model="form.shelfLife"
              :step="30"
              size="medium"
              :step-strictly="true"
              controls-position="right"
              :style="inputStyle"
            >
            </el-input-number>
              <template slot="append">天</template>
            </el-input>
          </el-form-item>
          <el-form-item label="正常货期" prop="deliveryCycle">
            <el-input v-model="form.deliveryCycle" :style="inputStyle" type="number">
              <template slot="append">天</template>
            </el-input>
          </el-form-item>
          <el-form-item label="商品核心介绍/功能介绍" prop="productDescribe">
            <el-input type="textarea" v-model="form.productDescribe" :rows="5" :style="inputStyle" />
          </el-form-item>
          <el-form-item label="商品介绍视频">
            <div :style="inputStyle">
              <file-list
                v-model="form.videos"
                :addible="!form.videos || form.videos.length < 1"
                :accept="'video/*'"
              >
                <template v-if="!form.videos || form.videos.length < 1">
                  <el-button icon="el-icon-plus">上传视频</el-button>
                </template>
              </file-list>
            </div>
            <p>只能上传视频文件,且不超过100M</p>
          </el-form-item>
          <el-form-item label="商品主图" prop="titleImage">
            <div :style="inputStyle">
              <file-list
                v-model="form.titleImage"
                :addible="!form.titleImage || form.titleImage.length < 1"
              ></file-list>
            </div>
          </el-form-item>
          <el-form-item label="商品附图" prop="attaImages">
            <div :style="inputStyle">
              <file-list v-model="form.attaImages"></file-list>
            </div>
          </el-form-item>
          <el-form-item label="主属性" prop="firstAtbKey">
            <el-input v-model="form.firstAtbKey" :style="inputStyle" />
            <div style="font-size:12px;color:#7a7575">例：规格、型号、颜色、尺码...</div>
          </el-form-item>
          <el-form-item label="副属性">
            <el-input v-model="form.secondAtbKey" :style="inputStyle" />
          </el-form-item>
          <el-form-item  label="零售单位" prop="retailUnit" :rules="{required: form.proType == 1 ?true:false, message: '零售单位不能为空', trigger: 'blur'}">
            <el-select v-model="form.retailUnit" clearable filterable placeholder="请选择">
              <el-option
                v-for="item in danweis"
                :key="item.code"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- sku -->
          <div
            class="row space-between wrap ptb5 mb5"
            style="width:100%;"
            v-for="(sku,index) in form.skus"
            :key="index"
          >
            <!-- sku参数 -->
            <div
              class="row space-between wrap ptb40 mt10"
              style="border:1px solid rgb(228, 228, 228);width:100%;border-radius:5px;background: #f9f9f9;"
            >
              <el-form-item v-if="form.firstAtbKey" :label="form.firstAtbKey" :prop="'skus.' + index + '.firstAtbValue'" :rules="{
                required: true, message: '不能为空', trigger: 'blur'
              }">
                <el-input v-model="sku.firstAtbValue" :style="inputStyle" />
              </el-form-item>
              <el-form-item v-if="form.secondAtbKey" :label="form.secondAtbKey" :prop="'skus.' + index + '.secondAtbValue'" :rules="{
                required: true, message: '不能为空', trigger: 'blur'
              }">
                <el-input v-model="sku.secondAtbValue" :style="inputStyle" />
              </el-form-item>
              <el-form-item label="商品条码"  :prop="'skus.' + index + '.codeBar'" :rules="{
                required: form.proType == 1 ?true:false, message: '商品条码不能为空', trigger: 'blur'
              }">
                <el-input v-model="sku.codeBar" :style="inputStyle" />
              </el-form-item>
               <el-form-item label="供应商规格编码"  :prop="'skus.' + index + '.supplierGoodsCode'" :rules="{
                required: true, message: '供应商规格编码不能为空', trigger: 'blur'
              }">
                <el-input v-model="sku.supplierGoodsCode" :style="inputStyle" />
              </el-form-item>
              <el-form-item label="箱规">
                <el-input v-model="sku.wholesaleSpec" :style="inputStyle" />
              </el-form-item>
              <el-form-item label="起订量">
                <el-input v-model="sku.wholesaleMinOrder" :style="inputStyle">
                  <template slot="append">PCS</template>
                </el-input>
              </el-form-item>
              <el-form-item label="裸品尺寸" :prop="'skus.' + index + '.lpcc'" class="InputSize">

                <div class="row flex-1">
                  <el-form-item :prop="'skus.' + index + '.skuLength'" style="margin-right:0;" >
                    <el-input v-model="sku.skuLength" placeholder="长">
                      <template slot="append">mm</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item :prop="'skus.' + index + '.skuWeight'" style="margin-right:0;" >
                    <el-input v-model="sku.skuWeight" placeholder="宽">
                      <template slot="append">mm</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item :prop="'skus.' + index + '.skuHeight'" >
                    <el-input v-model="sku.skuHeight" placeholder="高">
                      <template slot="append">mm</template>
                    </el-input>
                  </el-form-item>
                </div>
              </el-form-item>

              <el-form-item :label="form.proType == 1 ? '单品包装尺寸' : '带包装尺寸'" :prop="'skus.' + index + '.bzcc'" class="InputSize" :rules="{
                required: true, message: '不能为空', trigger: 'blur'
              }">
                <div class="row flex-1">
                  <el-form-item :prop="'skus.' + index + '.longCartonSize'" style="margin-right:0;" :rules="{
                    required: true, message: '不能为空', trigger: 'blur'
                  }">
                    <el-input v-model="sku.longCartonSize" placeholder="长" @input="calculateVolume(index)">
                      <template slot="append">mm</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item :prop="'skus.' + index + '.widthCartonSize'" style="margin-right:0;" :rules="{
                    required: true, message: '不能为空', trigger: 'blur'
                  }">
                    <el-input v-model="sku.widthCartonSize" placeholder="宽" @input="calculateVolume(index)">
                      <template slot="append">mm</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item :prop="'skus.' + index + '.highCartonSize'" :rules="{
                    required: true, message: '不能为空', trigger: 'blur'
                  }">
                    <el-input v-model="sku.highCartonSize" placeholder="高" @input="calculateVolume(index)">
                      <template slot="append">mm</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-input
                      v-model="sku.unitVolume"
                      :min="0"
                      onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
                      placeholder="体积(立方米)"
                      size="mini"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-form-item>

              <el-form-item label="装箱尺寸" :prop="'skus.' + index + '.zxcc'" class="InputSize" >
                <div  class="row flex-1">
                  <el-form-item :prop="'skus.' + index + '.boxLength'" style="margin-right:0;" >
                    <el-input v-model="sku.boxLength" placeholder="长" @input="calculateCartonVolume(index)">
                      <template slot="append">mm</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item :prop="'skus.' + index + '.boxWeight'" style="margin-right:0;" >
                    <el-input v-model="sku.boxWeight" placeholder="宽" @input="calculateCartonVolume(index)">
                      <template slot="append">mm</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item :prop="'skus.' + index + '.boxHeight'" >
                    <el-input v-model="sku.boxHeight" placeholder="高" @input="calculateCartonVolume(index)">
                      <template slot="append">mm</template>
                    </el-input>
                  </el-form-item>
                </div>
              </el-form-item>
              <el-form-item label="单品重量">
                <el-input v-model="sku.singleWeight" :style="inputStyle">
                  <template slot="append">g</template>
                </el-input>
              </el-form-item>
              <el-form-item label="外箱重量">
                <el-input v-model="sku.caseWeight" :style="inputStyle">
                  <template slot="append">g</template>
                </el-input>
              </el-form-item>



              <el-form-item label="商品供货价" :prop="'skus.' + index + '.price'" :rules="{
                required: true, message: '不能为空', trigger: 'blur'
              }">
                <el-input v-model="sku.price" :style="inputStyle">
                  <el-select v-model="sku.isFreight" style="width:100px;" slot="append" placeholder="请选择">
                    <el-option label="含运费" :value="true"></el-option>
                    <el-option label="不含运费" :value="false"></el-option>
                  </el-select>
                </el-input>
              </el-form-item>
              <el-form-item label="是否含税" :prop="'skus.' + index + '.isTax'" :rules="{
                required: true, message: '不能为空', trigger: 'blur'
              }">
                <el-select v-model="sku.isTax" style="width:90px">
                  <el-option
                    v-for="item in tax"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <el-form-item v-if="sku.isTax" :prop="'skus.' + index + '.taxRate'" :rules="{
                  required: true, message: '不能为空', trigger: 'blur'
                }">
                  <el-input v-model="sku.taxRate" :style="inputStyle">
                    <template slot="append">%</template>
                  </el-input>
                </el-form-item>
              </el-form-item>
              <el-form-item v-if="form.proType == 1" label="商品建议零售价" :prop="'skus.' + index + '.msrp'" :rules="{
                required: true, message: '不能为空', trigger: 'blur'
              }">
                <el-input v-model="sku.msrp" :style="inputStyle" />
              </el-form-item>
              <el-form-item label="工艺描述">
                <el-input v-model="sku.processDesc" :style="inputStyle">
                </el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="sku.remark" :style="inputStyle">
                </el-input>
              </el-form-item>
            </div>
          </div>
        </div>

      </el-form>
      <el-form
        :model="approveForm"
        ref="approveForm"
        :rules="approveFormRules"
        inline
        :label-width="labelWidth"
        size="small"
      >
        <div class="row space-between wrap max-width pt20">
          <div
            class=" wrap ptb20 mt10 mb16"
            style="width:100%;border-radius:5px;background: #f9f9f9;"
          > 
              <el-form-item label="内部联系人" prop="mobile">
                <inner-person-select ref="innerPersonSelect" value-prop="mobile" v-model="approveForm.mobile" :disabled="!!form.mobile" ></inner-person-select>
              </el-form-item>
              <el-form-item label="" prop="isSaveInnerPerson">
                <el-checkbox v-model="approveForm.isSaveInnerPerson" :disabled="!!form.mobile">保存为该供应商内部联系人</el-checkbox>
              </el-form-item>
          </div>
          <el-form-item label="审批原因" prop="reason">
            <el-input type="textarea" v-model="approveForm.reason" :rows="5" :style="inputStyle" />
          </el-form-item>
          <el-form-item label="商品质量等级" prop="goodsQuality">
            <el-select v-model="approveForm.goodsQuality" >
              <el-option label="高" value="3" />
              <el-option label="中" value="2" />
              <el-option label="低" value="1" />
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="algin-center">
        <el-button type="success" @click="pass">通过</el-button>
        <el-button type="warning" @click="noPass">不通过</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getById,
  getAllSup,
  sendApprove,
  saveRecommend,
  updateRecommend,
  delById,
  exportInfo,
  importRecommendProduct,
  sale,
  outSale,
  reset,
  getModifyByUser,
} from "@/api/supplier/recommend";
import {
  selectPage,
  enable,
  disable,
} from "@/api/supplier/recommendApprove";
import { getSupTypes,danweiList } from "@/api/supplier";
import { getSupInfoById } from "@/api/supplier/index";
import { supType, proType, simpleStatus } from "@/const/supplier/recommend";
import GoodsCateCascader from "@/components/GoodsCateCascader";
import PartsCateCascader from "_c/PartsCateCascader";
import FileList from "@/components/FileList";
import FileSaver from "file-saver";
import { translateDataToTree, formatDate } from "@/utils";
import InnerPersonSelect from '../../../components/InnerPersonSelect.vue';
export default {
  name: "SupplierRecommendCheck",
  components: { GoodsCateCascader, PartsCateCascader, FileList, InnerPersonSelect },
  data() {
    return {
      supplier: {},
      customerLoading: true,
      supList: [],
      labelWidth: "200px",
      inputStyle: { width: "200px" },
      proTypes: [],
      supType,
      simpleStatus,
      proType,
      searchForm: [
        {
          key: "supplierNameCn",
          label: "供应商名称",
          placeholder: "请输入供应商名称",
          type: "input"
        },
        /* {
          key: "supId",
          label: "供应商ID",
          placeholder: "请输入供应商ID",
          type: "input"
        },*/
        {
          key: "cateName",
          label: "商品分类",
          placeholder: "请输入商品分类名称",
          type: "input"
        },
        {
          key: "name",
          label: "商品名称",
          placeholder: "请输入商品名称",
          type: "input"
        },
        {
          key: "supType",
          label: "生产类型",
          placeholder: "请选择生产类型",
          clearable: true,
          type: "select",
          options: supType.properties
        },
        {
          key: "proType",
          label: "商品类型",
          placeholder: "请选择商品类型",
          clearable: true,
          type: "select",
          options: proType.properties
        },
        {
          key: "isSupportOdm",
          label: "是否支持定制",
          placeholder: "请选择是否支持定制",
          clearable: true,
          type: "select",
          options: simpleStatus.properties
        },
        {
          key: "isOnSale",
          label: "物料状态",
          placeholder: "请选择物料状态",
          clearable: true,
          type: "select",
          options: [
            { label: "正常", value: true },
            { label: "异常", value: false },
          ]
        },
      ],
      searchQuery: {
        supId: "",
        cateCode: "",
        name: "",
        supType: "",
        proType: "",
        isSupportOdm: "",
        supplierNameCn: "",
        pageIndex: 1,
        pageSize: 10,
        orderStr: "id desc",
        total: 0 // 总条数
      },
      testName: "",
      tableData: [],
      tableLoading: false,
      form: {
        mobile: '',
        skus: [
          {
            lpcc: false,
            zxcc: false,
            bzcc: false,
            isTax: false,
            isFreight: false,
          }
        ]
      },
      formRules: {
        supId: [{ required: true, message: "请选择供应商", trigger: "change" }],
        name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入商品条码", trigger: "blur" }],
        // shelfLife: [
        //   { required: true, message: "请输入保质期（天）", trigger: "blur" }
        // ],
        shelfLife: [
          { required: true,
          validator: (rule, value, callback) => {
            setTimeout(() => {
              if(!this.isShelfLife){
                callback()
              } else if (value < 1 || !value) {
                return callback(new Error('请输入保质期（天）'));
              }else{
                callback()
              }
            }, 100)
          }, trigger: 'blur' }
        ],
        deliveryCycle: [
          { required: false, message: "请输入正常货期（天）", trigger: "blur" }
        ],
        productDescribe: [
          {
            required: true,
            message: "请输入商品核心介绍/功能介绍",
            trigger: "blur"
          }
        ],
        firstAtbKey: [
          { required: true, message: "请输入主属性", trigger: "blur" }
        ],
        firstAtbValue: [
          { required: true, message: "请输入主属性值", trigger: "blur" }
        ],
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
          { required: false, message: "请输入商品材质", trigger: "blur" }
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
          { required: true, message: "请选择商品类型", trigger: "change" }
        ],
        supType: [
          { required: true, message: "请选择生产类型", trigger: "change" }
        ],
        taxRate: [{ required: true, message: "请填写税率", trigger: "blur" }],
      },
      formLoading: false,
      dialogVisible: false,
      dialogType: true,
      recommendLevel: [
        { label: "非常推荐", value: "非常推荐" },
        { label: "一般推荐", value: "一般推荐" }
      ],
      tax: [
        { label: "是", value: true },
        { label: "否", value: false }
      ],
      //裸品尺寸
      skuSize: {
        label: "是",
        value: true
      },
      //装箱尺寸
      // skuSize: {
      //   label: "是",
      //   value: true
      // },
      // //带包装尺寸
      // skuSize: {
      //   label: "是",
      //   value: true
      // },
      isHave: [
        { label: "有", value: true },
        { label: "无", value: false }
      ],
      isDraft: false,
      approveLog: null,
      approveForm: {
        id: 0,
        reason: '',
        goodsQuality:'',
        mobile: ''
      },
      approveFormRules: {
        mobile: [{required: true, message:'请选择内部联系人', trigger: 'blur'}],
        reason: [{ required: true, message: "请填写审批原因", trigger: "blur" }],
      },
      isShelfLife:true,
      danweis:[],

    };
  },
  computed: {
    dialogTitle() {
      return "审批推荐商品";
    }
  },
  methods: {
    getDanweiList(){
      danweiList().then(res => {
        console.log(res,'列表');
        this.danweis = res;
      });
    },
    calculateVolume(index) {
      let item = this.form.skus[index];
      let tskuLength = item.longCartonSize / 1000;
      let tskuWeight = item.widthCartonSize / 1000;
      let tskuHeight = item.highCartonSize / 1000;
      item.unitVolume = this.accMul(
        this.accMul(tskuLength, tskuWeight),
        tskuHeight
      );
    },
    onChange() {
      this.fetchTableData();
    },
    fetchProTypes() {
      return getSupTypes().then(res => {
        this.proTypes = res.map(item => {
          return { label: item.text, value: item.code };
        });
      });
    },
    // 加载表格数据
    fetchTableData() {
      // this.findAllSup();
      this.tableLoading = true;
      selectPage(this.searchQuery)
        .then(res => {
          console.info(res)
          this.searchQuery.total = Number(Number(res.total)); // 总条数
          this.tableData = res.records;
          // this.tableData.forEach((item, index) => {
          //   console.log(item)
          //   this.testName = getSupInfoById(item.supId).then(
          //     resp=>{
          //       item.id = resp.name
          //     }
          //   )
          // })
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    async edit(row) {
      console.info(row)
      this.dialogType = "edit";
      this.approveLog = row.approveLog
      this.approveForm = {
        id: 0,
        reason: '',
        mobile: ''
      }
      await this.fetchModifyDetails(row.id);
      this.showDialog();
    },
    async lookDetails(id) {
      this.dialogType = "look";
      await this.fetchDetails(id);
      this.showDialog();
    },
    fetchDetails(id) {
      return getById(id).then(res => {
        this.formHandler(res)
      });
    },
    async fetchModifyDetails(productId) {
      let modify = await getModifyByUser({operator: this.approveLog.operator, productId})
      if(!modify) {
        this.isDraft = false
        return this.fetchDetails(productId)
      }else{
        this.formHandler(modify)
        this.isDraft = true
      }
    },
    formHandler(res) {
      // 填充主图
      if (res.titleImage) {
        let arr = res.titleImage.split(".");
        let fileType = arr[arr.length - 1];
        let fileName = res.titleImage.substring(res.titleImage.lastIndexOf('/') + 1)
        res.titleImage = [
          { attaUrl: res.titleImage, fileName, fileType }
        ];
      } else {
        res.titleImage = [];
      }

      if(res.skus && res.skus.length > 0){
        for(let i in res.skus){
          let sku = res.skus[i]
          if(sku.skuLength || sku.skuWeight || sku.skuHeight) { sku.lpcc = true } else { sku.lpcc = false }
          if(sku.boxLength || sku.boxWeight || sku.boxHeight) { sku.zxcc = true } else { sku.zxcc = false }
          if(sku.longCartonSize || sku.widthCartonSize || sku.highCartonSize) { sku.bzcc = true } else { sku.bzcc = false }
        }
      }
      
      res.supId += "";
      res.mobile = res.innerPersonMobile || '';
      this.approveForm.mobile = res.innerPersonMobile || '';
      console.log('formHandler');
      console.log(this.form.mobile);
      console.log(res.mobile);
      console.log(this.approveForm.mobile);
      this.form = res;
    },
    showDialog() {
      this.dialogVisible = true;
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    resetForm() {
      this.$refs.form.resetFields();
    },
    findAllSup() {
      getAllSup().then(res => {
        res.forEach(i => {
          i.id = i.id + "";
          i.supId = i.supId + "";
        });
        this.supList = res;
        this.customerLoading = false;
      });
    },
    getProTypeName(type) {
      for (let index in this.proTypes) {
        if (type == this.proTypes[index].value) {
          return this.proTypes[index].label;
        }
      }
      return "";
    },
    pass() {
      this.$refs.approveForm.validate(valid => {
        if (!valid) return;
        this.$confirm(`确认审批通过吗?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        }).then(async () => {
          this.formLoading = true;
          this.approveForm.id = this.approveLog.id
          enable(this.approveForm).then(() => {
            this.$message({
              type: "success",
              message: "审批完成!"
            });
            this.closeDialog();
            this.fetchTableData();
          }).finally(()=>{
            this.formLoading = false;
          })
        })
      })
    },
    noPass() {
      this.$refs.approveForm.validate(valid => {
        if (!valid) return;
        this.$confirm(`确认审批不通过吗?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        }).then(async () => {
          this.formLoading = true;
          this.approveForm.id = this.approveLog.id
          disable(this.approveForm).then(() => {
            this.$message({
              type: "success",
              message: "审批完成!"
            });
            this.closeDialog();
            this.fetchTableData();
          }).finally(()=>{
            this.formLoading = false;
          })
        })
      })
    },
  },
  watch: {},
  async created() {
    await this.fetchProTypes();
    this.fetchTableData(); // 加载表格数据
    this.getDanweiList();
    this.findAllSup();
  },
  mounted() {}
};
</script>

<style lang='scss' scoped>
.max-width {
  width: 1000px;
  margin: 0 auto;
}
.el-dialog__header {
  border: 1px solid #eeeeee;
}
.positionRight {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(0, -50%);
  border-left: 1px solid #ccc;
  width: 40px;
  text-align: center;
  background: white;
  z-index: 9;
}
.InputSize {
  display: flex;
  /deep/ .el-form-item__content {
    display: flex;
  }
  /deep/ .el-input__inner {
    width: 150px;
  }
}
/*
/deep/ .el-form-item{
  display: inline-flex;
}
/deep/ .el-form-item__content{
  display: flex;
  flex-direction: column;
}
.formItemDisabled{
  /deep/ .el-input__inner{
    color: red;
  }
}
*/
</style>
<style lang="scss">
</style>
