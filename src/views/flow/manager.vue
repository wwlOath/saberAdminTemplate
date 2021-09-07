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
        <el-button :size="scope.size" :type="scope.type" @click.stop="changeState(scope.row)">变更状态</el-button>
        <el-button :size="scope.size" :type="scope.type" @click.stop="showProcessPhoto(scope.row)">流程图</el-button>
        <el-button :size="scope.size" :type="scope.type" @click.stop="del(scope.row)">删除</el-button>
      </template>
      <template slot="menuLeft" slot-scope="scope">
        <el-radio-group v-model="radioActive" @change="changeMenuLeftRadio" size="small">
          <el-radio-button label="1">通用流程</el-radio-button>
          <el-radio-button label="2">定制流程</el-radio-button>
        </el-radio-group>
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
      width="60%"
      :before-close="handleClose">
      <span>
        <img :src="processUrl+processId"/>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="流程变更"
      :visible.sync="visible"
      width="20%"
      :before-close="close"
    >
      <span>
        <avue-form :option="managerOption" ref="managerForm" v-model="managerForm">

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
  import {getManagerList, managerSubmit, managerRemove, iframeDiagramUrl } from "@/api/flow/index";

  const statusList = [
    {
      label: '激活',
      value: 'active'
    },
    {
      label: '挂起',
      value: 'suspend'
    }
  ];

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
              label: "租户编号",
              prop: "tenantId",
              span: 24,
              slot:true
            },
            {
              label: "流程主键",
              prop: "id",
              span: 24,
              width: 300,
            },
            {
              label: "流程标识",
              prop: "key",
              type: "input",
              search: true,
              rules: [{
                required: true,
                message: "请输入流程标识",
                trigger: "blur"
              }]
            },
            {
              label: "流程名称",
              prop: "name",
            },
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
              label: "流程版本",
              prop: "version",
              span: 24,
              slot: true,
            },
            {
              label: "状态",
              prop: "suspensionState",
              span: 24,
              slot: true,
            },
            {
              label: "部署时间",
              prop: "deploymentTime",
              span: 24,
              width: 150
            }
          ]
        },
        data: [],
        radioActive: 1,
        dialogVisible: false,
        processUrl: iframeDiagramUrl,
        processId: '',
        managerForm:{
          state: '',
        },
        managerOption: {
          menuBtn: false,
          column: [
            {
              label: "流程状态",
              type: "select",
              dicData: statusList,
              prop: "state",
              rules: [{
                required: true,
                message: "请选择流程状态",
                trigger: "blur"
              }],
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
        getManagerList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
        });
      },
      //左侧radioGroup
      changeMenuLeftRadio() {
        this.onLoad(this.page);
      },
      handleClose() {
        this.dialogVisible = false;
      },
      //显示流程图
      showProcessPhoto(data) {
        this.dialogVisible = true;
        this.processId = data.id;
      },
      close() {
        this.visible = false;
      },
      changeStatus() {
        this.$refs['managerForm'].validate((valid) => {
          if (valid) {
            managerSubmit({
              processId: this.processId,
              state: this.managerForm.state,
            }).then(res => {
              if(res.status == 200){
                this.$message({
                  type: 'success',
                  content: '操作成功'
                })
                this.onLoad(this.page, this.query);
                this.visible = false;
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
      changeState(data) {
        this.visible = true;
        this.processId = data.id;
      },
      //删除
      del(data) {
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          return managerRemove(data.deploymentId);
        })
        .then(() => {
          this.onLoad(this.page);
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
