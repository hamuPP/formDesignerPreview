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
            :rules="formRules"
            :tableBtnIsShow='tableBtnIsShow'
            :useCustormRule="useCustormRule"
            :formModel="previewFormModel"
            :formModelCn='formModelCn'
            :formModelCnFlag='formModelCnFlag'
            :fdFormItems="fdFormItems"
            :fdFormData="fdFormData"
            :isHistory='isHistory'

    >
    </previewForm>

    <anchor v-if="showAnchor" ref="anchor"></anchor>

    <commonDialog ref="commonDialog"
                  @dialogBtnClick="dialogBtnClickHandle">
        <slot name="dialogContent"></slot>
    </commonDialog>
  </div>

</template>

<script>
  import {getUrlQueryParams} from '@/util/utils'
  import previewForm from './previewForm.vue'
  import anchor from './anchor/index.vue'
  import CusMsgbox from './cus_msgbox/index.js'
  // import CusButton from './CusButton/index.vue'
  import commonDialog from './comm-dialog'
  import {generateElementuiCode} from '../generate_code/generateCode'

  export default {
    name: 'previewFormContainer',
    components: {
      previewForm,
      anchor,
      // CusButton,
      commonDialog
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
    //用于流转信息隐藏附件上传
    isHistory:{
      type:String,
      default:''
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
      tableBtnIsShow:{
        type:Object,
        default:()=>{}
      },
      formModelCn:{
        type:Object,
        default:()=>{}
      },
      formModelCnFlag:{
        type:Boolean,
        default:false
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
    computed: {
      previewFormModel:{
        get(){
          return this.formModel;
        },
        set(val){
          console.log("set formModel", val);
          this.$emit('update:formModel', val);
        }
      }
    },
    data () {
      return {
        searchParamObj: {},// 浏览器查询参数
        formRules:{},// 表单的规则
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
      },
      rules(n){
        this.formRules = JSON.parse(JSON.stringify(n));
      }
    },
    created () {
      // 检查浏览器参数
      let searchParamObj = this.searchParamObj = getUrlQueryParams();
      // 根据传入的rules生成表单的初始rules
      this.formRules = JSON.parse(JSON.stringify(this.rules));
    },
    mounted () {
      const that = this;
      //没有linkFormCode值时，代表是主表单，把主表单formModel值存起来，子表单表格要用
      if(!this.linkFormCode&&!sessionStorage.getItem('mainFormModel')){
        sessionStorage.setItem('mainFormModel',JSON.stringify(this.formModel))
      }
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

      /**
       * 根据code找到表单字段
       * @param code 字段的code
       * @param formCode 表单的code，若无，则默认是当前页面上所有表单的
       * @returns {*[]}
       */
      getFormItemsByCode(code, formCode){
        let allForm = window.$fdForm;
        let resultList = [];

        for(let key in allForm){
          let form = allForm[key];
          if((formCode && form.formCode === formCode) || !formCode){
            let allItems = form.$refs.fdFormItem;
            for (let i = 0,len = allItems.length;i < len;i++){
              let child = allItems[i];
              if (child && child.data && child.data.code === code){
                resultList.push(child);
              }
            }
          }
        }
        return resultList;
      },

      getFormByCode(code){
        let result = null;
        let all = window.$fdForm;
        if(all && all.constructor === Object && all[code]){
          result = all[code].$refs.fdForm;
        }
        return result;
      },
      getAllForms(){
        let result = [];
        let all = window.$fdForm;
        if(all && all.constructor === Object){
          for(let key in all){
            result.push(all[key].$refs.fdForm)
          }
        }
        return result;
      },
      /**
       * 添加rules
       * @param formCode 表单code
       * @param formItemCode 字段code
       * @param addRule {Object|Array} 将要新加入的规则
       */
      setFormRule(formCode, formItemCode, addRule){
        let currentFormCode = this.fdFormData.code;

        if(formCode === currentFormCode){
          if(addRule.constructor === Array){

          }else if(addRule.constructor === Object){
            addRule = [addRule];
          }

          this.formRules[formItemCode] = addRule;
          this.formRules = JSON.parse(JSON.stringify(this.formRules));
          this.$nextTick(__=>{
            let todo = this.getFormItemsByCode(formItemCode, formCode);
            if(todo[0] && todo[0].$refs && todo[0].$refs.elfmitem){
              todo[0].$refs.elfmitem.addValidateEvents();
            }
          });
        }
        // 找页面上的其他表单预览实例
        else if(formCode){
          if(addRule.constructor === Array){

          }else if(addRule.constructor === Object){
            addRule = [addRule];
          }
          let subForm = this.getFormByCode(formCode);
          let container = subForm.$parent.$parent;

          container.formRules[formItemCode] = addRule;
          container.formRules = JSON.parse(JSON.stringify(container.formRules));
          container.$nextTick(__=>{
            let todo = container.getFormItemsByCode(formItemCode, formCode);
            if(todo[0] && todo[0].$refs && todo[0].$refs.elfmitem){
              todo[0].$refs.elfmitem.addValidateEvents();
            }
          });
        }
      },
      setFormItemValue(formCode, formItemCode, newVal) {
        let currentFormCode = this.fdFormData.code;
        if(formCode === currentFormCode) {
          this.$set(this.formModel, formItemCode, newVal);
        }
        else if(formCode){
          // 找页面上的其他表单预览实例
          let subForm = this.getFormByCode(formCode);
          let container = subForm.$parent.$parent;

          container.$set(container.formModel, formItemCode, newVal)
        }
      },
      getFormItemValue(formCode, formItemCode) {
        let currentFormCode = this.fdFormData.code;
        if(formCode === currentFormCode) {
          return this.formModel[formItemCode];
        }
        else if(formCode){
          // 找页面上的其他表单预览实例
          let subForm = this.getFormByCode(formCode);
          let container = subForm.$parent.$parent;
          return container.formModel[formItemCode];
        }
      },
      beforeSubmit(){
        if (this.fdFormData.beforeSubmit){
          try {
            let fnc = new Function(this.fdFormData.beforeSubmit);
            fnc(this, this.formModel);
          } catch (e) {
            throw e;
          }
        }
      },
      afterSubmit(){
        if (this.fdFormData.afterSubmit){
          try {
            let fnc = new Function(this.fdFormData.afterSubmit);
            fnc(this, this.formModel);
          } catch (e) {
            throw e;
          }
        }
      },
      Alert(){
        CusMsgbox.alert(...arguments)
      },
      Confirm(){
        return CusMsgbox.confirm(...arguments)
      },
      // 打开弹窗
      openDialog(opt){
        // debugger;
        // this.content2 = opt.content2;
        this.$refs.commonDialog.showCustormDialog(opt)
      },
      dialogBtnClickHandle(opt, closeDialog){
        this.$emit('dialogBtnClick', opt, closeDialog)
      }
    },

    generateElementuiCode: generateElementuiCode
  }
</script>

<style lang="scss">
  @import 'element-ui/lib/theme-chalk/index.css';

</style>
