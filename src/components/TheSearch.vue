.<template>
  <div class="the-search-page">
    <div class="form" v-show="show">
      <slot></slot>
    </div>
    <div class="btns">
      <template v-show="show">
        <el-button v-show="isExact" type="primary" size="mini" plain @click="onExactSearch">精确查询</el-button>
        <el-button type="primary" size="mini" plain @click="onSearch">查询</el-button>
        <el-button type="danger" size="mini" plain @click="onReset">重置</el-button>
      </template>
      <!-- <svg-icon :icon-class="show ? 'search-show' : 'search-hide'" style="width: 20px; height:20px; margin-left: 8px;" @click="onClickSvg" /> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'TheSearch',
  components: {},
  props: {
    isExact: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return { 
      show: true, // 显示隐藏
    }
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    onExactSearch() {
      this.$emit('onExactSearch')
    },
    onSearch() {
      this.$emit('onSearch')
    },
    onReset() {
      this.$emit('onReset')
    },
    onClickSvg() {
      this.show = !this.show
    }
  }
}
</script>

<style lang="scss" scoped>
.the-search-page{
  position: relative;
  width: 100%;
  background-color: #ffffff;
  border-radius: 6px;
  padding-top: 10px;
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-start;
  .form{
    width: calc(100% - 170px);
  }
  .btns{
    // position: absolute;
    // bottom: 10px;
    // right: 10px;
    display: flex;
    align-self: flex-start;
    align-items: center;
  }
}
</style>
<style lang="scss">
</style>
