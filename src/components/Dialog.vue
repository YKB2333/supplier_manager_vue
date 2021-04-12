.<template>
  <el-dialog class="my-dialog"
    :visible.sync="visible" 
    :title="title"
    :width="width"
    :fullscreen="fullscreen"
    :show-close="showClose"
    :center="center"
    :close-on-click-modal="closeOnClickModal"
    @close="onClose"
    append-to-body
    :custom-class="maxHeight ? 'max-height' : ''">
    <slot></slot>
    <slot name="title"></slot>
    <slot name="footer"></slot>
  </el-dialog>
</template>

<script>
export default {
  name: 'TheDialog',
  components: {},
  props: {
    value: { // 双向绑定值：显示/关闭
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '50%'
    },
    fullscreen: {
      type: Boolean,
      default: false,
    },
    showClose: {
      type: Boolean,
      default: true
    },
    closeOnClickModal: {
      type: Boolean,
      default: true
    },
    center: {
      type: Boolean,
      default: false
    },
    destroyOnClose: {
      type: Boolean,
      default: false
    },
    maxHeight: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: false
    }
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    show() {
      this.visible = true
    },
    hide() {
      this.visible = false
    },
    onClose() {
      this.$emit('close')
    }
  },
  watch: {
    value(val) {
      this.visible = val
    }
  }
}
</script>

<style lang="scss" scoped>
.my-dialog{
  /deep/ .max-height{
    max-height: 80%;
    overflow: auto;
  }
}
</style>
<style lang="scss">
</style>
