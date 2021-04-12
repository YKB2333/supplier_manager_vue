<template>
  <div class="errPage-container">
    <h2>你没有权限访问页面</h2>
    <el-button icon="el-icon-arrow-left" type="primary" @click="back">返回</el-button>
    <el-button type="success" @click="$router.push('/')">回首页</el-button>
  </div>
</template>

<script>

export default {
  name: 'Page401',
  data() {
    return {
    }
  },
  methods: {
    back() {
      if (this.$route.query.noGoBack) {
        this.$router.push({ path: '/dashboard' })
      } else {
        this.$router.go(-1)
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .errPage-container {
    width: 800px;
    max-width: 100%;
    margin: 100px auto;
    // .pan-back-btn {
    //   background: #008489;
    //   color: #fff;
    //   border: none!important;
    // }
  }
</style>
