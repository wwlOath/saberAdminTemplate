<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               ref="crud"
               @tree-load="treeLoad"
               @search-change="searchChange"
               @search-reset="searchReset"
               @refresh-change="refreshChange"
               @on-load="onLoad">
      <template slot-scope="{row}"
                slot="source">
        <i :class="row.source"></i>
      </template>
      <template slot="menu" slot-scope="scope">
        <el-button :size="scope.size" :type="scope.type" icon="el-icon-setting" @click.stop="configure(scope.row)">权限配置</el-button>
      </template>
    </avue-crud>

    <el-drawer
      :title="'['+drawerTitle+'] 数据权限配置'"
      :visible.sync="visible"
      direction="rtl"
      size="60%"
      :before-close="handleClose">
      <basic-container>
          <avue-crud :option="settingOption"
                     :table-loading="settingLoading"
                     :data="settingData"
                     :page="page"
                     ref="settingcrud"
                     v-model="form"
                     @row-save="rowSave"
                     @row-update="rowUpdate"
                     @row-del="rowDel"
                     :before-open="beforeOpen"
                     @search-change="searchSettingChange"
                     @search-reset="searchSettingReset"
                     @selection-change="selectionChange"
                     @current-change="currentChange"
                     @size-change="sizeChange"
                     @refresh-change="refreshSettingChange"
                     @on-load="settingOnLoad">
            <template slot="menuLeft" slot-scope="scope">
              <el-button type="danger"
                         size="small"
                         icon="el-icon-delete"
                         plain
                         @click="handleDelete">删 除
              </el-button>
            </template>
            <template slot-scope="{row}"
                      slot="scopeType">
              <el-tag>{{row.scopeTypeName}}</el-tag>
            </template>
          </avue-crud>
      </basic-container>
    </el-drawer>
  </basic-container>
</template>

<script>
  import {add, getList, getTreeList, getDatascopeList, remove, } from "@/api/authority/datascope";

  export default {
    data() {
      return {
        form: {
          scopeType: ''
        },
        selectionList: [],
        loading: true,
        query: {},
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        option: {
          height: 'auto',
          calcHeight: 210,
          searchShow: true,
          searchMenuSpan: 6,
          tip: false,
          tree: true,
          border: true,
          index: true,
          selection: true,
          addBtn: false,
          editBtn: false,
          delBtn: false,
          viewBtn: false,
          menuWidth: 300,
          lazy:true,
          rowKey:'id',
          column: [
            {
              label: "菜单名称",
              prop: "name",
              span: 24,
              search: true,
              rules: [{
                required: true,
                message: "请输入菜单名称",
                trigger: "blur"
              }]
            },
            {
              label: '路由地址',
              prop: 'path'
            },
            {
              label: '菜单图标',
              prop: 'source',
              slot: true,
              width: 90,
              align: 'center'
            },
            {
              label: '菜单编号',
              prop: 'code',
              search: true
            },
            {
              label: '菜单别名',
              prop: 'alias',
            },
            {
              label: '菜单排序',
              prop: 'sort',
              width: 90
            },
          ]
        },
        data: [],
        visible: false,
        drawerTitle: '',
        settingOption: {
          height: 'auto',
          calcHeight: 210,
          searchShow: true,
          searchMenuSpan: 6,
          tip: false,
          border: true,
          index: true,
          selection: true,
          viewBtn: true,
          menuWidth: 300,
          column: [
            {
              label: "权限名称",
              prop: "scopeName",
              span: 12,
              search: true,
              rules: [{
                required: true,
                message: "请输入权限名称",
                trigger: "blur"
              }]
            },
            {
              label: '权限编号',
              prop: "resourceCode",
              span: 12,
              search: true,
              rules: [{
                required: true,
                message: "请输入权限名称",
                trigger: "blur"
              }]
            },
            {
              label: '权限字段',
              prop: 'scopeColumn',
              span: 12,
              rules: [{
                required: true,
                message: "请输入权限字段",
                trigger: "blur"
              }]
            },
            {
              label: '规则类型',
              prop: 'scopeType',
              slot: true,
              span: 12,
              type: 'select',
              dicUrl: "/api/blade-system/dict/dictionary?code=data_scope_type",
              props: {
                label: "dictValue",
                value: "dictKey",
              },
              dataType: "number",
              rules: [{
                required: true,
                message: "请输入规则类型",
                trigger: "blur"
              }],
              change: ({value, column}) => {
                const text = this.getDicSelectText('scopeType', value);
                this.form.scopeName = this.drawerTitle+'['+text+']';
              },
            },
            {
              label: '可见字段',
              prop: 'scopeField',
              span: 24,
              rules: [{
                required: true,
                message: "请输入可见字段",
                trigger: "blur"
              }],
              hide: true
            },
            {
              label: '权限类名',
              prop: 'scopeClass',
              span: 24,
              rules: [{
                required: true,
                message: "请输入权限类名",
                trigger: "blur"
              }],
              hide: true
            },
            {
              label: '备注',
              prop: 'remark',
              span: 24,
              hide: true,
              showColumn: false
            },
          ]
        },
        settingLoading: true,
        settingData: [],
        settingQuery: {},
        dataId: '',
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
      getDicSelectText(type, value) {
        if(value == ''){
          return '暂无';
        }
        const bl = this.$refs.settingcrud.DIC.hasOwnProperty(type);
        if (bl) {
          const obj = this.$refs.settingcrud.DIC[type].find(item => item.dictKey == value);
          return obj.dictValue;
        }
      },
      rowSave(row, done, loading) {
        row.menuId = this.dataId;
        add(row).then(() => {
          done();
          this.settingOnLoad(this.page);
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
        add(row).then(() => {
          done();
          this.settingOnLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        }, error => {
          window.console.log(error);
          loading();
        });
      },
      rowDel(row) {
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.settingOnLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        });
      },
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
          return remove(this.ids);
        })
        .then(() => {
          this.settingOnLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.$refs.settingcrud.toggleSelection();
        });
      },

      //权限配置
      configure(data) {
        this.dataId = data.id;
        this.drawerTitle = data.name;
        this.visible = true;
      },
      handleClose() {
        this.visible = false;
      },
      treeLoad(tree, treeNode, resolve) {
        setTimeout(() => {
          getTreeList(tree.id).then(res => {
            resolve(res.data.data)
          })
        }, 100)
      },

      searchReset() {
        this.query = {};
        this.onLoad();
      },
      searchSettingReset() {
        this.settingQuery = {};
        this.settingOnLoad();
      },
      searchChange(params, done) {
        this.query = params;
        this.onLoad(params);
        done();
      },
      searchSettingChange(params, done) {
        this.settingQuery = params;
        this.page.currentPage = 1;
        this.settingOnLoad(params);
        done();
      },
      selectionChange(list) {
        this.selectionList = list;
      },
      refreshChange() {
        this.onLoad();
      },
      refreshSettingChange() {
        this.settingOnLoad(this.page);
      },
      currentChange(currentPage){
        this.page.currentPage = currentPage;
      },
      beforeOpen(done, type) {
        let _this = this;
        if (["add"].includes(type)) {
          _this.data.forEach((d) => {
            if(d.id == _this.dataId) {
              _this.form.scopeName = d.name+'[暂无]';
              _this.form.resourceCode = d.code;
              _this.form.scopeField = '*';
              _this.form.scopeColumn = '-';
            }
          })
        }
        done();
      },
      sizeChange(pageSize){
        this.page.pageSize = pageSize;
      },
      onLoad(page, params = {}) {
        this.loading = true;
        getList(Object.assign(params, this.query)).then(res => {
          this.data = res.data.data;
          this.loading = false;
        });
      },
      settingOnLoad(page, params = {}) {
        this.settingLoading = true;
        getDatascopeList(this.dataId, page.currentPage, page.pageSize, Object.assign(params, this.settingQuery)).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.settingData = data.records;
          this.settingLoading = false;
        });
      }
    }
  };
</script>

<style>
</style>
