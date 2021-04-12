<template>
  <section class="app-main">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
  </section>
</template>

<script>

export default {
  name: 'AppMain',
  data() {
    return {
    }
  },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.fullPath
    }
  },
  
}
</script>

<style lang="scss" scoped>
.app-main {
  width: 100%;
  height:100%;
  position: relative;
  overflow: hidden;
}
</style>

