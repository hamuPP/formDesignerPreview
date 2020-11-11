/**
* Created by tangyue on 20/10/23
* 使用方式：
* <previewForm ref="FD"
*             view ---> 渲染样式区别：Boolean,预览|编辑。加上view就表示是预览的样式,不加就是编辑的样式
*             card --->：渲染样式区别:Boolean 是否将表单嵌套在一个elCard中, 如果不需要，那就是一个纯净的表单主体
*             workflow --->是否使用流程，
*             se---> 数据来源方式：Boolean, 带上se,表示数据将从sessionStorage中取
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
      },
      formModel: {
        type: Object,
        default() {
          return {}
        }
      },
      fdFormItems: {
        type: Array,
        default() {
          return []
        }
      },
      fdFormData: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    watch: {
      fdFormData(n, o) {
        this.skin = n.skin;
        this.formClassStr = `fd-form fd-form--preview ${n.skin} ${n.customClassName}`
      },
    },
    created() {
      window.ME = this;// todo 调试时整个全局的我好直接在外部使用

    },
    methods: {
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