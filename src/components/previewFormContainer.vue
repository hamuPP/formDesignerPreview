/**
* Created by tangyue on 20/11/9
* props: showAnchor 是否显示悬浮目录组件。但同时，必须有分组且有分组的名称，才能生成悬浮锚点
*/
<template>
  <div>
    <previewForm
            ref="form"
            :view="view"
            :id="id"
            :version='version'
            :linkFormCode='linkFormCode'
            :rules="rules"
            :useCustormRule="useCustormRule"
            :formModel="formModel"
            :fdFormItems="fdFormItems"
            :fdFormData="fdFormData"
    >
    </previewForm>

    <anchor v-if="showAnchor" ref="anchor"></anchor>
  </div>

</template>

<script>
  import {getUrlQueryParams, showQueryErrorMessage} from '../assets/js/utils'
  import previewForm from './previewForm.vue'
  import anchor from './anchor/index.vue'
  import {generateElementuiCode} from '../generate_code/generateCode'

  export default {
    name: 'previewFormContainer',
    components: {
      previewForm,
      anchor
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
      version: {
      type: [Number, String],
      default: null,
    },
    //link表单的code
    linkFormCode:{
       type: [Number, String],
      default: null,
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
      },
      // 是否采用用户自配的规则，即props中传入的rules。
      // 若是，则表单这里将会无视表单编辑器中配置的校验数据
      useCustormRule: {
        type: Boolean,
        default: false
      },
      // 是否显示一个右侧的锚点目录
      showAnchor: {
        type: Boolean,
        default: false
      },
      // 用于当本组件嵌入其他系统时，其他系统可能有固定显示的头尾部分，这种情况下，可视区域应该是body的高度还要减去头尾的尺寸
      // 是锚点目录需要用到的功能
      outerHeaderHeight: {
        type: Number,
        default: 0
      },
      outerheightHeight: {
        type: Number,
        default: 0
      },
    },
    data () {
      return {
        searchParamObj: {}// 浏览器查询参数
      }
    },
    watch: {
      view (n, o) {
        console.log('container watch view', this.view)
      },
      fdFormItems(n, o) {
        // 检测到表单项有变后，通知锚点组件重新生成锚点
        this.$nextTick(_=>{
          if(this.showAnchor){
            this.$refs.anchor.reset();
          }
        });
      }
    },
    created () {
      // 检查浏览器参数
      let searchParamObj = this.searchParamObj = getUrlQueryParams();
    },
    mounted () {
      //没有linkFormCode值时，代表是主表单，把主表单formModel值存起来，子表单表格要用
      if(!this.linkFormCode&&!sessionStorage.getItem('mainFormModel')){
        sessionStorage.setItem('mainFormModel',JSON.stringify(this.formModel))
      }
      const that = this;
      if(this.showAnchor){
        document.body.addEventListener('mousewheel', function(){
          that.scrollEvent();
        })
      }
    },
    methods: {
      scrollEvent (e) {
        let outerHeaderHeight = this.outerHeaderHeight || 0;
        let outerheightHeight = this.outerheightHeight || 0;
        this.$nextTick(_=>{
          let scrollItems = this.$el.querySelectorAll('.fd-form-group');

          // debugger;
          // let abc = this.$el;
          // for (let i = scrollItems.length - 1; i >= 0; i--) {
          //   // 判断滚动条滚动距离是否大于当前滚动项可滚动距离
          //   let judge = abc.scrollTop >= scrollItems[i].offsetTop - scrollItems[0].offsetTop
          //   if (judge) {
          //     debugger;
          //     this.$refs.anchor.catalogCur = i;
          //     break;
          //   }
          // }
          for(let i = 0,len = scrollItems.length;i<len;i++){
            let child = scrollItems[i];
            let rec = child.getBoundingClientRect();
            if((rec.y || rec.top) >= outerHeaderHeight
              &&(rec.y || rec.top) <= (document.body.clientHeight - outerheightHeight))
            {
              this.$refs.anchor.catalogCur = i;
              break;
            }
          }
        })
      },

      // 以下这些方法是给外部使用的一些便利方法，保放在最下面我好找
      /**
       * 获取form的vue实例,因为外部调用需要操作el-form
       * @returns {*}
       */
      getFormIns () {
        return this.$refs.form.$refs.fdForm;
      },
      getFormItemsIns () {
        return this.$refs.form.$refs.fdFormItem;
      },
      getFormItemsByCode(code){
        let all = this.$refs.form.$refs.fdFormItem;
        let resultList = [];
        for (let i = 0,len = all.length;i<len;i++){
          let child = all[i];
          if (child && child.data && child.data.code === code){
            resultList.push(child);
          }
        }
        return resultList;
      },

      beforeSubmit(){
        if (this.fdFormData.beforeSubmit){
          try {
            let fnc = new Function(this.fdFormData.beforeSubmit);
            fnc(this.formModel);
          } catch (e) {
            throw e;
          }
        }
      },
      afterSubmit(){
        if (this.fdFormData.afterSubmit){
          try {
            let fnc = new Function(this.fdFormData.afterSubmit);
            fnc(this.formModel);
          } catch (e) {
            throw e;
          }
        }
      },
    },

    generateElementuiCode: generateElementuiCode
  }
</script>

<style lang="scss">
  @import 'element-ui/lib/theme-chalk/index.css';

</style>
