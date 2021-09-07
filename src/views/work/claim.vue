<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page="page"
               v-model="form"
               @row-update="rowUpdate"
               @search-change="searchChange"
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @on-load="onLoad">
      <template slot="menu" slot-scope="scope">
        <el-button :size="scope.size" :type="scope.type" @click.stop="launch(scope.row)">发起</el-button>
        <el-button :size="scope.size" :type="scope.type" @click.native="showProcessPhoto(scope.row)">流程图</el-button>
      </template>
      <template slot-scope="{row}"
                slot="tenantId">
        <el-tag>{{row.tenantId == '' ? '通用' : row.tenantId}}</el-tag>
      </template>
      <template slot-scope="{row}"
                slot="category">
        <el-tag>{{row.categoryName}}</el-tag>
      </template>
      <template slot-scope="{row}"
                slot="version">
        <el-tag>v{{row.version}}</el-tag>
      </template>
      <template slot-scope="{row}"
                slot="suspensionState">
        <el-tag>{{row.suspensionState==1?'激活':'未激活'}}</el-tag>
      </template>
    </avue-crud>
    <el-dialog
      title="流程图"
      :visible.sync="dialogVisible"
      width="70%"
      :before-close="handleClose">
      <span>
        <img :src="processUrl+processId"/>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </basic-container>
</template>

<script>
  import {getClaimList, update, iframeUrl } from "@/api/work/index";

  export default {
    data() {
      return {
        form: {},
        query: {},
        loading: true,
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        selectionList: [],
        option: {
          height: 'auto',
          calcHeight: 210,
          searchShow: true,
          searchMenuSpan: 6,
          tip: false,
          border: true,
          index: true,
          addBtn: false,
          delBtn: false,
          editBtn: false,
          selection: true,
          column: [
            {
              label: "流程分类",
              type: "select",
              dicUrl: "/api/blade-system/dict/dictionary?code=flow",
              props: {
                label: "dictValue",
                value: "dictKey",
              },
              slot: true,
              prop: "category",
              search: true,
              rules: [{
                required: true,
                message: "请选择流程分类",
                trigger: "blur"
              }]
            },
            {
              label: "流程名称",
              prop: "name",
              type: "input",
              search: true,
              rules: [{
                required: true,
                message: "请输入流程名称",
                trigger: "blur"
              }]
            },
            {
              label: "当前步骤",
              prop: "taskName",
              span: 24,
            },

            {
              label: "流程版本",
              prop: "version",
              span: 24,
              slot: true,
              prop: "version",
            },
            {
              label: "申请时间",
              prop: "deploymentTime",
              span: 24,
            }
          ]
        },
        data: [],
        radioActive: 1,
        dialogVisible: false,
        processUrl: iframeUrl,
        processId: ''
      };
    },
    computed: {
      ids() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.id);
        });
        return ids.join(",");
      }
    },
    methods: {
      rowUpdate(row, index, done, loading) {
        update(row).then(() => {
          done();
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        }, error => {
          window.console.log(error);
          loading();
        });
      },
      searchReset() {
        this.query = {};
        this.onLoad(this.page);
      },
      searchChange(params, done) {
        params.category = 'flow_'+params.category;
        this.query = params;
        this.page.currentPage = 1;
        this.onLoad(this.page, params);
        done();
      },
      selectionChange(list) {
        this.selectionList = list;
      },
      currentChange(currentPage) {
        this.page.currentPage = currentPage;
      },
      sizeChange(pageSize) {
        this.page.pageSize = pageSize;
      },
      onLoad(page, params = {}) {
        this.loading = true;
        params.mode = this.radioActive;
        getClaimList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
        });
      },
      //发起流程
      launch(data) {
        this.$router.push({path: '/work/process/leave/form/'+data.id})
      },
      handleClose() {
        this.dialogVisible = false;
      },
      //显示流程图
      showProcessPhoto(data) {
        this.dialogVisible = true;
        this.processId = data.id;
      }
    }
  };
</script>

<style>
</style>
