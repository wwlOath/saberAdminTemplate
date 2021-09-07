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
        <el-button :size="scope.size" :type="scope.type" @click.stop="configure(scope.row)">配置</el-button>
        <el-button :size="scope.size" :type="scope.type" @click.stop="deploy(scope.row)">部署</el-button>
        <el-button :size="scope.size" :type="scope.type" @click.stop="download(scope.row)">下载</el-button>
        <el-button :size="scope.size" :type="scope.type" @click.stop="del(scope.row)">删除</el-button>
      </template>
      <template slot="menuLeft" slot-scope="scope">
        <el-button type="primary"
                   size="small"
                   icon="el-icon-circle-plus"
                   plain
                   @click="handleAdd">创建
        </el-button>
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   @click="handleDelete">删 除
        </el-button>
      </template>
      <template slot-scope="{row}"
                slot="version">
        <el-tag>v{{row.version}}</el-tag>
      </template>
    </avue-crud>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="handleClose">
      <span v-if="type == 'add'">
        <iframe src="https://design.bladex.vip/index.html" width="100%" height="700" title="流程设计器" frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="yes"></iframe>
      </span>
      <span v-else>
        <iframe :src="'https://design.bladex.vip/index.html#/editor/'+id" width="100%" height="700" title="流程设计器" frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="yes"></iframe>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="流程部署"
      :visible.sync="deployVisible"
      width="20%"
      :before-close="deployClose"
    >
      <avue-form :option="deployOption" ref="deployForm" v-model="deployForm">

      </avue-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deployVisible = false">取消</el-button>
        <el-button type="primary" @click="makeSure">确定</el-button>
      </span>
    </el-dialog>
  </basic-container>
</template>

<script>
  import {getModelList, modelSubmit, modelRemove } from "@/api/flow/index";

  export default {
    data() {
      return {
        id: '',
        dialogTitle: '',
        type: '',
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
              label: "模型主键",
              prop: "id",
              span: 24,
              width: 300
            },
            {
              label: "模型标识",
              prop: "modelKey",
              span: 24,
              type: "input",
              search: true,
              rules: [{
                required: true,
                message: "请输入模型标识",
                trigger: "blur"
              }]
            },
            {
              label: "模型名称",
              prop: "name",
              type: "input",
              search: true,
              rules: [{
                required: true,
                message: "请输入模型名称",
                trigger: "blur"
              }]
            },
            {
              label: "流程版本",
              prop: "version",
              span: 24,
              slot: true,
              width: 80
            },
            {
              label: "创建时间",
              prop: "created",
              span: 24,
            },
            {
              label: "更新时间",
              prop: "lastUpdated",
              span: 24,
            }
          ]
        },
        data: [],
        radioActive: 1,
        dialogVisible: false,
        deployVisible: false,
        deployForm:{
          pattern: 0,
        },
        deployOption:{
          menuBtn: false,
          column: [
            {
              label: "流程分类",
              type: "select",
              dicUrl: "/api/blade-system/dict/dictionary?code=flow",
              props: {
                label: "dictValue",
                value: "dictKey",
              },
              prop: "category",
              rules: [{
                required: true,
                message: "请选择流程分类",
                trigger: "blur"
              }],
              span: 24
            },
            {
              label: '流程模式',
              span: 24,
              prop: 'pattern',
              type: 'radio',
              dicData:[{
                label: '通用流程',
                value: 0
              },{
                label: '定制流程',
                value: 1,
              }]
            },
            {
              label: '所属租户',
              prop: 'tenantIds',
              display: false,
              type: 'tree',
              filterText: '输入关键字进行过滤',
              multiple:true,
              dicUrl: "/api/blade-system/tenant/select",
              props: {
                label: "tenantName",
                value: "tenantId",
              },
              span: 24,
              rules: [{
                required: true,
                message: "请选择所属租户",
                trigger: "blur"
              }],
            }
          ]
        }
      }
    },
    watch: {
      'deployForm.pattern':{
        handler(val){
          const value = this.findObject(this.deployOption.column,'tenantIds')
          if(val === 1){
            value.display = true;
            value.rules = [{
              required: true,
              message: "请选择所属租户",
              trigger: "blur"
            }];
          }else{
            value.display = false;
            value.rules = [];
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
        getModelList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
        });
      },
      //配置
      configure(data) {
        this.dialogTitle = '流程配置';
        this.id = data.id;
        this.dialogVisible = true;
        this.type = 'configure';
      },
      //部署
      deploy(data) {
        this.id = data.id;
        this.deployVisible = true;
      },
      deployClose() {
        this.deployVisible = false;
      },
      makeSure() {
        this.$refs['deployForm'].validate((valid) => {
          if (valid) {
            modelSubmit({
              modelId: this.id,
              category: 'flow_'+this.deployForm.category,
              tenantIds: this.deployForm.tenantIds.join(',')
            }).then(res => {
              if(res.status == 200){
                this.$message({
                  type: 'success',
                  content: '操作成功'
                })
                this.onLoad(this.page, this.query);
                this.deployVisible = false;
              }else{
                this.$message({
                  type: 'error',
                  content: res.data.msg
                })
              }
            })
          } else {
            return false;
          }
        });
      },
      //下载
      download(data) {
        const downloadUrl = 'https://design.bladex.vip/app/rest/models/'+data.id+'/bpmn20';
        window.open(downloadUrl);
      },
      //删除
      del(data) {
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          return modelRemove(data.id);
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
          return modelRemove(this.ids);
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
      //创建
      handleAdd(data) {
        this.dialogTitle = '流程配置';
        this.dialogVisible = true;
        this.type = 'add';
      },
      handleClose() {
        this.dialogVisible = false;
      },
    }
  };
</script>

<style>
</style>
