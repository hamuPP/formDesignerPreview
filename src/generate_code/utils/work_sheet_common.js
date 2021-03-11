const text =
`
// api 相关
import {openLoading,closeLoading, getFormatedTime} from "./Common"
import {
  getFormTemplateInfoService,
  getForm,
  initWorkFlowService,
  setParameterService,
  getFormInitDataService
} from '../api/api.js'

import {isEqual} from "element-ui/src/utils/util";

 // 样式控制的组件（29行）
const STYLE_FORM_COMPONENTS = ['dividingLine'];
//（32行）
const formateList = function(dataList) {
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
};

// (72行)
const flatList = function(list, fields){
  let result = [];
  // 获取字段的业务字段类型
  let getBuzFieldType = (code)=>{
    for(let i = 0,len = fields.length;i<len;i++){
      if(fields[i].code === code){
        return fields[i].fieldType;
      }
    }
  };
  let fn = (arr)=>{
    arr.forEach(it =>{
      if(it.type ==='group'){
        fn(it.children)
      }else{
        it.fieldType = getBuzFieldType(it.code)
        result.push(it)
      }
    })
  };
  fn(list);
  return result;
};

// (95行)
// 给上传附件增加一些新的查询参数
const setFileUploadParam = function() {
  const that = this;
  let formItems = that.$refs.FD.getFormItemsIns();
  for(let i in formItems){
    let it = formItems[i];
    // 因为当前业务表单，一个表单上只会有一个上传附件，所以直接根据类型找到一个上传附件即可
    if(it.data.type === 'uploadFile'){
      it.USER_UPLOAD_PARAM = {
        businessType: that.businessType,
        boId: that.boId,
        // 不需要files和access_token,因为表单默认有这2个
      };

      it.USER_UPLOAD_SEARCH_LIST_PARAM = {
        boId: that.boId,
        businessType: that.businessType
      }
      // 另外，每次进入页面后都需要查询附件列表（这个方法是组件自己的方法，就是调用查询附件的接口）
      it.getFileList();
    }
  }
};

// (119行)根据表单的id,查询表单模板的数据（包括字段数据、表单的配置等）
const getFormTemplateData = function(loadingTarget){
  const that = this;
  getForm({formId: that.formId})
    .then(res => {
      if (res && res.data && res.data.code == '0000') {
        let configContent = JSON.parse(res.data.data.configContent);
        let _fields = res.data.data.fields;
        // 表单配置项数据合并
        let fmData = configContent.fm;
        // 域们的数据
        let list = configContent.list;
        let flatLists = that.flatFdFormList = flatList(configContent.list, _fields);
        // 不论是否为新建或回显，都需要先做一个空值的，否则若有checkbox，则checkbox的值类型会报错
        let sourceModel = that.formModel = getFormModel(that, flatLists, 'defaultValue', true);
        that.fdFormData = fmData;
        that.fdFormItems = formateList(list);
        that.$nextTick(_=>{
          // 给上传附件增加一些新的查询参数
          that.boId && setFileUploadParam.call(that);
          // 初始化流程，获取必填校验、需要被隐藏的表单项目等信息
          manageWorkFlow.call(that, loadingTarget);
          // 处理附件的样式
          try{
            let filesCard = document.getElementById('filesCard');
            let fileBox = document.getElementsByClassName('files-box')[0];
            // 编辑和草稿页面需要显示附件，而预览页面不显示附件。这里使用js改变一下页面元素
            if(that.edit && that.boId){
              fileBox.style.display = 'block';
              // filesCard.getElementsByClassName('el-card__body')[0].appendChild(fileBox);
            }else{
              fileBox.style.display = "none";
            }
          }catch(e){
            console.log(e)
          }
        })
        // 根据业务单子id，查询表单的业务数据
        if (that.boId) {
          // id查询字段信息
          getFormData.call(that, that.boId, sourceModel);
        }
        // 没有业务id,则仅用表单模板的数据生成当前form的绑定值
        else {
          that.lastFormData = JSON.parse(JSON.stringify(that.formModel));
          console.log(that.formModel, that.lastFormData)
        }

      } else {
        // 关闭loading
        closeLoading({
          scope: that,
          target: loadingTarget
        });
        // 查询失败
        let errMsg = res.data.msg || '请稍后再试';
        that.$cusAlert(errMsg, {
          type: "warning",// warning
          modal: false,
          center: false,
          showConfirmButton: false,
          callback: action => {
          }
        });
      }
    })
    .catch(e => {
      // 关闭loading
      closeLoading({
        scope: that,
        target: loadingTarget
      });
      // 查询失败
      let errMsg = e.message || '请稍后再试';
      that.$cusAlert(errMsg, {
        type: "warning",// warning
        modal: false,
        center: false,
        showConfirmButton: false,
        callback: action => {
        }
      });
    })
};

// (257行)根据状态不同，处理流程初始化或者是归档
export const manageWorkFlow = function(loadingTarget) {
  const that = this;
  if(!that.userId){console.log('user_id没有值，请检查！');return ;}
  let req = {
    userId: that.userId,
    workflowCode: that.businessType,
  };
  if (that.boId) {
    req.boId = that.boId;
  }
  if (that.boId && that.$route.query.status != 'draft') {
    req.boId = that.boId;
  }
  if (that.$route.query.status == 'completed') {//归档无需调用流程的接口
    overWorkflow.call(that, req, loadingTarget);
  } else {
    initWorkFlow.call(that, req, loadingTarget);
  }
};

// （281行）初始化流程
const initWorkFlow = function(req, loadingTarget) {
  const that = this;
  initWorkFlowService(req)
    .then(res => {
      // 关闭loading
      closeLoading({
        scope: this,
        target: loadingTarget,
      });

      let n = res.data;
      // 查询成功的情况
      if (res.data && res.data.code == '0000') {
        that.opList = n.data;
        dealFormat.call(that, n.data.fieldhash);//处理必填校验
        that.lastFormData = JSON.parse(JSON.stringify(that.formModel))
        that.boId && getAllPaths(that, that.boId, n.data);
      }
      // 查询失败的情况
      else {
        let errMsg = res.data.msg;
        that.$cusAlert(errMsg, {
          type: "warning",// warning
          modal: false,
          center: false,
          showConfirmButton: false,
        });
      }
    })
    .catch(e => {
      console.log('catched')

      // 关闭loading
      closeLoading({
        scope: this,
        target: loadingTarget,
      });
    })
};

// (321行)
const overWorkflow = function(req, loadingTarget){
  const that = this;
  getWorkflowInsService(req)
    .then(res => {
      // 关闭loading
      closeLoading({
        scope: this,
        target: loadingTarget,
      });

      let n = res.data;
      if (res.data && res.data.code == '0000') {
        that.$emit('getInfos', n.data)
      } else {
        let errMsg = res.data.msg;
        that.$cusAlert(errMsg, {
          type: "warning",// warning
          modal: false,
          center: false,
          showConfirmButton: false,
        });
      }
    })
    .catch(e => {
      console.log('catched')

      // 关闭loading
      closeLoading({
        scope: this,
        target: loadingTarget,
      });
    })
};

// 根据表单的code获取表单模板的信息（588行）
export const getFormTemplateInfo_common = function(code, loadingTarget) {
  const that = this;
  getFormTemplateInfoService({formCode: code})
    .then(res => {
      if(res && res.data && res.data.code == '0000'){
        // 找到表单的id
        that.formId = res.data.data.id;
        // 找到表单的名字
        that.formName = res.data.data.name;
        that.$emit('getFormName', that.formName)
        // 根据表单的id,查询表单模板的数据（包括字段数据、表单的配置等）
        getFormTemplateData.call(that, loadingTarget);
      }
      // 查询失败
      else{
        // 关闭loading
        closeLoading({
          scope: that,
          target: loadingTarget,
        });

        let errMsg = res.data.msg;
        that.$cusAlert(errMsg, {
          type: "warning",// warning
          modal: false,
          center: false,
          showConfirmButton: false,
          callback: action => {
          }
        });
      }
    })
    .catch(e=>{
      console.log('catched')

      // 关闭loading
      closeLoading({
        scope: that,
        target: loadingTarget
      });

      let errMsg = e.message;
      that.$cusAlert(errMsg, {
        type: "warning",// warning
        modal: false,
        center: false,
        showConfirmButton: false,
        callback: action => {
        }
      });
    })
};

// (597行)
/**
 * 做出表单的绑定值,注意如果有分组，则需要把分组的数据移出来。关于表单的初始值（建单人等信息，formInitData）也会在这一步整进来
 * @param n 字段列表
 * @param valueFieldKey 值的字段，
 * @param useInitData 是否采用初始值，
 * @returns {{}}
 */
export const getFormModel = (that, n, valueFieldKey, useInitData, tables) => {
  let obj = {};
  let fn = function(list){
    list.forEach(it => {
      if(it.type === 'group'){
        fn(it.children);
      }else{
        if (it.type === 'checkbox') {
          // 如果是建单人等字段
          let _val = (useInitData && it.fieldType)? that.formInitData[it.code]: it[valueFieldKey];

          obj[it.code] = _val ?
            (_val.constructor === String ? _val.split(',') : _val)
            : [];
        }
        else if(it.type === 'rate'){
          // 如果是建单人等字段
          let _val = (useInitData && it.fieldType)? that.formInitData[it.code]: it[valueFieldKey];
          obj[it.code] = _val ? Number(_val) : 0;
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

  return obj;
};

// 根据表单的code获取建单人等初始信息(642行)
export const getFormInitData = function(code, loadingTarget) {
  const that = this;
  getFormInitDataService({formCode: code})
    .then(res=>{
      // 查询成功的时候
      if(res && res.data && res.data.code == '0000'){
        that.getFormInitDataRequestFailed = false;
        that.formInitData = {};
        let _formInitData = (res.data.data && res.data.data.fields)? res.data.data.fields : [];
        // 只要有fieldType的字段
        _formInitData.forEach(child =>{
          if(child && child.fieldType){
            that.formInitData[child.code] = child.value;
          }
        });

        // 查询表单的相关信息
        getFormTemplateInfo_common.call(that, code, loadingTarget);
      }
      // 查询失败
      else{
        that.getFormInitDataRequestFailed = true;
        // 关闭loading
        closeLoading({
          scope: that,
          target: loadingTarget,
        });

        let errMsg = res.data.msg;
        that.$cusAlert(errMsg, {
          type: "warning",// warning
          modal: false,
          center: false,
          showConfirmButton: false,
          callback: action => {
          }
        });
      }
    })
    .catch(e=>{
      // 接口报错
      that.getFormInitDataRequestFailed = true;

      // 关闭loading
      closeLoading({
        scope: that,
        target: loadingTarget
      });

      let errMsg = e.message;
      that.$cusAlert(errMsg, {
        type: "warning",// warning
        modal: false,
        center: false,
        showConfirmButton: false,
        callback: action => {
        }
      });
    })
};
`;

export default text;
