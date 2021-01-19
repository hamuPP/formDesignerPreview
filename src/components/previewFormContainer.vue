/**
* Created by tangyue on 20/11/9
*/
<template>
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

<script>
  import {getUrlQueryParams, showQueryErrorMessage} from '../assets/js/utils'
  import previewForm from './previewForm.vue'

  export default {
    name: 'previewFormContainer',
    components: {
      previewForm
    },
    props: {
      // 是否为预览模式，模式是编辑模式啦
      view: {
        type: Boolean,
        default: false
      },
      // 表单的id
      id: {
        type: [Number, String],
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
        searchParamObj: {}// 浏览器查询参数
      }
    },
    watch: {
      view (n, o) {
        console.log('container watch view', this.view)
      }
    },
    created () {
      // 检查浏览器参数
      let searchParamObj = this.searchParamObj = getUrlQueryParams();
      console.log(searchParamObj);
    },
    mounted () {
    },
    methods: {
      // 这些方法是给外部使用的一些便利方法
      // 获取form的vue实例,因为外部调用需要操作el-form
      getFormIns () {
        return this.$refs.form.$refs.fdForm;
      },
      getFormItemsIns () {
        return this.$refs.form.$refs.fdFormItem;
      }
    }

  }
</script>

<style lang="scss">
  @import 'element-ui/lib/theme-chalk/index.css';

</style>