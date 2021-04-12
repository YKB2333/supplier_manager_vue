<template>
  <div class="userlist-page">
    <!-- 表单 -->
    <my-table v-model="searchQuery" :searchForm="searchForm" @change="onChange">
      <div slot="before-table">
        <div class="pb10">
          <el-button v-permission-button="'add'" type="primary" size="small" @click="add">新增推荐商品</el-button>
        </div>
      </div>
      <el-table
        :data="tableData"
        border
        stripe
        v-loading="tableLoading"
        element-loading-text="拼命加载中"
      >
        <el-table-column label="id" prop="id" width="160"></el-table-column>
        <el-table-column label="供应商ID" prop="supId" width="160"></el-table-column>
        <el-table-column label="供应商名称" prop="supInfo.name" width="160"></el-table-column>
        <el-table-column label="主图" prop="titleImage" width="125">
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.titleImage"
              :preview-src-list="[scope.row.titleImage]"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" prop="name" fixed="left" width="160"></el-table-column>
        <el-table-column label="建档状态" prop="checkedStatus" fixed="left" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.checkedStatus == 1" type="warning">审批中</el-tag>
            <el-tag v-else-if="scope.row.checkedStatus == 2" type="success">通过</el-tag>
            <el-tag v-else-if="scope.row.checkedStatus == 3" type="danger">驳回</el-tag>
            <el-tag v-else type="info">初始</el-tag>
          </template>
        </el-table-column>
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
        <el-table-column label="操作" width="160" fixed="right">
          <template slot-scope="scope">
            <el-button
              v-permission-button="'viewDetails'"
              type="text"
              @click="lookDetails(scope.row.id)"
            >查看</el-button>
            <el-button :disabled="scope.row.checkedStatus == 1" v-permission-button="'edit'" type="text" @click="edit(scope.row.id)">编辑</el-button>
            <el-button
              v-permission-button="'approve'"
              :disabled="scope.row.checkedStatus == 1"
              type="text"
              @click="approve(scope.row.id)"
            >提交审批</el-button>
            <!-- <el-button v-permission-button="'delete'" type="text" @click="del(scope.row)">删除</el-button> -->
            <el-button
              v-permission-button="'sale'"
              type="text"
              v-if="!scope.row.isOnSale"
              @click="onSale(scope.row.id)"
            >异常</el-button>
            <el-button
              v-permission-button="'sale'"
              type="text"
              v-if="scope.row.isOnSale"
              @click="onOutSale(scope.row.id)"
            >正常</el-button>
            <el-button
              v-permission-button="'approveLog'"
              type="text"
              @click="onApproveLog(scope.row.id)"
            >审批日志</el-button>
            <el-button
              v-permission-button="'sendNotice'"
              type="text"
              @click="onSendNotice(scope.row)"
            >发送消息</el-button>
            <el-button
              v-permission-button="'noticeList'"
              type="text"
              @click="onNoticeList(scope.row.id)"
            >历史消息</el-button>
            <el-button
              v-if="scope.row.proType == 1 && !scope.row.isCoop"
              v-permission-button="'cooperation'"
              type="text"
              :disabled="scope.row.checkedStatus != 2 "
              @click="onCooperation(scope.row.supId,scope.row.id)"
            >达成合作</el-button>
          </template>
        </el-table-column>
      </el-table>
    </my-table>
    <!-- 编辑 - 查看详情 -->
      <!-- :before-close="resetForm" -->
    <el-dialog
      :title="dialogTitle"
      v-loading="formLoading"
      :visible.sync="dialogVisible"
      @close="resetForm"
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
        :disabled="dialogType == 'look' || dialogType == 'approve'"
      >
        <div class="row space-between wrap max-width pt20">
          <el-form-item label="供应商" prop="supId" >
            <supplier-select v-model="form.supId" @change="onSupChange" ></supplier-select>
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
          <el-form-item label="商品材质" prop="materialQuality"
                        :rules="{
                required: form.supType == 2 ? true:false, message: '商品材质不能为空', trigger: 'blur'
              }">
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

          <el-form-item label="保质期(天)" prop="shelfLife">
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
            >
            </el-input-number>
          </el-form-item>
          <el-form-item label="正常货期" prop="deliveryCycle">
            <el-input v-model="form.deliveryCycle" :style="inputStyle" type="number">
              <template slot="append">天</template>
            </el-input>
          </el-form-item>
          <el-form-item label="商品核心介绍/功能介绍" prop="productDescribe">
            <el-input type="textarea" v-model="form.productDescribe" :rows="5" :style="inputStyle" />
          </el-form-item>
          <el-form-item label="商品介绍视频" prop="videos">
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
              <div style="margin-top:-10px;font-size:12px;color:#7a7575">请上传120K以上的高清图片</div>
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
          <el-form-item label="副属性" prop="secondAtbKey">
            <el-input v-model="form.secondAtbKey" :style="inputStyle" />
          </el-form-item>
          <el-form-item  label="零售单位" prop="retailUnit"
                         :rules="{
                required: form.proType == 1 ?true:false, message: '零售单位不能为空', trigger: 'blur'
              }">
            <el-select v-model="form.retailUnit" clearable filterable placeholder="请选择">
              <el-option
                v-for="item in danweis"
                :key="item.code"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
           <el-form-item label="商品质量等级" prop="goodsQuality" v-if="this.dialogType== 'look'&&this.isShow">
            <el-input v-if="form.goodsQuality == '3'" value="高" :style="inputStyle" />
             <el-input v-if="form.goodsQuality == '2'" value="中" :style="inputStyle" />
              <el-input v-if="form.goodsQuality == '1'" value="低" :style="inputStyle" />
          </el-form-item>

          <div
            class=" wrap ptb20 mt10 mb16"
            style="width:100%;border-radius:5px;background: #f9f9f9;"
          >
            <el-row :gutter="10"  style="width:100%;">
              <el-col :span="12">
                <el-form-item label="内部联系人" prop="mobile">
                  <inner-person-select ref="innerPersonSelect" value-prop="mobile" v-model="form.mobile"></inner-person-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="" prop="isSaveInnerPerson">
                  <el-checkbox v-model="form.isSaveInnerPerson">保存为该供应商内部联系人</el-checkbox>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

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
              <el-form-item
                v-if="form.firstAtbKey"
                :label="form.firstAtbKey"
                :prop="'skus.' + index + '.firstAtbValue'"
                :rules="{
                required: true, message: '不能为空', trigger: 'blur'
              }"
              >
                <el-input v-model="sku.firstAtbValue" :style="inputStyle" />
              </el-form-item>
              <el-form-item
                v-if="form.secondAtbKey"
                :label="form.secondAtbKey"
                :prop="'skus.' + index + '.secondAtbValue'"
                :rules="{
                required: true, message: '不能为空', trigger: 'blur'
              }"
              >
                <el-input  v-model="sku.secondAtbValue"  :style="inputStyle" />
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
              <el-form-item label="箱规" prop="wholesaleSpec">
                <el-input v-model="sku.wholesaleSpec" :style="inputStyle" />
              </el-form-item>
              <el-form-item label="起订量" prop="wholesaleMinOrder">
              <el-input v-model="sku.wholesaleMinOrder" :style="inputStyle">
                <template slot="append">PCS</template>
              </el-input>
            </el-form-item>
              <!--裸品尺寸-->
              <el-form-item label="裸品尺寸" :prop="'skus.' + index + '.lpcc'" class="InputSize" >
                <div class="row flex-1">
                  <el-form-item :prop="'skus.' + index + '.skuLength'" style="margin-right:0;" >
                    <el-input v-model="sku.skuLength" placeholder="长" >
                      <template slot="append">mm</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item :prop="'skus.' + index + '.skuWeight'" style="margin-right:0;" >
                    <el-input v-model="sku.skuWeight" placeholder="宽"  >
                      <template slot="append">mm</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item :prop="'skus.' + index + '.skuHeight'">
                    <el-input v-model="sku.skuHeight" placeholder="高" >
                      <template slot="append">mm</template>
                    </el-input>
                  </el-form-item>
                </div>
              </el-form-item>

              <el-form-item :label="form.proType == 1 ? '单品包装尺寸' : '带包装尺寸'" :prop="'skus.' + index + '.bzcc'" class="InputSize" :rules="{
                required: true, message: '不能为空', trigger: 'blur'
               }">
                <div  class="row flex-1">
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
                  <el-form-item
                    :prop="'skus.' + index + '.highCartonSize'"
                    :rules="{required: true, message: '不能为空', trigger: 'blur'}"
                  >
                    <el-input v-model="sku.highCartonSize" placeholder="高" @input="calculateVolume(index)">
                      <template slot="append">mm</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-input
                      v-model="sku.unitVolume"
                      onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
                      placeholder="体积(立方米)"
                      size="mini"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-form-item>

              <el-form-item label="装箱尺寸" class="InputSize" >
                <div class="row flex-1">
                  <el-form-item :prop="'skus.' + index + '.boxLength'" style="margin-right:0;" >
                    <el-input v-model="sku.boxLength" placeholder="长"   @input="calculateCartonVolume(index)">
                      <template slot="append">mm</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item :prop="'skus.' + index + '.boxWeight'" style="margin-right:0;" >
                    <el-input v-model="sku.boxWeight" placeholder="宽"  @input="calculateCartonVolume(index)">
                      <template slot="append">mm</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item :prop="'skus.' + index + '.boxHeight'" >
                    <el-input v-model="sku.boxHeight" placeholder="高"  @input="calculateCartonVolume(index)">
                      <template slot="append">mm</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-input
                      v-model="sku.cartonVolume"
                      onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
                      placeholder="体积(立方米)"
                      size="mini"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-form-item>
              <el-form-item label="单品重量" prop="singleWeight">
                <el-input v-model="sku.singleWeight" :style="inputStyle">
                <template slot="append">g</template>
                </el-input>
              </el-form-item>
              <el-form-item label="外箱重量" prop="caseWeight">
                <el-input v-model="sku.caseWeight" :style="inputStyle">
                  <template slot="append">g</template>
                </el-input>
              </el-form-item>
              <el-form-item
                label="商品供货价"
                :prop="'skus.' + index + '.price'"
                :rules="{
                required: true, message: '不能为空', trigger: 'blur'
              }"
              >
                <el-input v-model="sku.price" :style="inputStyle">
                  <el-select
                    v-model="sku.isFreight"
                    style="width:100px;"
                    slot="append"
                    placeholder="请选择"
                  >
                    <el-option label="含运费" :value="true"></el-option>
                    <el-option label="不含运费" :value="false"></el-option>
                  </el-select>
                </el-input>
              </el-form-item>
              <el-form-item
                label="是否含税"
                :prop="'skus.' + index + '.isTax'"
                :rules="{
                required: true, message: '不能为空', trigger: 'blur'
              }"
              >
                <el-select v-model="sku.isTax" style="width:90px">
                  <el-option
                    v-for="item in tax"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <el-form-item
                  v-if="sku.isTax"
                  :prop="'skus.' + index + '.taxRate'"
                  :rules="{
                  required: true, message: '不能为空', trigger: 'blur'
                }"
                >
                  <el-input v-model="sku.taxRate" :style="inputStyle">
                    <template slot="append">%</template>
                  </el-input>
                </el-form-item>
              </el-form-item>
              <el-form-item
                label="商品建议零售价"
                :prop="'skus.' + index + '.msrp'"
                :rules="{
                required: true, message: '不能为空', trigger: 'blur'
              }"
              >
                <el-input v-model="sku.msrp" :style="inputStyle" />
              </el-form-item>
              <el-form-item label="工艺描述" prop="processDesc">
                <el-input v-model="sku.processDesc" :style="inputStyle">
                </el-input>
              </el-form-item>
              <el-form-item label="备注" prop="remark">
                <el-input v-model="sku.remark" :style="inputStyle">
                </el-input>
              </el-form-item>
              <el-button
                type="danger"
                icon="el-icon-delete"
                class="mt20 mr20"
                @click="onClickDeleteSkuList(index)"
              >删除规格</el-button>
            </div>
          </div>
          <div style="width:100%" class="mb40">
            <el-button
              type="primary"
              icon="el-icon-plus"
              class="mt20 ml20"
              @click="onClickAddSkuList"
            >新增规格(SKU)</el-button>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="algin-center">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          v-if="!approveLog && (dialogType == 'add' || dialogType == 'edit')"
          type="primary"
          @click="saveRecommend"
        >保 存</el-button>
        <el-button
          v-if="!approveLog && (dialogType === 'edit' || dialogType == 'add')"
          type="primary"
          @click="saveAndApprove"
        >保存并提交审批</el-button>
        <el-button
          v-if="(dialogType == 'edit' || dialogType == 'approve') && isDraft && !approveLog"
          type="info"
          @click="onReset"
        >撤消修改</el-button>
        <!-- 点击提审按钮，物料为新建状态且不存在审批，或者，物料非新建状态且不存在审批且存在草稿 -->
        <template v-if="dialogType == 'approve'">
          <el-button
            v-if="((form.checkedStatus == null || form.checkedStatus == '0') && !approveLog) || (form.checkedStatus != null && form.checkedStatus != '0' && !approveLog && isDraft)"
            type="success"
            @click="sendApprove"
          >提交审批</el-button>
          <el-button v-else disabled type="success">提交审批</el-button>
        </template>
      </div>
    </el-dialog>
    <!-- 审批列表 -->
    <el-dialog width="70%" title="审批列表" :visible.sync="checkDialogVisible">
      <el-table :data="approveList" border style="width: 100%">
        <el-table-column prop="operator" label="提审人">
          <template slot-scope="scope">{{scope.row.operatorName || scope.row.operator}}</template>
        </el-table-column>
        <el-table-column prop="reciver" label="受理人">
          <template slot-scope="scope">{{scope.row.reciverName || scope.row.reciver}}</template>
        </el-table-column>
        <el-table-column prop="createTime" label="提审时间">
          <template slot-scope="scope">{{scope.row.createTime | formatDate('Y-M-D h:m:s')}}</template>
        </el-table-column>
        <el-table-column prop="result" label="审批结果" width="95">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.result == 1">审批中</el-tag>
            <el-tag v-if="scope.row.result == 2" type="success">审批通过</el-tag>
            <el-tag v-if="scope.row.result == 3" type="danger">审批不通过</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="approver" label="审批人">
          <template slot-scope="scope">{{scope.row.approverName || scope.row.approver}}</template>
        </el-table-column>
        <el-table-column prop="reason" label="审批原因"></el-table-column>
        <el-table-column prop="approveTime" label="审批时间">
          <template slot-scope="scope">{{scope.row.approveTime | formatDate('Y-M-D h:m:s')}}</template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 消息列表 -->
    <el-dialog width="70%" title="消息列表" :visible.sync="noticeDialogVisible">
      <el-table :data="noticeList" border style="width: 100%">
        <el-table-column prop="operator" label="发送人"></el-table-column>
        <el-table-column prop="reciver" label="接收人"></el-table-column>
        <el-table-column prop="supId" label="供应商ID">
          <template slot-scope="scope">{{scope.row.supId + ''}}</template>
        </el-table-column>
        <el-table-column prop="content" label="消息内容"></el-table-column>
        <el-table-column prop="createTime" label="发送时间">
          <template slot-scope="scope">{{scope.row.createTime | formatDate('Y-M-D h:m:s')}}</template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 发送消息 -->
    <el-dialog width="50%" title="发送消息" :visible.sync="sendNoticeDialogVisible">
      <el-form
        :model="noticeForm"
        ref="noticeForm"
        :rules="noticeFormRules"
        inline
        :label-width="labelWidth"
        size="small"
      >
        <el-form-item label="供应商" prop="supName">
          <el-input v-model="noticeForm.supName" style="width:300px;" readonly />
        </el-form-item>
        <el-form-item label="物料名称" prop="productName">
          <el-input v-model="noticeForm.name" style="width:300px;" readonly />
        </el-form-item>
        <el-form-item label="消息内容" prop="content">
          <el-input type="textarea" v-model="noticeForm.content" :rows="5" style="width:300px;" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="algin-center">
        <el-button type="info" @click="sendNoticeDialogVisible = false">返回</el-button>
        <el-button type="success" @click="sendNotice">发送</el-button>
      </div>
    </el-dialog>
    <!-- 选择推荐物料建立合作关系 -->
    <el-dialog width="70%" title="建立合作" :visible.sync="cooperateDialog">
      <div
        v-for="(recommendSku,index) in cooperateGoods.recommendSkus"
        :key="`cooperateGoods_${index}`"
        class="cooperate_skus"
      >
        <div>
          <el-form inline>
            <el-form-item label="供应商名称">
              <el-input disabled v-model="cooperateGoods.supplierName"></el-input>
            </el-form-item>
            <el-form-item label="推荐商品名称">
              <el-input disabled v-model="cooperateGoods.recommendSpuName"></el-input>
            </el-form-item>
            <el-form-item label="商品条码">
              <el-input disabled v-model="recommendSku.codeBar"></el-input>
            </el-form-item>
            <el-form-item :label="recommendSku.firstAtbKey">
              <el-input disabled v-model="recommendSku.firstAtbValue"></el-input>
            </el-form-item>
            <el-form-item v-if="recommendSku.secondAtbKey" :label="recommendSku.secondAtbKey">
              <el-input disabled v-model="recommendSku.secondAtbValue"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div>
          <el-radio-group v-model="recommendSku.createType" @change="(value)=>{onCooperationCreateTypeChange(value,recommendSku)}">
            <el-radio-button label="1">选择已有的SKU</el-radio-button>
            <el-radio-button label="2">新增SKU</el-radio-button>
            <el-radio-button label="3">新增SPU</el-radio-button>
          </el-radio-group>
          <el-table
            v-if="recommendSku.createType == '1'"
            :data="cooperateGoods.existsSkus[recommendSku.codeBar]"
            @current-change="(currentRow, oldCurrentRow) => handleCurrentSkuChange(currentRow, oldCurrentRow,recommendSku)"
            highlight-current-row
          >
            <el-table-column label="商品ID" prop="spuId"></el-table-column>
            <el-table-column label="NC码" prop="skuSn"></el-table-column>
            <el-table-column label="商品条码" prop="codeBar"></el-table-column>
            <el-table-column label="主属性" prop="firstAtbValue"></el-table-column>
            <el-table-column label="副属性" prop="secondAtbValue"></el-table-column>
          </el-table>
          <search-spu
            v-else-if="recommendSku.createType == '2'"
            @currentRowChange="(currentRow) => handleCurrentSpuChange(currentRow,recommendSku)"
          ></search-spu>
        </div>
        <div style="text-align: center;">
          <el-button
            v-if="recommendSku.createType == '1'"
            :disabled="!recommendSku.skuId"
            @click="createCooperation(recommendSku)"
            :loading="cooperationLoading"
          >建立合作</el-button>
          <el-button
            v-else-if="recommendSku.createType == '2'"
            :disabled="!recommendSku.spuId"
            @click="createCooperation(recommendSku)"
            :loading="cooperationLoading"
          >建立合作</el-button>
          <el-button
            v-else
            @click="createCooperation(recommendSku)"
            :loading="cooperationLoading"
          >建立合作</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  selectPage,
  getById,
  getModifyById,
  getApproveLogById,
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
  fieldDetection,
  getInnerPersonBySupId
} from "@/api/supplier/recommend";
import { getApproveLogList } from "@/api/supplier/recommendApprove";
import {
  sendNotice,
  selectList as noticeList
} from "@/api/supplier/recommendNotice";
import { getSupTypes, danweiList } from "@/api/supplier";
import { saveByExpectGoods, addCoopGoods } from "@/api/supplier/cooperation";
import { supType, proType, simpleStatus } from "@/const/supplier/recommend";
import GoodsCateCascader from "@/components/GoodsCateCascader";
import PartsCateCascader from "_c/PartsCateCascader";
import SearchSpu from "_c/SearchSpu";
import FileList from "@/components/FileList";
import FileSaver from "file-saver";
import { translateDataToTree, formatDate } from "@/utils";
import InnerPersonSelect from '../../../components/InnerPersonSelect.vue';
import SupplierSelect from './component/supplier-select.vue';
export default {
  name: "RecommendProductList",
  components: { GoodsCateCascader, PartsCateCascader, FileList, SearchSpu, InnerPersonSelect, SupplierSelect },
  data() {
    return {
      isShow:false,
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
        // /* {
        //   key: "supId",
        //   label: "供应商ID",
        //   placeholder: "请输入供应商ID",
        //   type: "input"
        // },*/
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
            { label: "异常", value: false }
          ]
        },
        {
          key: "checkedStatus",
          label: "建档状态",
          placeholder: "请选择建档状态",
          clearable: true,
          type: "select",
          options: [
            { label: "初始", value: "0" },
            // { label: "审批中", value: "1" },
            { label: "通过", value: "2" }
            // { label: "不通过", value: "3" }
          ]
        }
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
        supId: '',
        name: '',
        supType: '',
        proType: '',
        brandName: '',
        salesChannels: '',
        materialQuality: '',
        packingMethod: '',
        isSupportOdm: '',
        proofingPrice: null,
        proofingCycle: null,
        shelfLife: '',
        deliveryCycle: '',
        productDescribe: '',
        videos: [],
        titleImage: [],
        attaImages: [],
        firstAtbKey: '',
        secondAtbKey: '',
        retailUnit: '',
        goodsQuality: '',
        mobile: '',
        isSaveInnerPerson: true,
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
        shelfLife: [
          { required: true, message: "请输入保质期（天）", trigger: "blur" }
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
        shelfLife: [
          { required: true,
            validator: (rule, value, callback) => {
              setTimeout(() => {
                if(!this.isShelfLife){
                  callback()
                } else if (value < 1 || !value) {
                  return callback(new Error('请输入有效期管理'));
                }else{
                  callback()
                }
              }, 100)
            }, trigger: 'blur' }
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
          { required: true, message: "请选择商品类型", trigger: "change" }
        ],
        supType: [
          { required: true, message: "请选择生产类型", trigger: "change" }
        ],
        taxRate: [{ required: true, message: "请填写税率", trigger: "blur" }],
        mobile: [
          { required: true, message: "请选择内部联系人", trigger: "blur" }
        ]
      },
      noticeFormRules: {
        content: [
          { required: true, message: "请填写消息内容", trigger: "blur" }
        ]
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
      checkDialogVisible: false,
      noticeDialogVisible: false,
      sendNoticeDialogVisible: false,
      approveList: [],
      noticeList: [],
      noticeForm: {},
      cooperateGoods: {
        supplierName: "",
        existsSkus: {},
        existsSpus: {},
        recommendSkus: {}
      },
      cooperateDialog: false,
      cooperationLoading: false,
      danweis:[],
      isShelfLife:true,
      ecologyUsers: [], // 内部跟进人信息,名字列表
    };
  },
  computed: {
    dialogTitle() {
      switch (this.dialogType) {
        case "add":
          return "新增推荐商品";
        case "edit":
          return "编辑推荐商品";
        case "look":
          return "推荐商品详情";
        case "approve":
          return "推荐商品审批详情";
      }
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
      ) ?  item.unitVolume = this.accMul(this.accMul(tskuLength, tskuWeight), tskuHeight) : 0;
      console.log(item.unitVolume)
    },
    calculateCartonVolume(index) {
      let item = this.form.skus[index];
      let tlongCartonSize = item.boxLength / 1000;
      let twidthCartonSize = item.boxWeight / 1000;
      let thighCartonSize = item.boxHeight / 1000;
      item.cartonVolume = this.accMul(
        this.accMul(tlongCartonSize, twidthCartonSize),
        thighCartonSize
      ) ? this.accMul(this.accMul(tlongCartonSize, twidthCartonSize), thighCartonSize) : 0;
      console.log(item.cartonVolume)
    },
    // 导出
    exportSup() {
      this.$store.commit("SHOW_LOADING");
      let params = _.cloneDeep(this.searchQuery);
      exportInfo(params)
        .then(blob => {
          console.log("导入中", blob.type === "application/x-download");
          let fileName = `供应商推荐物料${formatDate(
            new Date().getTime(),
            "Y-M-D_h:m"
          )}`;
          FileSaver.saveAs(blob, fileName + ".xlsx");
        })
        .finally(() => {
          this.$store.commit("SHOW_LOADING", false);
        });
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
      this.tableLoading = true;
      selectPage(this.searchQuery)
        .then(res => {
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
    del(row) {
      this.$confirm(`确定删除 ${row.name} 吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      }).then(() => {
        delById(row.id).then(res => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.fetchTableData();
        });
      });
    },
    add() {
      this.dialogType = "add";
      this.showDialog();
      // this.$refs.form.resetFields();
    },
    async edit(id) {
      this.dialogType = "edit";
      this.showDialog();
      await this.fetchModifyDetails(id);
    },
    async approve(id) {
      this.dialogType = "approve";
      this.showDialog();
      await this.fetchModifyDetails(id);
    },
    async lookDetails(id) {
      this.isShow = true;
      this.dialogType = "look";
      this.showDialog();
      await this.fetchDetails(id);
      // setTimeout(() => {
      // }, 1);
    },
    fetchDetails(id) {
      return getById(id).then(res => {
        this.formHandler(res);
      });
    },
    async fetchModifyDetails(id) {
      let modify = await getModifyById(id);
      await getApproveLogById(id).then(res => {
        this.approveLog = res;
      });
      if (!modify) {
        this.isDraft = false;
        return this.fetchDetails(id);
      } else {
        this.formHandler(modify);
        this.isDraft = true;
      }
    },
    formHandler(res) {
      // 填充主图
      if (res.titleImage) {
        let arr = res.titleImage.split(".");
        let fileType = arr[arr.length - 1];
        let fileName = res.titleImage.substring(res.titleImage.lastIndexOf("/") + 1);
        res.titleImage = [{ attaUrl: res.titleImage, fileName, fileType }];
      } else {
        res.titleImage = [];
      }
      res.skus = res.skus.map(sku => ({
        ...sku,
        lpcc: sku.skuLength || sku.skuWeight || sku.skuHeight,
        zxcc: sku.boxLength || sku.boxWeight || sku.boxHeight,
        bzcc: sku.longCartonSize || sku.widthCartonSize || sku.highCartonSize
      }))
      res.mobile = res.innerPersonMobile || '';
      res.supId += "";
      this.form = res;
    },
    showDialog() {
      this.dialogVisible = true;
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    onSupChange(e) { // 选中sup后若是有内部联系人，将该内部联系人作为该物料的默认内部联系人
      if (!e) {
        return ;
      }
      if (this.form.mobile) { // 如果已有内部联系人
        return ;
      }
      getInnerPersonBySupId(e)
        .then(list => {
          if (!(Array.isArray(list) && list.length > 0)) {
            return;
          }
          let innerPerson = list[0];
          this.form.mobile = innerPerson.tel;
        })
    },
    saveRecommend() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          this.$message({
            message: "请完善物料信息",
            type: "warning"
          });
          return;
        }
        let http;
        if (this.dialogType === "add") {
          http = saveRecommend;
        } else {
          http = updateRecommend;
        }
        /* this.form["cateCode"]=this.from["cateCode"].get(0)+"-"+this.from["cateCode"].get(1);*/
        let params = this.$lodash.cloneDeep(this.form);
        // console.log("供应商数据", params);
        params.titleImage = params.titleImage[0].attaUrl;

        this.$confirm(`确认提交吗?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        }).then(() => {
          this.formLoading = true;
          http(params)
            .then(res => {
              this.$message.success("保存成功");
              this.closeDialog();
              this.fetchTableData();
            })
            .finally(() => {
              this.formLoading = false;
            });
        });
      });
    },
    async saveAndApprove() {

      this.$refs['form']
        .validate()
        .then(() => {
          this.$confirm(`确认提交吗?`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            center: true
          }).then(async () => {
            try {
              this.formLoading = true;
              let httpReq = this.dialogType === "add" ? saveRecommend : updateRecommend;
              const params = this.$lodash.cloneDeep(this.form);
              params.titleImage = params.titleImage[0].attaUrl;
              let r = await httpReq(params);
              let id = r && r.id || this.form.id;
              await sendApprove(id)
              this.$message({
                type: "success",
                message: "提交审批成功!"
              });
              this.closeDialog();
              this.fetchTableData();
            } catch (error) {
              this.formLoading = false;
            } finally {
              this.formLoading = false;
            }

            // httpReq(params)
            //   .then(() => {
            //     sendApprove(this.form.id)
            //       .then(() => {
            //         this.$message({
            //           type: "success",
            //           message: "提交审批成功!"
            //         });
            //         this.closeDialog();
            //         this.fetchTableData();
            //       })
            //   })
          })
        })
        .catch(() => {
          this.$message({
            message: "请完善物料信息",
            type: "warning"
          });
        })
    },
    sendApprove() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          this.$message({
            message: "请完善物料信息",
            type: "warning"
          });
          return;
        }
        this.$confirm(`提交审批前，请确认表单内容是否已保存成功?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        }).then(async () => {
          this.formLoading = true;
          sendApprove(this.form.id)
            .then(() => {
              this.$message({
                type: "success",
                message: "提交审批成功!"
              });
              this.closeDialog();
              this.fetchTableData();
            })
            .finally(() => {
              this.formLoading = false;
            });
        });
      });
    },
    resetForm() {
      this.form = {
        supId: '',
        name: '',
        supType: '',
        proType: '',
        brandName: '',
        salesChannels: '',
        materialQuality: '',
        packingMethod: '',
        isSupportOdm: '',
        proofingPrice: '',
        proofingCycle: '',
        shelfLife: '',
        deliveryCycle: '',
        productDescribe: '',
        videos: [],
        titleImage: [],
        attaImages: [],
        firstAtbKey: '',
        secondAtbKey: '',
        retailUnit: '',
        goodsQuality: '',
        mobile: '',
        isSaveInnerPerson: true,
        skus: [
          {
            lpcc: false,
            zxcc: false,
            bzcc: false,
            isTax: false,
            isFreight: false,
          }
        ]
      };
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
      // return ;
      // this.$refs.form.resetFields();
      // done()
    },
    getProTypeName(type) {
      for (let index in this.proTypes) {
        if (type == this.proTypes[index].value) {
          return this.proTypes[index].label;
        }
      }
      return "";
    },
    onClickAddSkuList() {
      this.form.skus.push({
        lpcc: false,
        zxcc: false,
        bzcc: false,
        isTax: false,
        isFreight: false
      });
    },
    onClickDeleteSkuList(index) {
      this.form.skus.splice(index, 1);

      if (this.form.skus.length == 0) {
        this.onClickAddSkuList();
      }
    },
    onSale(id) {
      this.$confirm(`确认修改物料状态为正常吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      }).then(async () => {
        this.formLoading = true;
        sale(id)
          .then(() => {
            this.$message({
              type: "success",
              message: "状态修改成功!"
            });
            this.fetchTableData();
          })
          .finally(() => {
            this.formLoading = false;
          });
      });
    },
    onOutSale(id) {
      this.$confirm(`确认修改物料状态为异常吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      }).then(async () => {
        this.formLoading = true;
        outSale(id)
          .then(() => {
            this.$message({
              type: "success",
              message: "状态修改成功!"
            });
            this.fetchTableData();
          })
          .finally(() => {
            this.formLoading = false;
          });
      });
    },
    onReset() {
      this.$confirm(`确认撤消修改信息吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      }).then(async () => {
        this.formLoading = true;
        reset(this.form.id)
          .then(() => {
            this.$message({
              type: "success",
              message: "撤消成功!"
            });
            this.closeDialog();
            this.fetchTableData();
          })
          .finally(() => {
            this.formLoading = false;
          });
      });
    },
    onApproveLog(productId) {
      this.approveList = [];
      getApproveLogList({ productId }).then(res => {
        this.approveList = res;
        this.checkDialogVisible = true;
      });
    },
    onSendNotice(data) {
      console.info(data);
      this.noticeForm = {
        content: "",
        name: data.name,
        productId: data.id,
        supId: data.supInfo.id,
        supName: data.supInfo.name
      };
      this.sendNoticeDialogVisible = true;
    },
    sendNotice() {
      this.$refs.noticeForm.validate(valid => {
        if (!valid) return;
        this.$confirm(`确认发送消息给供应商吗?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        }).then(async () => {
          this.formLoading = true;
          sendNotice(this.noticeForm)
            .then(() => {
              this.$message({
                type: "success",
                message: "提交审批成功!"
              });
              this.sendNoticeDialogVisible = false;
              this.fetchTableData();
            })
            .finally(() => {
              this.formLoading = false;
            });
        });
      });
    },
    accMul(arg1, arg2) {
      var m = 0,
        s1 = arg1.toString(),
        s2 = arg2.toString();
      try {
        m += s1.split(".")[1].length;
      } catch (e) {}
      try {
        m += s2.split(".")[1].length;
      } catch (e) {}
      return (
        (Number(s1.replace(".", "")) * Number(s2.replace(".", ""))) /
        Math.pow(10, m)
      );
    },
    onNoticeList(productId) {
      this.noticeList = [];
      noticeList({ productId }).then(res => {
        this.noticeList = res;
        this.noticeDialogVisible = true;
      });
    },
    onCooperation(supId, id) {
      fieldDetection(supId, id).then(res => {
        this.$lodash.forEach(res.recommendSkus, (v, k) => {
          v.createType = "1";
        });
        this.cooperateGoods = res;
      });
      this.cooperateDialog = true;
    },
    onCooperationCreateTypeChange(value,recommendSku){
      this.$set(recommendSku, "spuId", '');
      this.$set(recommendSku, "skuId", '');
    },
    handleCurrentSpuChange(currentRow, recommendSku) {
      this.$set(recommendSku, "spuId", currentRow.id);
    },
    handleCurrentSkuChange(currentRow, oldCurrentRow, recommendSku) {
      this.$set(recommendSku, "spuId", currentRow.spuId);
      this.$set(recommendSku, "skuId", currentRow.id);
    },
    createCooperation(recommendSku) {
      this.cooperationLoading = true;
      let params = {
        createType: recommendSku.createType,
        supplierId: recommendSku.supId,
        spuId: recommendSku.spuId,
        skuId: recommendSku.skuId,
        recommendSpuId: recommendSku.productId,
        recommendSkuId: recommendSku.id
      };
      saveByExpectGoods(params)
        .then(res => {
          this.$message.success("建立合作关系成功！");
          this.onCooperation(recommendSku.supId, recommendSku.productId);
        })
        .finally(() => {
          this.cooperationLoading = false;
        });
    }
  },
  async created() {
    await this.fetchProTypes();
    this.fetchTableData(); // 加载表格数据
    // this.onClickAddSkuList();
    this.getDanweiList();
  }
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
.cooperate_skus {
  padding: 30px;
  margin: 10px;
  /* border-color: gray; */
  border: 3px dotted gray;
  > div {
    padding: 10px;
  }
}
</style>
<style lang="scss">
</style>
