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
import {downloadLocalFile} from '../util/utils'

let labelWidth = 0;
let lineMarginBottom = 0;
let allOptions = {}; // 针对下拉框等的下拉数据

// 生成zip文件并且下载
const downloadZip = (filename, files)=>{
  var JSZip = require('jszip');
  var zip = new JSZip();
  files.forEach(it => {
    zip.file(it.filename, it.fileContent);
  });
  zip.generateAsync({type: 'blob'})
    .then(function(content) {
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
    list.forEach(it=>{
      if(it.type === 'group'){
        fn(it.children)
      }else{
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

const generateBasicElementFormItem = (data)=>{
  let strStart = `<el-form-item prop="${data.code || ''}" label="${data.label || ''}" class="${data.className}"
                     :style="{
                       'marginBottom': ${data.type === 'dividingLine'? 0 : `${lineMarginBottom} + 'px'`}
                      }"
                  >`;
  let strEnd = '</el-form-item>';

  let innerStr = '';
  // 多行文本
  if(data.type === 'textarea'){
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
  else if(data.type === 'select'){
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

  // 分割线(todo 分割线到单选组中间的代码还没有拷过来)
  else if(data.type === 'dividingLine'){
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
  // 如果没有设置type，则都是input
  else{
    if(data.validationSetting && data.validationSetting.dataType.value === 'number'){
      innerStr = ` <el-input
              :disabled="${data.disabled}"
              :readonly="${data.readonly}"
              :clearable="${data.clearable}"
              type="number"
              v-model.number="formModel.${data.code}"
      ></el-input>`;
    }
    else if(data.validationSetting && data.validationSetting.dataType.value === 'password'){
      innerStr = ` <el-input
              :disabled="${data.disabled}"
              :readonly="${data.readonly}"
              :clearable="${data.clearable}"
              type="password"
              v-model="formModel.${data.code}"
      ></el-input>`;
    }
    else{
      innerStr = ` <el-input
              :disabled="${data.disabled}"
              :readonly="${data.readonly}"
              :clearable="${data.clearable}"
              v-model="formModel.${data.code}"
      ></el-input>`;
    }
  }
  return ` ${strStart}
              ${innerStr}
           ${strEnd}`;
};

//
const generatePreviewFormItem = (item)=>{
  let str = '';

  // 如果是分组
  if (item.type === 'group') {
    if (item.label) {
      str += `<div class="fd-form-group__header">${item.label}</div>`;
    }
    str += `
      ${item.children.map((child, childIdx)=>`
       <el-row key="${childIdx}" :gutter="35">
         ${loopCol(child)}
       </el-row>
      `).join(' ')}
    `;
  }
  // 非分组的表单项
  else {
    str = generateBasicElementFormItem(item);
  }

  return str;
};
const loopCol = (obj)=>{
  let str = '';
  for(let key in obj){
    let item = obj[key];
    str += `  <el-col key="${key}" :span="${item.width}" style="${colStyle(item)}">
           ${generatePreviewFormItem(item)}
         </el-col>`;
  }

  return str;
};
// 生成使用elenetui组件编写的页面
export const generateElementuiCode = (filename, formModel, list)=>{
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
  <el-form class="${formClassStr}"
           size="${formModel.size}"
           label-width="${formModel.labelWidth}px">
    ${formateList(list).map((it,index)=>`
        <el-row :gutter="35" key="${index}">
        ${loopCol(it)}
        </el-row>
    `).join(' ')}
  </el-form>
</template>

<script>
   export default {
     data () {
       return {
         list: ${JSON.stringify(list)},
         isView: false,// 表单的样式：预览或者是可编辑的
         formModel: {}, // 表单的绑定值
         options: ${JSON.stringify(allOptions)}
       }
     },
     created(){
       // 查询所有下拉、单选、多选的选项数据
      
     },
     methods: {
       // 查询所有下拉、单选、多选的选项数据
   
       // 下拉框的选中值改变后的事件
        selectChangeHand (val) {
          console.log(val);
          // do your own business
        }
     }
   }
</script>
`;

  downloadZip(filename, [
    { filename: 'main.vue', fileContent: IndexVueContent },
    { filename: 'README.md', fileContent: README }
    ]
  );
};
