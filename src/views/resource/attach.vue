<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page="page"
               v-model="form"
               @row-del="rowDel"
               @search-change="searchChange"
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @refresh-change="refreshChange"
               @on-load="onLoad">
      <template slot="menu" slot-scope="scope">
      </template>
      <template slot="menuLeft" slot-scope="scope">
        <el-button type="primary"
                   size="small"
                   icon="el-icon-upload2"
                   plain
                   @click="handleUpload">上传
        </el-button>
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   @click="handleDelete">删 除
        </el-button>
      </template>
      <template slot-scope="{row}"
                slot="categoryName">
        <el-tag>{{row.categoryName}}</el-tag>
      </template>
      <template slot-scope="{row}"
                slot="statusName">
        <el-tag>{{row.statusName}}</el-tag>
      </template>
    </avue-crud>

    <el-dialog
      title="附件管理"
      width="40%"
      :visible.sync="visible"
      :before-close="handleClose"
    >
      <avue-form :option="uploadOption" v-model="uploadForm">
      </avue-form>
    </el-dialog>
  </basic-container>
</template>

<script>
  import {getAttachList, attachUploadSubmit, attachRemove } from "@/api/resource/index";

  export default {
    data() {
      return {
        form: {

        },
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
          delBtn: true,
          editBtn: false,
          viewBtn: false,
          selection: true,
          column: [
            {
              label: "附件地址",
              prop: "url",
            },
            {
              label: "附件域名",
              prop: "domain",
              search: true
            },
            {
              label: "附件名称",
              prop: "name",
              search: true
            },
            {
              label: "附件原名",
              prop: "originalName",
              search: true
            },
            {
              label: "附件拓展名",
              prop: "extended",
            },
            {
              label: "附件大小",
              prop: "size",
            },
          ]
        },
        data: [],
        visible: false,
        uploadForm: {

        },
        uploadOption: {
          menuBtn: false,
          labelWidth: 120,
          column: [
            {
              label: '附件上传',
              prop: 'file',
              type: 'upload',
              span: 24,
              drag: true,
              propsHttp: {
                res: 'data'
              },
              action: '/api/blade-resource/oss/endpoint/put-file-attach'
            },
          ]
        }
      }
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
        getAttachList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
        });
      },
      //删除
      rowDel(data) {
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          return attachRemove(data.id);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        });
      },
      //多选删除
      handleDelete() {
        if (this.selectionList.length === 0) {
          this.$message.warning("请选择至少一条数据");
          return;
        }
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          return attachRemove(this.ids);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.$refs.crud.toggleSelection();
        });
      },
      handleUpload() {
        this.visible = true;
      },
      handleClose() {
        this.visible = false;
      },
    }
  };
</script>

<style>
</style>
