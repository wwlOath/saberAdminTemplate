<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               ref="crud"
               v-model="form"
               :before-open="beforeOpen"
               @row-del="rowDel"
               @row-update="rowUpdate"
               @row-save="rowSave"
               @search-change="searchChange"
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @on-load="onLoad">
      <template slot="menuLeft">
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   @click="handleDelete">删 除
        </el-button>
        <el-button type="default"
                   size="small"
                   icon="el-icon-setting"
                   plain
                   @click="handleSetting">权限设置
        </el-button>
      </template>
    </avue-crud>

    <el-dialog
      title="角色权限配置"
      :visible.sync="visible"
      width="30%"
      :before-close="handleClose"
    >
      <el-tabs type="border-card">
        <el-tab-pane label="菜单权限">
          <el-tree
            :props="defaultProps"
            :data="menuNode"
            ref="menuTree"
            show-checkbox
            node-key="id"
            :default-checked-keys="defaultCheckedKeys"
            @check-change="handleCheckChangeMenu">
          </el-tree>
        </el-tab-pane>
        <el-tab-pane label="数据权限">
          <el-tree
            :props="defaultProps"
            :data="dataNode"
            ref="dataTree"
            show-checkbox
            node-key="id"
            @check-change="handleCheckChangeData">
          </el-tree>
        </el-tab-pane>
        <el-tab-pane label="接口权限">
          <el-tree
            :props="defaultProps"
            :data="apiNode"
            ref="apiTree"
            node-key="id"
            show-checkbox
            @check-change="handleCheckChangeApi">
          </el-tree>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="makeSure">确定</el-button>
      </span>
    </el-dialog>
  </basic-container>
</template>

<script>
  import {add, getRoleTree, getList, remove, getGrantTree, getRoleTreeKeys, getGrant} from "@/api/authority/role";
  import website from '@/config/website';

  export default {
    data() {
      return {
        form: {},
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
          viewBtn: true,
          menuWidth: 300,
          column: [
            {
              label: "角色名称",
              prop: "roleName",
              span: 24,
              search: true,
              rules: [{
                required: true,
                message: "请输入角色名称",
                trigger: "blur"
              }]
            },
            {
              label: "所属租户",
              prop: "tenantId",
              type: "tree",
              dicUrl: "/api/blade-system/tenant/select",
              addDisplay: false,
              editDisplay: false,
              viewDisplay: website.tenantMode,
              span: 24,
              props: {
                label: "tenantName",
                value: "tenantId"
              },
              hide: !website.tenantMode,
              search: website.tenantMode,
              rules: [{
                required: true,
                message: "请输入所属租户",
                trigger: "click"
              }]
            },
            {
              label: "角色别名",
              prop: "roleAlias",
              search: true,
              span: 24,
              rules: [{
                required: true,
                message: "请输入角色别名",
                trigger: "blur"
              }]
            },
            {
              label: "上级角色",
              prop: "parentId",
              dicData: [],
              span: 24,
              type: "tree",
              hide: true,
              props: {
                label: "title"
              },
              rules: [{
                required: false,
                message: "请选择上级角色",
                trigger: "click"
              }]
            },
            {
              label: "角色排序",
              prop: "sort",
              type: "number",
              span: 24,
              rules: [{
                required: true,
                message: "请输入角色排序",
                trigger: "blur"
              }]
            }
          ]
        },
        data: [],
        visible: false,
        defaultProps: {
          children: 'children',
          label: 'title'
        },
        menuNode: [],
        apiNode: [],
        dataNode: [],
        defaultCheckedKeys: [],
        apiScopeIds: [],
        dataScopeIds: [],
        menuIds: [],
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
      rowSave(row, done, loading) {
        add(row).then(() => {
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
        add(row).then(() => {
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
          this.onLoad(this.page);
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
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.$refs.crud.toggleSelection();
        });
      },
      //权限设置
      handleSetting() {
        if (this.selectionList.length === 0 || this.selectionList.length > 1) {
          this.$message.warning("只能选择一条数据");
          return;
        }
        this.defaultCheckedKeys = [];
        getGrantTree().then(res => {
          this.menuNode = res.data.data.menu;
          this.apiNode = res.data.data.apiScope;
          this.dataNode = res.data.data.dataScope;
          this.visible = true;
        }).then(() => {
          this.defaultCheckedKeys = [];
          getRoleTreeKeys(this.selectionList[0]['id']).then(v => {
            this.defaultCheckedKeys = v.data.data.menu;
          })
        })
      },
      handleCheckChangeMenu(data, checked, indeterminate) {
        this.menuIds = this.$refs.menuTree.getCheckedKeys().concat(this.$refs.menuTree.getHalfCheckedKeys());
      },
      handleCheckChangeData(data, checked, indeterminate) {
        this.dataScopeIds = this.$refs.dataTree.getCheckedKeys().concat(this.$refs.dataTree.getHalfCheckedKeys());
      },
      handleCheckChangeApi(data, checked, indeterminate) {
        this.apiScopeIds = this.$refs.apiTree.getCheckedKeys().concat(this.$refs.apiTree.getHalfCheckedKeys())
      },
      handleClose() {
        this.visible = false;
      },
      makeSure() {
        getGrant({
          apiScopeIds: this.apiScopeIds,
          dataScopeIds: this.dataScopeIds,
          menuIds: this.menuIds,
          roleIds: [this.selectionList[0]['id']]
        }).then(res => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.$refs.crud.toggleSelection();
        })
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
      beforeOpen(done, type) {
        if (["edit", "view"].includes(type)) {
          this.data.forEach((d) => {
            if(d.id == this.form.id) {
              this.form = d;
            }
          })
        }
        done();
      },
      currentChange(currentPage){
        this.page.currentPage = currentPage;
      },
      sizeChange(pageSize){
        this.page.pageSize = pageSize;
      },
      onLoad(page, params = {}) {
        this.loading = true;
        getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          this.data = res.data.data;
          this.loading = false;
          getRoleTree().then(res => {
            const column = this.findObject(this.option.column, "parentId");
            column.dicData = res.data.data;
          });
        });
      }
    }
  };
</script>

<style>
</style>
