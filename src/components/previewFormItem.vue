/**
* Created by tangyue on 20/10/23
*/
<template>
  <div class="fd-form-item">
  <!--  区分组件类型：type：目前有table\input两种，后续应该还有select等。注意table不是输入型组件,并且table没有label,所以单独提出来  -->
    <template v-if="data.type === 'table'">
      <div
        class="fd-formTable"
        :class="{ empty: !data.tableCols.length }"
        style="margin-bottom:6px"
      >
        <p class="fd-formTable__emptyMsg" v-if="!data.tableCols.length">
          您尚未为表格设置列数据
        </p>
        <template v-else>
          <!--  1：是；0：否        -->
          <!-- <div
            v-if="data.showTitleHeader.value === 1"
            class="fd-formTable__toolbox"
          >
            {{ data.title.value }}
          </div> -->
          <h3 style="margin:6px 0;float:left;color:black">{{data.tName}}</h3>
          <div style="text-align: right; margin-bottom: 5px">
            <el-button type="primary" round size="mini" @click="addTableRow "  :disabled="data.readonly"
              >新增行</el-button
            >
          </div>
          <el-table
            style="width: 100%"
            ref="tableInForm"
            border
            stripe
            :data="data.tableData"
            header-cell-class-name="fd-formTable__headerItem"
          >
            <el-table-column
              v-if="data.showSerial === 1"
              type="index"
              width="50"
              align="center"
              label="序号"
            >
            </el-table-column>
            <el-table-column
              v-for="(col, index) in data.tableCols"
              :key="index"
              align="center"
              :label="col.label"
              :width="col.width"
            >
              <template slot-scope="scope">
                <div v-if="col.componentTypeValue === 'input' ">
                  <!--密码组件-->
                  <div v-if="col.componentTypeValueAttr.dataType.value === 'password'">
                    <el-input
                            v-if="currentIndex == scope.$index"
                            :ref="data.ref.value"
                            @click.native.stop
                            v-model="scope.row[col.prop]"
                            :disabled="col.componentTypeValueAttr.disabled.value"
                            :readonly="col.componentTypeValueAttr.readonly.value"
                            :clearable="col.componentTypeValueAttr.clearable.value"
                            type="password"
                    ></el-input>
                    <span style="margin-left: 10px" v-else>{{
                        scope.row[col.prop]
                      }}</span>
                  </div>
                  <!--数字组件-->
                  <div v-else-if="col.componentTypeValueAttr.dataType.value === 'number'">
                    <el-input
                            v-if="currentIndex == scope.$index"
                            :ref="data.ref.value"
                            @click.native.stop
                            v-model.number="scope.row[col.prop]"
                            :disabled="col.componentTypeValueAttr.disabled.value"
                            :readonly="col.componentTypeValueAttr.readonly.value"
                            :clearable="col.componentTypeValueAttr.clearable.value"
                            type="number"
                    ></el-input>
                    <span style="margin-left: 10px" v-else>{{
                        scope.row[col.prop]
                      }}</span>
                  </div>
                  <!--自动搜索组件-->
                  <div v-else-if="col.componentTypeValueAttr.dataType.value === 'url'">
                    <el-autocomplete v-if="currentIndex == scope.$index"
                                     v-model="scope.row[col.prop]"
                                     placeholder="请输入内容"
                                     @click.native.stop
                                     :disabled="col.componentTypeValueAttr.disabled.value"
                                     :readonly="col.componentTypeValueAttr.readonly.value"
                                     :clearable="col.componentTypeValueAttr.clearable.value"
                    >
                    </el-autocomplete>
                    <span style="margin-left: 10px" v-else>{{
                        scope.row[col.prop]
                      }}</span>
                  </div>
                  <!-- 默认的文本框展示 -->
                  <div v-else>
                    <el-input
                            v-model="scope.row[col.prop]"
                            v-if="currentIndex == scope.$index"
                            :disabled="col.componentTypeValueAttr.disabled.value"
                            :readonly="col.componentTypeValueAttr.readonly.value"
                            :clearable="col.componentTypeValueAttr.clearable.value"
                    ></el-input>
                    <span style="margin-left: 10px" v-else>{{
                      scope.row[col.prop]
                    }}</span>
                  </div>
                </div>
                <div v-else-if="col.componentTypeValue === 'select' ">
                  <el-select
                          v-model="scope.row[col.prop]"
                          class="el_select_self"
                          v-if="currentIndex == scope.$index"
                          placeholder="请选择"
                          :filterable="col.componentTypeValueAttr.filterable.value"
                          :disabled="col.componentTypeValueAttr.disabled.value"
                          :readonly="col.componentTypeValueAttr.readonly.value"
                          :clearable="col.componentTypeValueAttr.clearable.value"
                  >
                    <el-option
                            v-for="item in col.options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                  </el-select>
                  <span style="margin-left: 10px" v-else>{{

                    getShowTableLabelForValue(scope.row[col.prop], col.options)
                  }}</span>
                </div>
                <div v-else-if="col.componentTypeValue === 'inputNumber' ">
                  <el-input-number
                          v-if="currentIndex == scope.$index"
                          v-model="scope.row[col.prop]"
                          :min="col.componentTypeValueAttr.minValue.value"
                          :max="col.componentTypeValueAttr.maxValue.value"
                          :step-strictly="col.componentTypeValueAttr.stepStrictly.value"
                          :precision="col.componentTypeValueAttr.precision.value"
                          :step="col.componentTypeValueAttr.stepValue.value"

                  ></el-input-number>
                  <span style="margin-left: 10px" v-else>{{
                    scope.row[col.prop]
                  }}</span>
                </div>
                <div v-else-if="col.componentTypeValue === 'datePicker' ">
                  <el-date-picker
                          class="el_datePicker_self"
                          v-model="scope.row[col.prop]"
                          :disabled="col.componentTypeValueAttr.disabled.value"
                          :type="col.componentTypeValueAttr.innerType.value"
                          :clearable="col.componentTypeValueAttr.clearable.value"
                          :format="col.componentTypeValueAttr.selfShowValueFormat.value ? col.componentTypeValueAttr.inputFormatShow.value : col.componentTypeValueAttr.showValueFormat.value"
                          :value-format="col.componentTypeValueAttr.selfValueFormat.value ? col.componentTypeValueAttr.inputFormatValue.value : col.componentTypeValueAttr.valueFormat.value"
                          v-if="currentIndex == scope.$index"
                          placeholder="选择日期">
                  </el-date-picker>
                  <span style="margin-left: 10px" v-else>{{

                    getShowTableTextForDate(scope.row[col.prop], col.componentTypeValueAttr)
                  }}</span>
                </div>

              </template>
            </el-table-column>
            <el-table-column label="操作" width="100" align="center">
              <template slot-scope="scope">
                <span v-if="currentIndex == scope.$index">
                  <el-button
                    type="text"
                    size="small"
                    :disabled="data.readonly"
                    @click="handleUse(scope.$index, scope.row)"
                    >应用</el-button
                  >
                  <el-button
                    type="text"
                    size="small"
                    :disabled="data.readonly"
                    @click="handleCancel(scope.$index, scope.row)"
                    >取消</el-button
                  >
                </span>
                <span v-else>
                  <el-button
                    type="text"
                    size="small"
                    :disabled="data.readonly"
                    @click="handleEdit(scope.$index, scope.row)"
                    >编辑</el-button
                  >
                  <el-button
                    @click="handleDelete(scope.$index)"
                    type="text"
                    :disabled="data.readonly"
                    size="small"
                    >删除</el-button
                  ></span
                >
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
    </template>
    <!-- 富文本组件 -->
    <template v-else-if="data.type==='richText'">
       <h3 style="margin:6px 0;color:black">{{data.label}}</h3>
      <div style="color:black" :class="'richText'+data.frontId"></div>
    </template>
      <!-- HTML块 -->
    <template v-else-if="data.type==='html'">
      <h3 style="margin:6px 0;color:black">{{data.label}}</h3>
      <div style="min-height:200px;border:1px solid #b9c2dd" v-html="data.htmlValue">
      </div>
    </template>
  <!--  (预览模式不要附件，编辑模式有附件，但附件的样式是特殊的)  -->
    <el-form-item
           v-else-if="data.type !== 'uploadFile' || (data.type === 'uploadFile' && !view)"
          :prop="data.code"
          :label="data.label"
          :class="data.className"
          :style="{
            'marginBottom': data.type === 'dividingLine'? 0 : lineMarginBottom + 'px'
          }"
          :rules="componentRootForm.useCustormRule? null: rules">

        <!-- 选择人员树组件 -->
      <template v-if="data.type==='user'">
        <el-form-item
          class="form-item suffix-button"
          prop="paramExpress"
        >
          <el-input
            clearable
            :disabled="data.disabled"
            v-model="data.defaultName"
            @clear='clearExpress'
            v-on:click.native.stop="openPerRoleDialog()"
          >
          </el-input>
          <!-- <el-button
            size="mini"
            type="danger"
            circle
            title="清除"
             :disabled="data.disabled"
            icon="el-icon-delete"
            style="margin-bottom: 22px;margin-left:4px"
             @click="clearExpress()"
          ></el-button> -->
        </el-form-item>
      </template>
     <!-- 下拉树组件 -->
      <template v-else-if="data.type==='tree'">
        <el-form-item
          class="form-item suffix-button"
          prop="paramExpress"
        >
         <selectTree :data='data' :formModel='formModel'></selectTree>
        </el-form-item>
    </template>
    <!--  区分输入组件的类型      -->
    <!--   多行文本     -->
    <el-input v-else-if="data.type === 'textarea'"
              :ref="data.ref"
              v-model="formModel[data.code]"
              type="textarea"
              :rows="data.rows"
              resize="none"
              :disabled="data.disabled"
              :readonly="data.readonly"
              :clearable="data.clearable"
    >
    </el-input>
    <!--   单选组     -->
    <el-radio-group v-else-if="data.type === 'radio'"
                    :ref="data.ref"
                    v-model="formModel[data.code]"
                    :disabled="data.disabled"
                    :readonly="data.readonly"
                    :clearable="data.clearable"
                  >
      <el-radio v-for="radio in options"
                :key="radio.value"
                :label="radio.value">
        {{radio.label}}
      </el-radio>
    </el-radio-group>

    <!--   多选组   -->
    <el-checkbox-group v-else-if="data.type === 'checkbox'"
                       :ref="data.ref"
                       v-model="formModel[data.code]"
                       :disabled="data.disabled"
                       :readonly="data.readonly"
                       :clearable="data.clearable"
                      >
      <el-checkbox v-for="(check, index) in options"
                   :key="index"
                   :label="check.value">{{check.label}}
      </el-checkbox>
    </el-checkbox-group>

    <!--   评分     -->
    <el-rate v-else-if="data.type === 'rate'"
             :ref="data.ref"
             v-model="formModel[data.code]"
             :disabled="data.disabled"
             :readonly="data.readonly"
             :clearable="data.clearable">
    </el-rate>

    <!--   下拉框     -->
    <el-select v-else-if="data.type === 'select'"
               :ref="data.ref"
               v-model="formModel[data.code]"
               :disabled="data.disabled"
               :readonly="data.readonly"
               :clearable="data.clearable"
               :filterable="data.filterable"
               @change="selectChangeHand"
    >
      <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
      </el-option>
    </el-select>

    <!--  日期选择器      -->
    <el-date-picker v-else-if="data.type === 'datePicker'"
                    :ref="data.ref"
                    v-model="formModel[data.code]"
                    :type="data.innerType"
                    :format="data.isCustormFormat? data.custormFormat : data.format"
                    :value-format="data.isCustormValueFormat ? data.custormValueFormat : data.valueFormat"
                    :disabled="data.disabled"
                    :readonly="data.readonly"
                    :clearable="data.clearable"
    >
    </el-date-picker>

    <!--  时间选择器      -->
    <el-time-picker v-else-if="data.type === 'timePicker'"
                    :ref="data.ref"
                    v-model="formModel[data.code]"
                    :format="data.isCustormFormat? data.custormFormat : data.format"
                    :value-format="data.isCustormValueFormat ? data.custormValueFormat : data.valueFormat"
                    :disabled="data.disabled"
                    :readonly="data.readonly"
                    :clearable="data.clearable"
    >
    </el-time-picker>

    <!--  时间范围选择器      -->
    <el-time-picker v-else-if="data.type === 'timePickerRange'"
                    :ref="data.ref"
                    is-range
                    v-model="formModel[data.code]"
                    :value-format="data.valueFormat"
                    :disabled="data.disabled"
                    :readonly="data.readonly"
                    :clearable="data.clearable"
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    @click.native.stop
    >
    </el-time-picker>
    <!--  按钮      -->
    <el-button v-else-if="data.type === 'button'"
               :ref="data.ref"
               :type="data.innerType"
               :round="data.round"
               :circle="data.circle"
               :icon="data.icon"
               :size="data.size"
               :disabled="data.disabled"
               :class="{'auto-width': data.fixParentWidth}"
    >
      <template v-if="data.defaultValue">
        {{data.defaultValue}}
      </template>
    </el-button>

    <!--  分割线  -->
    <div v-else-if="data.type === 'dividingLine'"
         class="fd-formItem__dividingLine"
         :style="{
                'height': data.thickness + 'px',
                'background': data.color,
                'marginTop': data.marginTop + 'px',
                'marginBottom': data.marginBottom + 'px',
                'marginLeft': '-' + labelWidth + 'px'
             }">
      <template v-if="formModel[data.code]">
        {{formModel[data.code]}}
      </template>
    </div>

    <!--   上传附件   -->
    <div v-else-if="data.type === 'uploadFile'"
         class="fd-formItem__upload-file">
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
          <i class="el-icon-delete file-del-icon" @click="delFile(item)"></i>
        </li>
      </ul>
    </div>

      <!-- 新附件上传 -->
      <el-upload
              v-else-if="data.type === 'uploadNewFile'"
              class="upload-demo"
              action="string"
              ref="newFile"
              :show-file-list="false"
              :auto-upload="true"
              :http-request="uploadNewFile"
              :multiple="data.isMultiple"
      >
        <el-button size="small" type="primary">点击上传</el-button>
        <div class="el-upload__tip" @click.stop="()=>{}">只能上传{{data.upLoadFileType.join("、")}}文件，且不超过{{data.fileUploadSize}}KB</div>
        <ul class="el-upload-list el-upload-list--text" @click.stop="()=>{}">
          <li class="el-upload-list__item is-ready" v-for="(fileItem, fileIndex) in fileList" :key="fileIndex">
            <a class="el-upload-list__item-name" :href="getDownURL(fileItem)" download title="下载">
              <i class="el-icon-document"></i>
              {{fileItem.name}}
            </a>
            <el-button size="mini" type="text" icon="el-icon-delete" @click.stop="deleteFile(fileItem)"></el-button>
          </li>
        </ul>
      </el-upload>

      <!-- 计数器 -->
      <el-input-number
              v-else-if="data.type === 'calcNumber'"
              :ref="data.ref.value"
              v-model="formModel[data.code]"
              class="inputNumber__self"
              :step-strictly="data.stepStrictly"
              :precision="data.precision"
              :step="data.stepValue"
              :controls="data.showButton"
              :disabled="data.disabled"
              :readonly="data.readonly"
              :min="data.minValue"
              :max="data.maxValue"
      ></el-input-number>

      <!--   级联选择器   -->
      <el-cascader
              v-else-if="data.type === 'cascader'"
              :ref="data.ref.value"
              v-model="formModel[data.code]"
              class="el_cascader_self"
              :key.sync="data.cascaderKey"
              collapse-tags
              :disabled="data.disabled"
              :readonly="data.readonly"
              :clearable="data.clearable"
              :filterable="data.filterable"
              :placeholder="data.placeholder"
              :props="{ multiple: data.isMultiple }"
              :options="data.optionSetting.options && data.optionSetting.options.length > 0 ? data.optionSetting.options[0].children : []"
              @change="selectCascaderChange($event, data)"

      >
      </el-cascader>

    <!--   业务公共字段-流水号     -->
    <el-input v-else-if="data.type === 'sheetFlowCode'"
            :ref="data.ref"
            v-model="formModel[data.code]"
            :disabled="data.disabled"
            :readonly="data.readonly"
            :clearable="data.clearable"
    ></el-input>

    <!--   业务公共字段-操作人     -->
    <el-input v-else-if="data.type === 'operator'"
            :ref="data.ref"
            v-model="formModel[data.code]"
            :disabled="data.disabled"
            :readonly="data.readonly"
            :clearable="data.clearable"
    ></el-input>

    <!--   业务公共字段-操作人部门     -->
    <el-input v-else-if="data.type === 'operatorDept'"
            :ref="data.ref"
            v-model="formModel[data.code]"
            :disabled="data.disabled"
            :readonly="data.readonly"
            :clearable="data.clearable"
    ></el-input>
    <!--   业务公共字段-操作人联系方式     -->
    <el-input v-else-if="data.type === 'operatorMobile'"
            :ref="data.ref"
            v-model="formModel[data.code]"
            :disabled="data.disabled"
            :readonly="data.readonly"
            :clearable="data.clearable"
    ></el-input>

    <!--   业务公共字段-操作人当前角色     -->
    <el-input
            v-else-if="data.type === 'operatorRole'"
            :ref="data.ref"
            v-model="formModel[data.code]"
            :disabled="data.disabled"
            :readonly="data.readonly"
            :clearable="data.clearable"
    ></el-input>
    <!--   业务公共字段-操作时间     -->
    <el-date-picker
            v-else-if="data.type === 'operateTime'"
            :ref="data.ref"
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="formModel[data.code]"
            type="datetime"
            :disabled="data.disabled"
            :computereadonly="data.readonly"
    >
    </el-date-picker>

    <!-- 如果没有设置type，则都是input --start-- -->
    <template v-else>
<!--      <div style="color:red">{{data}}</div>-->
      <!-- 搜索 -->
      <el-autocomplete v-if="data.isAutocompletable"
                       v-model="formModel[data.code]"
                       :fetch-suggestions="querySearchAsync"
                       placeholder="请输入内容"
                       @select="handleSelect"
                       :disabled="data.disabled"
                       :readonly="data.readonly"
      >
      </el-autocomplete>

      <el-input v-else-if="data.validationSetting && data.validationSetting.dataType.value === 'number'"
              :ref="data.ref"
              :disabled="data.disabled"
              :readonly="data.readonly"
              :clearable="data.clearable"
              type="number"
              v-model.number="formModel[data.code]"
      ></el-input>
      <el-input v-else-if="data.validationSetting && data.validationSetting.dataType.value === 'password'"
              :ref="data.ref"
              :disabled="data.disabled"
              :readonly="data.readonly"
              :clearable="data.clearable"
              type="password"
              v-model="formModel[data.code]"
      ></el-input>
      <el-input v-else
              :ref="data.ref"
              :disabled="data.disabled"
              :readonly="data.readonly"
              :clearable="data.clearable"
              v-model="formModel[data.code]"
      ></el-input>
    </template>

    <!-- 如果没有设置type，则都是input --end-- -->
  <personEditDialog
      ref="personEditDialog"
      @personSure="personSure"
    ></personEditDialog>
    <!-- <rogroupEditDialog

      ref="rogroupEditDialog"
      @rogroup="rogroup"
    ></rogroupEditDialog> -->
    </el-form-item>
    <MessageBox
      :showMessage.sync="MessageConfig.showMessage"
      :MessageConfig="MessageConfig"
      @checkyes="checkyesDel"
      @checkno="checkDeleteNo"
    ></MessageBox>
  </div>
</template>

<script>
  import wangEditor from "wangeditor";
  import {
    commonRequest,
    getCodeTypeData,
    getNames,
    uploadFiles} from '../api/formDesigner_api';
  import {isObjEmpty} from '../util/common.js';
  import MessageBox from "./MessageBox.vue";
    import selectTree from "./selectTree"
  import personEditDialog from "./personEditDialog.vue";
  import rogroupEditDialog from "./rogroupEditDialog.vue";
  import {baseUrl} from '../api/commonUrl';
  export default {
    name: 'previewFormItem',
    components:{MessageBox,personEditDialog,rogroupEditDialog,selectTree},
    props: {
      // 是否为预览模式，模式是编辑模式啦
      view: {
        type: Boolean,
        default: false
      },
      formModel: {
        type: Object,
        default () {
          return {}
        }
      },
      data: {
        type: Object,
        default () {
          return {}
        }
      },
      labelWidth: {
        type: Number,
        default: 0
      },
      lineMarginBottom: {
        type: Number,
        default: 0
      },
    },
    computed: {
      componentRootForm () {
        let parent = this.$parent;
        let parentName = parent.$options.name;
        while (parentName !== 'previewForm') {
          parent = parent.$parent;
          parentName = parent.$options.name;
        }
        return parent;
      },
    },
    watch: {
      // relationPreQueryParam(n, o){
      //   debugger;
      // }
      // formModel:{
      //   handler(n,o){
      //     if(this.data.type=='richText'&&this.editorFlag){
      //       this.editorFlag = false
      //       this.editor.txt.html(this.formModel[this.data.code])
      //     }

      //   },
      //   deep:true
      // },
      editorTxt:{
        handler(n,o){
          console.log(n,'ppp');
          this.editor.txt.html(this.formModel[this.data.code])
        },
        deep: true
      },
      'data.disabled'(n,o){
        if(this.data.type=='richText'){

           if(n){
            this.editor.$textElem.attr('contenteditable', false)
          }else{
            this.editor.$textElem.attr('contenteditable', true)
          }
        }
      }
    },
    data () {
      return {
        options: [], // 针对下拉框等的下拉数据
        fileName: '', // 附件名字
        fileList: [
          // {
          //   name: '测试啊啊啊啊'
          // }, {
          //   name: '凉凉以就就'
          // },
        ], // 附件列表
        USER_UPLOAD_PARAM: null, // 仅对上传组件有用的自定义查询参数
        USER_UPLOAD_SEARCH_LIST_PARAM: null, // 仅对上传组件有用的自定义查询参数
        relationPreQueryParam: {}, // 关联前置查询参数(键值的形式的)
        relationPreQueryParamKeys: {}, // 关联前置查询参数(键对应的记录)
        rules: {},
        tableData:[],//表格数据
        currentIndex:null,//用于行内编辑
        delRolIndex:null,//用于删除
        MessageConfig: {
          showMessage: false, //打开消息提示框
          MsgBoxType: "", //消息提示框类型
          MsgText: "",
        },
        formSetting:[],//表单元素状态控制
        editor:null,
        editorHtml:'',
        editorFlag:true,
        formCode:'',
        editorTxt: ''
      }
    },
    created () {
      debugger;
      // 检查如果有码表配置的，查询其数据
      let {type, optionSetting, validationSetting, formSetting_children} = this.data;
      if (type == 'tree'){return;}

      if (optionSetting === 'static') {
        this.options = this.data.optionSetting_tabContent.map(it=>{
          if(it.label && it.label.value){
            return {
              label: it.label.value,
              value: it.value.value
            }
          }
        });
      }
      // 码表(调用接口，查询数据)
      else if (optionSetting === 'remote') {
        if (this.data.optionSetting_codeType) {
          this.getCodeTypeList(this.data.optionSetting_codeType);
        }
      }
      // 字典表
      else if(optionSetting === 'remoteDict'){
        const optionSetting_tabContent = this.data.optionSetting_tabContent;
        if (optionSetting_tabContent && optionSetting_tabContent.relationSettings &&
          optionSetting_tabContent.relationSettings.values && !isObjEmpty(optionSetting_tabContent.relationSettings.values)){
          // 整理出查询参数
          let queryP = this.getRelationQueryParams(optionSetting_tabContent);
          console.log('queryP' + queryP, this.data)
          if (queryP) {
            this.getRemoteUrlDatas({
              url: (optionSetting_tabContent.remoteUrl && optionSetting_tabContent.remoteUrl.value)? optionSetting_tabContent.remoteUrl.value : '/admin/sysdict/list',
              method: (optionSetting_tabContent.remoteMethods && optionSetting_tabContent.remoteMethods.value)? optionSetting_tabContent.remoteMethods.value: 'get',
              ...queryP
              // params: queryParam,
              // data: queryParam
            });
          }
        }
        else{
          this.getRemoteUrlDatas({
            url: (optionSetting_tabContent.remoteUrl && optionSetting_tabContent.remoteUrl.value)? optionSetting_tabContent.remoteUrl.value : '/admin/sysdict/list',
            method: (optionSetting_tabContent.remoteMethods && optionSetting_tabContent.remoteMethods.value)? optionSetting_tabContent.remoteMethods.value: 'get',
            params: {
              parentValue: optionSetting_tabContent.codeType.value || 'root'// 这是我们字典后端接的查询参数
            }
          });
        }
      }
      // 远程接口（初版）
      else if (optionSetting === 'remoteUrl') {
        // 如果有前置关联关系设置的，则需要先检查其前置是否有值，有再查询
        // eslint-disable-next-line camelcase
        const optionSetting_tabContent = this.data.optionSetting_tabContent;
        if (optionSetting_tabContent && optionSetting_tabContent.relationSettings &&
          optionSetting_tabContent.relationSettings.values && !isObjEmpty(optionSetting_tabContent.relationSettings.values)) {
          // 整理出查询参数
          let queryP = this.getRelationQueryParams(optionSetting_tabContent)

          if (queryP) {
            try{
              this.getRemoteUrlDatas({
                url: optionSetting_tabContent.remoteUrl.value,
                method: optionSetting_tabContent.remoteMethods.value,
                ...queryP
              });
            }
            catch(e){

            }

          }
        }
        // 没有配置前置关联查询参数，则现在就查询后台接口
        else {
          this.getRemoteUrlDatas({
            url: optionSetting_tabContent.remoteUrl.value,
            method: optionSetting_tabContent.remoteMethods.value
          });
        }
      }
      // 远程接口（2版）
      else if (optionSetting === 'remoteUrl2') {
        // todo 前置关联还没有加入
        // 如果有前置关联关系设置的，则需要先检查其前置是否有值，有再查询
        // eslint-disable-next-line camelcase
        const optionSetting_tabContent = JSON.parse(JSON.stringify(this.data.optionSetting_tabContent))

        // // 没有配置前置关联查询参数，则现在就查询后台接口
          // 处理queryParams，拼接查询参数
          let params = {};
          let data = {};
          let headers = {};
          for(let i = 0,len = optionSetting_tabContent.queryParams.length;i < len; i++){
            let it = optionSetting_tabContent.queryParams[i];
            // 空键名的不要
            if(!it.paramName){
              break;
            }
            if (it.paramType === 'params'){
              params[it.paramName] = it.defaultValue;
            }
            else if (it.paramType === 'body'){
              data[it.paramName] = it.defaultValue;
            }
            else if (it.paramType === 'header'){
              headers[it.paramName] = it.defaultValue;
            }
          }

          this.getRemoteUrlDatas({
            url: optionSetting_tabContent.url,
            method: optionSetting_tabContent.method,
            data: data,
            params: params,
            headers: headers,
            successCallback: optionSetting_tabContent.successCallback
          });
      }
      //判断是否有控制表单元素状态的下拉框
      if(formSetting_children){
        this.formSetting = formSetting_children
      }
      // 检查是否有配置校验规则(前提是：不使用用户自定义的规则)
      if (!this.componentRootForm.useCustormRule) {
        if (validationSetting) {
          let rules = [];
          // 必填
          if (validationSetting.required && validationSetting.required.selected) {
            rules.push({ required: true, message: '请输入必填信息', trigger: 'blur' });
          }
          // 数据类型
          if (validationSetting.dataType && validationSetting.dataType.selected) {
            let validationDataValue = validationSetting.dataType.value;
            let txt = '';
            for (let i = 0, len = validationSetting.dataType.options.length; i < len; i++) {
              let child = validationSetting.dataType.options[i];
              if (child.value === validationDataValue) {
                txt = child.label;
              }
            }
            if (validationDataValue === 'password') {

            }
            // 手机类型的，给它整个正则校验
            else if (validationDataValue === 'mobile') {
              rules.push({pattern: eval('/^(1)\\d{10}$/'), message: '手机格式不正确'})
            }
            // 其他类型的，用 elementui 自己的校验配置的type即可
            else {
              rules.push({type: validationDataValue, message: `仅限${txt}类型`})
            }
          }

          // 自定义正则
          if (validationSetting.regExpPattern && validationSetting.regExpPattern.selected && validationSetting.regExpPattern.value) {
            try {
              // eslint-disable-next-line no-eval
              let _value = eval(validationSetting.regExpPattern.value)
              rules.push({pattern: _value, message: `错误格式(${validationSetting.regExpPattern.value})`})
            } catch (e) {
              console.log('错误的正则表达式:', e)
            }
          }

          // 长度控制
          if(validationSetting.lengthControl && validationSetting.lengthControl.selected){
            let min = validationSetting.lengthControl.min;
            let max = validationSetting.lengthControl.max;
            if(max && max !== min){
              rules.push({ min: min, max: max, message: `长度在 ${min} 到 ${max} 个字符` })
            }
          }
          this.rules = rules;
        }
      }

      // 处理富文本的值
      if(this.data.type=='richText'){
        this.editorTxt = this.formModel[this.data.code]
      }
    },
    mounted () {
      if (this.data.type === 'textarea') {
        this.labelEle = this.$el.getElementsByClassName('el-form-item__label')[0];
        this.contentEle = this.$el.querySelector('.el-form-item__content .el-textarea');
        this.setLabelEleHeight(this.contentEle.offsetHeight + 'px');
      }
      this.renderUploadStyles();
      if (this.data.type == 'richText') {
        // 配置富文本编辑器的参数以及各种回调函数
        this.initRichTextSettings();
      }
    },
    methods: {
      renderUploadStyles () {
        // fileList
      },
      // 设置label元素的高度与行高
      setLabelEleHeight (newHeight) {
        this.labelEle.style.height = newHeight;
        this.labelEle.style.lineHeight = newHeight;
      },
      // 添加附件信息
      addFileName () {
        this.fileName = this.$refs.file.files[0].name;
      },
      // 上传到服务器
      upFile () {
        const uploadOptions = this.data.uploadSettings;// 上传相关配置（诸如接口地址、请求方式）
        // 判断文件是否为空
        if (this.$refs.file.value === '') {
          this.$message({
            showClose: true,
            message: '请选择上传的目标文件!',
            duration: 1000,
            type: 'warning'
          });
          return false;
        } else {
          // 找到配置的请求体、接口地址、查询方式
          let param = new FormData();
          param.append('files', this.$refs.file.files[0]);
          param.append('access_token', sessionStorage.getItem('access_token'));

          // 用户自定义添加的参数,这是例如在引用页面，用户可能需要再添加一些参数
          if (this.USER_UPLOAD_PARAM) {
            for (let key in this.USER_UPLOAD_PARAM) {
              if (key) {
                param.append(key, this.USER_UPLOAD_PARAM[key]);
              }
            }
          }

          // 遍历配置的请求体，加上这些参数
          uploadOptions.bodyParam.forEach(it => {
            if (it && it.label) {
              param.append(it.label, it.value);
            }
          });

          // 向后端发送请求
          commonRequest({
            data: param,
            method: uploadOptions.uploadMethod,
            url: uploadOptions.uploadUrl,
            headers: {'Content-Type': 'multipart/form-data'}
          })
            .then(res => {

              if (res.data.ok) { // 上传成功
                this.$message({
                  showClose: true,
                  message: '上传成功',
                  duration: 1500,
                  type: 'success'
                });
                this.fileName = '';// 清空文件
              } else {
                this.$message({
                  showClose: true,
                  message: res.data.codeMsg || res.data.msg || '上传失败',
                  duration: 1500,
                  type: 'warning'
                });
              }
              // 改为不论上传成功与否，都请求列表数据
              this.getFileList();
            })
            .catch(e => {

          })
        }
      },
      // 查询附件列表
      getFileList () {
        if (this.data.listRequestUrl) {
          // 遍历配置的请求体，加上这些参数
          let queryData = {};
          if (this.data.bodyParam) {
            this.data.bodyParam.forEach(it => {
              queryData[it.label] = it.value
            });
          }

          // 用户自定义添加的参数,这是例如在引用页面，用户可能需要再添加一些参数
          if (this.USER_UPLOAD_SEARCH_LIST_PARAM) {
            for (let key in this.USER_UPLOAD_SEARCH_LIST_PARAM) {
              if (key) {
                queryData[key] = this.USER_UPLOAD_SEARCH_LIST_PARAM[key];
              }
            }
          }

          commonRequest({
            params: queryData,
            method: this.data.listRequestMethod,
            url: this.data.listRequestUrl
          })
            .then(res => {
              console.log('查询附件的值',res);

              if (res && res.data && res.data.code == '0000') {
                this.fileList = res.data.data.data;
              } else {
                this.fileList = [];
              }
            })
            .catch(e => {

              console.log(e)
            })
        }
      },
      // 下载地址
      getDownURL (row) {
        // 处理url。如果是以http或者https开头的，则直接使用；若否，则依次取baseUrl。和本地的ip
        let url = this.data.downloadServiceUrl;
        let _url = '';
        if (url.startsWith('http:') || url.startsWith('https:')){
          _url = url
        }
        else if (baseUrl) {
          _url = baseUrl + url;
        }
        else {
          _url = window.location.origin + url
        }
        return (
           _url +
          row.id +
          '?access_token=' +
          sessionStorage.getItem('access_token')
        );
      },
      // 删除附件
      delFile (row) {
        commonRequest({
          method: 'DELETE',
          url: this.data.delFileUrl + row.id
        })
          .then((response) => {
          this.$message({
            showClose: true,
            message: '删除成功!',
            duration: 1000,
            type: 'success'
          });
          this.getFileList();
        });
      },
      // 获取码表数据列表
      getCodeTypeList (codeType) {
        getCodeTypeData({codeType: codeType})
          .then(res => {
            if (res && res.data && res.data.ok) {
              this.options = res.data.data.map(it => {
                return {
                  label: it.NAME,
                  value: it.ID
                }
              })
            }
          })
          .catch(e => {

          })
      },

      // 针对配置了数据来源是远程接口的表单项，查询远程接口的数据
      getRemoteUrlDatas ({url, method, params, data, needClearFormValue, headers = {}, successCallback}) {
        const that = this;
        commonRequest({
          url: url,
          params: params,
          data: data,
          method: method,
          headers: headers
        })
          .then(res => {
            // 如果有needClearFormValue，则需要清空当前的选中值
            if(needClearFormValue){
              this.formModel[this.data.code] = '';
            }
            // 清空当前的下拉数据们
            this.options = [];
            // 如果有自定义的回调函数，则执行自定义的
            if(successCallback){
              try{
                let fn = new Function('resData', successCallback);
                debugger;
                this.options = fn(res) || [];
              }catch(e){
                console.log(e)
              }
            }
            // 没有自定义的回调函数，则执行默认逻辑
            else{
              if (res.data && res.data.code == '0000') {
                if(res.data.data.data && res.data.data.data.constructor === Array){
                  this.options = res.data.data.data.map(it => {
                    return {
                      label: it.name,
                      value: it.id
                    }
                  });
                }else{
                  this.options = res.data.data.map(it => {
                    return {
                      label: it.lable,
                      value: it.value
                    }
                  });
                }
              } else {
                this.$message({
                  showClose: true,
                  message: res.data.codeMsg || res.data.msg || '查询失败',
                  duration: 1500,
                  type: 'warning'
                });
              }
            }
          })
          .catch(e => {
            this.$message({
              showClose: true,
              message: (e && e.message) ? e.message : '查询失败',
              duration: 1500,
              type: 'warning'
            });
            // 清空当前的选中值
            this.formModel[this.data.code] = '';
            // 清空当前的下拉数据们
            this.options = [];
          })
      },

      // 检查当前表单项的前置关联查询参数。若都有值，则需要向后台查询接口
      checkRelationPreQueryParam () {
        let flg = true;
        for (let i in this.relationPreQueryParam) {
          if (!i || !this.relationPreQueryParam[i]) {
            flg = false;
            break;
          }
        }
        if (flg) {
          const optionSetting_tabContent = this.data.optionSetting_tabContent;

          this.getRemoteUrlDatas({
            url: optionSetting_tabContent.remoteUrl ? optionSetting_tabContent.remoteUrl.value : '/admin/sysdict/list',// 以现在的情况，如果不是，即是字典表查询
            method: optionSetting_tabContent.remoteUrl? optionSetting_tabContent.remoteMethods.value : 'get',
            params: this.relationPreQueryParam,
            data: this.relationPreQueryParam,
            needClearFormValue: true,// 是否需要清空当前表单项的绑定值
          });
        }
      },

      clearValueAndOptions () {
        // 清空当前的选中值
        this.formModel[this.data.code] = '';
        // 清空当前的下拉数据们
        this.options = [];
      },

      // 下拉框的选中值改变后的事件
      selectChangeHand (val) {
        const FD_FORM_ITEM_LIST = this.componentRootForm.$refs.fdFormItem;

        // 检查当前表单中的所有表单项的前置关联查询参数
        for (let i = 0, len = FD_FORM_ITEM_LIST.length; i < len; i++) {
          let formItem = FD_FORM_ITEM_LIST[i];
          for (let j in formItem.relationPreQueryParamKeys) {
            if (j && formItem.relationPreQueryParamKeys[j] && formItem.relationPreQueryParamKeys[j] === this.data.code) {
              formItem.relationPreQueryParam[j] = val;
              // 假如该下拉框有选中值，再检查是否关联参数都齐了
              if (val) {
                formItem.checkRelationPreQueryParam();
              }
              // 假如该下拉框没有选中值，（比如：点了清空按钮，或者选了没有值的选项），则清掉被关联的值和下拉数据
              else {
                formItem.clearValueAndOptions();
              }
            }
          }
        }
        //判断当前下拉框是否有配置更改其他表单元素的状态
        if(this.formSetting.length>0){
          let data=[]
          this.formSetting.forEach(item=>{
            if(item.value==val&&item.editSettingArray){
              data = JSON.parse(JSON.stringify(item.editSettingArray))
              this.$bus.$emit('selectChange',data)
            }else if(item.editSettingArray){
              this.$bus.$emit('selectChange',data)
            }
          })
        }

      },
           // 打开选择人员或角色弹框
    openPerRoleDialog() {
        if (this.$refs.personEditDialog&&!this.data.disabled){
          this.$refs.personEditDialog.show(this.data.defaultValueArr,this.data);
        }
    },
          // 将选人弹窗中确定的人员更新到表单中
      personSure(usersData,names,ids){// usersData:选中的人，用于弹框回显，names：选中的人，用于展示
        this.data.defaultName=names
        this.data.defaultValueArr=[...usersData]
        this.formModel[this.data.code]=ids
      },
          //清空选中人员
      clearExpress(){
        event.stopPropagation();
        this.data.defaultName=''
        this.data.defaultValueArr=[]
        this.formModel[this.data.code]=''
      },
            //打开下拉树弹框
    // openTreeDialog(){
    //   if (this.$refs.rogroupEditDialog&&!this.data.disabled) {
    //       this.$refs.rogroupEditDialog.show(this.data);
    //     }
    // },
    // //将下拉树选择的值显示在input中
    // rogroup({value,name}){
    //   this.data.defaultValueArr = name
    //   this.data.defaultValue=''
    //   this.formModel[this.data.code]=''
    //   value.forEach(item=>{
    //     this.data.defaultValue+=item.id+','
    //     this.formModel[this.data.code]+=item.id+','
    //   })
    // },
    // //清空下拉树选中的值
    // clearGogroup(){
    //   event.stopPropagation();
    //   this.data.defaultValueArr = ''
    //   this.data.defaultValue=''
    //   this.formModel[this.data.code]=''
    // },
      //新增行
    addTableRow(event) {
      event.stopPropagation();
      let obj = {}
      this.data.tableCols.forEach((item) => {
        obj[item.prop] = ''
      });
      this.data.tableData.push(obj);
    },
    //删除行
    handleDelete(index) {
      event.stopPropagation();
       this.MessageConfig.showMessage = true;
        this.MessageConfig.MsgBoxType = "confirm";
        this.MessageConfig.MsgText = "确认删除该行数据？";
        this.delRolIndex = index
    },
    //确认删除
      checkyesDel(data){
        if(data){
          this.data.tableData.splice(this.delRolIndex, 1);
        }
      },
    // 取消删除事件
      checkDeleteNo(data) {
        if (!data) {
          this.delRolIndex = null
        }
      },
    //编辑行
    handleEdit(index, row) {
      event.stopPropagation();
      this.defaultData = JSON.parse(JSON.stringify(row));
      this.currentIndex = index;
    },
    //确认编辑行
    handleUse(index, row) {
      event.stopPropagation();
      //  this.MessageConfig.showMessage = true;
      //   this.MessageConfig.MsgBoxType = "success";
      //   this.MessageConfig.MsgText = "应用成功";
        this.currentIndex = null;
    },
    //取消编辑
    handleCancel(index, row) {
      event.stopPropagation();
      this.data.tableData[index] = JSON.parse(JSON.stringify(this.defaultData));
      for(let key in this.data.tableData[index]){
        for(let dekey in this.defaultData){
          if(key==dekey){
              this.data.tableData[index][key]=this.defaultData[dekey]
            }
        }
      }
      this.currentIndex = null;
      },
      querySearchAsync(queryString, cb) {

        if(queryString){
          if(!this.data.searchUrl){
            let url = '/workflow/form/data/getNames'
            this.formCode=this.$parent.$parent.$parent.$parent.$parent.$parent.formCode
            let data={
              fieldValue:this.formModel[this.data.code],
              fieldCode:this.data.code,
              formCode:this.formCode
            }
            let callBackArr = [];
            if(!this.formCode||!this.data.code) return
            getNames(url,data).then(res=>{
              if(res&&res.data&&res.data.data){
                res.data.data.forEach(item=>{
                if(item.indexOf(queryString)>-1){
                  callBackArr.push({value:item,label:item})
                }
              })
              }
               cb(callBackArr);
            })

          }
          else{
            let data = {
              fieldValue:this.formModel[this.data.code],
            }
            let callBackArr = [];
            getNames(this.data.searchUrl,data).then(res=>{
               if(res&&res.data&&res.data.data){
                 res.data.data.forEach(item=>{
                if(item.indexOf(queryString)>-1){
                   callBackArr.push({value:item,label:item})
                }
              })
               }
               cb(callBackArr);
            })

          }
        }
      },
      handleSelect(item) {
        this.formModel[this.data.code]=item.label
      },
      // 对于有设置前置关联的普通下拉和码表下拉，找到联动查询参数
      getRelationQueryParams(optionSetting_tabContent){
        let queryParam = {};// 值版本
        let queryParamKeys = {};// 键对应的版本
        let flg = true;
        let values = optionSetting_tabContent.relationSettings.values;
        for (let key in values) {
          let it = values[key];
          var targetKey = it[1];// 找到前置关联的字段的名称；
          if (targetKey) {
            queryParam[key] = this.formModel[targetKey];
            queryParamKeys[key] = targetKey;
            // 只要有一个没值的，都算作false，即不去查后端
            flg && (flg = Boolean(this.formModel[targetKey]));
          } else {
            flg = false;
          }
        }
        this.relationPreQueryParam = queryParam;
        this.relationPreQueryParamKeys = queryParamKeys;

        return flg? {
          params: queryParam,
          data: queryParam
        }: flg;
      },
      // 新附件上传 上传文件
      uploadNewFile(params) {
        debugger;
        let fileName = params.file.name;
        debugger
        let pos = fileName.lastIndexOf(".");
        console.log("获取当前data,upload", this.data)
        let lastName = fileName.substring(pos, fileName.length);
        if (
          this.data.upLoadFileType && this.data.upLoadFileType.indexOf(lastName.toLowerCase()) === -1
        ) {
          let tipTxt = ""
          this.data.upLoadFileType.length > 0 && this.data.upLoadFileType.map((value, index) => {
            if (index === 0) {
              tipTxt += `${value}`
            } else {
              tipTxt += `、${value}`
            }
          })
          this.$message.error(`文件必须为${tipTxt}类型`);
          // this.resetCompressData()
          return false;
        }
        // 限制上传文件的大小
        const isLt = params.file.size / 1024 > this.data.fileUploadSize;
        if (isLt) {
          this.$message.error(`上传文件大小不得大于${this.data.fileUploadSize}KB!`);
          return false
        }
        debugger
        if (this.fileList.length >= this.data.totalUploadCounts) {
          debugger
          this.$message.error(`上传文件的数量不能超过${this.data.totalUploadCounts}个`);
          return false
        }
        // 判断文件是否为空
        if (false) {
          this.$message({
            showClose: true,
            message: "请选择上传的目标文件!",
            duration: 1000,
            type: "warning"
          });
          return false;
        } else {
          // 找到配置的请求体、接口地址、查询方式
          let param = new FormData();
          param.append("files", params.file);
          param.append("access_token", sessionStorage.getItem("access_token"));
          // param.append('typeId', 1);
          console.log("上传文件的自定义参数", this.customParams);
          param.append("boId", "1376349548590534656")
          param.append("businessType", "jlitreq")
          // 向后端发送请求
          return new Promise((resolve, reject) => {
            uploadFiles(param)
              .then(res => {
                //   debugger;
                if (res.data && res.code == "0000") {
                  // 上传成功
                  this.$message({
                    showClose: true,
                    message: "上传成功",
                    duration: 1500,
                    type: "success"
                  });
                  this.getFileList()
                  resolve(params)
                } else {
                  this.$message({
                    showClose: true,
                    message: res.data.codeMsg || res.data.msg || "上传失败",
                    duration: 1500,
                    type: "warning"
                  });

                  reject(false)
                }
                // 改为不论上传成功与否，都请求列表数据
                // this.getFileList();
              })
              .catch(e => {
                this.$message({
                  showClose: true,
                  message: "上传失败",
                  duration: 1500,
                  type: "warning"
                });
                reject(false)
              }).finally(() => {

            })
          })

        }
      },

      // 配置富文本编辑器的参数以及各种回调函数
      initRichTextSettings(){
        const that = this;
        debugger;
        let className = '.richText' + this.data.frontId;
        const editor = new wangEditor(className);
        editor.config.height = this.data.height || 200;// 高度(200是我settings.js中设置的最小值)
        editor.config.showLinkImg = false;
        // 使用服务器上传图片与使用base64图片不能同时存在
        // editor.config.uploadImgServer = this.data.uploadUrl||''
        editor.config.uploadImgShowBase64 = true;

        // 配置alt选项
        editor.config.showLinkImgAlt = false
        editor.config.zIndex = 50
        // 配置超链接
        editor.config.showLinkImgHref = false
        editor.config.excludeMenus = [
          'emoticon',
          'video'
          // 'image',
        ];
        // 配置 onchange 回调函数，将数据同步到 vue 中
        editor.config.onchange = (newHtml) => {
          this.editorData = newHtml;
          this.formModel[this.data.code] = editor.txt.html()
        };
        editor.config.pasteTextHandle = function(pasteStr){
          debugger;
          // return '<img src="https://www.wangeditor.com/imgs/ali-pay.jpeg"/>'
          return pasteStr;
        };
        // 创建编辑器
        editor.create();
        this.editor = editor;
      },
      // 动态表格下拉框根据value显示对应的label
      getShowTableLabelForValue(value, options){
        let resultArr = options.filter((item) => {
          return item.value === value
        })
        return resultArr.length > 0 ? resultArr[0].label : ""
      },
      // 动态表格下显示自定义日期格式的文本
      getShowTableTextForDate(value, attr){
        //scope.row[col.prop] ? scope.row[col.prop] : col.componentTypeValueAttr.isDeafultNowDate.value ? moment().format('YYYY-MM-DD') : scope.row[col.prop]
        if (attr.isDeafultNowDate.value) {
          if (attr.selfShowValueFormat.value) {
            return this.moment().format(attr.inputFormatShow.value)
          }
          return this.moment().format("YYYY-MM-DD")
        } else {
          if (attr.selfShowValueFormat.value) {
            return value ? this.moment(value).format(attr.inputFormatShow.value) : this.moment().format(attr.inputFormatShow.value)
          }
          return value ? this.moment(value).format("YYYY-MM-DD") : ""
        }
      }
    }
  }
</script>

<style scoped>
.fd-form-item .el-autocomplete{
  width: 100%;
}
</style>
