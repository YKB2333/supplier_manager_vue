.<template>
  <div class="the-search-page">
    <div class="form">
      <slot></slot>
    </div>
    <div class="btns">
      <el-button type="primary" plain @click="onSearch">查询</el-button>
      <el-button type="danger" plain @click="onReset">重置</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TheSearch',
  components: {},
  data() {
    return {

    }
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    onSearch() {
      this.$emit('onSearch')
    },
    onReset() {
      this.$emit('onReset')
    }
  }
}
</script>

<style lang="scss" scoped>
.the-search-page{
  position: relative;
  width: 100%;
  background-color: transparent;
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
  }
}
</style>
<style lang="scss">
</style>
