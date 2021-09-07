<template>
  <basic-container>
    <el-form :model="form" status-icon ref="form" label-width="100px">
      <el-form-item>
        <el-row type="flex" class="row-bg" justify="end">
          <el-button type="primary" @click="agree">同意</el-button>
          <el-button type="danger" @click="refuse">驳回</el-button>
          <el-button @click="closeTab">关闭</el-button>
        </el-row>
      </el-form-item>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>审批信息</span>
        </div>
        <el-form-item label="申请人" prop="assigneeName">
          <el-input type="text" v-model="form.flow.assigneeName" disabled></el-input>
        </el-form-item>

        <el-row type="flex">
          <el-col :span="12">
            <el-form-item label="开始时间" prop="startTime">
              <el-input type="text" v-model="form.startTime" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间" prop="endTime">
              <el-input type="text" v-model="form.endTime" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="请假理由" prop="reason">
          <el-input type="textarea" :rows="2" v-model="form.reason" disabled></el-input>
        </el-form-item>

        <el-form-item label="批复意见" prop="comment">
          <el-input type="textarea" :rows="2" v-model="form.comment"></el-input>
        </el-form-item>
      </el-card>
      <br>

      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>流程信息</span>
        </div>
        <div>
          <el-timeline>
            <el-timeline-item :timestamp="item.createTime" placement="top" v-for="(item,key) in historys">
              <el-card>
                <p>{{item.assigneeName}}在[{{item.createTime}}]开始处理[{{item.historyActivityName}}]环节</p>
                <p v-if="item.endTime != ''">结束时间：[{{item.endTime}}]</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-card>
      <br>

      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>流程跟踪</span>
        </div>
        <div>
          <img :src="imageUrl+processInstanceId">
        </div>
      </el-card>
    </el-form>

  </basic-container>
</template>

<style lang="sass">

</style>

<script>
  import {getTodoDetail, iframeDiagramUrl, getTodoHistory, todoSumit } from "@/api/work/index";
  import { mapGetters } from "vuex";

  export default {
    name: '',
    data() {
      return {
        form: {
          flow: {}
        },
        businessId: '',
        processInstanceId: '',
        taskId: '',
        imageUrl: iframeDiagramUrl,
        historys: []
      }
    },
    computed: {
      ...mapGetters(["tagList"]),
    },
    methods: {
      getDetailList() {
        getTodoDetail(this.businessId).then(res => {
          if(res.status == 200) {
            this.form = res.data.data;
          }
        })
      },
      getHistoryList() {
        getTodoHistory(this.processInstanceId).then(res => {
          if(res.status == 200){
            this.historys = res.data.data;
          }
        })
      },
      //同意
      agree() {
        todoSumit({
          comment: this.form.comment,
          processInstanceId: this.processInstanceId,
          taskId: this.taskId,
          flag: 'ok'
        }).then(res => {
          if(res.status == 200) {
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.$router.push({path: '/work/start'});
            let { tag } = this.findTag(this.$route.path);
            this.$store.commit("DEL_TAG", tag);
          }
        })
      },
      //驳回
      refuse() {
        todoSumit({
          comment: this.form.comment,
          processInstanceId: this.processInstanceId,
          taskId: this.taskId,
        }).then(res => {
          if(res.status == 200) {
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.$router.push({path: '/work/start'});
            let { tag } = this.findTag(this.$route.path);
            this.$store.commit("DEL_TAG", tag);
          }
        })
      },
      findTag(value) {
        let tag;
        this.tagList.map((item, index) => {
          if (item.value === value) {
            tag = item;
          }
        });
        return { tag: tag};
      },
      closeTab() {
        let { tag } = this.findTag(this.$route.path);
        this.$store.commit("DEL_TAG", tag);
        this.$router.push({path: '/work/start'});
      }
    },
    mounted() {
      this.businessId = this.$route.params.businessId;
      this.processInstanceId = this.$route.params.processInstanceId;
      this.taskId = this.$route.params.taskId;
      this.getDetailList();
      this.getHistoryList();
    }
  }

</script>
