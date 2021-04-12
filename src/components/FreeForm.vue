<template>
  <el-table :data="freeForm">
    <el-table-column width="150" :label="title" label-class-name="weight-title" fixed="left">
      <template slot-scope="scope">
        <div class="options" v-if="editable">
          <i class="el-icon-plus" @click="addRow(scope.$index)" />
          <i class="el-icon-minus" @click="removeRow(scope.$index)" />
        </div>
      </template>
    </el-table-column>
    <el-table-column v-for="option in options" :key="option.key" :label="option.label">
      <template slot-scope="scope">
        <el-input v-if="option.type == 'input'" v-model="scope.row[option.key]"></el-input>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: "FreeForm",
  props: {
    value: {
      type: Array,
      default: () => {
        return [];
      }
    },
    editable: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: ""
    },
    options: {
      type: Array,
      required: true,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return { freeForm: this.value };
  },
  computed: {},
  methods: {
    addRow(index) {
      this.freeForm.splice(index + 1, 0, {});
    },
    removeRow(index) {
      if (this.freeForm.length == 1) {
        this.freeForm.splice(index, 1, {});
        return;
      }
      this.freeForm.splice(index, 1);
    }
  },
  watch: {
    freeForm: {
      handler: function(val) {
        this.$emit("input", val);
      },
      deep: true
    }
  },
  created(){
    if(this.freeForm.length == 0){
      this.addRow(0)
    }
  }
};
</script>

<style lang="scss" scoped>
.options {
  cursor: pointer;
  font-size: 14px;
  :hover {
    font-size: 18px;
    color: red;
  }
}
</style>
<style lang="scss">
.weight-title {
  font-size: 14px;
  color: #606266;
  font-weight: bold;
}
</style>
