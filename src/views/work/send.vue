<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page="page"
               ref="crud"
               v-model="form"
               @search-change="searchChange"
               @search-reset="searchReset"
               @current-change="currentChange"
               @size-change="sizeChange"
               @refresh-change="refreshChange"
               @on-load="onLoad">
      <template slot-scope="{row}"
                slot="processDefinitionVersion">
        <el-tag>v{{row.processDefinitionVersion}}</el-tag>
      </template>
      <template slot-scope="{row}" slot="processIsFinished">
        <el-tag>{{row.processIsFinished === 'unfinished' ? '未完成' : '完成'}}</el-tag>
      </template>
      <template slot-scope="{row}" slot="category">
        <el-tag>{{row.category == 'flow_1' ? '请假流程' : '报销流程'}}</el-tag>
      </template>
      <template slot="menu" slot-scope="scope">
        <el-button :size="scope.size" :type="scope.type" @click.stop="workDetail(scope.row)">详情</el-button>
        <el-button :size="scope.size" :type="scope.type" @click.stop="workTrack(scope.row)">跟踪</el-button>
      </template>
    </avue-crud>

    <el-dialog
      title="流程图"
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="handleClose">
      <span>
        <img :src="imageUrl+processInstanceId"/>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>

  </basic-container>
</template>

<style lang="sass">

</style>

<script>
  import {getSendList,iframeDiagramUrl} from "@/api/work/index";

  export default {
    name: '',
    data() {
      return {
        loading: true,
        option: {
          searchShow: true,
          searchMenuSpan: 6,
          tip: false,
          border: true,
          index: true,
          addBtn: false,
          delBtn: false,
          editBtn: false,
          selection: false,
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
              hide: true,
              //showColumn:false,
              rules: [{
                required: true,
                message: "请选择流程分类",
                trigger: "blur"
              }]
            },
            {
              label: "流程名称",
              prop: "categoryName",
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
              slot: true,
            },
            {
              label: "流程版本",
              prop: "processDefinitionVersion",
              span: 24,
              slot: true,
            },
            {
              label: '流程进度',
              prop: 'processIsFinished',
              slot: true,
            },
            {
              label: "申请时间",
              prop: "createTime",
              span: 24,
            }
          ]
        },
        data: [],
        form: {},
        query: {},
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        dialogVisible: false,
        imageUrl: iframeDiagramUrl,
        processInstanceId: ''
      }
    },
    methods: {
      searchChange(params, done) {
        params.category = 'flow_'+params.category;
        this.query = params;
        this.page.currentPage = 1;
        this.onLoad(this.page, params);
        done();
      },
      searchReset() {
        this.query = {};
        this.onLoad(this.page);
      },
      currentChange(currentPage) {
        this.page.currentPage = currentPage;
      },
      sizeChange(pageSize) {
        this.page.pageSize = pageSize;
      },
      refreshChange() {
        this.onLoad(this.page, this.query);
      },
      onLoad(page, params = {}) {
        this.loading = true;
        getSendList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          if(res.status == 200) {
            const data = res.data.data;
            this.page.total = data.total;
            this.data = data.records;
            this.loading = false;
          }
        })
      },
      //详情
      workDetail(data) {
        this.$router.push({path: `/work/process/leave/detail/${data.processInstanceId}/${data.businessId}`});
      },
      //跟踪
      workTrack(data) {
        this.processInstanceId = data.processInstanceId;
        this.dialogVisible = true;
      },
      handleClose() {
        this.dialogVisible = false;
      },
    },
    mounted() {

    }
  }

</script>
