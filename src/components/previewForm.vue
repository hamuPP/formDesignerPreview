/**
* Created by tangyue on 20/10/23
* 使用方式：
* <previewForm ref="FD"
*             view ---> 渲染样式区别：Boolean,预览|编辑。加上view就表示是预览的样式,不加就是编辑的样式
*             card --->：渲染样式区别:Boolean 是否将表单嵌套在一个elCard中, 如果不需要，那就是一个纯净的表单主体
*             workflow --->是否使用流程，
*             se---> 数据来源方式：Boolean, 带上se,表示数据将从sessionStorage中取
*             id="123234524" ---->数据来源方式：String, 带上id，并且需要写id="XXXX"表示将根据id向后端查询数据
* </previewForm>
* **注意：**
* 1. 关于数据来源方式：se与id，如果同时存在，将使用se,而忽略id
* 2. workflow：是否使用流程。目前表单设计器做出来的表单是要和流程一起用的，所以会有这么一条配置
*
*/
<template>
  <el-form :class="formClassStr"
           :size="fdFormData.size"
           :label-width="fdFormData.labelWidth + 'px'"
           :model="formModel"
           ref="fdForm"
           :rules="rules"
           :disabled="view"
  >
    <el-row v-for="(it, index) in fdFormItems"
            :key="index"
            :gutter="35">
      <el-col
              v-for="(item, key) in it"
              :key="key"
              :span="item.width"
              :style="colStyle(item)">
        <!--    如果是有分组的  --start--  -->
        <template v-if="item.type === 'group'">
          <div class="fd-form__group">
            <div v-if="item.label" class="fd-form__groupHeader">{{item.label}}</div>
            <el-row v-for="(child, childIdx) in  item.children"
                    :key="childIdx"
                    :gutter="35">
              <el-col
                      v-for="(cItem, cKey) in child"
                      :key="cKey"
                      :span="cItem.width">
                <previewFormItem ref="fdFormItem"
                                 :view="view"
                                 :formModel="formModel"
                                 :data="cItem"
                                 :labelWidth="fdFormData.labelWidth"
                                 :lineMarginBottom="fdFormData.lineMarginBottom"></previewFormItem>
              </el-col>
            </el-row>
          </div>
        </template>
        <!--    如果是有分组的  --end--  -->

        <!--   非分组的表单项  --start--   -->
        <previewFormItem v-else
                         ref="fdFormItem"
                         :view="view"
                         :formModel="formModel"
                         :data="item"
                         :labelWidth="fdFormData.labelWidth"
                         :lineMarginBottom="fdFormData.lineMarginBottom"></previewFormItem>
        <!--   非分组的表单项  --end--   -->
      </el-col>

    </el-row>
  </el-form>
</template>

<script>
  // 预设皮肤的几个参数
  import {getRefs} from '../util/common';
  import previewFormItem from './previewFormItem.vue'
  import {getForm} from '../api/formDesigner_api';

  const SKIN_OPTIONS = {
    'fd-form--blue': {
      labelWidth: 150,
      lineMarginBottom: 6
    }
  };
  export default {
    name: 'previewForm',
    components: {previewFormItem},
    data() {
      return {
        skin: '', // 预设的表格的样式名称
        formClassStr: '',
        fdFormItems: [],
        fdFormData: {},
        formModel: {},// 表单绑定的值
      }
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
      se: {
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
        default() {
          return {}
        }
      }
    },
    watch: {
      fdFormData(n, o) {
        console.log('watched', n )
        debugger;
        this.skin = n.skin;
        this.formClassStr = `fd-form fd-form--preview ${n.skin} ${n.customClassName}`
      },
    },
    created() {
      window.ME = this;// todo 调试时整个全局的我好直接在外部使用
      // 有se的表示从本地存储中找到数据
      debugger;
      if (this.se) {
        if (sessionStorage.getItem('preview_lists') && sessionStorage.getItem('preview_form')) {
          this.formModel = this.getFormModel(JSON.parse(sessionStorage.getItem('preview_lists')));
          this.fdFormItems = this.formateList(JSON.parse(sessionStorage.getItem('preview_lists')));
          this.fdFormData = this.formateFormData(JSON.parse(sessionStorage.getItem('preview_form')));
        }
        else{
          alert('没有数据')
        }
      }
      // 向后端查询数据
      else if(this.id) {
        this.formId = this.id
        this.getFormData();
      }
    },
    methods: {
      formateList(dataList) {
        const BASE_COUNT = 24;//基数：多少个为一组
        let list = [];
        let fn = (dataList, parent) => {
          let count = 0;
          dataList.forEach(it => {
            let span = it.width;

            // 假如有一项为24,则它自为一行，
            let index;
            let lastNum = count / BASE_COUNT;// 之前的表单项的总和
            if (span == 24 && lastNum !== Math.floor(lastNum)) {
              index = Math.ceil(lastNum);
              count = (index + 1) * 24;
            } else {
              count += span;
              let num = count / BASE_COUNT;
              index = Math.floor(num) === num ? num - 1 : Math.floor(num);// 整数-1，小数向下取整
            }
            if (parent) {
              !parent.children && (parent.children = []);
              !parent.children[index] && (parent.children[index] = []);
              parent.children[index].push(it)
            } else {
              !list[index] && (list[index] = []);
              list[index].push(it);
            }

            // 分组的
            if (it.children && it.children.length) {
              let metaChildren = [].concat(it.children);// 原始的子成员数据
              it.children = [];
              fn(metaChildren, it);
            }
          });
        };
        fn(dataList);
        return list;
      },
      formateFormData(data) {
        let resultData = {};
        let skin = data.skin;
        let skinOptions = (skin && SKIN_OPTIONS[skin]) ? SKIN_OPTIONS[skin] : {};
        resultData = Object.assign(skinOptions, data);
        return resultData;
      },
      colStyle(item) {
        let str = '';
        if (item.displayInline) {
          str += 'clear: both;';
        }
        if (item.hidden) {
          str += 'display: none';
        }
        return str;
      },
      // 做出表单的绑定值
      getFormModel(n) {
        let obj = {};
        n.forEach(it => {
          if(it.type === 'checkbox'){
            obj[it.code] = it.defaultValue ? it.defaultValue.split(','): [];
          }else{
            obj[it.code] = it.defaultValue;
          }
        });
        return obj;
      },
      // 根据id,查询表单的数据
      getFormData() {
        getForm({formId: this.formId})
          .then(res => {
            if(res && res.data && res.data.ok){
              var configContent = JSON.parse(res.data.data.configContent);
              // 表单配置项数据合并
              var fmData = configContent.fm;
              // 域们的数据
              var list = configContent.list;
              this.fdFormData = fmData;
              debugger;
              this.formModel = this.getFormModel(list);
              this.fdFormItems = this.formateList(list);
            }
            else{
              this.MessageConfig = {
                showMessage: true,//打开消息提示框
                MsgBoxType: 'error',//消息提示框类型
                MsgText: (res && res.data && res.data.msg)? res.data.msg : '请稍后再试'
              }
            }
          })
          .catch(e=>{
            debugger;
            this.MessageConfig = {
              showMessage: true,//打开消息提示框
              MsgBoxType: 'error',//消息提示框类型
              MsgText: e.message
            }
          })
      },

      /////// 组件外会用到的方法：
      // 返回表单组件
      getForm() {
        return this.$refs.fdForm;
      },
      // 返回表单里面的每个输入组件
      getRef(refName) {
        return getRefs(this, refName);
      },
      // 给输入组件绑定事件，返回的参数与elementUI的Api写的相同
      addEvent(eventType, refName, func) {
        let refs = getRefs(this, refName);
        refs.forEach(ref => {
          ref.$on(eventType, func)
        })
      },
    }
  }
</script>

<style lang="scss">
  @import "../assets/scss/formDesigner.scss";
</style>