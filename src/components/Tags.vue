<template>
  <div>
    <template v-if="!editable">
      <el-tag size="mini" class="mr6" v-for="tag in dynamicTags" :key="tag">{{ tag }}</el-tag>
    </template>
    <template v-else>
      <el-tag
        v-for="tag in dynamicTags"
        :key="tag"
        closable
        @close="handleClose(tag)"
        class="mr6">
        {{tag}}
      </el-tag>
      <el-input
        v-if="inputVisible"
        v-model="inputValue"
        ref="saveTagInput"
        size="mini"
        @keyup.enter.native="handleInputConfirm"
        @blur="handleInputConfirm"
      >
      </el-input>
      <el-button v-else size="mini" icon="el-icon-plus" @click="showInput">添加标签</el-button>
    </template>
  </div>
</template>

<script>
export default {
  name: 'Tags',
  props: {
    value: {
      type: Array,
      required: true,
      default: () => []
    },
    editable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      inputVisible: false,
      inputValue: '',
      dynamicTags: this.value
    }
  },
  computed: {
  },
  created() {
  },
  mounted() {},
  methods: {
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
      this.$emit('input', this.dynamicTags)
    },
    handleInputConfirm() {
      let inputValue = this.inputValue
      if (inputValue) {
        this.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
      this.$emit('input', this.dynamicTags)
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(()=> {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
  },
  watch: {
    value: {
      handler: function(val) {
        let tags = _.cloneDeep(val)
        this.dynamicTags = tags
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
<style lang="scss">
</style>
