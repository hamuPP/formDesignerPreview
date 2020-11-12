/**
* Created by tangyue on 20/11/9
*/
<template>
  <div :class="view? 'view-page': 'edit-page'">
    <!--  如果需要使用ElCard样式  -->
    <el-card v-if="card">
      <!--  预览模式 --start--    -->
      <el-tabs v-if="view"
               v-model="activeName"
               type="border-card"
               class="cusComplaint__wrapper">
        <el-tab-pane label="基本信息" name="基本信息">
          <previewForm
                  ref="form"
                  view
                  :id="id"
                  :rules="rules"
                  :formModel="formModel"
                  :fdFormItems="fdFormItems"
                  :fdFormData="fdFormData"
          >
          </previewForm>
        </el-tab-pane>
      </el-tabs>
      <!--  预览模式 --end--    -->

      <!--  编辑模式 --start--    -->
      <template v-else>
        <div slot="header" class="edit-page__header">
          <span>编辑表单</span>
        </div>
        <previewForm
                ref="form"
                :id="id"
                :rules="rules"
                :formModel="formModel"
                :fdFormItems="fdFormItems"
                :fdFormData="fdFormData"
        >
        </previewForm>
      </template>
      <!--  编辑模式 --end--    -->
    </el-card>
    <!--  不使用ElCard样式（直接显示表单主体）  -->
    <template v-else>
      <previewForm
              ref="form"
              :view="view"
              :id="id"
              :rules="rules"
              :formModel="formModel"
              :fdFormItems="fdFormItems"
              :fdFormData="fdFormData"
      >
      </previewForm>
    </template>
  </div>
</template>

<script>
  import {getUrlQueryParams, showQueryErrorMessage} from '../assets/js/utils'
  import previewForm from './previewForm.vue'

  export default {
    name: 'previewFormContainer',
    components: {
      previewForm
      // transferDialog,
      // terminateDialog
    },
    props: {
      // 是否为预览模式，模式是编辑模式啦
      view: {
        type: Boolean,
        default: false
      },
      card: {
        type: Boolean,
        default: false
      },
      workflow: {
        type: Boolean,
        default: false
      },
      // 表单的id
      id: {
        type: [Number, String],
        default: null
      },
      // 当有流程时，此为业务的id
      boId: {
        type: [Number, String],
        default: null
      },
      userId: {
        type: [Number, String],
        default: null
      },
      businessType: {
        type: String,
        default: null
      },
      rules: {
        type: Object,
        default () {
          return {}
        }
      },
      formModel: {
        type: Object,
        default () {
          return {}
        }
      },
      fdFormItems: {
        type: Array,
        default () {
          return []
        }
      },
      fdFormData: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data () {
      return {
        activeName: '基本信息',
        searchParamObj: {},// 浏览器查询cam手机
        // 流程业务相关的变量，都带上workflow_的前缀
        workflow_btnVisible: true,// todo 先默认改成true,方便我写页面样式
        workflow_operateVisible: true,//显示隐藏按钮  todo 先默认改成true,方便我写页面样式

      }
    },
    watch: {
      view (n, o) {
        console.log('container watch view', this.view)
      }
    },
    created () {
      debugger;
      console.log('container created', this.view);
      // 检查浏览器参数
      let searchParamObj = this.searchParamObj = getUrlQueryParams();
      console.log();

    },
    mounted () {
    },
    methods: {
      // 获取form的vue实例,因为外部调用需要操作el-form
      getFormIns () {
        return this.$refs.form.$refs.fdForm;
      }
    }

  }
</script>

<style lang="scss">
  @import 'element-ui/lib/theme-chalk/index.css';
  @import "../assets/font/iconfont.css";

  .preview__headBtn {
    font-size: 16px;
    margin: 10px;
    cursor: pointer;
  }

  .edit-page {
    font-family: "Microsoft YaHei", "微软雅黑", "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", Arial, sans-serif;

    .el-card__header {
      padding: 0 !important;
    }
  }

  .edit-page__header {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    font-weight: bold;
    color: #333;
    padding: 0 0 0 20px;
  }

  .view-page {
    font-family: "Microsoft YaHei", "微软雅黑", "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", Arial, sans-serif;

    .el-tabs__header .el-tabs__nav-scroll {
      background: #fff;
      border-bottom: solid 1px #5787FF;
    }

    .el-tabs__header .el-tabs__nav-scroll .el-tabs__nav .el-tabs__item {
      margin: 0px 0px 0 5px;
      background-color: #B9C1D9;
      border-radius: 10px 10px 0 0;
      height: 32px;
      color: #fff;
      line-height: 32px;
    }

    .el-tabs__header .el-tabs__nav-scroll .el-tabs__nav .is-active {
      background-color: #5787FF;
    }
  }
</style>