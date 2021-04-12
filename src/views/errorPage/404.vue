<template>
  <div class="http404-container">
    <p>404</p>
    <router-link to="/" class="btn">返回首页</router-link>
  </div>
</template>

<script>

export default {
  name: 'Page404',
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.http404-container{
  transform: translate(-50%,-50%);
  position: absolute;
  top: 40%;
  left: 50%;
  .btn{
    display: block;
    width: 110px;
    height: 36px;
    line-height: 36px;
    background: #1482f0;
    border-radius: 100px;
    text-align: center;
    color: #ffffff;
    font-size: 14px;
    cursor: pointer;
  }
  P{
    font-size: 30px;
    text-align: center;
  }
}
</style>
