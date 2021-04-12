<template>
  <div>
    <the-search @onSearch="onChange" @onReset="resetSearch">
      <el-form :model="searchQuery" ref="f" inline class="pl20">
        <el-form-item label="版本名称" prop="name">
          <el-input v-model="searchQuery.name" placeholder="请输入" @keyup.enter.native="onChange"></el-input>
        </el-form-item>
        <el-form-item label="版本号" prop="no">
          <el-input v-model="searchQuery.no"  placeholder="请输入" @keyup.enter.native="onChange"></el-input>
        </el-form-item>
      </el-form>
    </the-search>

    <div class="mtb16">
      <el-button type="primary" @click="add" v-permission-button="'add'">新增</el-button>
      <el-button type="primary" @click="edit" v-permission-button="'edit'">编辑</el-button>
      <el-button type="primary" @click="remove" v-permission-button="'delete'">删除</el-button>
    </div>

    <div style="background:#fff" class="p10">
      <el-table
        ref="table"
        border
        stripe
        :data="list"
        row-key="id"
        size="small"
        @selection-change="handleSelectionChange"
        >
        <el-table-column type="selection" />
        <el-table-column type="index" label="序号"/>
        <el-table-column prop="name" label="版本名称" width="100px"/>
        <el-table-column prop="no" label="版本号" width="100px"/>
        <el-table-column prop="updateTitle" label="更新标题" width="150px"/>
        <el-table-column prop="updateContent" label="更新内容" min-width="250px"/>
        <el-table-column prop="updatePushUrl" label="更新推送url" width="250px"/>
        <el-table-column prop="createDate" label="创建时间" width="120px" >
          <template slot-scope="scope">
            <div v-if="scope.row.createDate">
              {{ scope.row.createDate | formatDate('Y/M/D h:m')  }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="creatorName" label="创建人" width="100px"/>
      </el-table>
      <the-pagination
        :pageIndex="searchQuery.pageIndex"
        :pageSize="searchQuery.pageSize"
        :total="searchQuery.total"
        @onPageSizeChange="handleSizeChange"
        @onPageIndexChange="handleCurrentChange"
      />
    </div>

    <el-dialog
      :title="form.id? '编辑版本' : '新增版本'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="600px"
      @close="closeDialog"
      >
      <el-form ref="form" :model="form" label-width="100px" :rules="rules">
        <el-form-item label="版本名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入，8个字以内"></el-input>
        </el-form-item>
        <el-form-item label="版本号" prop="no">
          <el-input v-model="form.no" placeholder="请输入版本号数字，4个字以内" type="number"></el-input>
        </el-form-item>
        <el-form-item label="更新标题" prop="updateTitle">
          <el-input v-model="form.updateTitle" placeholder="请输入版本更新的标题，15个字以内"></el-input>
        </el-form-item>
        <el-form-item label="更新内容" prop="updateContent">
          <el-input v-model="form.updateContent" placeholder="请输入版本更新的内容，100字以内" type="textarea" maxlength="100" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="更新推送url" prop="updatePushUrl">
          <el-input v-model="form.updatePushUrl" placeholder="请输入跳转的url链接"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button :loading="buttonLoading" type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import TheSearch from "@/components/TheSearch"
import ThePagination from '@/components/ThePagination'
import { getVersionPage, saveVersion, updateVersion, deleteVersion } from '@/api/setting/version'

export default {
  name: 'VersionManager',

  components: { TheSearch, ThePagination, },

  data() {
    return {
      searchQuery: {
        name: '',
        no: '',
        pageIndex: 1,
        pageSize: 10,
        total: 0,
      },
      list: [],
      selectList: [],
      dialogVisible: false,
      form: {
        name: '',
        no: '',
        updateTitle: '',
        updateContent: '',
        updatePushUrl: '',
      },
      rules: {
        name: [
          {required: true, message:'请输入版本名称', trigger: 'blur'},
          {require: true, max: 8, message: '长度在8个字符以内', trigger: ['blur', 'change'] }
        ],
        no: [
          {required: true, message:'请输入版本号', trigger: 'blur'},
          {require: true, max: 4, message: '长度在4个字符以内', trigger: ['blur', 'change'] }
        ],
        updateTitle: [
          {required: true, message:'请输入更新标题', trigger: 'blur'},
          {require: true, max: 15, message: '长度在15个字符以内', trigger: ['blur', 'change'] }
        ],
        updateContent: [ {required: true, message:'请输入更新内容', trigger: 'blur'} ],
      },
      buttonLoading: false
    }
  },

  created() {
    this.getData();
  },

  methods: {
    // #region 数据获取
    onChange() {
      this.selectList = [];
      this.searchQuery.pageIndex = 1;
      this.searchQuery.pageSize = 10;
      this.getData();
    },

    resetSearch() {
      this.$refs['f'].resetFields();
      this.onChange();
    },

    getData() {
      console.log(this.searchQuery);
      this.$store.commit('SHOW_LOADING')
      getVersionPage(this.searchQuery)
        .then((res) =>　{
          this.list = res && res.records || [];
          this.searchQuery.total = res && res.total || 0;
        })
        .finally(() => {
          this.$store.commit('SHOW_LOADING', false)
        })
      // this.list = new Array(11).fill(0).map((v, i) => {
      //   return {
      //     id: i,
      //     name: `V1.0.${i}`,
      //     no: '' + i,
      //     updateTitle: '12月版本迭代',
      //     updateContent: '修复部分bug',
      //     updatePushUrl: 'https://www.badu.com',
      //     creatorName: '王这',
      //     createTimestamp: new Date().getTime()
      //   }
      // })
      // this.searchQuery.total = this.list.length
    },

    handleSizeChange(e) {
      this.searchQuery.pageIndex = 1;
      this.searchQuery.pageSize = e;
      this.getData()
    },

    handleCurrentChange(e) {
      this.searchQuery.pageIndex = e;
      this.getData()
    },
    // #endregion 数据获取

    // #region 选中相关
    handleSelectionChange(e) { // 不需要分页选中
      this.selectList = e;
    },
    // #endregion
    
    // #region 操作相关
    closeDialog() {
      this.form.id = '';
      this.$refs['form'].resetFields();
      this.dialogVisible = false;
    },

    add() {
      this.dialogVisible = true;
    },

    edit() {
      if (!Array.isArray(this.selectList) || this.selectList.length === 0) {
        this.$message.error('未选中数据进行操作！');
        return ;
      }
      if (!Array.isArray(this.selectList) || this.selectList.length !== 1) {
        this.$message.error('只能选择一条数据进行操作!')
        return ;
      }
      this.dialogVisible = true;
      this.$nextTick(()=> {
        this.form = JSON.parse(JSON.stringify(this.selectList[0]))
      })
    },

    remove() {
      if (!Array.isArray(this.selectList) || this.selectList.length === 0) {
        this.$message.error('未选中数据进行操作！');
        return ;
      }
      this.$confirm('是否删除选中的版本？', '提示', {
        type: 'warning'
      }).then(() => {
        deleteVersion(this.selectList.map(v => v.id))
          .then(res => {
            this.$message.success('删除成功')
            this.getData()
          })
      })
    },

    save() {
      const saveReq = this.form.id ? updateVersion : saveVersion;
      this.$refs['f'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          saveReq(this.form)
            .then(res => {
              this.$message.success('保存成功');
              this.closeDialog();
              this.getData();
            })
            .finally(() => {
              this.buttonLoading = false;
            })
        } else {
          return false
        }
      })
    },

    // #endregion

  }
}
</script>

<style lang="scss" scoped>
</style>