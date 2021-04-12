<template>
  <div>
    <el-tooltip effect="dark" :content="isFullscreen?'退出全屏':'全屏'" placement="bottom">
      <svg-icon :icon-class="isFullscreen?'exit-fullscreen':'fullscreen'" @click="click" />
    </el-tooltip>
  </div>
</template>

<script>
import screenfull from 'screenfull'

export default {
  name: 'Screenfull',
  data() {
    return {
      isFullscreen: false
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    click() {
      if (!screenfull.enabled) {
        this.$message({
          message: '你的浏览器不支持全屏',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle()
    },
    init() {
      if (screenfull.enabled) {
        screenfull.on('change', () => {
          this.isFullscreen = screenfull.isFullscreen
        })
      }
    }
  }
}
</script>

<style scoped>
.screenfull-svg {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;;
  width: 20px;
  height: 20px;
  vertical-align: 10px;
}
</style>
