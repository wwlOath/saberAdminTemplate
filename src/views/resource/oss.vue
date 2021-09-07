<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page="page"
               v-model="form"
               @row-save="rowSave"
               @row-update="rowUpdate"
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
  </basic-container>
</template>

<script>
  import {getOssList, ossSubmit, ossRemove } from "@/api/resource/index";

  export default {
    data() {
      return {
        form: {
          categoryName: 'minio'
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
          addBtn: true,
          delBtn: true,
          editBtn: true,
          viewBtn: true,
          selection: true,
          column: [
            {
              label: "分类",
              prop: "category",
              search: true,
              type: "select",
              dicUrl: "/api/blade-system/dict/dictionary?code=oss",
              props: {
                label: "dictValue",
                value: "dictKey",
              },
              addDisplay: false,
              editDisplay: false,
              viewDisplay: false,
              hide: true,
              showColumn: false,
            },
            {
              label: "分类",
              prop: "categoryName",
              slot: true,
              type: "radio",
              dicUrl: "/api/blade-system/dict/dictionary?code=oss",
              props: {
                label: "dictValue",
                value: "dictValue",
              },
              rules: [{
                required: true,
                message: "请选择分类",
                trigger: "blur"
              }],
              span: 24
            },
            {
              label: "资源编号",
              prop: "ossCode",
              span: 24,
              type: "input",
              search: true,
              rules: [{
                required: true,
                message: "请输入模型标识",
                trigger: "blur"
              }],
            },
            {
              label: "资源地址",
              prop: "endpoint",
              rules: [{
                required: true,
                message: "请输入资源地址",
                trigger: "blur"
              }],
              span: 24
            },
            {
              label: "空间名",
              prop: "bucketName",
              rules: [{
                required: true,
                message: "请输入空间名",
                trigger: "blur"
              }],
              span: 24
            },
            {
              label: "accessKey",
              prop: "accessKey",
              search: true,
              rules: [{
                required: true,
                message: "请输入accessKey",
                trigger: "blur"
              }],
              span: 24
            },
            {
              label: "secretKey",
              prop: "secretKey",
              rules: [{
                required: true,
                message: "请输入secretKey",
                trigger: "blur"
              }],
              span: 24
            },
            {
              label: "是否启用",
              prop: "statusName",
              slot: true,
              addDisplay:false,
              editDisplay:false,
              viewDisplay:false,
            },
            {
              label: 'appId',
              prop: 'appId',
              span: 24,
              hide: true,
              display: false,
            },
            {
              label: 'region',
              prop: 'region',
              span: 24,
              hide: true,
              display: false,
            },
            {
              label: '备注',
              prop: 'remark',
              span: 24,
              hide: true,
            }
          ]
        },
        data: [],
      }
    },
    watch: {
      'form.categoryName':{
        handler(val){
          const appId = this.findObject(this.option.column,'appId')
          const region = this.findObject(this.option.column,'region')
          if(val === 'tencent'){
            appId.display = true;
            region.display = true;
          }else{
            appId.display = false;
            region.display = false;
          }
        },
        immediate: true
      },
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
        getOssList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
        });
      },
      rowSave(row, done, loading) {
        ossSubmit(row).then(() => {
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
      rowUpdate(row, index, done, loading) {
        ossSubmit(row).then(() => {
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
      //删除
      rowDel(data) {
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          return ossRemove(data.id);
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
          return ossRemove(this.ids);
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
    }
  };
</script>

<style>
</style>
