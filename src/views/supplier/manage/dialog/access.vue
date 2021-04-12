<template>
  <el-dialog v-bind="$attrs" v-on="$listeners" @open="onOpen" @close="onClose">
    <el-form label-width="100px" :rules="accessRules">
      <div style="display: flex; align-items: center;">
        <el-form-item label="供应商名称">{{ supInfo.name }}</el-form-item>
        <el-form-item label="申请人">
          {{ userInfo.loginAcount || userInfo.mobile }}
        </el-form-item>
      </div>
      <el-form-item label="审核状态">
        {{ accessStatus[supInfo.accessStatus] || accessStatus['30'] }}
      </el-form-item>
      <el-form-item label="分管组织" prop="deptIds">
        <el-cascader
          :disabled="!['30', '100'].includes(supInfo.accessStatus)"
          :props="defaultParams"
          :options="departments"
          :show-all-levels="false"
          v-model="supInfo.deptIds"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="是否客户指定供应商" prop="isAssagin">
        <el-select
          v-model="supInfo.isAssagin"
          :disabled="!['30', '100'].includes(supInfo.accessStatus)">
          <el-option label="是" :value="true"></el-option>
          <el-option label="否" :value="false"></el-option>
        </el-select>
      </el-form-item>
      <div>
        <el-badge :value="improvePlanData.scoreList.length">
          <el-button style="color:#606266;cursor:auto;font-size:16px;" type="text" size="big">评分改进</el-button>
        </el-badge>
        <el-badge>
          <el-button
            @click="improvePlanData.expandScoreInfo = !improvePlanData.expandScoreInfo"
            style="margin:0 20px;font-size:16px;"
            type="text"
            size="big"
          >{{ improvePlanData.expandScoreInfo ? '收起' : '展开' }}</el-button>
        </el-badge>
        <el-table
          v-show="improvePlanData.expandScoreInfo"
          class="mt10"
          :data="improvePlanData.scoreList">
          <el-table-column label="序号" type="index" width="50"></el-table-column>
          <el-table-column label="审核说明" prop="zgjy_desc"></el-table-column>
          <el-table-column
            prop="zgjy_improve_plan"
            label="改进计划"
            :class-name="isRequiredPlain ? 'must' : ''">
            <template slot-scope="scope">
              <el-input
                :disabled="['30', '35', '40', '60', '70', '75', '80', '90', '95', '100'].includes(supInfo.accessStatus)"
                type="textarea"
                v-model="scope.row.zgjy_improve_plan"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="改进结果"
            prop="zgjy_improve_result"
            :class-name="isRequireResult ? 'must' : ''">
            <template slot-scope="scope">
              <el-input
                :disabled="['30', '35', '40', '50', '55', '60', '80', '90', '95', '100'].includes(supInfo.accessStatus)"
                type="textarea"
                v-model="scope.row.zgjy_improve_result"
              />
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="zgjy_remark">
            <template slot-scope="scope">
              <el-input
                :disabled="['30', '35', '40', '50', '55', '60', '80', '100'].includes(supInfo.accessStatus)"
                type="textarea"
                v-model="scope.row.zgjy_remark"
              />
            </template>
          </el-table-column>
          <el-table-column label="附件" prop="zgjy_atta" width="280">
            <template slot-scope="scope">
              <div class="row">
                <el-upload
                  :disabled="disabledAtta"
                  action="#"
                  :multiple="false"
                  :http-request="(data) => onUploadAtta(data, scope.$index)"
                  :show-file-list="false">
                  <el-button
                    size="mini"
                    type="primary"
                    :disabled="!['70','75','90'].includes(supInfo.accessStatus)"
                    plain
                  >上传</el-button>
                </el-upload>
                <div class="flex-1 pl20">
                  <div
                    class="row space-between"
                    v-for="(atta, i) in scope.row.zgjy_atta"
                    :key="i">
                    <el-link type="primary" :href="atta" target="_blank">附件{{ i + 1 }}</el-link>
                    <el-button
                      v-show="disabledAtta"
                      type="text"
                      icon="el-icon-close"
                      :disabled="!['70','75','90'].includes(supInfo.accessStatus)"
                      @click="onRemoveAtta(scope.$index, i)"
                    ></el-button>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-form>
    <div>
      <el-badge style="margin:20px 0;" :value="improvePlanData.checkList.length" class="item">
        <el-button style="color:#606266;cursor:auto;font-size:16px;" type="text" size="big">审核信息</el-button>
      </el-badge>
      <el-badge>
        <el-button
          @click="improvePlanData.expandCheckInfo = !improvePlanData.expandCheckInfo"
          style="margin:0 20px;font-size:16px;"
          type="text"
          size="big"
        >{{ improvePlanData.expandCheckInfo ? '收起' : '展开' }}</el-button>
      </el-badge>
      <ul v-show="improvePlanData.expandCheckInfo" class="checkMessage">
        <li v-for="info in improvePlanData.checkList" :key="info.id">
          <img :src="require('@/assets/images/logo.png')" />
          <div class="detail">
            <p>
              <span>{{ info.operator || '-' }}</span>
              <el-tag
                v-if="['1'].includes(info.result)"
                class="ml10"
                size="mini"
              >{{info.nodeName}}--批准</el-tag>
              <el-tag
                v-if="['0'].includes(info.result)"
                class="ml10"
                size="mini"
              >{{info.nodeName}}--退回</el-tag>
            </p>
            <p>{{ info.operatorDepartment || '-' }}</p>
          </div>
          <div class="detailMessage">
            <p>审批意见：{{ info.remark || '-' }}</p>
            <p>接收人：{{ info.reciver || '-' }}</p>
            <p>时间：{{ info.approveTime | formatDate('Y-M-D h:m:s') }}</p>
          </div>
        </li>
      </ul>
    </div>
    <div slot="footer">
      <el-button @click="close">关 闭</el-button>
      <el-button
        type="danger"
        :disabled="['30', '40', '60', '80', '100'].includes(supInfo.accessStatus) || (supInfo.checkedStatus == '1' && !supInfo.accessStatus)"
        :loading="loading === 'cancel'"
        @click="onCancelSupplier"
      >取消准入</el-button>
      <el-button
        type="primary"
        :disabled="['40', '60', '80', '95', '100'].includes(supInfo.accessStatus)"
        @click="onApplySupplier"
        :loading="loading === 'apply'"
      >提交准入</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { uploadOss } from "@/api/uploadOss"
import { isEmpty } from "@/utils/index"
import { getImprovePlan, applySupplier, doAbandan } from "@/api/supplier"
import { accessStatus } from "@/const/supplier/index"

export default {
  inheritAttrs: false,
  props: {
    rowData: Object,
    departments: Array,
  },
  data() {
    return {
      supInfo: {},
      accessRules:{
        deptIds: [
          { required: true, message: "请选择部门", trigger: "blur" }
        ],
        isAssagin : [
          { required: true, message: "请选择是否客户指定", trigger: "blur" }
        ]
      },
      defaultParams: {
        label: "_fullname",
        value: "_departmentid",
        children: "departmentBeanList",
        checkStrictly: true
      },
      improvePlanData: {
        expandCheckInfo: false, // 展开审核信息，默认false
        expandScoreInfo: true, // 展开评分改进，默认true
        checkList: [], // 审核信息列表
        scoreList: [] // 评分改进列表数据
      },
      loading: null,
      accessStatus,
      supApproveLogId: '',
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    // 供应商准入-是否禁用附件（不能上传和删除）
    disabledAtta() {
      return ["30", "35", "40", "50", "60", "80", "100"].includes(this.supInfo.accessStatus)
    },
    // 供应商准入-改进计划是否必填
    isRequiredPlain() {
      return ["50", "55"].includes(this.supInfo.accessStatus)
    },
    // 供应商准入-改进结果是否必填
    isRequireResult() {
      return ["70", "75"].includes(this.supInfo.accessStatus)
    }
  },
  methods: {
    onOpen() {
      this.supInfo = _.cloneDeep(this.rowData)
      this.supInfo.deptIds = []
      if (this.supInfo.belongCompanyId) {
        this.supInfo.deptIds.push(this.supInfo.belongCompanyId.toString())
      }
      if (this.supInfo.belongDeaprtId) {
        this.supInfo.deptIds.push(this.supInfo.belongDeaprtId.toString())
      }
      getImprovePlan(this.supInfo.id).then(res => {
        this.improvePlanData.checkList = res
        if (this.improvePlanData.checkList.length) {
          let first = this.improvePlanData.checkList[0]
          this.supApproveLogId = this.improvePlanData.checkList[0].id
          // 拿最新的id
          if (first.zgjy) {
            let jsonArray = JSON.parse(first.zgjy)
            this.improvePlanData.scoreList = []
            jsonArray.forEach(e => {
              if (isEmpty(e.zgjy_atta)) {
                e.zgjy_atta = []
              } else {
                e.zgjy_atta = e.zgjy_atta.split("|")
              }
              this.improvePlanData.scoreList.push(e)
              this.improvePlanData.scoreList = this.improvePlanData.scoreList.filter(a => a.zgjy_score != "99999")
            })
          }
        }
        for(let item of res) {
          if(item.zgjy) {
            item.zgjy = JSON.parse(item.zgjy)
          }
        }
      })
    },
    onClose() {
      this.improvePlanData = {
        expandCheckInfo: false, // 展开审核信息，默认false
        expandScoreInfo: true, // 展开评分改进，默认true
        checkList: [], // 审核信息列表
        scoreList: [] // 评分改进列表数据
      }
    },
    close() {
      this.$emit('update:visible', false)
    },
    // 附件上传
    onUploadAtta(data, index) {
      // console.log(data, index)
      let formData = new FormData()
      formData.append("file", data.file)
      this.$store.commit("SHOW_LOADING", "上传附件...")
      uploadOss(formData).then(res => {
        console.log("上传附件成功", res)
        this.improvePlanData.scoreList[index].zgjy_atta.push(res.url);
      }).finally(() => {
        this.$store.commit("SHOW_LOADING", false)
      })
    },
    // 删除附件
    onRemoveAtta(pIndex, index) {
      this.$confirm("确认删除附件？", {
        type: "warning"
      }).then(() => {
        this.improvePlanData.scoreList[pIndex].zgjy_atta.splice(index, 1)
      })
    },
    // 提交准入
    onApplySupplier() {
      if (this.isRequiredPlain) {
        if (this.improvePlanData.scoreList.some(e => isEmpty(e.zgjy_improve_plan))) {
          this.$message.error("改进计划不能为空")
          return
        }
      }
      if (this.isRequireResult) {
        if (this.improvePlanData.scoreList.some(e => isEmpty(e.zgjy_improve_result))) {
          this.$message.error("改进结果不能为空")
          return
        }
      }
      if (!(this.supInfo.deptIds[0] && this.supInfo.deptIds[1])) {
        this.$message.error("组织和部门不能为空")
        return
      }
      if (this.supInfo.isAssagin === true || this.supInfo.isAssagin === false) {
        let zgjyArray = []
        let copyList = _.cloneDeep(this.improvePlanData.scoreList)
        copyList.forEach(item => {
          item.zgjy_atta = item.zgjy_atta.join("|")
          zgjyArray.push(item)
        })
        let params = {
          accessStatus: this.supInfo.accessStatus,
          belongCompanyId: Number(this.supInfo.deptIds[0]),
          belongDeaprtId: Number(this.supInfo.deptIds[1]),
          isAssagin: this.supInfo.isAssagin,
          supId: this.supInfo.id,
          zgjy: JSON.stringify(zgjyArray),
          supApproveLogId: this.supApproveLogId
        }
        this.loading = 'apply'
        applySupplier(params).then(res => {
          this.$message.success("提交成功")
          this.close()
          this.$emit('success')
        }).finally(() => {
          this.loading = null
        })
      } else {
        this.$message.error("请选择是否客户不能为空")
        return
      }
    },
    // 取消准入
    onCancelSupplier() {
      this.$confirm("确删除取消准入？", {
        type: "warning"
      }).then(() => {
        let params = {
          requestid: this.improvePlanData.checkList[0].flowId,
          supId: this.supInfo.id
        }
        // console.log(params)
        this.loading = 'canccel'
        doAbandan(params).then(() => {
          this.$message.success("取消准入成功")
          this.close()
          this.$emit('success')
        }).finally(() => {
          this.loading = null
        })
      })
    },
  }
};
</script>

<style lang="scss" scoped>
/deep/ table th.must div:before {
  content: "* ";
  color: #ff1818;
}
.checkMessage{
  list-style: none;
  padding: 0;
  margin: 0;
  li{
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    height:100px;
    margin-bottom: 10px;
    display: flex;
    width:50%;
    justify-content: space-between;
    align-items: center;
    img{
      width: 60px;
      height: 60px;
      margin:4px 10px;
    }
    div{
      flex: 1;
    }
    .detail{
      >p:nth-child(1){
        color: #409eff;
      }
      >p:nth-child(2){
        color:#bbb;
      }
    }
    .detailMessage{
      color:#888;
      >p:nth-child(1){
        color:red;
      }
      >p:nth-child(2){
        color:#222;
      }
    }
  }
}
</style>