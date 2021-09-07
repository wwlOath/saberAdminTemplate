<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page="page"
               v-model="form"
               @search-change="searchChange"
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @refresh-change="refreshChange"
               @on-load="onLoad">
      <template slot="menu" slot-scope="scope">
        <el-button :size="scope.size" :type="scope.type" @click.stop="del(scope.row)" icon="el-icon-delete">删除</el-button>
      </template>
      <template slot-scope="{row}"
                slot="suspensionState">
        <el-tag>{{row.suspensionState==1?'激活':'未激活'}}</el-tag>
      </template>
    </avue-crud>

    <el-dialog
      title="流程删除"
      :visible.sync="visible"
      width="20%"
      :before-close="close"
    >
      <span>
        <avue-form :option="followOption" ref="managerForm" v-model="followForm">

        </avue-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">关闭</el-button>
        <el-button type="primary" @click="changeStatus">确定</el-button>
      </span>
    </el-dialog>
  </basic-container>
</template>

<script>
  import {getFollowList, followRemove } from "@/api/flow/index";

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
              label: "执行id",
              prop: "id",
              type: "input",
              search: true,
              width: 300
            },
            {
              label: "流程key",
              prop: "processDefinitionKey",
              type: "input",
              search: true,
              minWidth: 130
            },
            {
              label: "实例id",
              prop: "executionId",
              type: "input",
              search: true,
              width: 300
            },
            {
              label: "状态",
              prop: "suspensionState",
              span: 24,
              slot: true,
            },
            {
              label: "发起人",
              prop: "startUser",
            },
            {
              label: "开始时间",
              prop: "startTime",
              width: 150
            }
          ]
        },
        data: [],
        processId: '',
        followForm:{
          state: '',
        },
        followOption: {
          menuBtn: false,
          column: [
            {
              label: "删除理由",
              type: "textarea",
              prop: "deleteReason",
              span: 24,
            },
          ]
        },
        visible: false,

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
      refreshChange() {
        this.onLoad(this.page, this.query);
      },
      searchReset() {
        this.query = {};
        this.onLoad(this.page);
      },
      searchChange(params, done) {
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
        getFollowList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
        });
      },
      close() {
        this.visible = false;
      },
      del(data) {
        this.visible = true;
        this.processId = data.id;
      },
      changeStatus() {
        this.sureDel();
      },
      //确认删除
      sureDel(data) {
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          return followRemove(this.followForm.deleteReason, this.processId);
        })
        .then(() => {
          this.onLoad(this.page);
          this.visible = false;
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        });
      },
    }
  };
</script>

<style>
</style>
