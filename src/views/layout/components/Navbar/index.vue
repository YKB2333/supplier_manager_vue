<template>
  <div class="navbar" style="display: flex; align-items: center; justify-content: space-between;">
    <div style="display: flex; align-items: center;">
      <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container" />
      <breadcrumb class="breadcrumb-container" />
    </div> 

    <div class="right-menu row center-y pr20">
      <screenfull class="right-menu-item hover-effect" />
      <el-button type="text" @click="drawer = true" class="pl14 pr20" size="medium">
        {{ $store.getters.userInfo &&  ($store.getters.userInfo.loginAcount || $store.getters.userInfo.mobile) }}<i class="el-icon-menu ml4"></i>
      </el-button>
      <el-drawer
        title="用户信息"
        :visible.sync="drawer"
        direction="rtl">
        <div>
          <el-dropdown-item class="row space-between" v-if="$store.getters.userInfo && $store.getters.userInfo.loginAcount">
            <span class="pr20 fs12">登录账号</span>
            <span>{{ $store.getters.userInfo.loginAcount }}</span>
          </el-dropdown-item>
          <el-dropdown-item class="row space-between" v-if="$store.getters.userInfo && $store.getters.userInfo.mobile">
            <span class="pr20 fs12">手机</span>
            <span>{{ $store.getters.userInfo.mobile }}</span>
          </el-dropdown-item>
          <el-dropdown-item class="row space-between" v-if="$store.getters.userInfo && $store.getters.userInfo.email">
            <span class="pr20 fs12">邮箱</span>
            <span>{{ $store.getters.userInfo.email }}</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="color: #409EFF; display: block;" @click="dialogVisible = true">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="color: #F56C6C; display: block;" @click="logout">退出登录</span>
          </el-dropdown-item>
        </div>
      </el-drawer>
    </div>

    <!-- 修改密码弹窗 -->
    <el-dialog title="修改密码" :visible.sync="dialogVisible" width="500px" :show-close="false" :close-on-click-modal="false">
      <el-form :model="pwdForm" :rules="rules" ref="pwdForm" label-width="100px">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input type="password" v-model="pwdForm.oldPassword" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model="pwdForm.newPassword" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input type="password" v-model="pwdForm.confirmPassword" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm()" :loading="modifyPwdLoading">确认修改</el-button>
          <el-button @click="resetForm()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from './components/Breadcrumb'
import Hamburger from './components/Hamburger'
import Screenfull from './components/Screenfull'
import { modifyPwd } from '@/api/user'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull
  },
  data() {
    var confirmPwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入确认密码'))
      } else if (value !== this.pwdForm.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    };
    return {
      drawer: false,
      dialogVisible: false,
      pwdForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      modifyPwdLoading: false,
      rules: {
        oldPassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, validator: confirmPwd, trigger: 'blur' }
        ],
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    logout() {
      this.$alert('确定退出登录').then(res => {
        this.$store.dispatch('LogOut').then(() => {
          location.reload() // 重新登录后路由重复添加问题
        })
      })
    },
    submitForm() {
      this.$refs['pwdForm'].validate((valid) => {
        if (valid) {
          this.modifyPwdLoading = true
          modifyPwd({
            userId: this.$store.getters.userInfo.id,
            newPassword: this.pwdForm.newPassword,
            oldPassword: this.pwdForm.oldPassword
          }).then(res => {
            this.$message.success('密码修改成功，请重新登录')
            this.resetForm()
            this.$store.dispatch('LogOut').then(() => {
              location.reload() // 重新登录后路由重复添加问题
            })
          }).catch(error => {
            console.log(error)
          }).finally(() => {
            this.modifyPwdLoading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm() {
      this.$refs['pwdForm'].resetFields()
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    // float: left;
    cursor: pointer;
    transition: background .3s;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 15px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
