<template>
  <div class="app" id="app">
    <el-card class="params-config">
      <div slot="header" class="clearfix">
        <span>try</span>
      </div>
      <div class="params-config__row">
        <span class="text-label">请输入表单id:</span>
        <el-input size="mini" v-model="formId" v-on:keyup.enter.native="formIdEnterHand"></el-input>
        <em>(按回车进行查询)</em>
      </div>
    </el-card>
    <FormDesigner ref="FD"
                  :view="isView"
                  :id="formId"
                  :formModel="formModel"
                  :fdFormItems="fdFormItems"
                  :fdFormData="fdFormData"
    ></FormDesigner>
  </div>
</template>
<script>
  import {getForm} from './api/API';

  import {getUrlQueryParams} from '../src/assets/js/utils';

  export default {
    data () {
      return {
        // 以下几个参数由调用方来传给表单设计器预览插件
        isView: false,
        formId: '', // 表单的id,而不是业务的id
        businessType: 'zctest', // 集客的流程编码 以前用的CustomerComplaint， 后面改成了 ComplaintOrder
        formModel: {},
        fdFormItems: [],
        fdFormData: {}
      }
    },
    created () {
      let searchParamObj = getUrlQueryParams();
      // 根据表单id查询接口数据
      if (this.formId) {
        this.getFormData();
      }
    },
    mounted () {
      let FD = this.$refs.FD;
      let FD_form = FD.getFormIns();
      console.log(FD_form)
    },
    beforeDestroy () {

    },
    methods: {
      // 做出表单的绑定值
      getFormModel (n) {
        let obj = {};
        n.forEach(it => {
          if (it.type === 'checkbox' || it.type === 'timePickerRange') {
            debugger;
            obj[it.code] = it.defaultValue ? it.defaultValue.split(',') : [];
          } else {
            obj[it.code] = it.defaultValue;
          }
        });
        return obj;
      },
      formateList (dataList) {
        const BASE_COUNT = 24;// 基数：多少个为一组
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

      formateFormData (data) {
        let resultData = {};
        let skin = data.skin;
        let skinOptions = (skin && SKIN_OPTIONS[skin]) ? SKIN_OPTIONS[skin] : {};
        resultData = Object.assign(skinOptions, data);
        return resultData;
      },

      // 根据id,查询表单的数据
      getFormData () {
        getForm({formId: this.formId})
          .then(res => {
            if (res && res.data && res.data.ok) {
              var configContent = JSON.parse(res.data.data.configContent);
              // 表单配置项数据合并
              var fmData = configContent.fm;
              // 域们的数据
              var list = configContent.list;
              this.fdFormData = fmData;
              this.formModel = this.getFormModel(list);
              this.fdFormItems = this.formateList(list);
              console.log(this.fdFormItems)
              debugger;
            } else {
              this.MessageConfig = {
                showMessage: true, // 打开消息提示框
                MsgBoxType: 'error', // 消息提示框类型
                MsgText: (res && res.data && res.data.msg) ? res.data.msg : '请稍后再试'
              }
            }
          })
          .catch(e => {
            debugger;
            this.MessageConfig = {
              showMessage: true, // 打开消息提示框
              MsgBoxType: 'error', // 消息提示框类型
              MsgText: e.message
            }
          })
      },

      formIdEnterHand () {
        this.getFormData(this.formId);
      }
    }

  }
</script>

<style lang="scss" scoped>
  .app{
    box-sizing: border-box;
    height: 100%;
    background: #f5f5f5;
    padding: 40px 83px 50px 72px;
    overflow: auto;
  }
  .params-config{
    border:1px solid #dcdcdc;
    font-size: 14px;
    margin-bottom: 20px;
    .params-config__row{
      margin:5px 0;
    }
    .text-label{
      padding:0 10px;
    }
    .el-input{
      width: 200px;
    }
  }

</style>
