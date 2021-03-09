/**
 * Created by tangyue on 21/2/25
 * 表单设计器的代码生成功能
 * 重要：不要一键格式化代码！否则最终导出的文件的格式会出错！
 * todolist:
 * 1.动态获取码表的方法还没有加上
 * 2.远程接口以及关联查询的方法还没有加上
 * 3.校验的方法还没加上
 * 4.附件的逻辑还没有加上
 */
import README from './README.js';
import listPage from './views/list_page.js';
import CommonJs from './utils/Common.js';
import request from './utils/request.js';
import work_sheet_common from './utils/work_sheet_common.js';
import config from './public/config.js'
import api from './api/api.js'
import {downloadLocalFile} from '../util/utils'

let labelWidth = 0;
let lineMarginBottom = 0;
let allOptions = {}; // 针对下拉框等的下拉数据

// 生成zip文件并且下载
const downloadZip = (filename, files, folderList) => {
  var JSZip = require('jszip');
  var zip = new JSZip();
  files.forEach(it => {
    zip.file(it.filename, it.fileContent);
  });
  // 把文件夹加进来
  for (let i in folderList) {
    let child = folderList[i];
    var folder = zip.folder(i);
    child.forEach(it => {
      folder.file(it.filename, it.fileContent);
    });
  }
  zip.generateAsync({type: 'blob'})
    .then(function (content) {
      downloadLocalFile(`${filename}.zip`, content, 'application/zip')
    });
};

const formateList = (dataList) => {
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
};

const generateAllOptions = (list) => {
  let fn = (list)=>{
    list.forEach(it => {
      if (it.type === 'group') {
        fn(it.children)
      } else {
        let {type, optionSetting, validationSetting} = it;
        if (optionSetting === 'static') {
          allOptions[it.frontId] = it.optionSetting_options;
        }
        // todo 码表和远程接口还没有写
        else {}
      }
    })
  }
  fn(list);
};
const colStyle = (item)=>{
  let str = '';
  if (item.displayInline) {
    str += 'clear: both;';
  }
  if (item.hidden) {
    str += 'display: none';
  }
  return str;
};

const generateBasicElementFormItem = (data, isInGroup) => {
  let strStart = `<el-form-item prop="${data.code || ''}" label="${data.label || ''}" class="${data.className}"
                          :style="{
                            'marginBottom': ${data.type === 'dividingLine'? 0 : `${lineMarginBottom} + 'px'`}
                          }"
                  >`;
  let strEnd = '</el-form-item>';

  let innerStr = '';
  // 多行文本
  if (data.type === 'textarea') {
    innerStr = `<el-input
              v-model="formModel.${data.code}"
              type="textarea"
              :rows="${data.rows}"
              resize="none"
              :disabled="${data.disabled}"
              :readonly="${data.readonly}"
              :clearable="${data.clearable}"
    >
    </el-input>`;
  }
  // 单选组
  else if(data.type === 'radio'){
    innerStr = `<el-radio-group
                    v-model="formModel.${data.code}"
                    :disabled="${data.disabled}"
                    :readonly="${data.readonly}"
                    :clearable="${data.clearable}"
                  >
                  <el-radio v-for="radio in options[${data.frontId}]"
                            :key="radio.value"
                            :label="radio.value">
                    {{radio.label}}
                  </el-radio>
    </el-radio-group>`;
  }
  else if(data.type === 'checkbox'){
    innerStr = ` <el-checkbox-group 
                       v-model="formModel.${data.code}"
                       :disabled="${data.disabled}"
                       :readonly="${data.readonly}"
                       :clearable="${data.clearable}"
                      >
      <el-checkbox v-for="(check, index) in options[${data.frontId}]"
                   :key="index"
                   :label="check.value">{{check.label}}
      </el-checkbox>
    </el-checkbox-group>`;
  }
  else if(data.type === 'rate') {
    innerStr = `<el-rate
             v-model="formModel.${data.code}"
             :disabled="${data.disabled}"
             :readonly="${data.readonly}"
             :clearable="${data.clearable}">
    </el-rate>`
  }
  else if (data.type === 'select') {
    innerStr = ` <el-select
                    v-model="formModel.${data.code}"
                    :disabled="${data.disabled}"
                    :readonly="${data.readonly}"
                    :clearable="${data.clearable}"
                    @change="selectChangeHand"
    >
      <el-option
              v-for="item in options[${data.frontId}]"
              :key="item.value"
              :label="item.label"
              :value="item.value">
      </el-option>
    </el-select>`;
  }
  else if (data.type === 'datePicker') {
    innerStr = `<el-date-picker
                    v-model="formModel.${data.code}"
                    type="${data.innerType}"
                    value-format="${data.valueFormat}"
                    :disabled="${data.disabled}"
                    :readonly="${data.readonly}"
                    :clearable="${data.clearable}"
    >
    </el-date-picker>`;
  }
  else if(data.type === 'timePicker'){
    innerStr = `<el-time-picker
                    v-model="formModel.${data.code}"
                    value-format="${data.valueFormat}"
                    :disabled="${data.disabled}"
                    :readonly="${data.readonly}"
                    :clearable="${data.clearable}"
    >
    </el-time-picker>`
  }
  else if(data.type === 'timePickerRange') {
    innerStr = `<el-time-picker
                    is-range
                    v-model="formModel.${data.code}"
                    value-format="${data.valueFormat}"
                    :disabled="${data.disabled}"
                    :readonly="${data.readonly}"
                    :clearable="${data.clearable}"
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    @click.native.stop
    >
    </el-time-picker>`
  }
  else if(data.type === 'button') {
    innerStr = `<el-button
               type="${data.innerType}"
               :round="${data.round}"
               :circle="${data.circle}"
               :icon="${data.icon}"
               :size="${data.size}"
               :disabled="${data.disabled}"
               :class="{'auto-width': ${data.fixParentWidth}"
    >
      <template v-if="data.defaultValue">
        {{data.defaultValue}}
      </template>
    </el-button>`
  }
  // 分割线
  else if (data.type === 'dividingLine') {
    innerStr = `<div
         class="fd-formItem__dividingLine"
         :style="{
                'height': ${data.thickness} + 'px',
                'background': '${data.color}',
                'marginTop': ${data.marginTop} + 'px',
                'marginBottom': ${data.marginBottom} + 'px',
                'marginLeft': '-' + ${labelWidth}+ 'px'
             }">
    </div>`;
  }
  // 上传附件
  else if (data.type === 'uploadFile') {
    innerStr = `<div class="fd-formItem__upload-file">
                    <el-button type="primary" size="mini" @click="upFile" class="file-btn">上传</el-button>
                    <a href="javascript:;" class="file-btn open-file-btn">
                      浏览
                      <input type="file" ref="file" name="file" @change="addFileName" />
                    </a>
                    <div class="input-box">
                      <el-input v-model="fileName"></el-input>
                    </div>
              
                    <ul class="file-list">
                      <li v-for="(item,index) in fileList" :key="index">
                        <a class="file-detail" :href="getDownURL(item)" download title="下载">{{item.name}}</a>
                        <i class="el-icon-delete" @click="delFile(item)"></i>
                      </li>
                    </ul>
                </div>`;
  }
  // 业务公共字段-流水号
  else if (data.type === 'sheetFlowCode') {
    innerStr = `<el-input
                  :disabled="${data.disabled}"
                  :readonly="${data.readonly}"
                  :clearable="${data.clearable}"
                  v-model="formModel.${data.code}">
                </el-input>`;
  }
  // 业务公共字段-操作人
  else if (data.type === 'operator') {
    innerStr = `<el-input
                  :disabled="${data.disabled}"
                  :readonly="${data.readonly}"
                  :clearable="${data.clearable}"
                  v-model="formModel.${data.code}">
                </el-input>`;
  }
  // 业务公共字段-操作人部门
  else if (data.type === 'operatorDept') {
    innerStr = `<el-input
                  :disabled="${data.disabled}"
                  :readonly="${data.readonly}"
                  :clearable="${data.clearable}"
                  v-model="formModel.${data.code}">
                </el-input>`;
  }
  // 业务公共字段-操作人联系方式
  else if (data.type === 'operatorMobile') {
    innerStr = `<el-input
                  :disabled="${data.disabled}"
                  :readonly="${data.readonly}"
                  :clearable="${data.clearable}"
                  v-model="formModel.${data.code}">
                </el-input>`;
  }
  // 业务公共字段-操作人当前角色
  else if (data.type === 'operatorRole') {
    innerStr = `<el-input
                  :disabled="${data.disabled}"
                  :readonly="${data.readonly}"
                  :clearable="${data.clearable}"
                  v-model="formModel.${data.code}">
                </el-input>`;
  }
  // 业务公共字段-操作时间
  else if (data.type === 'operateTime') {
    innerStr = `<el-date-picker
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :disabled="${data.disabled}"
                  :readonly="${data.readonly}"
                  :clearable="${data.clearable}"
                  v-model="formModel.${data.code}"
                  :computereadonly="${data.readonly}">
                </el-date-picker>`;
  }
  // 如果没有设置type，则都是input
  else {
    if (data.validationSetting && data.validationSetting.dataType.value === 'number'){
      innerStr = `<el-input
                     :disabled="${data.disabled}"
                     :readonly="${data.readonly}"
                     :clearable="${data.clearable}"
                     type="number"
                     v-model.number="formModel.${data.code}">
                  </el-input>`;
    }
    else if (data.validationSetting && data.validationSetting.dataType.value === 'password'){
      innerStr = `<el-input
                      :disabled="${data.disabled}"
                      :readonly="${data.readonly}"
                      :clearable="${data.clearable}"
                      type="password"
                      v-model="formModel.${data.code}">
                  </el-input>`;
    }
    else{
      innerStr = `<el-input
                      :disabled="${data.disabled}"
                      :readonly="${data.readonly}"
                      :clearable="${data.clearable}"
                      v-model="formModel.${data.code}">
                  </el-input>`;
    }
  }
  // 代码一样，只是布局排版用的空格不同
  if (isInGroup) {
    return `    ${strStart}
                ${innerStr}
                      ${strEnd}`;
  } else {
    return `${strStart}
            ${innerStr}
                  ${strEnd}`;
  }
};

/**
 * 生成表单的单个组件
 * @param item
 * @param isInGroup 这个表单组件的外层是否是一个分组框
 * @returns {string}
 */
const generatePreviewFormItem = (item, isInGroup, spaceCount = 0) => {
  let str = '';

  // 如果本表单组件是分组
  if (item.type === 'group') {
    if (item.label) {
      str += `<div class="fd-form-group__header">${item.label}todo_${spaceCount}</div>`;
    }
    str += `${item.children.map((child, childIdx)=>`
              <el-row key="${childIdx}" :gutter="35">
              ${loopCol(child, 'group', 20)}
              </el-row>
      `).join(' ')}`;
  }
  // 非分组的表单项
  else {
    str = generateBasicElementFormItem(item, isInGroup);
  }

  return str;
};
const loopCol = (obj, isGroup, spaceCount = 0) => {
  let str = '';
  for (let key in obj) {
    let item = obj[key];

    // 分组内的el-col布局（代码上来说，一模一样，区别是排版的空格不同）
    // if (isGroup) {
    //   if (str.length) {
    //     str += '\n              ';// 14个空格
    //   }
    //   str += `    <el-col key="${key}" :span="${item.width}" style="${colStyle(item)}">
    //               ${generatePreviewFormItem(item, isGroup)}
    //               </el-col>`;
    // }
    // // 非分组内的el-col布局
    // else {
    //   if (str.length) {
    //     str += '\n      ';// 6个空格
    //   }
    //   str += `    <el-col key="${key}" :span="${item.width}" style="${colStyle(item)}">
    //               ${generatePreviewFormItem(item, isGroup)}
    //       </el-col>`;
    // }

    if (str.length) {
      str += '\n';// 6个空格
      for (let c = 0; c < spaceCount; c++) {
        str += ' ';
      }
    }
    // 这里的空格 ，注意手动补4个空格
    var _str =
`    <el-col key="${key}" :span="${item.width}" style="${colStyle(item)}">
    ${generatePreviewFormItem(item, isGroup, spaceCount)}
    `;
    for (let c = 0; c < spaceCount; c++) {
      _str += ' ';
    }
    _str += '</el-col>';

    str += _str;
//     str +=
// `<el-col key="${key}" :span="${item.width}" style="${colStyle(item)}">
// ${generatePreviewFormItem(item, isGroup)}
// </el-col>`;
  }

  return str;
};
// 生成使用elenetui组件编写的页面
export const generateElementuiCode = (filename, formModel, list) => {
  let IndexVueContent = '';// 文本正文内容
  // 1.整理出表单上的样式
  console.log(formModel);
  console.log(list);
  labelWidth = formModel.labelWidth;
  lineMarginBottom = formModel.lineMarginBottom;
  generateAllOptions(list);
  let formClassStr = `fd-form fd-form--preview ${formModel.skin} ${formModel.customClassName}` +
    (formModel.size ? ` fd-form--${formModel.size}` : '');

  /// IMPORTANT --TODO 不要修改此处的代码格式，更不要使用一键代码自动格式化功能，否则导出的文件内的换行和对齐等格式全都不对 -ty 2021年02月25日18:11:00 ///
  IndexVueContent =
    `
<template>
    <div class="wrapper">
        <el-form class="${formClassStr}"
                 size="${formModel.size}"
                 label-width="${formModel.labelWidth}px">
          ${formateList(list).map((it, index) => `
            <el-row :gutter="35" key="${index}">
            ${loopCol(it, null, 12)}
            </el-row>
          `).join(' ')}
        </el-form>  
    </div>

</template>

<script>
    import {openLoading,closeLoading} from "./utils/Common"
    // 工单公共js
    import {

      getFormInitData,

    } from './utils/work_sheet_common.js'
   export default {
     data () {
       return {
         boId: null,// 工单id
         businessType: null,
         userId: sessionStorage.getItem("user_id"),
         list: ${JSON.stringify(list)},
         isView: false,// 表单的样式：预览或者是可编辑的
         formModel: {}, // 表单的绑定值
         options: ${JSON.stringify(allOptions)},
         fileName: '', // 附件名字
         fileList: [], // 附件列表
       }
     },
     created(){
         // 处理浏览器传参
         this.boId = this.$route.query.boId || null;// 有id是编辑，无id是新增
         this.businessType = this.$route.query.businessType;
         this.formCode = this.$route.query.formCode;
         this.status = this.$route.query.status;
        // 查询所有下拉、单选、多选的选项数据 todo
        
         // 根据表单的code获取表单模板的信息
        if(this.formCode){
          openLoading({
            scope: this,
            target: ['.wrapper']
          });
          // 查询表单的建单人等初始信息
          getFormInitData.call(this, this.formCode, ['.wrapper']);
        }
      
     },
     methods: {
        // 查询所有下拉、单选、多选的选项数据
   
        // 下拉框的选中值改变后的事件
        selectChangeHand (val) {
          console.log(val);
          // do your own business
        },
        // 上传到服务器 todo 
        upFile(){
          // do your own business
        },
        
        // 添加附件信息
        addFileName () {
          this.fileName = this.$refs.file.files[0].name;
        },
        
        // 下载地址
        getDownURL (row) {
          return (
            this.data.downloadServiceUrl +
            row.id +
            '?access_token=' +
            sessionStorage.getItem('access_token')
          );
        },
     }
   }
</script>
`;

  downloadZip(filename, [
      { filename: 'main.vue', fileContent: IndexVueContent },
      { filename: 'list.vue', fileContent: listPage },
      { filename: 'README.md', fileContent: README }
    ],
    {
      utils: [
        {filename: 'Common.js', fileContent: CommonJs},
        {filename: 'request.js', fileContent: request},
        {filename: 'work_sheet_common.js', fileContent: work_sheet_common}
      ],
      public: [
        {filename: 'config.js', fileContent: config}
      ],
      api: [
        {filename: 'api.js', fileContent: api}

      ]
    }
  );
};
