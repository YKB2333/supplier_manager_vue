<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      elLoading: null
    }
  },
  created() {},
  watch: {
    '$store.getters.loading'(show) {
      if (show) {
        this.elLoading = this.$loading({
          lock: true,
          text: this.$store.getters.loadingText,
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      } else {
        if (this.elLoading) this.elLoading.close()
      }
    }
  }
}
</script>

<style lang="scss">
@import './assets/styles/scss/index.scss';
</style>
