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
        <el-table-column label="供应商ID" prop="supId" fixed="left" width="160"></el-table-column>
        <el-table-column label="供应商名称" prop="supName" fixed="left" width="160"></el-table-column>
        <el-table-column label="风险等级" prop="supRiskCategory" width="80"></el-table-column>
        <el-table-column label="客户类型" prop="supCustomerType" width="160"></el-table-column>
        <el-table-column label="企业性质" prop="supNature" width="80"></el-table-column>
        <el-table-column label="主要业务类型" prop="supBusinessType" width="80"></el-table-column>
        <el-table-column label="合作等级" prop="supCoopType" width="80"></el-table-column>
        <el-table-column label="经营品牌" prop="supManageBrank" width="160"></el-table-column>
        <el-table-column label="建档状态" prop="supCheckedStatus" fixed="right" width="80">
          <template slot-scope="scope">{{checkStatus[scope.row.supCheckedStatus]}}</template>
        </el-table-column>
        <el-table-column label="是否启用" prop="supIsEnable" fixed="right" width="80">
          <template slot-scope="scope">{{enableStatus[scope.row.isEnable]}}</template>
        </el-table-column>
        <!-- <el-table-column label="备注" prop="remark" width="200"></el-table-column> -->
        <el-table-column label="供应商创建时间" prop="supCreateDate" width="140">
          <template
            v-if="scope.row.supCreateDate"
            slot-scope="scope"
          >{{scope.row.supCreateDate | formatDate('Y-M-D h:m:s')}}</template>
        </el-table-column>
        <el-table-column label="资料修改申请时间" prop="createDate" width="140">
          <template
            v-if="scope.row.createDate"
            slot-scope="scope"
          >{{scope.row.createDate | formatDate('Y-M-D h:m:s')}}</template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template slot-scope="scope">
            <!-- <el-button type="text" @click="lookDetails(scope.row.id)">查看</el-button> -->
            <el-button
              v-permission-button="'viewDetails'"
              type="text"
              @click="lookDetails(scope.row)"
            >查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </my-table>

    <!-- Form表单弹窗 -->
    <el-dialog title="供应商信息修改申请" :visible.sync="infoFormDialog" fullscreen center>
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="基础信息" name="first">
          <el-form :model="infoForm" ref="infoForm" :label-width="labelWidth" inline size="mini">
            <el-form-item label="编码" prop="code" v-if="infoForm.code">
              <el-input :style="inputStyle" v-model="infoForm.code"></el-input>
              <el-input
                :style="inputStyle"
                class="warningInput"
                v-if="notEquals(logForm.code, infoForm.code)"
                v-model="logForm.code"
              ></el-input>
            </el-form-item>
            <el-form-item label="供应商名称（中文）" prop="name">
              <el-input :style="inputStyle" v-model="infoForm.name"></el-input>
              <el-input
                :style="inputStyle"
                class="warningInput"
                v-if="notEquals(logForm.name,infoForm.name)"
                v-model="logForm.name"
              ></el-input>
            </el-form-item>
            <el-form-item label="供应商简称" prop="abbr">
              <el-input :style="inputStyle" v-model="infoForm.abbr"></el-input>
              <el-input
                :style="inputStyle"
                class="warningInput"
                v-if="notEquals(logForm.abbr,infoForm.abbr)"
                v-model="logForm.abbr"
              ></el-input>
            </el-form-item>
            <el-form-item label="曾用名">
              <el-input :style="inputStyle" v-model="infoForm.nameUsed"></el-input>
              <el-input
                :style="inputStyle"
                class="warningInput"
                v-if="notEquals(logForm.nameUsed,infoForm.nameUsed)"
                v-model="logForm.nameUsed"
              ></el-input>
            </el-form-item>
            <el-form-item label="供应商名称（英文）">
              <el-input :style="inputStyle" v-model="infoForm.nameEn"></el-input>
              <el-input
                :style="inputStyle"
                class="warningInput"
                v-if="notEquals(logForm.nameEn,infoForm.nameEn)"
                v-model="logForm.nameEn"
              ></el-input>
            </el-form-item>
            <el-form-item label="企业法人">
              <el-input :style="inputStyle" v-model="infoForm.legalMan"></el-input>
              <el-input
                :style="inputStyle"
                class="warningInput"
                v-if="notEquals(logForm.legalMan,infoForm.legalMan)"
                v-model="logForm.legalMan"
              ></el-input>
            </el-form-item>
            <el-form-item label="供应商分类" prop="types">
              <el-select :style="inputStyle" multiple v-model="infoForm.types">
                <el-option
                  v-for="type in types.properties"
                  :key="type.value"
                  :label="type.label"
                  :value="type.value"
                ></el-option>
              </el-select>
              <el-select
                :style="inputStyle"
                class="warningInput"
                multiple
                v-if="notEquals(logForm.types,infoForm.types)"
                v-model="logForm.types"
              >
                <el-option
                  v-for="type in types.properties"
                  :key="type.value"
                  :label="type.label"
                  :value="type.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="infoForm.types&&infoForm.types.includes('1')" label="供应商商品分类">
              <goods-cate-cascader
                v-model="infoForm.productCategorys"
                :props="{
                    expandTrigger: 'hover',
                    value: 'code',
                    label: 'name',
                    multiple: true
                  }"
                :collapseTags="true"
                :cateLevel="2"
              ></goods-cate-cascader>
              <goods-cate-cascader
                v-if="notEquals(logForm.productCategorys,infoForm.productCategorys)"
                v-model="logForm.productCategorys"
                class="warningInput"
                :props="{
                    expandTrigger: 'hover',
                    value: 'code',
                    label: 'name',
                    multiple: true
                  }"
                :collapseTags="true"
                :cateLevel="2"
              ></goods-cate-cascader>
            </el-form-item>
            <el-form-item label="经营品牌">
              <el-input :style="inputStyle" v-model="infoForm.manageBrank"></el-input>
              <el-input
                :style="inputStyle"
                class="warningInput"
                v-if="notEquals(logForm.manageBrank,infoForm.manageBrank)"
                v-model="logForm.manageBrank"
              ></el-input>
            </el-form-item>
            <el-form-item label="主供商品">
              <el-input :style="inputStyle" v-model="infoForm.mainProduct"></el-input>
              <el-input
                :style="inputStyle"
                class="warningInput"
                v-if="notEquals(logForm.mainProduct,infoForm.mainProduct)"
                v-model="logForm.mainProduct"
              ></el-input>
            </el-form-item>
            <el-form-item label="主要业务类型">
              <el-select :style="inputStyle" v-model="infoForm.businessType">
                <el-option v-for="type in businessType" :key="type" :value="type"></el-option>
              </el-select>
              <el-select
                :style="inputStyle"
                class="warningInput"
                v-if="notEquals(logForm.businessType,infoForm.businessType)"
                v-model="logForm.businessType"
              >
                <el-option v-for="type in businessType" :key="type" :value="type"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="主要客户名称" prop="customerName">
              <el-input :style="inputStyle" v-model="infoForm.customerName"></el-input>
              <el-input
                :style="inputStyle"
                class="warningInput"
                v-if="notEquals(logForm.customerName,infoForm.customerName)"
                v-model="logForm.customerName"
              ></el-input>
            </el-form-item>
            <el-form-item v-if="infoForm.types&&infoForm.types.includes('2')" label="配件分类">
              <parts-cate-cascader
                :style="inputStyle"
                v-model="infoForm.partsCategorys"
                :props="{
                    expandTrigger: 'hover',
                    value: 'code',
                    label: 'name',
                    multiple: true
                  }"
                :collapseTags="true"
              ></parts-cate-cascader>
              <parts-cate-cascader
                :style="inputStyle"
                v-if="notEquals(logForm.partsCategorys,infoForm.partsCategorys)"
                v-model="logForm.partsCategorys"
                class="warningInput"
                :props="{
                    expandTrigger: 'hover',
                    value: 'code',
                    label: 'name',
                    multiple: true
                  }"
                :collapseTags="true"
              ></parts-cate-cascader>
            </el-form-item>

            <el-form-item label="企业性质" prop="nature">
              <el-select :style="inputStyle" v-model="infoForm.nature">
                <el-option v-for="type in nature" :key="type" :value="type"></el-option>
              </el-select>
              <el-select
                :style="inputStyle"
                class="warningInput"
                v-if="notEquals(logForm.nature,infoForm.nature)"
                v-model="logForm.nature"
              >
                <el-option v-for="type in nature" :key="type" :value="type"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="产权">
              <el-select :style="inputStyle" v-model="infoForm.property">
                <el-option v-for="type in property" :key="type" :value="type"></el-option>
              </el-select>
              <el-select
                :style="inputStyle"
                class="warningInput"
                v-if="notEquals(logForm.property,infoForm.property)"
                v-model="logForm.property"
              >
                <el-option v-for="type in property" :key="type" :value="type"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="国家" prop="country">
              <el-input :style="inputStyle" v-model="infoForm.country"></el-input>
              <el-input
                :style="inputStyle"
                class="warningInput"
                v-if="notEquals(logForm.country,infoForm.country)"
                v-model="logForm.country"
              ></el-input>
            </el-form-item>
            <el-form-item label="成立时间" prop="foundingTime">
              <el-date-picker
                :style="inputStyle"
                v-model="infoForm.foundingTime"
                type="date"
                value-format="timestamp"
              ></el-date-picker>
              <el-date-picker
                :style="inputStyle"
                class="warningInput"
                v-if="notEquals(logForm.foundingTime,infoForm.foundingTime)"
                v-model="logForm.foundingTime"
                type="date"
                value-format="timestamp"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="单位地址" prop="address">
              <el-input :style="inputStyle" v-model="infoForm.address"></el-input>
              <el-input
                :style="inputStyle"
                class="warningInput"
                v-if="notEquals(logForm.address,infoForm.address)"
                v-model="logForm.address"
              ></el-input>
            </el-form-item>

            <el-form-item label="主要客户类型" prop="customerTypes">
              <el-select :style="inputStyle" v-model="infoForm.customerTypes" multiple>
                <el-option v-for="type in customerTypes" :key="type" :value="type"></el-option>
              </el-select>
              <el-select
                :style="inputStyle"
                class="warningInput"
                v-if="notEquals(logForm.customerTypeList,infoForm.customerTypeList)"
                v-model="logForm.customerTypeList"
                multiple
              >
                <el-option v-for="type in customerTypes" :key="type" :value="type"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="其他客户类型"
              v-if="infoForm.customerTypes&&infoForm.customerTypes.includes('其他')"
            >
              <el-input :style="inputStyle" v-model="infoForm.otherCustomerType"></el-input>
              <el-input
                :style="inputStyle"
                class="warningInput"
                v-if="notEquals(logForm.otherCustomerType,infoForm.otherCustomerType)"
                v-model="logForm.otherCustomerType"
              ></el-input>
            </el-form-item>

            <el-form-item label="备注">
              <el-input
                :style="inputStyle"
                v-model="infoForm.remark"
                type="textarea"
                placeholder="建议填写供应商网址;限制渠道;是否限价;建议零售价等"
              ></el-input>
              <el-input
                :style="inputStyle"
                class="warningInput"
                v-if="notEquals(logForm.remark,infoForm.remark)"
                v-model="logForm.remark"
                type="textarea"
              ></el-input>
            </el-form-item>
            <el-form-item label="简介">
              <el-input :style="inputStyle" v-model="infoForm.intro" type="textarea"></el-input>
              <el-input
                :style="inputStyle"
                class="warningInput"
                v-if="notEquals(logForm.intro,infoForm.intro)"
                v-model="logForm.intro"
                type="textarea"
              ></el-input>
            </el-form-item>
            <el-form-item label="供应商logo">
              <div :style="inputStyle">
                <file-list v-model="infoForm.logo" :addible="false" :removable="false"></file-list>
              </div>
              <div :style="inputStyle" v-if="notEquals(logForm.logo,infoForm.logo)">
                <file-list
                  v-model="logForm.logo"
                  class="warningInput"
                  :addible="false"
                  :removable="false"
                ></file-list>
              </div>
            </el-form-item>
            <el-form-item label="标签">
              <tags :style="inputStyle" :editable="false" v-model="infoForm.tags"></tags>
              <tags
                :style="inputStyle"
                class="warningTag"
                :editable="false"
                v-if="notEquals(logForm.tagList,infoForm.tagList)"
                v-model="logForm.tagList"
              ></tags>
            </el-form-item>
            <el-form-item label="排序等级">
              <el-input :style="inputStyle" v-model.number="infoForm.orderLevel"></el-input>
              <el-input
                :style="inputStyle"
                class="warningInput"
                v-if="notEquals(logForm.orderLevel,infoForm.orderLevel)"
                v-model.number="logForm.orderLevel"
              ></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="供应商规模" name="second">
          <el-form :model="infoForm" :label-width="labelWidth" inline size="mini">
            <el-form-item label="面积">
              <el-input :style="inputStyle" v-model="infoForm.supScaleSaveAndUpdateVo.measureArea"></el-input>
              <el-input
                :style="inputStyle"
                class="warningInput"
                v-if="notEquals(logForm.supScaleSaveAndUpdateVo.measureArea,infoForm.supScaleSaveAndUpdateVo.measureArea)"
                v-model="logForm.supScaleSaveAndUpdateVo.measureArea"
              ></el-input>
            </el-form-item>
            <el-form-item label="员工数量">
              <el-input
                :style="inputStyle"
                v-model.number="infoForm.supScaleSaveAndUpdateVo.staffCount"
              ></el-input>
              <el-input
                :style="inputStyle"
                class="warningInput"
                v-if="notEquals(logForm.supScaleSaveAndUpdateVo.staffCount,infoForm.supScaleSaveAndUpdateVo.staffCount)"
                v-model="logForm.supScaleSaveAndUpdateVo.staffCount"
              ></el-input>
            </el-form-item>
            <el-form-item label="管理人员数量">
              <el-input :style="inputStyle" v-model="infoForm.supScaleSaveAndUpdateVo.managerCount"></el-input>
              <el-input
                :style="inputStyle"
                class="warningInput"
                v-if="notEquals(logForm.supScaleSaveAndUpdateVo.managerCount,infoForm.supScaleSaveAndUpdateVo.managerCount)"
                v-model="logForm.supScaleSaveAndUpdateVo.managerCount"
              ></el-input>
            </el-form-item>
            <el-form-item label="月度产能">
              <el-input
                :style="inputStyle"
                v-model="infoForm.supScaleSaveAndUpdateVo.monthCapacity"
              ></el-input>
              <el-input
                :style="inputStyle"
                class="warningInput"
                v-if="notEquals(logForm.supScaleSaveAndUpdateVo.monthCapacity,infoForm.supScaleSaveAndUpdateVo.monthCapacity)"
                v-model="logForm.supScaleSaveAndUpdateVo.monthCapacity"
              ></el-input>
            </el-form-item>
            <el-form-item class="large-form-item">
              <free-form
                v-model="infoForm.supScaleSaveAndUpdateVo.prodDevs"
                title="主要生产设备"
                :options="deviceOptions"
                :editable="false"
              ></free-form>
              <free-form
                class="warningInput"
                v-if="notEquals(logForm.supScaleSaveAndUpdateVo.prodDevs,infoForm.supScaleSaveAndUpdateVo.prodDevs)"
                v-model="logForm.supScaleSaveAndUpdateVo.prodDevs"
                title="（待变更）"
                :options="deviceOptions"
                :editable="false"
              ></free-form>
            </el-form-item>
            <el-form-item class="large-form-item">
              <free-form
                v-model="infoForm.supScaleSaveAndUpdateVo.testDevs"
                title="主要检测设备"
                :options="deviceOptions"
                :editable="false"
              ></free-form>
              <free-form
                class="warningInput"
                v-if="notEquals(logForm.supScaleSaveAndUpdateVo.testDevs,infoForm.supScaleSaveAndUpdateVo.testDevs)"
                v-model="logForm.supScaleSaveAndUpdateVo.testDevs"
                title="（待变更）"
                :options="deviceOptions"
                :editable="false"
              ></free-form>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="财务信息" name="third">
          <el-form
            :model="infoForm.supFinanceSaveAndUpdateVo"
            ref="financeForm"
            :label-width="labelWidth"
            inline
            size="mini"
          >
            <el-form-item label="纳税人识别号" prop="taxNo">
              <el-input :style="inputStyle" v-model="infoForm.supFinanceSaveAndUpdateVo.taxNo"></el-input>
              <el-input
                :style="inputStyle"
                class="warningInput"
                v-if="notEquals(logForm.supFinanceSaveAndUpdateVo.taxNo,infoForm.supFinanceSaveAndUpdateVo.taxNo)"
                v-model="logForm.supFinanceSaveAndUpdateVo.taxNo"
              ></el-input>
            </el-form-item>
            <el-form-item label="是否一般纳税人" prop="isGeneralTaxpayer">
              <el-select
                :style="inputStyle"
                v-model="infoForm.supFinanceSaveAndUpdateVo.isGeneralTaxpayer"
              >
                <el-option
                  v-for="item in simpleStatus.properties"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-select
                class="warningInput"
                v-if="notEquals(logForm.supFinanceSaveAndUpdateVo.isGeneralTaxpayer,infoForm.supFinanceSaveAndUpdateVo.isGeneralTaxpayer)"
                :style="inputStyle"
                v-model="logForm.supFinanceSaveAndUpdateVo.isGeneralTaxpayer"
              >
                <el-option
                  v-for="item in simpleStatus.properties"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="银行类别">
              <el-input :style="inputStyle" v-model="infoForm.supFinanceSaveAndUpdateVo.bankName"></el-input>
              <el-input
                :style="inputStyle"
                class="warningInput"
                v-if="notEquals(logForm.supFinanceSaveAndUpdateVo.bankName,infoForm.supFinanceSaveAndUpdateVo.bankName)"
                v-model="logForm.supFinanceSaveAndUpdateVo.bankName"
              ></el-input>
            </el-form-item>
            <el-form-item label="开户行" prop="bankBranch">
              <el-input :style="inputStyle" v-model="infoForm.supFinanceSaveAndUpdateVo.bankBranch"></el-input>
              <el-input
                :style="inputStyle"
                class="warningInput"
                v-if="notEquals(logForm.supFinanceSaveAndUpdateVo.bankBranch,infoForm.supFinanceSaveAndUpdateVo.bankBranch)"
                v-model="logForm.supFinanceSaveAndUpdateVo.bankBranch"
              ></el-input>
            </el-form-item>
            <el-form-item label="银行账户" prop="accountName">
              <el-input
                :style="inputStyle"
                v-model="infoForm.supFinanceSaveAndUpdateVo.accountName"
              ></el-input>
              <el-input
                :style="inputStyle"
                class="warningInput"
                v-if="notEquals(logForm.supFinanceSaveAndUpdateVo.accountName,infoForm.supFinanceSaveAndUpdateVo.accountName)"
                v-model="logForm.supFinanceSaveAndUpdateVo.accountName"
              ></el-input>
            </el-form-item>
            <el-form-item label="银行账号" prop="bankAccount">
              <el-input
                :style="inputStyle"
                v-model="infoForm.supFinanceSaveAndUpdateVo.bankAccount"
              ></el-input>
              <el-input
                :style="inputStyle"
                class="warningInput"
                v-if="notEquals(logForm.supFinanceSaveAndUpdateVo.bankAccount,infoForm.supFinanceSaveAndUpdateVo.bankAccount)"
                v-model="logForm.supFinanceSaveAndUpdateVo.bankAccount"
              ></el-input>
            </el-form-item>
            <el-form-item label="币种" prop="currency">
              <el-input :style="inputStyle" v-model="infoForm.supFinanceSaveAndUpdateVo.currency"></el-input>
              <el-input
                :style="inputStyle"
                class="warningInput"
                v-if="notEquals(logForm.supFinanceSaveAndUpdateVo.currency,infoForm.supFinanceSaveAndUpdateVo.currency)"
                v-model="logForm.supFinanceSaveAndUpdateVo.currency"
              ></el-input>
            </el-form-item>
            <el-form-item label="是否境外">
              <el-select :style="inputStyle" v-model="infoForm.supFinanceSaveAndUpdateVo.isAbroad">
                <el-option
                  v-for="item in simpleStatus.properties"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-select
                class="warningInput"
                v-if="notEquals(logForm.supFinanceSaveAndUpdateVo.isAbroad,infoForm.supFinanceSaveAndUpdateVo.isAbroad)"
                :style="inputStyle"
                v-model="logForm.supFinanceSaveAndUpdateVo.isAbroad"
              >
                <el-option
                  v-for="item in simpleStatus.properties"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="联系人" name="fourth">
          <el-form
            :model="infoForm.supContactSaveAndUpdateVo"
            ref="contactForm"
            :label-width="labelWidth"
            inline
            size="mini"
          >
            <el-form-item label="姓名" prop="fullName">
              <el-input :style="inputStyle" v-model="infoForm.supContactSaveAndUpdateVo.fullName"></el-input>
              <el-input
                :style="inputStyle"
                class="warningInput"
                v-if="notEquals(logForm.supContactSaveAndUpdateVo.fullName,infoForm.supContactSaveAndUpdateVo.fullName)"
                v-model="logForm.supContactSaveAndUpdateVo.fullName"
              ></el-input>
            </el-form-item>
            <el-form-item label="性别">
              <el-select :style="inputStyle" v-model="infoForm.supContactSaveAndUpdateVo.gender">
                <el-option
                  v-for="item in gender.properties"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-select
                class="warningInput"
                v-if="notEquals(logForm.supContactSaveAndUpdateVo.gender,infoForm.supContactSaveAndUpdateVo.gender)"
                :style="inputStyle"
                v-model="logForm.supContactSaveAndUpdateVo.gender"
              >
                <el-option
                  v-for="item in gender.properties"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="生日">
              <el-date-picker
                :style="inputStyle"
                v-model="infoForm.supContactSaveAndUpdateVo.birthday"
                type="date"
                value-format="timestamp"
              ></el-date-picker>
              <el-date-picker
                class="warningInput"
                v-if="notEquals(logForm.supContactSaveAndUpdateVo.birthday,infoForm.supContactSaveAndUpdateVo.birthday)"
                :style="inputStyle"
                v-model="logForm.supContactSaveAndUpdateVo.birthday"
                type="date"
                value-format="timestamp"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="职位">
              <el-input :style="inputStyle" v-model="infoForm.supContactSaveAndUpdateVo.position"></el-input>
              <el-input
                :style="inputStyle"
                class="warningInput"
                v-if="notEquals(logForm.supContactSaveAndUpdateVo.position,infoForm.supContactSaveAndUpdateVo.position)"
                v-model="logForm.supContactSaveAndUpdateVo.position"
              ></el-input>
            </el-form-item>
            <el-form-item label="电话">
              <el-input :style="inputStyle" v-model="infoForm.supContactSaveAndUpdateVo.tel"></el-input>
              <el-input
                :style="inputStyle"
                class="warningInput"
                v-if="notEquals(logForm.supContactSaveAndUpdateVo.tel,infoForm.supContactSaveAndUpdateVo.tel)"
                v-model="logForm.supContactSaveAndUpdateVo.tel"
              ></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
              <el-input :style="inputStyle" v-model="infoForm.supContactSaveAndUpdateVo.mobile"></el-input>
              <el-input
                :style="inputStyle"
                class="warningInput"
                v-if="notEquals(logForm.supContactSaveAndUpdateVo.mobile,infoForm.supContactSaveAndUpdateVo.mobile)"
                v-model="logForm.supContactSaveAndUpdateVo.mobile"
              ></el-input>
            </el-form-item>
            <el-form-item label="传真">
              <el-input :style="inputStyle" v-model="infoForm.supContactSaveAndUpdateVo.fax"></el-input>
              <el-input
                :style="inputStyle"
                class="warningInput"
                v-if="notEquals(logForm.supContactSaveAndUpdateVo.fax,infoForm.supContactSaveAndUpdateVo.fax)"
                v-model="logForm.supContactSaveAndUpdateVo.fax"
              ></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input :style="inputStyle" v-model="infoForm.supContactSaveAndUpdateVo.email"></el-input>
              <el-input
                :style="inputStyle"
                class="warningInput"
                v-if="notEquals(logForm.supContactSaveAndUpdateVo.email,infoForm.supContactSaveAndUpdateVo.email)"
                v-model="logForm.supContactSaveAndUpdateVo.email"
              ></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="合作信息" name="fifth">
          <el-form :model="infoForm" :label-width="labelWidth" inline size="mini">
            <el-form-item label="供应商合作等级" prop="coopType">
              <el-select :style="inputStyle" v-model="infoForm.coopType">
                <el-option v-for="type in coopType" :key="type" :value="type"></el-option>
              </el-select>
              <el-select
                :style="inputStyle"
                class="warningInput"
                v-if="notEquals(logForm.coopType,infoForm.coopType)"
                v-model="logForm.coopType"
              >
                <el-option v-for="type in coopType" :key="type" :value="type"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="供应商风险等级" prop="riskCategory">
              <el-select :style="inputStyle" v-model="infoForm.riskCategory">
                <el-option v-for="type in riskCategory" :key="type" :value="type"></el-option>
              </el-select>
              <el-select
                :style="inputStyle"
                class="warningInput"
                v-if="notEquals(logForm.riskCategory,infoForm.riskCategory)"
                v-model="logForm.riskCategory"
              >
                <el-option v-for="type in riskCategory" :key="type" :value="type"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商品服务类型" prop="goodsServiceType">
              <el-select :style="inputStyle" v-model="infoForm.goodsServiceType" multiple>
                <el-option
                  v-for="type in brandCategory.properties"
                  :key="type.value"
                  :value="type.value"
                  :label="type.label"
                ></el-option>
              </el-select>
              <el-select
                :style="inputStyle"
                class="warningInput"
                v-if="notEquals(logForm.goodsServiceType,infoForm.goodsServiceType)"
                v-model="logForm.goodsServiceType"
                multiple
              >
                <el-option
                  v-for="type in brandCategory.properties"
                  :key="type.value"
                  :value="type.value"
                  :label="type.label"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="合作账期">
              <el-input :style="inputStyle" v-model.number="infoForm.debtTerm"></el-input>
              <el-input
                :style="inputStyle"
                class="warningInput"
                v-if="notEquals(logForm.debtTerm,infoForm.debtTerm)"
                v-model.number="logForm.debtTerm"
              ></el-input>
            </el-form-item>
            <el-form-item label="是否支持一件代发">
              <el-select :style="inputStyle" v-model="infoForm.isSupportRetailEc">
                <el-option
                  v-for="item in allowStatus.properties"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-select
                :style="inputStyle"
                class="warningInput"
                v-if="notEquals(logForm.isSupportRetailEc,infoForm.isSupportRetailEc)"
                v-model="logForm.isSupportRetailEc"
              >
                <el-option
                  v-for="item in allowStatus.properties"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="供应商类型" prop="supplierType">
              <el-select :style="inputStyle" v-model="infoForm.supplierType">
                <el-option
                  v-for="item in supplierType.properties"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-select
                :style="inputStyle"
                class="warningInput"
                v-if="notEquals(logForm.supplierType,infoForm.supplierType)"
                v-model="logForm.supplierType"
              >
                <el-option
                  v-for="item in supplierType.properties"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="附件" name="sixth">
          <el-form :model="infoForm" :label-width="labelWidth" size="mini">
            <el-form-item label="营业执照">
              <file-list :addible="false" :removable="false" v-model="infoForm.busiLicenses"></file-list>
            </el-form-item>
            <el-form-item
              label="（待变更）"
              class="warningInput"
              v-if="notEquals(logForm.busiLicenses,infoForm.busiLicenses)"
            >
              <file-list :addible="false" :removable="false" v-model="logForm.busiLicenses"></file-list>
            </el-form-item>
            <el-form-item label="开户许可证">
              <file-list :addible="false" :removable="false" v-model="infoForm.openPermits"></file-list>
            </el-form-item>
            <el-form-item
              label="（待变更）"
              class="warningInput"
              v-if="notEquals(logForm.openPermits,infoForm.openPermits)"
            >
              <file-list :addible="false" :removable="false" v-model="logForm.openPermits"></file-list>
            </el-form-item>
            <el-form-item label="许可证">
              <file-list :addible="false" :removable="false" v-model="infoForm.licences"></file-list>
            </el-form-item>
            <el-form-item
              label="（待变更）"
              class="warningInput"
              v-if="notEquals(logForm.licences,infoForm.licences)"
            >
              <file-list :addible="false" :removable="false" v-model="logForm.licences"></file-list>
            </el-form-item>
            <el-form-item label="完税证明">
              <file-list :addible="false" :removable="false" v-model="infoForm.taxRecords"></file-list>
            </el-form-item>
            <el-form-item
              label="（待变更）"
              class="warningInput"
              v-if="notEquals(logForm.taxRecords,infoForm.taxRecords)"
            >
              <file-list :addible="false" :removable="false" v-model="logForm.taxRecords"></file-list>
            </el-form-item>
            <el-form-item label="ISO认证">
              <file-list :addible="false" :removable="false" v-model="infoForm.isos"></file-list>
            </el-form-item>
            <el-form-item
              label="（待变更）"
              class="warningInput"
              v-if="notEquals(logForm.isos,infoForm.isos)"
            >
              <file-list :addible="false" :removable="false" v-model="logForm.isos"></file-list>
            </el-form-item>
            <el-form-item label="CSR认证">
              <file-list :addible="false" :removable="false" v-model="infoForm.csrs"></file-list>
            </el-form-item>
            <el-form-item
              label="（待变更）"
              class="warningInput"
              v-if="notEquals(logForm.csrs,infoForm.csrs)"
            >
              <file-list :addible="false" :removable="false" v-model="logForm.csrs"></file-list>
            </el-form-item>
            <el-form-item label="其他体系认证">
              <file-list :addible="false" :removable="false" v-model="infoForm.systemAuths"></file-list>
            </el-form-item>
            <el-form-item
              label="（待变更）"
              class="warningInput"
              v-if="notEquals(logForm.systemAuths,infoForm.systemAuths)"
            >
              <file-list :addible="false" :removable="false" v-model="logForm.systemAuths"></file-list>
            </el-form-item>
            <el-form-item label="厂房/车间照片">
              <file-list :addible="false" :removable="false" v-model="infoForm.workPics"></file-list>
            </el-form-item>
            <el-form-item
              label="（待变更）"
              class="warningInput"
              v-if="notEquals(logForm.workPics,infoForm.workPics)"
            >
              <file-list :addible="false" :removable="false" v-model="logForm.workPics"></file-list>
            </el-form-item>
            <el-form-item label="检验报告">
              <file-list :addible="false" :removable="false" v-model="infoForm.insReports"></file-list>
            </el-form-item>
            <el-form-item
              label="（待变更）"
              class="warningInput"
              v-if="notEquals(logForm.insReports,infoForm.insReports)"
            >
              <file-list :addible="false" :removable="false" v-model="logForm.insReports"></file-list>
            </el-form-item>
            <el-form-item label="组织架构图">
              <file-list :addible="false" :removable="false" v-model="infoForm.orgCharts"></file-list>
            </el-form-item>
            <el-form-item
              label="（待变更）"
              class="warningInput"
              v-if="notEquals(logForm.orgCharts,infoForm.orgCharts)"
            >
              <file-list :addible="false" :removable="false" v-model="logForm.orgCharts"></file-list>
            </el-form-item>
            <el-form-item label="其它证照">
              <file-list :addible="false" :removable="false" v-model="infoForm.otherAttas"></file-list>
            </el-form-item>
            <el-form-item
              label="（待变更）"
              class="warningInput"
              v-if="notEquals(logForm.otherAttas,infoForm.otherAttas)"
            >
              <file-list :addible="false" :removable="false" v-model="logForm.otherAttas"></file-list>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="成功案例" name="seventh">
          <el-form :model="infoForm" :label-width="labelWidth" size="mini">
            <el-form-item label="成功案例(可添加一件代发)">
              <file-list :addible="false" :removable="false" v-model="infoForm.successCases"></file-list>
            </el-form-item>
            <el-form-item
              label="（待变更）"
              class="warningInput"
              v-if="notEquals(logForm.successCases,infoForm.successCases)"
            >
              <file-list :addible="false" :removable="false" v-model="logForm.successCases"></file-list>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="algin-center">
        <el-button type="success" @click="checkDialog(true)">通 过</el-button>
        <el-button type="danger" @click="checkDialog(false)">不通过</el-button>
        <el-button @click="infoFormDialog = false">返 回</el-button>
      </div>
    </el-dialog>

    <el-dialog title="审批意见" :visible.sync="checkFormDialog" v-loading="checkLoading" center>
      <el-form :model="checkForm" ref="checkForm" label-width="100px" size="mini">
        <el-form-item label="供应商名称" prop="supName">
          <el-input v-model="currentRow.supName" />
        </el-form-item>
        <el-form-item label="审核意见" prop="reason" :rules="[{ required: true, message: '审核意见不能为空'}]">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 6}"
            v-model="checkForm.reason"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="algin-center">
        <el-button type="success" v-if="checkForm.flag" @click="check">通 过</el-button>
        <el-button type="danger" v-else @click="check">不通过</el-button>
        <el-button @click="checkFormDialog = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getSupInfoById, getSupTypes } from "@/api/supplier";
import {
  selectSupInfoPage,
  enable,
  disEnable
} from "@/api/supplier/modifyLog.js";
import { brandCategory } from "@/const/goods";
import {
  checkStatus,
  types,
  modifyCheckStatus,
  enableStatus,
  simpleStatus,
  allowStatus,
  gender,
  supplierType
} from "@/const/supplier/index";
import Tags from "_c/Tags";
import FileList from "_c/FileList";
import FreeForm from "_c/FreeForm";
import GoodsCateCascader from "_c/GoodsCateCascader";
import PartsCateCascader from "_c/PartsCateCascader";
import { isEmpty } from "@/utils";
export default {
  name: "CheckModify",
  components: {
    Tags,
    FileList,
    FreeForm,
    GoodsCateCascader,
    PartsCateCascader
  },
  data() {
    return {
      labelWidth: "200px",
      inputStyle: { width: "200px", display: "block" },
      nature: ["外资", "合资", "民营", "股份制", "其他"],
      property: ["自有", "租赁"],
      customerTypes: ["商超", "电商", "便利店", "药妆店", "其他"],
      businessType: ["内销", "外销"],
      coopType: ["战略合作", "长期合作", "短期合作", "一次性合作"],
      riskCategory: ["A", "B", "C", "D"],
      deviceOptions: [
        { key: "dev", label: "设备名称", type: "input", reqired: true },
        { key: "count", label: "数量", type: "input", reqired: true }
      ],
      types,
      brandCategory,
      checkStatus,
      modifyCheckStatus,
      enableStatus,
      simpleStatus,
      allowStatus,
      gender,
      supplierType,
      searchForm: [
        {
          key: "supName",
          label: "名称",
          placeholder: "供应商名称",
          type: "input"
        }
      ],
      searchQuery: {
        supName: "",
        pageIndex: 1,
        pageSize: 10,
        orderStr: "id desc",
        total: 0 // 总条数
      },
      tableData: [],
      tableLoading: false,
      currentRow: {},
      infoForm: {
        tags: [],
        riskCategory: null,
        supScaleSaveAndUpdateVo: {},
        supFinanceSaveAndUpdateVo: {},
        supContactSaveAndUpdateVo: {}
      },
      logForm: {
        tags: [],
        riskCategory: null,
        supScaleSaveAndUpdateVo: {},
        supFinanceSaveAndUpdateVo: {},
        supContactSaveAndUpdateVo: {}
      },
      infoFormDialog: false,
      checkForm: {
        supId: null,
        modifyLogId: null,
        reason: null,
        flag: null
      },
      checkFormDialog: false,
      checkLoading: false,
      activeName: "first"
    };
  },
  computed: {},
  methods: {
    notEquals(v1, v2) {
      return !this.$lodash.isEqual(v1, v2);
    },
    onChange() {
      this.fetchTableData();
    },
    // 加载表格数据
    fetchTableData() {
      this.tableLoading = true;
      selectSupInfoPage(this.searchQuery)
        .then(res => {
          this.searchQuery.total = Number(res.total); // 总条数
          this.tableData = res.records.map(row => {
            row.id += "";
            row.supId += "";
            return row;
          });
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    async lookDetails(row) {
      this.currentRow = row;
      if (row.supInfoContent) {
        let res = this.$lodash.cloneDeep(row.supInfoContent);
        if (res.logo) {
          let arr = res.logo.split(".");
          let fileType = arr[arr.length - 1];
          res.logo = [{ attaUrl: res.logo, fileName: "", fileType }];
        } else {
          res.logo = [];
        }
        this.logForm = { ...res };
        this.logForm.tags = this.logForm.tagList;
        this.logForm.types = this.logForm.typeList;
        this.logForm.customerTypes = this.logForm.customerTypeList;
        this.logForm.goodsServiceType = this.logForm.goodsServiceTypeList;
        this.logForm.supScaleSaveAndUpdateVo =
          this.logForm.supScaleSaveAndUpdateVo || {};
        this.logForm.supFinanceSaveAndUpdateVo =
          this.logForm.supFinanceSaveAndUpdateVo || {};
        this.logForm.supContactSaveAndUpdateVo =
          this.logForm.supContactSaveAndUpdateVo || {};
        this.logForm.modifyLogId = this.currentRow.id;
      }
      await this.fetchSupDetails(row.supId);
      this.infoFormDialog = true;
    },
    fetchSupDetails(supId) {
      return getSupInfoById(supId).then(res => {
        res.id += "";
        res.tags = res.tagList;
        res.types = res.typeList;
        res.customerTypes = res.customerTypeList;
        res.goodsServiceType = res.goodsServiceTypeList;
        res.supScaleSaveAndUpdateVo = res.supScaleVo || {};
        res.supScaleSaveAndUpdateVo.prodDevs =
          res.supScaleSaveAndUpdateVo.prodDeviceList;
        res.supScaleSaveAndUpdateVo.testDevs =
          res.supScaleSaveAndUpdateVo.testDeviceList;
        res.supFinanceSaveAndUpdateVo = res.supFinance || {};
        res.supContactSaveAndUpdateVo = res.supContact || {};
        res.productCategorys = res.categorys.map(cate => {
          return cate.code;
        });
        res.partsCategorys = res.partsCategorys.map(cate => {
          return cate.code;
        });
        if (res.logo) {
          let arr = res.logo.split(".");
          let fileType = arr[arr.length - 1];
          res.logo = [{ attaUrl: res.logo, fileName: "", fileType }];
        } else {
          res.logo = [];
        }
        this.infoForm = res;
      });
    },
    checkDialog(flag) {
      this.checkForm.supId = this.currentRow.supId;
      this.checkForm.modifyLogId = this.currentRow.id;
      this.checkForm.flag = flag;
      this.checkFormDialog = true;
    },
    check() {
      let check = this.checkForm.flag ? enable : disEnable;
      this.$refs.checkForm.validate(valid => {
        if (valid) {
          this.checkLoading = true;
          check(this.checkForm)
            .then(res => {
              this.$message.success("审批成功！");
              this.resetForm();
              this.fetchTableData();
            })
            .finally(() => {
              this.checkLoading = false;
            });
        }
      });
    },
    resetForm() {
      this.checkFormDialog = false;
      this.infoFormDialog = false;
      this.infoForm = {
        tags: [],
        riskCategory: null,
        supScaleSaveAndUpdateVo: {},
        supFinanceSaveAndUpdateVo: {},
        supContactSaveAndUpdateVo: {}
      };
      this.logForm = {
        tags: [],
        riskCategory: null,
        supScaleSaveAndUpdateVo: {},
        supFinanceSaveAndUpdateVo: {},
        supContactSaveAndUpdateVo: {}
      };
      this.currentRow = {};
      this.checkForm = {};
    }
  },
  watch: {},
  async created() {
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
  width: 100%;
  /deep/ .el-form-item__content {
    width: 100%;
  }
}
.warningInput {
  /deep/ .el-input__inner {
    color: red;
  }
  /deep/ .el-textarea__inner {
    color: red;
  }
  /deep/ .el-select__tags-text {
    color: red;
  }
  /deep/ .el-upload-list__item {
    border-color: red;
    border-style: dashed;
  }
  /deep/ .picture-card-box {
    border: 1px dashed red;
  }
  /deep/ .el-tag--info {
    color: red;
  }
}
.warningTag {
  /deep/ .el-tag {
    border: 1px dashed red;
  }
}
</style>
