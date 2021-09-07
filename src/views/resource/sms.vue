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
        <el-button :size="scope.size" :type="scope.type" icon="el-icon-video-play" @click.stop="debugTest(scope.row)">调试</el-button>
        <el-button :size="scope.size" :type="scope.type" icon="el-icon-circle-check" @click.stop="runTest(scope.row)">启用</el-button>
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
                slot="category">
        <el-tag>{{row.categoryName}}</el-tag>
      </template>
      <template slot-scope="{row}"
                slot="statusName">
        <el-tag>{{row.statusName}}</el-tag>
      </template>
    </avue-crud>

    <el-dialog
      title="手机短信发送调试"
      width="30%"
      :visible.sync="visible"
      :before-close="handleClose"
    >
      <avue-form :option="smsOption" ref="smsForm" v-model="smsForm" @submit="smsSubmitSave">

      </avue-form>
    </el-dialog>
  </basic-container>
</template>

<script>
  import {getSmsList, smsSubmit, smsRemove, smsSend, smsEnabled } from "@/api/resource/index";

  export default {
    data() {
      return {
        form: {
          category: '1'
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
          viewBtn: true,
          selection: true,
          column: [
            {
              label: "分类",
              prop: "category",
              slot: true,
              type: "radio",
              search: true,
              dicUrl: "/api/blade-system/dict/dictionary?code=sms",
              props: {
                label: "dictValue",
                value: "dictKey",
              },
              dataType: "number",
              rules: [{
                required: true,
                message: "请选择分类",
                trigger: "blur"
              }],
              span: 24
            },
            {
              label: "资源编号",
              prop: "smsCode",
              span: 24,
              type: "input",
              search: true,
              rules: [{
                required: true,
                message: "请输入资源编号",
                trigger: "blur"
              }],
            },
            {
              label: "模板ID",
              prop: "templateId",
              search: true,
              rules: [{
                required: true,
                message: "请输入模板ID",
                trigger: "blur"
              }],
              span: 24
            },
            {
              label: "accessKey",
              prop: "accessKey",
              rules: [{
                required: true,
                message: "请输入accessKey",
                trigger: "blur"
              }],
              span: 24,
              display: false,
              hide: true
            },
            {
              label: "secretKey",
              prop: "secretKey",
              rules: [{
                required: true,
                message: "请输入secretKey",
                trigger: "blur"
              }],
              span: 24,
              display: false,
              hide: true
            },
            {
              label: "regionId",
              prop: "regionId",
              span: 24,
              display: false,
              hide: true
            },
            {
              label: "短信签名",
              prop: "signName",
              rules: [{
                required: true,
                message: "请输入短信签名",
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
              label: '备注',
              prop: 'remark',
              span: 24,
              hide: true,
            }
          ]
        },
        data: [],
        visible: false,
        smsOption: {
          submitText: '发送',
          column: [
            {
              label: "资源编号",
              type: "input",
              prop: "code",
              span: 24,
              disabled: true
            },
            {
              label: "发送手机",
              type: "input",
              prop: "phones",
              span: 24,
            },
            {
              label: "发送手机",
              type: "input",
              placeholder: "例: {'code':2333,'title':'通知标题'}",
              prop: "params",
              span: 24,
            },
          ]
        },
        smsForm: {

        }
      }
    },
    watch: {
      'form.category':{
        handler(val){
          const accessKey = this.findObject(this.option.column,'accessKey')
          const secretKey = this.findObject(this.option.column,'secretKey')
          const regionId = this.findObject(this.option.column,'regionId')
          if(val === 1){
            accessKey.display = true;
            accessKey.label = 'apiKey';
            secretKey.display = false;
            secretKey.label = 'secretKey';
            regionId.display = false;
          }else if(val === 2){
            accessKey.display = true;
            accessKey.label = 'accessKey';
            secretKey.display = true;
            secretKey.label = 'secretKey';
            regionId.display = false;
          }else if(val === 3){
            accessKey.display = true;
            accessKey.label = 'accessKey';
            secretKey.display = true;
            secretKey.label = 'secretKey';
            regionId.display = true;
          }else if(val === 4){
            accessKey.display = true;
            accessKey.label = 'appId';
            secretKey.display = true;
            secretKey.label = 'appKey';
            regionId.display = false;
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
        getSmsList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
        });
      },
      rowSave(row, done, loading) {
        smsSubmit(row).then(() => {
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
        smsSubmit(row).then(() => {
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
          return smsRemove(data.id);
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
          return smsRemove(this.ids);
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
      handleClose() {
        this.visible = false;
      },
      debugTest(data) {
        this.smsForm.code = data.smsCode;
        this.visible = true;
      },
      smsSubmitSave() {
        smsSend(this.smsForm).then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        }, error => {
          window.console.log(error);
        });
      },
      //启用
      runTest(data) {
        this.$confirm("是否确定启用这条配置?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          return smsEnabled(data.id);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        });
      }
    }
  };
</script>

<style>
</style>
