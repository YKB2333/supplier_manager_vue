<template>
  <el-dialog v-bind="$attrs" v-on="$listeners" @open="onOpen" @close="onClose" v-loading="loading">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="基础信息" name="base">
        <el-form
          :model="saveForm" 
          ref="baseForm" 
          :label-width="labelWidth" 
          :rules="type === 'preview' ? null : baseRules"
          inline>
          <el-form-item label="编码" prop="code" v-if="saveForm.code">
            <el-input :style="inputStyle" v-model="saveForm.code" disabled></el-input>
          </el-form-item>
          <el-form-item label="供应商名称（中文）" prop="name">
            <el-input :style="inputStyle" v-model="saveForm.name" placeholder="请输入供应商名称（中文）"></el-input>
          </el-form-item>
          <el-form-item label="供应商类型" prop="supplierType">
            <el-select 
              :style="inputStyle" clearable 
              :disabled="type === 'preview'"
              v-model="saveForm.supplierType">
              <el-option
                v-for="item in supplierType.properties"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="企业性质" prop="nature">
            <el-select 
              :style="inputStyle" clearable 
              :disabled="type === 'preview'"
              v-model="saveForm.nature">
              <el-option v-for="type in nature" :key="type" :value="type"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="供应商简称" prop="abbr" v-show="baseInfoVisible('abbr')">
            <el-input :style="inputStyle" v-model="saveForm.abbr" placeholder="请输入供应商简称"></el-input>
          </el-form-item>
          <el-form-item label="供应商名称（英文）" prop="nameEn" v-show="baseInfoVisible('nameEn')">
            <el-input :style="inputStyle" v-model="saveForm.nameEn" placeholder="请输入供应商名称（英文）"></el-input>
          </el-form-item>
          <el-form-item label="曾用名" prop="nameUsed" v-show="baseInfoVisible('nameUsed')">
            <el-input :style="inputStyle" v-model="saveForm.nameUsed" placeholder="请输入曾用名"></el-input>
          </el-form-item>
          <el-form-item label="企业法人" prop="legalMan">
            <el-input :style="inputStyle" v-model="saveForm.legalMan" placeholder="请输入企业法人"></el-input>
          </el-form-item>
          <el-form-item label="是否一般纳税人" prop="isGeneralTaxpayer">
            <el-select
              :style="inputStyle" clearable
              :disabled="type === 'preview'"
              v-model="saveForm.isGeneralTaxpayer">
              <el-option
                v-for="item in simpleStatus.properties"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="国家" prop="country" >
            <country-select v-model="saveForm.country" :style="inputStyle" />
          </el-form-item>
          <el-form-item label="营业执照号" prop="taxNo">
            <span slot="label">营业执照号
              <el-tooltip effect="dark" content="当企业性质为个人时，填写个人身份证号">
                <i class="el-icon-warning"></i>
              </el-tooltip>
            </span>
            <el-input 
              :style="inputStyle" 
              v-model="saveForm.taxNo"
              placeholder="请输入营业执照号"
            ></el-input>
          </el-form-item>
          <el-form-item label="供货类型" prop="types" v-show="baseInfoVisible('types')">
            <el-select 
              :style="inputStyle" clearable multiple 
              :disabled="type === 'preview'"
              v-model="saveForm.types">
              <el-option
                v-for="type in supTypesOptions"
                :key="type.value"
                :label="type.label"
                :value="type.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品分类" prop="productCategorys" v-show="baseInfoVisible('productCategorys') && saveForm.types && saveForm.types.includes('1')">
            <goods-cate-cascader
              v-model="saveForm.productCategorys"
              :props="{expandTrigger: 'hover', value: 'code', label: 'name', multiple: true}"
              :collapseTags="true"
              :cateLevel="3"
            ></goods-cate-cascader>
          </el-form-item>
          <el-form-item label="配件分类" prop="partsCategorys" v-show="baseInfoVisible('productCategorys') && saveForm.types && saveForm.types.includes('2')">
            <parts-cate-cascader
              :style="inputStyle"
              v-model="saveForm.partsCategorys"
              :props="{expandTrigger: 'hover', value: 'code', label: 'name', multiple: true}"
              :collapseTags="true"
            ></parts-cate-cascader>
          </el-form-item>
          <el-form-item label="经营品牌" prop="manageBrank" v-show="baseInfoVisible('manageBrank')">
            <el-input :style="inputStyle" v-model="saveForm.manageBrank"></el-input>
          </el-form-item>
          <el-form-item label="主供商品" prop="mainProduct" v-show="baseInfoVisible('mainProduct')">
            <el-input :style="inputStyle" v-model="saveForm.mainProduct"></el-input>
          </el-form-item>
          <el-form-item label="主要业务类型" prop="businessType" v-show="baseInfoVisible('businessType')">
            <el-select 
              :style="inputStyle" clearable 
              :disabled="type === 'preview'"
              v-model="saveForm.businessType">
              <el-option v-for="type in businessType" :key="type" :value="type"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="主要客户类型" prop="customerTypes" v-show="baseInfoVisible('customerTypes')">
            <el-select 
              :style="inputStyle" clearable multiple
              :disabled="type === 'preview'"
              v-model="saveForm.customerTypes">
              <el-option v-for="type in customerTypes" :key="type" :value="type"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="主要客户名称" prop="customerName" v-show="baseInfoVisible('customerName')">
            <el-input :style="inputStyle" v-model="saveForm.customerName" placeholder="请输入主要客户名称"></el-input>
          </el-form-item>
          <!-- <el-form-item label="营业执照号" prop="businessLicenseNum">
            <el-input :style="inputStyle" v-model="saveForm.businessLicenseNum" placeholder="请输入营业执照号"></el-input>
          </el-form-item> -->
          <el-form-item label="供应商地址" prop="address" v-show="baseInfoVisible('address')">
            <el-input :style="inputStyle" v-model="saveForm.address" placeholder="请输入供应商地址"></el-input>
          </el-form-item>
          <el-form-item label="产权" prop="property" v-show="baseInfoVisible('property')">
            <el-select 
              :style="inputStyle" clearable 
              :disabled="type === 'preview'"
              v-model="saveForm.property">
              <el-option v-for="type in property" :key="type" :value="type"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="成立时间" prop="foundingTime">
            <el-date-picker
              :style="inputStyle"
              v-model="saveForm.foundingTime"
              type="date"
              value-format="timestamp"
              :picker-options="controlTime"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="备注" prop="remark" v-show="baseInfoVisible('remark')">
            <el-input
              :style="inputStyle"
              v-model="saveForm.remark"
              type="textarea"
              placeholder="建议填写供应商网址;限制渠道;是否限价;建议零售价等"
            ></el-input>
          </el-form-item>
          <el-form-item label="简介" prop="intro" v-show="baseInfoVisible('intro')">
            <el-input :style="inputStyle" v-model="saveForm.intro" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="标签" props="tags" v-show="baseInfoVisible('tags')">
            <tags v-model="saveForm.tags" :editable="type !== 'preview'"></tags>
          </el-form-item>
          <el-divider></el-divider>
          <el-form-item label="供应商logo" prop="logo" v-show="baseInfoVisible('logo')">
            <file-list
              v-model="saveForm.logo"
              :addible="type !== 'preview' && saveForm.logo.length === 0"
            ></file-list>
          </el-form-item>
          <el-form-item label="开户许可证" prop="openPermits">
            <file-list v-model="saveForm.openPermits" :addible="type !== 'preview' && saveForm.openPermits.length === 0"></file-list>
          </el-form-item>
          <el-form-item label="营业执照" prop="busiLicenses">
            <file-list v-model="saveForm.busiLicenses" :addible="type !== 'preview' && saveForm.busiLicenses.length === 0"></file-list>
          </el-form-item>
          <el-form-item label="身份复印件" prop="idcards" v-show="baseInfoVisible('idcards')">
            <file-list v-model="saveForm.idcards" :addible="type !== 'preview'"></file-list>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="供应商规模" name="scale">
        <el-form :model="saveForm.supScaleSaveAndUpdateVo" :label-width="labelWidth" inline>
          <el-form-item label="面积" prop="measureArea">
            <el-input 
              :style="inputStyle" 
              v-model="saveForm.supScaleSaveAndUpdateVo.measureArea"
            ></el-input>
          </el-form-item>
          <el-form-item label="员工数量" prop="staffCount">
            <el-input
              :style="inputStyle"
              v-model.number="saveForm.supScaleSaveAndUpdateVo.staffCount"
            ></el-input>
          </el-form-item>
          <el-form-item label="管理人员数量" prop="managerCount">
            <el-input 
              :style="inputStyle" 
              v-model="saveForm.supScaleSaveAndUpdateVo.managerCount"
            ></el-input>
          </el-form-item>
          <el-form-item label="月度产能" prop="monthCapacity">
            <el-input
              :style="inputStyle"
              v-model="saveForm.supScaleSaveAndUpdateVo.monthCapacity"
            ></el-input>
          </el-form-item>
          <el-form-item class="large-form-item" prop="prodDevs">
            <free-form
              v-model="saveForm.supScaleSaveAndUpdateVo.prodDevs"
              title="主要生产设备"
              :options="deviceOptions"
            ></free-form>
          </el-form-item>
          <el-form-item class="large-form-item" prop="testDevs">
            <free-form
              v-model="saveForm.supScaleSaveAndUpdateVo.testDevs"
              title="主要检测设备"
              :options="deviceOptions"
            ></free-form>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="财务信息" name="finance">
        <el-button v-if="type !== 'preview'" type="primary" class="mb10" @click="addEditRow('finance')">新增</el-button>
        <el-form :model="saveForm" ref="financeForm" inline class="edit-table-form">
          <el-table :data="saveForm.supFinances" border stripe style="max-width: 1450px;">
            <el-table-column width="240" label="银行类别">
              <template slot-scope="scope">
                <el-form-item 
                  label=" "
                  :prop="`supFinances[${scope.$index}].bankName`" 
                  :rules="financeRules(scope.$index).bankName">
                  <el-select 
                    :disabled="type === 'preview'"
                    v-model="scope.row.bankName" 
                    @change="(e) => changeNcBank(e, scope.$index)">
                    <el-option
                      v-for="(item,index) in allNcBankCategory"
                      :key="index"
                      :label="item.name"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="开户行" width="220">
              <template slot-scope="scope">
                <el-form-item 
                  label=" "
                  :prop="`supFinances[${scope.$index}].bankBranch`"
                  :rules="financeRules(scope.$index).bankBranch">
                  <el-input v-model="scope.row.bankBranch" placeholder="请输入开户行"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="账户名" width="220">
              <template slot-scope="scope">
                <el-form-item 
                  label=" "
                  :prop="`supFinances[${scope.$index}].accountName`"
                  :rules="financeRules(scope.$index).accountName">
                  <el-input v-model="scope.row.accountName" placeholder="请输入账户名"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="账户号" width="220">
              <template slot-scope="scope">
                <el-form-item 
                  label=" "
                  :prop="`supFinances[${scope.$index}].bankAccount`"
                  :rules="financeRules(scope.$index).bankAccount">
                  <el-input v-model="scope.row.bankAccount" placeholder="请输入账户号"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="币种" width="220">
              <template slot-scope="scope">
                <el-form-item 
                  label=" "
                  :prop="`supFinances[${scope.$index}].currency`"
                  :rules="financeRules(scope.$index).currency">
                  <!-- <el-input v-model="scope.row.currency" placeholder="请输入币种"></el-input> -->
                  <el-select 
                    :disabled="type === 'preview'"
                    v-model="scope.row.currency">
                    <el-option
                      v-for="item in CURRENCY"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="是否境外" width="240">
              <template slot-scope="scope">
                <el-form-item 
                  label=" "
                  :prop="`supFinances[${scope.$index}].isAbroad`"
                  :rules="financeRules(scope.$index).isAbroad">
                  <el-select 
                    clearable
                    :disabled="type === 'preview'"
                    v-model="scope.row.isAbroad">
                    <el-option
                      v-for="item in simpleStatus.properties"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80" fixed="right" v-if="type !== 'preview'">
              <template slot-scope="scope">
                <el-button type="text" @click="delEditRow('finance', scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="供应商联系人" name="contacts">
        <el-button v-if="type !== 'preview'" type="primary" class="mb10" @click="addEditRow('contacts')">新增</el-button>
        <el-form :model="saveForm" ref="contactsForm" inline class="edit-table-form">
          <el-table :data="saveForm.supContacts" border stripe style="max-width: 1650px;">
            <el-table-column label="姓名" width="220">
              <template slot-scope="scope">
                <el-form-item 
                  label=" "
                  :prop="`supContacts[${scope.$index}].fullName`" 
                  :rules="contactRules.fullName">
                  <el-input v-model="scope.row.fullName" placeholder="请输入姓名"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="手机" width="220">
              <template slot-scope="scope">
                <el-form-item 
                  label=" "
                  :prop="`supContacts[${scope.$index}].mobile`"
                  :rules="contactRules.mobile">
                  <el-input v-model="scope.row.mobile" placeholder="请输入手机"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="邮箱" width="220">
              <template slot-scope="scope">
                <el-form-item 
                  label=" "
                  :prop="`supContacts[${scope.$index}].email`"
                  :rules="contactRules.email">
                  <el-input v-model="scope.row.email" placeholder="请输入邮箱"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="性别" width="240">
              <template slot-scope="scope">
                <el-form-item 
                  label=" "
                  :prop="`supContacts[${scope.$index}].gender`"
                  :rules="contactRules.gender">
                  <el-select 
                    clearable
                    :disabled="type === 'preview'"
                    v-model="scope.row.gender">
                    <el-option
                      v-for="item in gender.properties"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="职位" width="220">
              <template slot-scope="scope">
                <el-form-item 
                  label=" "
                  :prop="`supContacts[${scope.$index}].position`"
                  :rules="contactRules.position">
                  <el-input v-model="scope.row.position" placeholder="请输入职位"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="传真" width="220">
              <template slot-scope="scope">
                <el-form-item 
                  label=" "
                  :prop="`supContacts[${scope.$index}].fax`"
                  :rules="contactRules.fax">
                  <el-input v-model="scope.row.fax" placeholder="请输入传真"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="电话" width="220">
              <template slot-scope="scope">
                <el-form-item 
                  label=" "
                  :prop="`supContacts[${scope.$index}].tel`"
                  :rules="contactRules.tel">
                  <el-input v-model="scope.row.tel" placeholder="请输入电话"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80" fixed="right" v-if="type !== 'preview'">
              <template slot-scope="scope">
                <el-button type="text" @click="delEditRow('contacts', scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="内部联系人" name="innerContacts">
        <el-button v-if="type !== 'preview'" type="primary" class="mb10" @click="addEditRow('innerContacts')">新增</el-button>
        <el-form :model="saveForm" ref="innerContactsForm" inline class="edit-table-form">
          <el-table :data="saveForm.innerPersonInfos" border stripe style="width: 1200px;">
            <el-table-column label="姓名" label-class-name="table-label-required">
              <template slot-scope="scope">
                <el-form-item 
                  :prop="`innerPersonInfos[${scope.$index}].fullName`" 
                  :rules="innerRules.fullName">
                  <el-select
                    v-model="scope.row.fullName"
                    filterable
                    remote
                    :disabled="type === 'preview'"
                    reserve-keyword
                    placeholder="请输入姓名"
                    :remote-method="remoteMethod"
                    :loading="innerPersonLoading"
                    @change="(userName) => onChangeUser(userName, scope.$index)">
                    <el-option
                      v-for="(item, i) in innerPersonOptions"
                      :key="i"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="手机" label-class-name="table-label-required">
              <template slot-scope="scope">
                <el-form-item 
                  :prop="`innerPersonInfos[${scope.$index}].tel`"
                  :rules="innerRules.tel">
                  <el-input v-model="scope.row.tel" placeholder="请输入手机"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="所属部门" label-class-name="table-label-required">
              <template slot-scope="scope">
                <el-form-item 
                  :prop="`innerPersonInfos[${scope.$index}].deptName`"
                  :rules="innerRules.deptName">
                  <el-input v-model="scope.row.deptName" placeholder="请输入所属部门"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="负责内容" label-class-name="table-label-required">
              <template slot-scope="scope">
                <el-form-item 
                  :prop="`innerPersonInfos[${scope.$index}].jobTitle`"
                  :rules="innerRules.jobTitle">
                  <el-input v-model="scope.row.jobTitle" placeholder="请输入负责内容"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80" v-if="type !== 'preview'">
              <template slot-scope="scope">
                <el-button type="text" @click="delEditRow('innerContacts', scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="合作信息" name="coop">
        <el-form
          :model="saveForm"
          ref="coopForm"
          :rules="coopRules"
          :label-width="labelWidth"
          inline>
          <el-form-item label="供应商合作等级" prop="coopType" >
            <el-select 
              :style="inputStyle" clearable 
              :disabled="type === 'preview'"
              v-model="saveForm.coopType">
              <el-option v-for="type in coopType" :key="type" :value="type"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="供应商风险等级" prop="riskCategory">
            <el-select 
              :style="inputStyle" clearable 
              :disabled="type === 'preview'"
              v-model="saveForm.riskCategory">
              <el-option
                style="height:100%;"
                v-for="type in riskCategory"
                :key="type.value"
                :value="type.value">
                <div style="font-weight: 700;">{{`风险等级：${type.value}`}}</div>
                <p v-html="type.desc" style="font-size: 1rem;margin-block-start: 0px;margin-block-end: 0px;"></p>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item 
            label="商品服务类型" 
            prop="goodsServiceType" 
            :rules="[
              { required: saveForm.supplierType == '2', message: '商品服务类型', trigger: 'blur' },
            ]">
            <el-select 
              :style="inputStyle" clearable multiple
              :disabled="type === 'preview'"
              v-model="saveForm.goodsServiceType">
              <el-option
                v-for="type in brandCategory.properties"
                :key="type.value"
                :value="type.value"
                :label="type.label"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="合作账期" prop="debtTerm">
            <el-input :style="inputStyle" v-model.number="saveForm.debtTerm" type="number">
              <template slot="append">天</template>
            </el-input>
          </el-form-item>
          <el-form-item label="是否支持一件代发" prop="isSupportRetailEc">
            <el-select 
              :style="inputStyle" clearable 
              :disabled="type === 'preview'"
              v-model="saveForm.isSupportRetailEc">
              <el-option
                v-for="item in allowStatus.properties"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="附件" name="file">
        <el-form :model="saveForm" :label-width="labelWidth">
          <el-form-item label="许可证" prop="licences">
            <file-list v-model="saveForm.licences" :addible="type !== 'preview'"></file-list>
          </el-form-item>
          <el-form-item label="完税证明" prop="taxRecords">
            <file-list v-model="saveForm.taxRecords" :addible="type !== 'preview'"></file-list>
          </el-form-item>
          <el-form-item label="ISO认证" prop="isos">
            <file-list v-model="saveForm.isos" :addible="type !== 'preview'"></file-list>
          </el-form-item>
          <el-form-item label="CSR认证" prop="csrs">
            <file-list v-model="saveForm.csrs" :addible="type !== 'preview'"></file-list>
          </el-form-item>
          <el-form-item label="其它体系认证" prop="systemAuths">
            <file-list v-model="saveForm.systemAuths" :addible="type !== 'preview'"></file-list>
          </el-form-item>
          <el-form-item label="厂房/车间照片" prop="workPics">
            <file-list v-model="saveForm.workPics" :addible="type !== 'preview'"></file-list>
          </el-form-item>
          <el-form-item label="检验报告" prop="insReports">
            <file-list v-model="saveForm.insReports" :addible="type !== 'preview'"></file-list>
          </el-form-item>
          <el-form-item label="组织架构图" prop="orgCharts">
            <file-list v-model="saveForm.orgCharts" :addible="type !== 'preview'"></file-list>
          </el-form-item>
          <el-form-item label="其它证照" prop="otherAttas">
            <file-list v-model="saveForm.otherAttas" :addible="type !== 'preview'"></file-list>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="成功案例" name="success">
        <el-form :model="saveForm" :label-width="labelWidth">
          <el-form-item label="成功案例(可添加一件代发)" prop="successCases">
            <file-list v-model="saveForm.successCases" :size="15" :addible="type !== 'preview'"></file-list>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="align-center">
      <el-button @click="close">关闭</el-button>
      <el-button v-if="type !== 'preview'" type="primary" :disabled="disabledSave" @click="onSave">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { 
  checkSupInfoName, findAllBankCategory, saveSupInfo, updateSupInfo,
  getSupInfoById, getJobTitleById, getAllEcologyUsers
} from '@/api/supplier'
import { supplierType, simpleStatus, gender, allowStatus } from "@/const/supplier/index"
import { CURRENCY } from "@/const/currency"
import GoodsCateCascader from "_c/GoodsCateCascader"
import PartsCateCascader from "_c/PartsCateCascader"
import CountrySelect from "_c/CountrySelect"
import FileList from "_c/FileList"
import FreeForm from "_c/FreeForm"
import { brandCategory } from "@/const/goods"
import Tags from "_c/Tags"

export default {
  inheritAttrs: false,
  
  props: {
    supTypesOptions: {
      type: Array,
      default: () => []
    },
    type: {
      type: String
    },
    id: String,
  },

  components: {
    GoodsCateCascader,
    PartsCateCascader,
    CountrySelect,
    FileList,
    FreeForm,
    Tags
  },

  data() {
    return {
      activeName: "base",
      saveForm: {
        tags: [], // 标签
        supScaleSaveAndUpdateVo: {}, // 供应商规模
        supFinances: [], // 财务信息
        supContacts: [], // 供应商联系人
        innerPersonInfos: [], // 内部联系人
        busiLicenses: [],
        openPermits: [],
        logo: []
      },
      coopRules: {
        coopType: [{ required: true, message: "请输入合作等级", trigger: "change" }],
        riskCategory: [{ required: true, message: "请输入风险等级", trigger: "change" }],
      },
      labelWidth: '200px', 
      inputStyle: { width: "200px" },
      supplierType,
      simpleStatus,
      gender,
      brandCategory,
      allowStatus,
      CURRENCY,
      businessType: ["内销", "外销"],
      customerTypes: ["商超", "电商", "便利店", "药妆店", "其他"],
      nature: ["外资", "合资", "民营", "股份制", "个人", "其他"],
      property: ["自有", "租赁"],
      deviceOptions: [
        { key: "dev", label: "设备名称", type: "input", reqired: true },
        { key: "count", label: "数量", type: "input", reqired: true }
      ],
      coopType: ["战略合作", "长期合作", "短期合作", "一次性合作"],
      riskCategory: [
        { value: "A", desc: `根据渠道要求，需要实施第三方审核的.` },
        {
          value: "B",
          desc: `1.根据渠道要求，不需要实施第三方审核，但长期(≥1年)为我司提供产品及服务的.<br/>2.属于食品、医械、卫生、化妆品、3C等相对安全、品质风险较高的产品品类.`
        },
        {
          value: "C",
          desc: `1.根据渠道要求，不需要实施第三方审核，但长期(≥1年)为我司提供产品及服务的.<br/>2.属于日用生活等相对安全、品质风险较低产品品类.`
        },
        {
          value: "D",
          desc: `1.长期(≥1年)合作供应商，但属于特殊产品品类（包装非产品品类）。<br/>2.短期(＜1年)或一次性为我司提供产品及服务的供应商。`
        }
      ],
      allNcBankCategory: [],
      loading: false,
      innerPersonLoading: false,
      innerPersonOptions: [],
      ecologyUsers: [], // 内部跟进人信息,名字列表
      controlTime: {
        disabledDate(date) {
          return date.getTime() > Date.now()
        }
      },
      disabledSave: false
    }
  },

  computed: {
    // 基础信息表单项展示
    baseInfoVisible() {
      return (type) => {
        let isShow = false
        switch(type) {
          case 'abbr': // 供应商简称
             isShow = this.saveForm.supplierType == '2'
            break;
          case 'nameEn': // 供应商名称-英文
             isShow = this.saveForm.supplierType == '2'
            break;
          case 'nameUsed': // 曾用名
             isShow = this.saveForm.supplierType == '2'
            break;
          case 'country': // 国家
             isShow = this.saveForm.supplierType == '2'
            break;
          case 'types': // 供货类型
             isShow = this.saveForm.supplierType == '2'
            break;
          case 'productCategorys': // 供货分类
             isShow = this.saveForm.supplierType == '2'
            break;
          case 'manageBrank': // 经营品牌
             isShow = this.saveForm.supplierType == '2'
            break;
          case 'mainProduct': // 主供商品
             isShow = this.saveForm.supplierType == '2'
            break;
          case 'businessType': // 主要业务类型
             isShow = this.saveForm.supplierType == '2'
            break;
          case 'customerTypes': // 主要客户类型
             isShow = this.saveForm.supplierType == '2'
            break;
          case 'customerName': // 主要客户名称
             isShow = this.saveForm.supplierType == '2'
            break;
          case 'address': // 供应商地址
             isShow = this.saveForm.supplierType == '2'
            break;
          case 'property': // 产权
             isShow = this.saveForm.supplierType == '2'
            break;
          case 'intro': // 供应商简介
             isShow = this.saveForm.supplierType == '2'
            break;
          case 'remark': // 供应商备注
             isShow = this.saveForm.supplierType == '2'
            break;
          case 'tags': // 标签
             isShow = this.saveForm.supplierType == '2'
            break;
          case 'logo': // 供应商logo
             isShow = this.saveForm.supplierType == '2' && this.saveForm.nature != '个人'
            break;
          case 'openPermits': // 开户证明附件 当前供应商类型不再影响展示
             isShow =  this.saveForm.nature != '个人'
            break;
          case 'busiLicenses': // 营业执照附件 当前供应商类型不再影响展示
             isShow =  this.saveForm.nature != '个人'
            break;
          case 'idcards': // 身份证复印件
             isShow = this.saveForm.nature == '个人'
            break;
          default: 
            break;
        }
        return isShow
      }
    },

    // 基础信息表单校验
    baseRules() {
      let checkSupName = async (rule, value, callback) => {
        let data = {}
        data.id = this.saveForm.id
        data.name = this.saveForm.name
        await checkSupInfoName(data).then(() => {
          callback()
        }).catch(() => {
          return callback(new Error('供应商已存在'))
        })
      }
      let rules = {
        name: [
          { required: true, message: "请输入供应商名称", trigger: "blur"},
          { validator: checkSupName, trigger: 'blur' }
        ],
        supplierType: [{ required: true, message: "请选择供应商类型", trigger: "change" }],
        nature: [{ required: true, message: "请输入企业性质", trigger: "change" }],
        legalMan: [{ required: true, message: "请输入企业法人", trigger: "blur" }],
        isGeneralTaxpayer: [{ required: true, message: "请选择是否一般纳税人", trigger: "change" }],
        taxNo: [{ required: true, message: "请输入营业执照号", trigger: "blur" }],
        productCategorys: [],
        partsCategorys: [],
        // businessLicenseNum: [
        //   { required: true, message: '请输入营业执照号', trigger: 'blur' },
        //   { pattern: /^[0-9a-zA-Z]{18}$/, message: '请输入正确的营业执照号(18位英文数字组合)', trigger: 'blur' }
        // ],
        mainProduct: [],
        country: [],
        types: [],
        customerTypes: [],
        customerName: [],
        foundingTime: [{ required: true, message: "请选择成立时间", trigger: "change" }],
        address: [],
        logo: [],
        openPermits: [],
        busiLicenses: [],
        idcards: []
      }
      if (this.saveForm.supplierType == '2') {
        // 主供商品
        rules['mainProduct'].push({ required: true, message: "请输入主供商品", trigger: "blur" })
        // 国家
        rules['country'].push({ required: true, message: "请选择国家", trigger: "change" })
        // 供货类型
        rules['types'].push({ required: true, message: "请选择供货类型", trigger: "change" })
        // 客户类型
        rules['customerTypes'].push({ required: true, message: "请选择主要客户类型", trigger: "change" })
        // 主要客户名称
        rules['customerName'].push({ required: true, message: "请输入主要客户名称", trigger: "blur" })
        // 供应商地址
        rules['address'].push({ required: true, message: "请输入供应商地址", trigger: "blur" })
      }
      if (this.saveForm.supplierType == '2' && this.saveForm.nature != '个人') {
        // 供应商logo
        rules['logo'].push({ required: true, message: "请上传供应商logo", trigger: "change" })
        // 开户证明附件
        rules['openPermits'].push({ required: true, message: "请上传开户证明附件", trigger: "change" })
        // 营业执照附件
        rules['busiLicenses'].push({ required: true, message: "请上传营业执照附件", trigger: "change" })
      }
      if (this.saveForm.nature == '个人') {
        // 身份证
        rules['idcards'].push({ required: true, message: "请上传身份证复印件", trigger: "change" })
      }
      if (this.saveForm.country == '中国'  && this.saveForm.nature != '个人') { //
        // 个人供应商，纳税人识别码为身份证，校验字段应该不要求是18位中英文
        rules['taxNo'].push({ pattern: /^[0-9a-zA-Z]{18}$/, message: '请输入18位英文数字组合', trigger: 'blur' })
      }
      if (this.saveForm.country == '中国'  && this.saveForm.nature === '个人') { //
        // 个人供应商，纳税人识别码为身份证，校验字段应该不要求是18位中英文
        rules['taxNo'].push({ pattern: /^[1-9]\d{5}(18|19|(2\d))\d{2}(0[1-9]|1[0-2])(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, message: '请输入正确的身份证号码', trigger: 'blur' })
      }
      let types = this.saveForm.types || []
      if (types.includes('1')) {
        rules['productCategorys'].push({ required: true, message: "请选择商品分类", trigger: "change" })
      }
      if (types.includes('2')) {
        rules['partsCategorys'].push({ required: true, message: "请选择配件分类", trigger: "change" })
      }

      this.$nextTick(() => {
        if (this.$refs['baseForm']) this.$refs['baseForm'].clearValidate()
      })
      return rules
    },

    // 财务信息表单校验
    financeRules() {
      return (index) => {
        let rules = {
          bankName: [{ required: true, message: "请输入银行类别", trigger: "blur" }],
          bankBranch: [],
          accountName: [{ required: true, message: "请输入公司银行账户名称", trigger: "blur" }],
          bankAccount: [{ required: true, message: "请输入银行账号", trigger: "blur" }],
          currency: [{ required: true, message: "请输入币种", trigger: "blur" }],
          isAbroad: [{ required: true, message: "请选择是否境外", trigger: "change" }]
        }
        if (this.saveForm.supFinances[index] && this.saveForm.supFinances[index].bankName == '企业支付宝') {
          rules['bankAccount'].push({ pattern: /^[0-9a-zA-Z_@.-]+$/, message: '账号只能是数字字母或者邮箱' })
        } else {
          rules['bankBranch'].push({ required: true, message: "请输入开户行", trigger: "blur" })
          rules['bankAccount'].push({ pattern: /^[0-9]+$/, message: '银行账号只能是数字' })
        }
        return rules
      }
    },

    // 供应商联系人表单校验
    contactRules() {
      let rules = {
        fullName: [{ required: true, message: "请输入供应商联系人姓名", trigger: "blur" }],
        mobile: [{ pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '手机号码格式不正确',  trigger: 'blur' }],
        email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
      }
      if (this.saveForm.country == '中国') {
        rules['mobile'].push({ required: true, message: '请输入手机号码', trigger: 'blur' })
      }
      return rules
    },

    // 内部联系人表单校验
    innerRules() {
      let rules = {
        fullName: [{ required: true, message: '请输入名称', trigger: 'change' }],
        tel: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
        deptName: [{ required: true, message: '请输入部门', trigger: 'blur' }],
        jobTitle: [{ required: true, message: '请输入负责内容', trigger: 'blur' }],
      }
      return rules
    }

  },

  methods: {
    async onOpen() {
      try {
        console.log('onOpen', this.type)
        this.loading = true
        await findAllBankCategory().then(res => {
          this.allNcBankCategory = res
        })
        
        await getAllEcologyUsers().then(res => {
          this.ecologyUsers = res.map(item => {
            return { value: item.lastname, label: item.lastname, userInfo: item, mobile: item.mobile }
          })
        })
        
        if (this.id) {
          await this.fetchSupInfo()
        }
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    fetchSupInfo() {
      return getSupInfoById(this.id).then(res => {
        res.id += ""
        res.tags = res.tagList || []
        res.types = res.typeList
        res.customerTypes = res.customerTypeList
        res.goodsServiceType = res.goodsServiceTypeList
        res.supScaleSaveAndUpdateVo = res.supScaleVo || {}
        res.supScaleSaveAndUpdateVo.prodDevs = res.supScaleSaveAndUpdateVo.prodDeviceList
        res.supScaleSaveAndUpdateVo.testDevs = res.supScaleSaveAndUpdateVo.testDeviceList
        res.supFinances = res.supFinances || []
        res.supContacts = res.supContacts || []
        res.innerPersonInfos = res.innerSupContacts || []
        res.productCategorys = res.categorys.map(cate => {
          return cate.code;
        })
        res.partsCategorys = res.partsCategorys.map(cate => {
          return cate.code
        })
        if (res.logo) {
          let arr = res.logo.split(".")
          let fileType = arr[arr.length - 1]
          res.logo = [{ attaUrl: res.logo, fileName: "", fileType }]
        } else {
          res.logo = []
        }
        if (res.busiLicenses && res.busiLicenses.length > 1) {
          res.busiLicenses = res.busiLicenses.slice(0, 1)
        }
        if (res.openPermits && res.openPermits.length >= 1) {
          res.openPermits = res.openPermits.slice(0, 1)
        }
        this.saveForm = res
      })
    },

    onClose() {
      Object.assign(this.$data, this.$options.data())
      // this.$refs['baseForm'].clearValidate()
    },

    close() {
      this.$emit('update:visible', false)
    },

    changeNcBank(e, index) {
      this.allNcBankCategory.map(item => {
        if (item.code === e) {
          this.saveForm.supFinances[index].ncBankPk = item.ncPk
          this.saveForm.supFinances[index].bankName = item.name
        }
      })
    },

    async onSave() {
      try {
        this.disabledSave = true
        // 基础信息
        let baseValid = await new Promise(resolve => {
          this.$refs['baseForm'].validate((valid) => {
            resolve(valid)
          })
        }) 
        console.log('baseValid', baseValid)
        if (!baseValid) {
          this.$message.warning('请完善基础信息必填项')
          this.activeName = 'base'
          return
        }
  
        // 财务信息
        if (this.saveForm.supFinances.length === 0) {
          this.$message.warning('财务信息不能为空')
          this.activeName = 'finance'
          return
        }
        let financeValid = false 
        this.$refs['financeForm'].validate((valid) => {
          financeValid = valid
        })
        console.log('financeValid', financeValid)
        if (!financeValid) {
          this.$message.warning('请完善财务信息必填项')
          this.activeName = 'finance'
          return
        }
        
        // 供应商联系人
        if (this.saveForm.supContacts.length === 0) {
          this.$message.warning('供应商联系人不能为空')
          this.activeName = 'contacts'
          return
        }
        let contactsValid = false 
        this.$refs['contactsForm'].validate((valid) => {
          contactsValid = valid
        })
        console.log('contactsValid', contactsValid)
        if (!contactsValid) {
          this.$message.warning('请完善供应商联系人信息必填项')
          this.activeName = 'contacts'
          return
        }
  
        // 内部联系人
        if (this.saveForm.innerPersonInfos.length === 0) {
          this.$message.warning('内部联系人不能为空')
          this.activeName = 'innerContacts'
          return
        }
        let innerContactsValid = false
        this.$refs['innerContactsForm'].validate((valid) => {
          innerContactsValid = valid
        })
        console.log('innerContactsValid', innerContactsValid)
        if (!innerContactsValid) {
          this.$message.warning('请完善内部联系人信息必填项')
          this.activeName = 'innerContacts'
          return
        }
  
        // 合作信息
        let coopValid = false
        this.$refs['coopForm'].validate((valid) => {
          coopValid = valid
        })
        console.log('coopValid', coopValid)
        if (!coopValid) {
          this.$message.warning('请完善合作信息必填项')
          this.activeName = 'coop'
          return
        }
        this.$confirm("确认保存吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.saveSupplierInfo()
        })
      } catch (error) {
        console.error(error)
      } finally {
        this.disabledSave = false
      }
    },

    saveSupplierInfo: _.debounce(function() {
      console.log('提交')
      let params = _.cloneDeep(this.saveForm)
      if (params.logo && params.logo.length > 0) {
        params.logo = params.logo[0].attaUrl
      } else {
        params.logo = null
      }
      let http
      if (this.type === 'edit') {
        http = updateSupInfo
      } else if (this.type === 'add') {
        http = saveSupInfo
      }
      this.loading = true
      http(params).then(res => {
        this.$message.success("保存成功！")
        this.close()
        this.$emit('success')
      }).finally(() => {
        this.loading = false
      })
    }, 300),

    addEditRow(type) {
      if (type === 'finance') {
        this.saveForm.supFinances.push({
          bankName: '',
          bankBranch: '',
          accountName: '',
          bankAccount: '',
          currency: '',
          isAbroad: false,
        })
      } else if (type === 'contacts') {
        this.saveForm.supContacts.push({
          bankName: '',
          bankBranch: '',
          accountName: '',
          bankAccount: '',
          currency: '',
          isAbroad: '',
        })
      } else if (type === 'innerContacts') {
        this.saveForm.innerPersonInfos.push({
          fullName: '',
          tel: '',
          deptName: '',
          jobTitle: ''
        })
        if (this.saveForm.innerPersonInfos.length === 1) {
          let i = this.ecologyUsers.findIndex(e => e.mobile === this.$store.getters.userInfo.mobile)
          // console.log('i', i)
          if (i >= 0) {
            // console.log('item', this.ecologyUsers[i])
            this.setInnerContacts(0, this.ecologyUsers[i].userInfo)
            return
          }
        }
      }
    },

    delEditRow(type, index) {
      if (type === 'finance') {
        this.saveForm.supFinances.splice(index, 1)
      } else if (type === 'contacts') {
        this.saveForm.supContacts.splice(index, 1)
      } else if (type === 'innerContacts') {
        this.saveForm.innerPersonInfos.splice(index, 1)
      }
    },

    remoteMethod(query) {
      if (query !== "") {
        this.innerPersonLoading = true
        setTimeout(() => {
          this.innerPersonLoading = false
          this.innerPersonOptions = this.ecologyUsers.filter(item => {
            return item.label.indexOf(query) > -1
          })
        }, 200)
      } else {
        this.innerPersonOptions = []
      }
    },

    onChangeUser(userName, index) {
      let userInfo = null
      this.ecologyUsers.forEach((item) => {
        if (item.label == userName) {
          userInfo = item.userInfo
        }
      })
      if (userInfo !== null) {
        this.setInnerContacts(index, userInfo)
      }
    },
    
    setInnerContacts(index, userInfo) {
      this.saveForm.innerPersonInfos[index].deptName = userInfo.departmentname //所属部门
      this.saveForm.innerPersonInfos[index].deptId = userInfo.departmentid //所属部门id
      this.saveForm.innerPersonInfos[index].email = userInfo.email //邮箱
      this.saveForm.innerPersonInfos[index].fullName = userInfo.lastname //姓名
      this.saveForm.innerPersonInfos[index].tel = userInfo.mobile //电话
      getJobTitleById(userInfo.jobtitle).then(res => {
        this.saveForm.innerPersonInfos[index].jobTitleId = res._jobtitleid
        this.saveForm.innerPersonInfos[index].jobTitle = res._fullname
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.large-form-item {
  width: 99.9%;
  /deep/ .el-form-item__content {
    width: 99.9%;
  }
}

.edit-table-form{
  /deep/ .el-form-item__content {
    margin-bottom: 0;
    display: flex;
    align-items: center;
  }
  /deep/ .el-form-item {
    display: flex;
  }
}
</style>