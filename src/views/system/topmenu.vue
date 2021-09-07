<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page="page"
               v-model="form"
               ref="crud"
               @row-update="rowUpdate"
               @row-save="rowSave"
               @row-del="rowDel"
               @search-change="searchChange"
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @refresh-change="refreshChange"
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
                   @click="menuSetting">菜单配置
        </el-button>
      </template>
      <template slot-scope="{row}"
                slot="source">
        <div style="text-align: center">
          <i :class="row.source"></i>
        </div>
      </template>
      <template slot-scope="{row}"
                slot="sort">
        <el-input-number v-model="row.sort" @change="handleChangeNumber(row)" :min="1"></el-input-number>
      </template>
    </avue-crud>

    <el-dialog
      title="下级菜单配置"
      :visible.sync="visible"
      width="30%"
      :before-close="handleClose"
    >
      <el-tree
        :props="defaultProps"
        :data="menuNode"
        ref="menuTree"
        show-checkbox
        node-key="id"
        :default-checked-keys="defaultCheckedKeys"
        @check-change="handleCheckChangeMenu">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="makeSure">确定</el-button>
      </span>
    </el-dialog>
  </basic-container>
</template>

<script>
  import {getList, add, remove, getTopTree, getTopTreeKeys, getGrant} from "@/api/system/topmenu";

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
          tip: false,
          searchShow: true,
          searchMenuSpan: 6,
          border: true,
          index: true,
          viewBtn: true,
          selection: true,
          column: [
            {
              label: "菜单名",
              prop: "name",
              search: true,
              span: 12,
              rules: [{
                required: true,
                message: "请输入菜单名",
                trigger: "blur"
              }]
            },
            {
              label: "菜单图标",
              prop: "source",
              slot: true,
              type: 'icon',
              span: 12,
              rules: [{
                required: true,
                message: "请选择菜单图标",
                trigger: "blur"
              }],
              iconList: [
                {
                  label: '通用图标',
                  list: ["iconfont iconicon_roundadd", "iconfont iconicon_compile", "iconfont iconicon_glass", "iconfont iconicon_roundclose", "iconfont iconicon_roundreduce", "iconfont iconicon_delete", "iconfont iconicon_shakehands", "iconfont iconicon_task_done", "iconfont iconicon_voipphone", "iconfont iconicon_safety", "iconfont iconicon_work", "iconfont iconicon_study", "iconfont iconicon_task", "iconfont iconicon_subordinate", "iconfont iconicon_star", "iconfont iconicon_setting", "iconfont iconicon_sms", "iconfont iconicon_share", "iconfont iconicon_secret", "iconfont iconicon_scan_namecard", "iconfont iconicon_principal", "iconfont iconicon_group", "iconfont iconicon_send", "iconfont iconicon_scan", "iconfont iconicon_search", "iconfont iconicon_refresh", "iconfont iconicon_savememo", "iconfont iconicon_QRcode", "iconfont iconicon_im_keyboard", "iconfont iconicon_redpacket", "iconfont iconicon_photo", "iconfont iconicon_qq", "iconfont iconicon_wechat", "iconfont iconicon_phone", "iconfont iconicon_namecard", "iconfont iconicon_notice", "iconfont iconicon_next_arrow", "iconfont iconicon_left", "iconfont iconicon_more", "iconfont iconicon_details", "iconfont iconicon_message", "iconfont iconicon_mobilephone", "iconfont iconicon_im_voice", "iconfont iconicon_GPS", "iconfont iconicon_ding", "iconfont iconicon_exchange", "iconfont iconicon_cspace", "iconfont iconicon_doc", "iconfont iconicon_dispose", "iconfont iconicon_discovery", "iconfont iconicon_community_line", "iconfont iconicon_cloud_history", "iconfont iconicon_coinpurse_line", "iconfont iconicon_airplay", "iconfont iconicon_at", "iconfont iconicon_addressbook", "iconfont iconicon_boss", "iconfont iconicon_addperson", "iconfont iconicon_affiliations_li", "iconfont iconicon_addmessage", "iconfont iconicon_addresslist", "iconfont iconicon_add", "iconfont icongithub", "iconfont icongitee2"],
                }, {
                  label: '系统图标',
                  list: ["iconfont icon-zhongyingwen", "iconfont icon-caidan", "iconfont icon-rizhi1", "iconfont icon-zhuti", "iconfont icon-suoping", "iconfont icon-bug", "iconfont icon-qq1", "iconfont icon-weixin1", "iconfont icon-shouji", "iconfont icon-mima", "iconfont icon-yonghu", "iconfont icon-yanzhengma", "iconfont icon-canshu", "iconfont icon-dongtai", "iconfont icon-iconset0265", "iconfont icon-shujuzhanshi2", "iconfont icon-tuichuquanping", "iconfont icon-rizhi", "iconfont icon-cuowutishitubiao", "iconfont icon-debug", "iconfont icon-iconset0216", "iconfont icon-quanxian", "iconfont icon-quanxian", "iconfont icon-shuaxin", "iconfont icon-bofangqi-suoping", "iconfont icon-quanping", "iconfont icon-navicon", "iconfont icon-biaodan", "iconfont icon-liuliangyunpingtaitubiao08", "iconfont icon-caidanguanli", "iconfont icon-cuowu", "iconfont icon-wxbgongju", "iconfont icon-tuichu", "iconfont icon-daohanglanmoshi02", "iconfont icon-changyonglogo27", "iconfont icon-biaoge", "iconfont icon-baidu1", "iconfont icon-tubiao", "iconfont icon-souhu", "iconfont icon-msnui-360", "iconfont icon-iframe", "iconfont icon-huanyingye"]
                }
              ]
            },
            {
              label: "菜单编号",
              prop: "code",
              search: true,
              span: 12,
              rules: [{
                required: true,
                message: "请输入菜单编号",
                trigger: "blur"
              }]
            },
            {
              label: "菜单排序",
              prop: "sort",
              slot: true,
              type: "number",
              span: 12,
              rules: [{
                required: true,
                message: "请输入菜单排序",
                trigger: "blur"
              }]
              //minRows: 6,
            },
          ]
        },
        data: [],
        visible: false,
        defaultProps: {
          children: 'children',
          label: 'title'
        },
        menuNode: [],
        defaultCheckedKeys: [],
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
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          done();
        }, error => {
          window.console.log(error);
          loading();
        });
      },
      rowUpdate(row, index, done, loading) {
        add(row).then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          done();
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
      selectionClear() {
        this.selectionList = [];
        this.$refs.crud.toggleSelection();
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
        getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
          this.selectionClear();
        });
      },
      handleChangeNumber(row) {
        add(row).then((row) => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        }, error => {
          window.console.log(error);
        });
      },
      //菜单配置
      handleClose() {
        this.visible = false;
      },
      handleCheckChangeMenu(data, checked, indeterminate) {
        this.menuIds = this.$refs.menuTree.getCheckedKeys().concat(this.$refs.menuTree.getHalfCheckedKeys());
      },
      menuSetting() {
        if (this.selectionList.length === 0 || this.selectionList.length > 1) {
          this.$message.warning("只能选择一条数据");
          return;
        }
        this.defaultCheckedKeys = [];
        getTopTree().then(res => {
          this.menuNode = res.data.data.menu;
          this.visible = true;
        }).then(() => {
          this.defaultCheckedKeys = [];
          getTopTreeKeys(this.selectionList[0]['id']).then(v => {
            this.defaultCheckedKeys = v.data.data.menu;
          })
        })
      },
      makeSure() {
        getGrant({
          menuIds: this.menuIds,
          topMenuIds: [this.selectionList[0]['id']]
        }).then(res => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.$refs.crud.toggleSelection();
        })
      },
    }
  };
</script>

<style>
</style>
