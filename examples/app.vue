<template>
  <div class="app" id="app">
    <button @click="testDownload">测试下载</button>
    <button @click="testOpenDialog">测试代码打开弹窗</button>
    <button @click="getFormInsHand">getFormIns</button>
    <button @click="getFormByCodeHand">getFormByCode</button>
    <button @click="getFormItemsByCodeHand">getFormItemsByCode</button>
    <button @click="setRule">setRule</button>
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
    <div style="border: 1px solid red;">
      <FormDesigner v-if="formVisible"
                    ref="FD"
                    :view="isView"
                    :id="formId"
                    :formModel="formModel"
                    :fdFormItems="fdFormItems"
                    :fdFormData="fdFormData"
                    :showAnchor="false"
                    useCustormRule
                    @formItemClick="clickHand"
                    @dialogBtnClick="dialogBtnClickHand">
        <template v-slot:[dialogContent]>
          <myComp1></myComp1>
        </template>

      </FormDesigner>
    </div>

    <div style="border: 1px solid red;">
      <FormDesigner v-if="formVisible"
                    ref="FD2"
                    :view="isView"
                    :id="formId"
                    :formModel="formModel"
                    :fdFormItems="fdFormItems"
                    :fdFormData="fdFormData"
                    :showAnchor="false"
                    :useCustormRule="false"
                    @formItemClick="clickHand"
                    @dialogBtnClick="dialogBtnClickHand">
        <template v-slot:[dialogContent]>
          <myComp1></myComp1>
        </template>

      </FormDesigner>
    </div>
    <h2>表单值</h2>
    <div class="form-model-box">{{formModel}}</div>

    <hr>
<!--    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">-->
<!--      <el-form-item label="活动名称" prop="name" :rules="_rule1">-->
<!--        <el-input v-model="ruleForm.name"></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="活动区域" prop="region">-->
<!--        <el-select v-model="ruleForm.region" placeholder="请选择活动区域">-->
<!--          <el-option label="区域一" value="shanghai"></el-option>-->
<!--          <el-option label="区域二" value="beijing"></el-option>-->
<!--        </el-select>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="活动时间" required>-->
<!--        <el-col :span="11">-->
<!--          <el-form-item prop="date1">-->
<!--            <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date1" style="width: 100%;"></el-date-picker>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col class="line" :span="2">-</el-col>-->
<!--        <el-col :span="11">-->
<!--          <el-form-item prop="date2">-->
<!--            <el-time-picker placeholder="选择时间" v-model="ruleForm.date2" style="width: 100%;"></el-time-picker>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="即时配送" prop="delivery">-->
<!--        <el-switch v-model="ruleForm.delivery"></el-switch>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="活动性质" prop="type">-->
<!--        <el-checkbox-group v-model="ruleForm.type">-->
<!--          <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>-->
<!--          <el-checkbox label="地推活动" name="type"></el-checkbox>-->
<!--          <el-checkbox label="线下主题活动" name="type"></el-checkbox>-->
<!--          <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>-->
<!--        </el-checkbox-group>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="特殊资源" prop="resource">-->
<!--        <el-radio-group v-model="ruleForm.resource">-->
<!--          <el-radio label="线上品牌商赞助"></el-radio>-->
<!--          <el-radio label="线下场地免费"></el-radio>-->
<!--        </el-radio-group>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="活动形式" prop="desc">-->
<!--        <el-input type="textarea" v-model="ruleForm.desc"></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item>-->
<!--        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>-->
<!--        <el-button @click="resetForm('ruleForm')">重置</el-button>-->
<!--      </el-form-item>-->
<!--    </el-form>-->
  </div>
</template>
<script>
  import {generateElementuiCode} from '../src/generate_code/generateCode.js'
  // 样式控制的组件
  const STYLE_FORM_COMPONENTS = ['dividingLine', 'button'];

  import {getForm} from './api/API';

  import {getUrlQueryParams} from '../src/assets/js/utils';

  import myComp1 from './views/myComp1'

  export default {
    components:{myComp1},
    data () {
      return {
        // 以下几个参数由调用方来传给表单设计器预览插件
        isView: false,
        formId: '', // 表单的id,而不是业务的id
        businessType: 'zctest', // 集客的流程编码 以前用的CustomerComplaint， 后面改成了 ComplaintOrder
        formModel: {},
        fdFormItems: [],
        fdFormData: {},
        formVisible: false,
        dialogContent: 'dialogContent',
        ruleForm: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        _rule1: [],
        myRules:{
          d1: [
            { "min": 3, "max": 5, "message": "长度在 3 到 5 个字符", "trigger": "blur" }
          ]
        },
        rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
          ],
          region: [
            { required: true, message: '请选择活动区域', trigger: 'change' }
          ],
          date1: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ],
          date2: [
            { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
          ],
          type: [
            { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
          ],
          resource: [
            { required: true, message: '请选择活动资源', trigger: 'change' }
          ],
          desc: [
            { required: true, message: '请填写活动形式', trigger: 'blur' }
          ]
        }
      }
    },
    created () {
      let searchParamObj = getUrlQueryParams();
      // 根据表单id查询接口数据
      if (this.formId) {
        this.getFormData();
      }

      // 从本地存储中找到数据
      if (sessionStorage.getItem('preview_lists') && sessionStorage.getItem('preview_form')) {
        this.formModel = this.getFormModel(this, JSON.parse(sessionStorage.getItem('preview_lists')), 'defaultValue');
        this.fdFormItems = this.formateList(JSON.parse(sessionStorage.getItem('preview_lists')));
        this.fdFormData = JSON.parse(sessionStorage.getItem('preview_form'));
        this.formVisible = true;
      }
    },
    mounted () {

    },
    beforeDestroy () {

    },
    methods: {
      // 做出表单的绑定值
      getFormModel (that, n, valueFieldKey, useInitData) {
        let obj = {};
        let fn = function (list) {
          list.forEach(it => {
            if (it.type === 'group') {
              fn(it.children);
            }
            else if (it.type === 'tabs') {
              for(let j = 0,jlen = it.children.length; j<jlen; j++) {
                fn(it.children[j]);
              }
            }
            else{
              if (it.type === 'checkbox') {
                // 如果是建单人等字段
                let _val = (useInitData && it.fieldType)? that.formInitData[it.code]: it[valueFieldKey];

                obj[it.code] = _val ?
                  (_val.constructor === String ? _val.split(',') : _val)
                  : [];
              }
              else if(it.type === 'timePickerRange'){
                // 如果是建单人等字段
                let _val = (useInitData & it.fieldType) ? that.formInitData[it.code]: it[valueFieldKey];

                obj[it.code] = _val ? (_val.constructor === String ? _val.split(',') : _val) : null;

              }
              // 排除掉样式组件（例如分割线，这些是样式，不是表单值）
              else if(!STYLE_FORM_COMPONENTS.includes(it.type)) {
                // 如果是建单人等字段
                let _val = (useInitData && it.fieldType)? that.formInitData[it.code]: it[valueFieldKey];
                obj[it.code] = _val || '';// 如果有null，不要null，整个空字符串
              }
            }

          });
        };
        fn(n);

        console.log('formModel', obj)
        return obj;
      },
      formateList (dataList) {
        const BASE_COUNT = 24;// 基数：多少个为一组
        let list = [];
        let fn = (dataList, parent) => {
          let count = 0;
          dataList.forEach(it => {
            let span = it.width;
            let displayInline = it.displayInline;

            // 假如有一项为24,或者它有'独占一行'的属性，则它自为一行，
            let index;
            let lastNum = count / BASE_COUNT;// 之前的表单项的总和
            if (span == 24 && lastNum !== Math.floor(lastNum) ) {
              index = Math.ceil(lastNum);
              count = (index + 1) * 24;
            }
            else if(displayInline){
              // 假如除不尽，则把现在的count补满为24的整数
              if(count / 24 !== Math.floor(count / 24)){
                count = Math.ceil(count / 24) * 24 + 24;
              }else{
                count += 24;
              }
              let num = count / BASE_COUNT;
              index = Math.floor(num) === num ? num - 1 : Math.floor(num);// 整数-1，小数向下取整
            }
            else {
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
            if (it.type === 'group'){
              if (it.children && it.children.length) {
                let metaChildren = [].concat(it.children);// 原始的子成员数据
                it.children = [];
                fn(metaChildren, it);
              }
            } else if (it.type === 'tabs') {
              let _metaC = [].concat(it.children);
              it.children = [];
              _metaC.forEach(child => {
                let _metaChildren = [].concat(child);// 原始的子成员数据
                let _it = {};
                fn(_metaChildren, _it);
                it.children.push(_it.children)
              });
            }

          });
        };
        fn(dataList);
        return list;
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
              this.formModel = this.getFormModel(this, list, 'defaultValue');
              this.fdFormItems = this.formateList(list);
              this.formVisible = true;
            } else {
              this.MessageConfig = {
                showMessage: true, // 打开消息提示框
                MsgBoxType: 'error', // 消息提示框类型
                MsgText: (res && res.data && res.data.msg) ? res.data.msg : '请稍后再试'
              }
            }
          })
          .catch(e => {
            this.MessageConfig = {
              showMessage: true, // 打开消息提示框
              MsgBoxType: 'error', // 消息提示框类型
              MsgText: e.message
            }
          })
      },

      formIdEnterHand () {
        this.getFormData(this.formId);
      },

      testDownload(){
        generateElementuiCode('测试',
          {
            labelWidth: 110,
            lineMarginBottom: 10,
          },
        []);
      },

      clickHand(opt){
        debugger;
        // let aa =
        // .scrollEvent''
      },
      dialogBtnClickHand({formItem, btnText, formModel}, done){
        debugger;
        // 执行done关闭弹窗
        done();
      },

      // 测试通过方法打开弹窗
      testOpenDialog(){
        let opt = {
          titleText: '傻逼',
          confirmBtn: '确定',
          cancelBtn: '取消',
          confirmCb: (done)=>{console.log(11); done()},
          cancleCb: (done)=>{console.log(222); done()},
          // content: myComp1,
          // content2: 'dialogName1'
        };
        this.$refs.FD.openDialog(opt)
      },

      getFormInsHand(){
        let ccc = this.$refs.FD.getFormIns();
        debugger;
      },

      getFormByCodeHand(){
        let ccc = this.$refs.FD.getFormByCode('test666');
        debugger;
      },

      getFormItemsByCodeHand(){
        debugger;
        let ccc = this.$refs.FD.getFormItemsByCode('wenben');
        console.log(ccc)
      },
      setRule(){
        // this.rules.name.push(
        //   // { required: true, message: '请输入邮箱地址', trigger: 'blur' },
        //   { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
        // );

        var FD = this.$refs.FD;
        console.log(FD);
        var rule = { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' };
        FD.setFormRule('myF', 'd1', rule)
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

  .form-model-box{
    border: 1px solid #dcdcdc;
    color: #333;
    padding: 10px;
    min-height: 100px;
  }

</style>
