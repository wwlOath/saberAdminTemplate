<template>
  <basic-container>
    <avue-form :option="option" v-model="form" @submit="handleSubmit">
      <template slot="group1Header" slot-scope="scope">
        <h4>{{scope}}</h4>
      </template>
    </avue-form>
  </basic-container>
</template>

<style lang="sass">

</style>

<script>
  import {leaveSubmit} from "@/api/work/index";

  export default {
    name: '',
    data() {
      return {
        form:{},
        id: '',
        option:{
          group:[
            {
              icon:'el-icon-info',
              label: '请假基础信息',
              collapse: true,
              prop: 'group1',
              column: [
                {
                  label: '审批人员',
                  prop: 'taskUser',
                  span: 24,
                  type: "select",
                  dicUrl: "/api/blade-user/user-list",
                  props: {
                    label: "account",
                    value: "id",
                  },
                  slot: true,
                  rules: [{
                    required: true,
                    message: "请选择审批人员",
                    trigger: "blur"
                  }]
                },
                {
                  label: '开始时间',
                  prop: 'startTime',
                  span: 12,
                  type: "datetime",
                  rules: [{
                    required: true,
                    message: "请选择开始时间",
                    trigger: "blur"
                  }]
                },
                {
                  label: '结束时间',
                  prop: 'endTime',
                  span: 12,
                  type: "datetime",
                  rules: [{
                    required: true,
                    message: "请选择结束时间",
                    trigger: "blur"
                  }]
                },
                {
                  label: '请假理由',
                  prop: 'reason',
                  type: 'textarea',
                  span: 24,
                  rules: [{
                    required: true,
                    message: "请输入请假理由",
                    trigger: "blur"
                  }]
                },
              ]
            }
          ]
        }
      }
    },
    methods: {
      handleSubmit(form){
        let _this = this;
        _this.form.processDefinitionId = this.id;
        leaveSubmit(this.form).then(res => {
          if(res.status == 200){
            _this.$message({
              type: "success",
              message: "操作成功!"
            });
            _this.$router.push({path: '/work/start'});
          }
        })
      },
    },
    mounted() {
      this.id = this.$route.params.id;
    }
  }

</script>
