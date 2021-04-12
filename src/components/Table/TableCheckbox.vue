<template>
  <div>
    <el-checkbox-group v-model="checkList" class="mb10" @change="onChange">
      <el-checkbox v-for="label in originList" :key="label" :label="label">
      </el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>
export default {
  name: 'TableCheckbox',
  components: {},
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      checkList: [],
      originList: []
    }
  },
  computed: {},
  created() {
    this.originList = this.$lodash.cloneDeep(this.value)
    this.$emit('input', [])
  },
  mounted() {},
  methods: {
    onChange(currentList) {
      console.log(currentList)
      this.$emit('input', currentList)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
<style lang="scss">
</style>
