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
import utilsJs from './utils/utils.js';
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

// // 拉平我的表单项列表
// const flatList = (dataList)=>{
//   let resultList = [];
//
//   let fn = (list) => {
//     list.forEach(it => {
//       if(it.type === 'group'){
//         fn(it.children)
//       }else{
//
//       }
//     });
//   };
//
//   fn(dataList);
//   return resultList
// };

const generateAllOptions = (list) => {
  let fn = (list) => {
    list.forEach(it => {
      if (it.type === 'group') {
        fn(it.children)
      } else {
        let {type, optionSetting, validationSetting} = it;
        if (optionSetting && optionSetting.value === 'static') {
          console.log('optionSetting_options', it.optionSetting_options)
          debugger;// todo  检查层级，是否有个value
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

const generateBasicElementFormItem = (data, isInGroup, spaceCount = 0) => {
  // 把前面的排版空格做出来
  let _space = '    ';// 我的排版是4个空格缩进，所以这里初始值是4个空格
  for (let c = 0; c < spaceCount; c++) {
    _space += ' ';
  }

  let strStart =
`${_space}<el-form-item prop="${data.code || ''}" label="${data.label || ''}" class="${data.className}"
${_space}    :style="{
${_space}        'marginBottom': ${data.type === 'dividingLine'? 0 : `${lineMarginBottom} + 'px'`}
${_space}    }"
${_space}>`;
  let strEnd = `${_space}</el-form-item>`;

  let innerStr = '';
  // 多行文本
  if (data.type === 'textarea') {
    innerStr = `${_space}    <el-input
${_space}        v-model="formModel.${data.code}"
${_space}        type="textarea"
${_space}        :rows="${data.rows}"
${_space}        resize="none"
${_space}        :disabled="${data.disabled}"
${_space}        :readonly="${data.readonly}"
${_space}        :clearable="${data.clearable}">
${_space}    </el-input>`;
  }
  // 单选组
  else if (data.type === 'radio') {
    innerStr = `${_space}    <el-radio-group
${_space}        v-model="formModel.${data.code}"
${_space}        :disabled="${data.disabled}"
${_space}        :readonly="${data.readonly}"
${_space}        :clearable="${data.clearable}">
${_space}        <el-radio v-for="radio in options[${data.frontId}]"
${_space}            :key="radio.value"
${_space}            :label="radio.value">
${_space}            {{radio.label}}
${_space}        </el-radio>
${_space}    </el-radio-group>`;
  }
  else if(data.type === 'checkbox'){
    innerStr = `${_space}    <el-checkbox-group 
${_space}        v-model="formModel.${data.code}"
${_space}        :disabled="${data.disabled}"
${_space}        :readonly="${data.readonly}"
${_space}        :clearable="${data.clearable}">
${_space}        <el-checkbox v-for="(check, index) in options[${data.frontId}]"
${_space}            :key="index"
${_space}            :label="check.value">{{check.label}}
${_space}        </el-checkbox>
${_space}    </el-checkbox-group>`;
  }
  else if(data.type === 'rate') {
    innerStr = `${_space}    <el-rate
${_space}        v-model="formModel.${data.code}"
${_space}        :disabled="${data.disabled}"
${_space}        :readonly="${data.readonly}"
 ${_space}        :clearable="${data.clearable}">
${_space}    </el-rate>`
  }
  else if (data.type === 'select') {
    innerStr = `${_space}    <el-select
${_space}        v-model="formModel.${data.code}"
${_space}        :disabled="${data.disabled}"
${_space}        :readonly="${data.readonly}"
${_space}        :clearable="${data.clearable}"
${_space}        @change="selectChangeHand">
${_space}            <el-option v-for="item in options[${data.frontId}]"
${_space}            :key="item.value"
${_space}            :label="item.label"
${_space}            :value="item.value">
${_space}            </el-option>
${_space}    </el-select>`;
  }
  else if (data.type === 'datePicker') {
    innerStr = `${_space}    <el-date-picker
${_space}        v-model="formModel.${data.code}"
${_space}        type="${data.innerType}"
${_space}        value-format="${data.valueFormat}"
${_space}        :disabled="${data.disabled}"
${_space}        :readonly="${data.readonly}"
${_space}        :clearable="${data.clearable}">
${_space}    </el-date-picker>`;
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
    innerStr = `${_space}    <div class="fd-formItem__upload-file">
${_space}        <el-button type="primary" size="mini" @click="upFile(${JSON.stringify(data.uploadSettings)})" class="file-btn">上传</el-button>
${_space}        <a href="javascript:;" class="file-btn open-file-btn">
${_space}            浏览
${_space}            <input type="file" ref="file['${data.frontId}']" name="file" @change="addFileName('${data.frontId}')" />
${_space}        </a>
${_space}        <div class="input-box">
${_space}            <el-input v-model="fileName['${data.frontId}']"></el-input>
${_space}        </div>
              
${_space}        <ul class="file-list">
${_space}            <li v-for="(item,index) in fileList['${data.frontId}']" :key="index">
${_space}                <a class="file-detail" :href="getDownURL(item)" download title="下载">{{item.name}}</a>
${_space}                <i class="el-icon-delete" @click="delFile(item)"></i>
${_space}            </li>
${_space}        </ul>
${_space}    </div>`;
  }
  // 业务公共字段-流水号
  else if (data.type === 'sheetFlowCode') {
    innerStr = `${_space}    <el-input
${_space}        :disabled="${data.disabled}"
${_space}        :readonly="${data.readonly}"
${_space}        :clearable="${data.clearable}"
${_space}        v-model="formModel.${data.code}">
${_space}    </el-input>`;
  }
  // 业务公共字段-操作人
  else if (data.type === 'operator') {
    innerStr = `${_space}    <el-input
${_space}        :disabled="${data.disabled}"
${_space}        :readonly="${data.readonly}"
${_space}        :clearable="${data.clearable}"
${_space}        v-model="formModel.${data.code}">
${_space}    </el-input>`;
  }
  // 业务公共字段-操作人部门
  else if (data.type === 'operatorDept') {
    innerStr = `${_space}    <el-input
${_space}        :disabled="${data.disabled}"
${_space}        :readonly="${data.readonly}"
${_space}        :clearable="${data.clearable}"
${_space}        v-model="formModel.${data.code}">
${_space}    </el-input>`;
  }
  // 业务公共字段-操作人联系方式
  else if (data.type === 'operatorMobile') {
    innerStr = `${_space}    <el-input
${_space}        :disabled="${data.disabled}"
${_space}        :readonly="${data.readonly}"
${_space}        :clearable="${data.clearable}"
${_space}        v-model="formModel.${data.code}">
${_space}    </el-input>`;
  }
  // 业务公共字段-操作人当前角色
  else if (data.type === 'operatorRole') {
    innerStr = `${_space}    <el-input
${_space}        :disabled="${data.disabled}"
${_space}        :readonly="${data.readonly}"
${_space}        :clearable="${data.clearable}"
${_space}        v-model="formModel.${data.code}">
${_space}    </el-input>`;
  }
  // 业务公共字段-操作时间
  else if (data.type === 'operateTime') {
    innerStr = `${_space}    <el-date-picker
${_space}        value-format="yyyy-MM-dd HH:mm:ss"
${_space}        :disabled="${data.disabled}"
${_space}        :readonly="${data.readonly}"
${_space}        :clearable="${data.clearable}"
${_space}        v-model="formModel.${data.code}"
${_space}        :computereadonly="${data.readonly}">
${_space}    </el-date-picker>`;
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
      innerStr = `${_space}    <el-input
${_space}        :disabled="${data.disabled}"
${_space}        :readonly="${data.readonly}"
${_space}        :clearable="${data.clearable}"
${_space}        type="password"
${_space}        v-model="formModel.${data.code}">
${_space}    </el-input>`;
    }
    else {
      innerStr = `${_space}    <el-input
${_space}        :disabled="${data.disabled}"
${_space}        :readonly="${data.readonly}"
${_space}        :clearable="${data.clearable}"
${_space}        v-model="formModel.${data.code}">
${_space}    </el-input>`;
    }
  }
  // 代码一样，只是布局排版用的空格不同 todo 后面我改用了spacecount的计算，这里还没有改
//   let _str =
// `${strStart}
// ${innerStr}
// ${strEnd}
// `
  return `${strStart}
${innerStr}
${strEnd}
`
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
      // 把前面的排版空格做出来
      let _groupHeadSpace = '';// 我的排版是4个空格缩进，所以这里初始值是4个空格
      for (let c = 0; c < spaceCount; c++) {
        _groupHeadSpace += ' ';
      }
      str += `${_groupHeadSpace}<div class="fd-form-group__header">${item.label}</div>`;
    }
    // 把前面的排版空格做出来
    let _space = '    ';// 我的排版是4个空格缩进，所以这里初始值是4个空格
    for (let c = 0; c < spaceCount; c++) {
      _space += ' ';
    }
    str +=
`${item.children.map((child, childIdx) =>`
${_space}<el-row key="${childIdx}" :gutter="35">
${_space}${loopCol(child, 'group', 20)}
${_space}</el-row>
`).join(' ')}`;
  }
  // 非分组的表单项
  else {
    str = generateBasicElementFormItem(item, isInGroup, spaceCount);
  }
  return str;
};
const loopCol = (obj, isGroup, spaceCount = 0) => {
  let str = '';
  for (let key in obj) {
    let item = obj[key];

    if (str.length) {
      str += '\n';// 6个空格
      for (let c = 0; c < spaceCount; c++) {
        str += ' ';
      }
    }
    // 这里的空格 ，注意手动补4个空格
    var _str =
`    <el-col key="${key}" :span="${item.width}" style="${colStyle(item)}">
${generatePreviewFormItem(item, isGroup, spaceCount + 4)}
    `;
    for (let c = 0; c < spaceCount; c++) {
      _str += ' ';
    }
    _str += '</el-col>';

    str += _str;
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
<!-- todo 这个v-if的判断是否有必要？ -->
    <el-form v-if="Object.keys(formModel).length"
             class="${formClassStr}"
             size="${formModel.size}"
             label-width="${formModel.labelWidth}px"
             :model="formModel"
             ref="fdForm"
             :rules="rules"
             :disabled="view">
      ${formateList(list).map((it, index) => `
        <el-row :gutter="35" key="${index}">
        ${loopCol(it, null, 12)}
        </el-row>
      `).join(' ')}
    </el-form>
</template>

<script>
    export default {
        name: 'previewForm',
        props: {
            // 是否为预览模式，模式是编辑模式啦
            view: {
              type: Boolean,
              default: false,
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
            // 表单的绑定值
            formModel: {
              type: Object,
              default () {
                return {};
              }
            },
            flatFdFormList:{
              type: Array,
              default () {
                return [];
              }
            },
        },
        data () {
            return {
               options: ${JSON.stringify(allOptions)},
               fileName: {}, // 附件名字
               fileList: {}, // 附件列表
            }
     },
     created(){
        // 查询所有下拉、单选、多选的选项数据 todo
       
      
     },
     methods: {
          // todo 检查下面2个方法的返回值
               // 这些方法是给外部使用的一些便利方法
      // 获取form的vue实例,因为外部调用需要操作el-form
      getFormIns () {
        return this.$refs.form.$refs.fdForm;
      },
      getFormItemsIns () {
        debugger;
        return this.flatFdFormList;
      },
        // 查询所有下拉、单选、多选的选项数据
   
        // 下拉框的选中值改变后的事件
        selectChangeHand (val) {
          console.log(val);
          // do your own business
        },
        // 上传到服务器 todo
        upFile(fid){
          debugger;
          // do your own business
        },
        
        // 添加附件信息
        addFileName (fid) {
          this.$set(this.fileName, fid, this.$refs["file['" + fid + "']"].files[0].name)

        },
        
        // 下载地址 todo 不确定是否需要的东西
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

<style lang="scss">
.wrapper{
    background: #fff;
}
</style>
`;

  downloadZip(filename, [
      { filename: 'main.vue', fileContent: IndexVueContent },
      { filename: 'list.vue', fileContent: listPage },
      { filename: 'README.md', fileContent: README }
    ],
    {
      utils: [
        {filename: 'Common.js', fileContent: CommonJs},
        {filename: 'utils.js', fileContent: utilsJs},
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
