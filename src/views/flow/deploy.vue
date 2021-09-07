<template>
  <basic-container>
    <avue-form :option="deployOption" ref="deployForm" v-model="deployForm">

    </avue-form>
  </basic-container>
</template>

<style lang="sass">

</style>

<script>
  export default {
    name: '',
    data() {
      return {
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
              span: 12,
              row: true,
            },
            {
              label: '流程模式',
              span: 12,
              row: true,
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
              span: 12,
              row: true,
              rules: [{
                required: true,
                message: "请选择所属租户",
                trigger: "blur"
              }],
            },
            {
              label: '附件上传',
              prop: 'imgUrl6',
              type: 'upload',
              limit: 1,
              span: 24,
              propsHttp: {
                res: 'data'
              },
              listType: 'bpmn20',
              tip: '请上传 bpmn20.xml 标准格式文件',
              action: '/api/blade-flow/manager/check-upload'
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
    methods: {

    },
    mounted() {

    }
  }

</script>
