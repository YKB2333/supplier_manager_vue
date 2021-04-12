.<template>
  <div>
    <el-dialog 
      :visible.sync="visible" 
      append-to-body 
      :close-on-click-modal="closeOnClickModal" 
      custom-class="custom-dialog-class-1"
      top="10vh" 
      :width="width"
      :title="title"
      @close="whenClose">
      <slot></slot>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'SuperDialog',
  components: {},
  props: {
    width: {
      type: String,
      default: '50%'
    },
    closeOnClickModal: {
      type: Boolean,
      default: false
    },
    title: {
      type: String, 
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
    whenClose() {
      this.$emit('close')
      this.$destroy()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
<style lang="scss">
.custom-dialog-class-1{
  height: 80%;
  overflow-y: auto;
}
</style>
