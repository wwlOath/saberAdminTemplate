<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page="page"
               ref="crud"
               @row-click="handleRowClick"
               @search-change="searchChange"
               @search-reset="searchReset"
               @refresh-change="refreshChange"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @on-load="onLoad">
      <template slot="menuLeft" slot-scope="scope">
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   @click="handleDelete">删 除
        </el-button>
      </template>
      <template slot-scope="{row}"
                slot="code">
        <el-tag>{{row.code}}</el-tag>
      </template>
      <template slot-scope="{row}"
                slot="isSealed">
        <el-tag>{{row.isSealed == 0 ? '否' : '是'}}</el-tag>
      </template>
      <template slot="menu" slot-scope="scope">
        <el-button :size="scope.size" :type="scope.type" icon="el-icon-setting" @click.stop="configure(scope.row)">字典配置</el-button>
      </template>
    </avue-crud>

    <el-dialog
      :title="'['+drawerTitle+'] 字典配置'"
      :visible.sync="visible"
      width="60%"
      :before-close="handleClose">
      <avue-crud :option="settingOption"
                   :table-loading="settingLoading"
                   :data="settingData"
                   ref="settingcrud"
                   v-model="settingForm"
                   :before-open="beforeOpen"
                   @row-save="rowSaveSetting"
                   @row-update="rowUpdateSetting"
                   @row-del="rowDelSetting"
                   @search-change="searchSettingChange"
                   @search-reset="searchSettingReset"
                   @selection-change="selectionSettingChange"
                   @refresh-change="refreshSettingChange"
                   @on-load="settingOnLoad">
          <template slot="menuLeft" slot-scope="scope">
            <el-button type="danger"
                       size="small"
                       icon="el-icon-delete"
                       plain
                       @click="handleDeleteSetting">删 除
            </el-button>
          </template>
          <template slot-scope="{row}"
                    slot="isSealed">
            <el-tag>{{row.isSealed == 0 ? '否' : '是'}}</el-tag>
          </template>
        </avue-crud>
    </el-dialog>
  </basic-container>
</template>

<script>
  import {add, getList, getSettingList, remove} from "@/api/system/dictbiz";

  const switchData = [
    {
      label: '否',
      value: 0
    },
    {
      label: '是',
      value: 1
    },
  ]
  export default {
    data() {
      return {
        form: {
          scopeType: ''
        },
        selectionList: [],
        selectionSettingList: [],
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
          addBtn: true,
          editBtn: true,
          delBtn: true,
          viewBtn: false,
          menuWidth: 300,
          column: [
            {
              label: "字典编号",
              prop: "code",
              span: 24,
              slot: true,
              search: true,
              rules: [{
                required: true,
                message: "请输入菜单名称",
                trigger: "blur"
              }],
            },
            {
              label: '字典名称',
              prop: 'dictValue',
              search: true,
              span: 12,
              rules: [
                {
                  required: true,
                  message: '请输入字典名称',
                  trigger: 'blur'
                }
              ]
            },
            {
              label: '字典排序',
              prop: 'sort',
              hide: true,
              type: 'number',
              span: 12,
              rules: [
                {
                  required: true,
                  message: '请输入字典排序',
                  trigger: 'blur'
                }
              ]
            },
            {
              label: '封存',
              prop: 'isSealed',
              slot: true,
              type: 'switch',
              dicData: switchData,
            },
            {
              label: '字典备注',
              prop: 'remark',
              hide: true
            },
          ]
        },
        data: [],
        visible: false,
        drawerTitle: '',
        settingForm: {},
        settingOption: {
          searchShow: true,
          searchMenuSpan: 6,
          tip: false,
          border: true,
          index: true,
          selection: true,
          viewBtn: false,
          column: [
            {
              label: "字典编号",
              prop: "code",
              span: 24,
              disabled: true,
              search: true,
              rules: [{
                required: true,
                message: "请输入字典编号",
                trigger: "blur"
              }],
            },
            {
              label: '字典名称',
              prop: 'dictValue',
              search: true,
              span: 12,
              rules: [
                {
                  required: true,
                  message: '请输入字典名称',
                  trigger: 'blur'
                }
              ]
            },
            {
              label: '上级字典',
              prop: 'parentId',
              type: 'tree',
              dicUrl: '/api/blade-system/dict-biz/tree?code=DICT',
              props: {
                label: "title",
                value: 'value'
              },
              disabled: true,
              span: 12,
              hide: true,
              rules: [
                {
                  required: true,
                  message: '请选择上级字典',
                  trigger: 'click'
                }
              ]
            },
            {
              label: '字典键值',
              prop: 'dictKey',
              span: 12,
              rules: [{
                required: true,
                message: "请输入字典键值",
                trigger: "blur"
              }]
            },
            {
              label: '字典排序',
              prop: 'sort',
              span: 12,
              type: 'number',
              rules: [{
                required: true,
                message: "请输入字典排序",
                trigger: "blur"
              }],
              hide: true
            },
            {
              label: '封存',
              prop: 'isSealed',
              slot: true,
              type: 'switch',
              dicData: switchData,
            },
            {
              label: '字典备注',
              prop: 'remark',
              span: 12,
              hide: true
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
      },
      settingIds() {
        let ids = [];
        this.selectionSettingList.forEach(ele => {
          ids.push(ele.id);
        });
        return ids.join(",");
      }
    },
    methods: {
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

      //setting
      rowSaveSetting(row, done, loading) {
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
      rowUpdateSetting(row, index, done, loading) {
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
      rowDelSetting(row) {
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
      handleDeleteSetting() {
        if (this.selectionSettingList.length === 0) {
          this.$message.warning("请选择至少一条数据");
          return;
        }
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          return remove(this.settingIds);
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
      beforeOpen(done, type) {
        let _this = this;
        if (["add"].includes(type)) {
          _this.data.forEach((d) => {
            if(d.id == _this.dataId) {
              _this.settingForm.code = d.code;
              _this.settingForm.parentId = d.id;
            }
          })
        }
        done();
      },
      //权限配置
      configure(data) {
        this.dataId = data.id;
        this.drawerTitle = data.dictValue;
        this.visible = true;
      },
      handleRowClick(row, event, column) {
        this.dataId = row.id;
        this.drawerTitle = row.dictValue;
        this.visible = true;
      },
      handleClose() {
        this.visible = false;
      },
      searchReset() {
        this.query = {};
        this.onLoad(this.page);
      },
      searchSettingReset() {
        this.settingQuery = {};
        this.settingOnLoad();
      },
      searchChange(params, done) {
        this.query = params;
        this.page.currentPage = 1;
        this.onLoad(params);
        done();
      },
      searchSettingChange(params, done) {
        this.settingQuery = params;
        this.settingOnLoad(params);
        done();
      },
      selectionChange(list) {
        this.selectionList = list;
      },
      selectionSettingChange(list) {
        this.selectionSettingList = list;
      },
      refreshChange() {
        this.onLoad(this.page);
      },
      refreshSettingChange() {
        this.settingOnLoad();
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
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
        });
      },
      settingOnLoad(page, params = {}) {
        this.settingLoading = true;
        getSettingList(this.dataId, Object.assign(params, this.settingQuery)).then(res => {
          this.settingData = res.data.data;
          this.settingLoading = false;
        });
      }
    }
  };
</script>

<style>
</style>
