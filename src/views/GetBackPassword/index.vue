<template>
  <div class="w-h-full blue-bg">
    <div class="w500 pos-center" >
      <el-card style="min-height: 300px;">
        <div v-if="!urlToken">
          <el-button size="large" type="text" icon="el-icon-arrow-left" class="mb10" @click="$router.replace('/login')">返回登录</el-button>
          <el-tabs>
            <el-tab-pane>
              <span slot="label"><i class="el-icon-mobile-phone"></i> 通过手机找回密码</span>
              <div class="ptb10">
                <el-input v-model="mobile" placeholder="请输入手机号码">
                  <i class="el-icon-mobile-phone" slot="prepend"></i>
                </el-input>
                <div class="row pt20">
                  <el-input v-model="vCode" placeholder="请输入验证码" style="width: 330px">
                  </el-input>
                  <el-button :loading="vCodeBtnLoading" type="success" class="ml20 w120" @click="sendFindPwdSms" :disabled="disabledVCodeBtn">{{ vCodeBtnText }}</el-button>
                </div>
                <el-form :model="mobilePwdForm" label-width="80">
                  <el-form-item label="新密码" prop="newPwd">
                    <el-input type="password" v-model="mobilePwdForm.newPwd" placeholder="新密码" />
                  </el-form-item>
                  <el-form-item label="确认新密码" prop="confirmPwd">
                    <el-input type="password" v-model="mobilePwdForm.confirmPwd" placeholder="确认新密码" />
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="resetPasswordMobile" :loading="submitMobilebtnLoading">提交</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </el-tab-pane>
            <el-tab-pane>
              <span slot="label"><i class="el-icon-message"></i> 通过邮箱找回密码</span>
              <div class="row pt20">
                <el-input v-model="email" placeholder="请输入邮箱" style="width:380px">
                </el-input>
                <el-button type="success" class="ml20" @click="sendFindPwdEmail" :loading="sendEmailBtnLoading">发送</el-button>
                </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div v-if="urlToken">
          <el-steps :active="1" class="pt20 pb40">
            <el-step title="邮箱验证"></el-step>
            <el-step title="修改密码"></el-step>
          </el-steps>
          <el-form :model="emailPwdForm" label-width="80">
            <el-form-item label="新密码" prop="newPwd">
              <el-input type="password" v-model="emailPwdForm.newPwd" placeholder="新密码" />
            </el-form-item>
            <el-form-item label="确认新密码" prop="confirmPwd">
              <el-input type="password" v-model="emailPwdForm.confirmPwd" placeholder="确认新密码" />
            </el-form-item>
            <el-form-item>
              <el-button type="success" @click="resetPasswordEmail" :loading="submitEmailbtnLoading">提交</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUrlParam, checkEmail, checkMobile } from '@/utils'
import { sendSms, sendEmail, verifyEmailTokenAndModifyPwd, verifyFindCodeAndModifyPwd } from '@/api/user'

let intervalTime = 60
export default {
  name: 'GetBackPassword',
  components: {},
  data() {
    return {
      mobile: '', // 手机号码
      vCode: '', // 验证码
      email: '', // 邮箱
      emailPwdForm: { // 从邮箱链接回来时重置新密码
        newPwd: '',
        confirmPwd: ''
      },
      mobilePwdForm: { // 手机方式重置密码
        newPwd: '',
        confirmPwd: ''
      },
      vCodeTime: intervalTime, // 可以重新发送的时间间隔
      disabledVCodeBtn: false, // 禁用获取验证码按钮
      vCodeBtnText: '获取验证码', 
      vCodeInterval: null, // 验证码可以重新的获取定时器
      vCodeBtnLoading: false,
      submitMobilebtnLoading: false,
      sendEmailBtnLoading: false,
      submitEmailbtnLoading: false,
      urlToken: '', // 地址栏上的token
    }
  },
  computed: {
  },
  created() {
    if (getUrlParam(location.href, 'token')) {
      this.urlToken = getUrlParam(location.href, 'token')
    }
  },
  mounted() {},
  methods: {
    // 发送短信验证码
    sendFindPwdSms() {
      let mobile = this.mobile.trim()
      if (mobile === '') {
        this.$message.warning('请输入手机号')
        return
      }
      if (!checkMobile(mobile)) {
        this.$message.warning('手机号码格式不正确')
        return
      }
      this.vCodeBtnLoading = true
      sendSms(mobile)
      .then(res => {
        this.$message.success('短信已发送，请注意查收!')
        this.disabledVCodeBtn = true
        this.vCodeBtnText = `${intervalTime}s`
        this.vCodeInterval = setInterval(() => {
          this.vCodeBtnText = `${this.vCodeTime}s`
          this.vCodeTime--
        }, 1000)
      }).finally(() => {
        this.vCodeBtnLoading = false
      })
    },
    // 发送邮件
    sendFindPwdEmail() {
      let email = this.email.trim()
      if (email === '') {
        this.$message.warning('邮箱不能为空')
        return
      }
      if (!checkEmail(email)) {
        this.$message.warning('邮箱格式不正确')
        return
      }
      this.sendEmailBtnLoading = true
      sendEmail(email)
      .then(res => {
        this.$message.success('邮件已发送，请注意查收!')
      }).finally(() => {
        this.sendEmailBtnLoading = false
      })
    },
    // 邮箱方式重置密码提交(邮件链接回来)
    resetPasswordEmail() {
      if (this.emailPwdForm.newPwd.trim() === '') {
        this.$message.warning('新密码不能为空')
        return
      }
      if (this.emailPwdForm.confirmPwd.trim() === '') {
        this.$message.warning('确认密码不能为空')
        return
      }
      if (this.emailPwdForm.newPwd.trim() !== this.emailPwdForm.confirmPwd.trim()) {
        this.$message.warning('两次输入的密码不一致')
        return
      }
      let newPwd = this.emailPwdForm.newPwd
      let token = this.urlToken
      this.submitEmailbtnLoading = true
      verifyEmailTokenAndModifyPwd(newPwd, token)
      .then(res => {
        // console.log(res)
        this.$alert('返回登录页？', '密码重置成功', {
          confirmButtonText: '确定',
          showClose: false,
          callback: action => {
            this.$router.replace('/login')
          }
        })
      }).finally(() => {
        this.submitEmailbtnLoading = false
      })
    },
    // 手机方式重置密码提交
    resetPasswordMobile() {
      if (this.vCode === '') {
        this.$message.warning('请输入验证码')
        return
      }
      if (this.mobilePwdForm.newPwd.trim() === '') {
        this.$message.warning('新密码不能为空')
        return
      }
      if (this.mobilePwdForm.confirmPwd.trim() === '') {
        this.$message.warning('确认密码不能为空')
        return
      }
      if (this.mobilePwdForm.newPwd.trim() !== this.mobilePwdForm.confirmPwd.trim()) {
        this.$message.warning('两次输入的密码不一致')
        return
      }
      let code = this.vCode
      let mobile = this.mobile
      let newPwd = this.mobilePwdForm.newPwd
      this.submitMobilebtnLoading = true
     verifyFindCodeAndModifyPwd(code, mobile, newPwd)
     .then(res => {
        this.$alert('返回登录页', '密码重置成功', {
          confirmButtonText: '确定',
          showClose: false,
          callback: action => {
            this.$router.replace('/login')
          }
        })
      }).finally(() => {
        this.submitMobilebtnLoading = false
      })
    }
  },
  destroyed() {
    clearInterval(this.vCodeInterval)
  },
  watch: {
    vCodeTime(val) {
      if (val === 0) {
        this.vCodeTime = intervalTime
        this.disabledVCodeBtn = false
        this.vCodeBtnText = '获取验证码'
        clearInterval(this.vCodeInterval)
      } 
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
<style lang="scss">
</style>
