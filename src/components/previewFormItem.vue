/**
* Created by tangyue on 20/10/23
*/
<template>
  <!--  (预览模式不要附件，编辑模式有附件，但附件的样式是特殊的)  -->
  <el-form-item
          v-if="data.type !== 'uploadFile' || (data.type === 'uploadFile' && !view)"
          :prop="data.code"
          :label="data.label"
          :class="data.className"
          :style="{
            'marginBottom': data.type === 'dividingLine'? 0 : lineMarginBottom + 'px'
          }">
    <!--  区分输入组件的类型      -->
    <!--   多行文本     -->
    <el-input v-if="data.type === 'textarea'"
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
                    :value-format="data.valueFormat"
                    :disabled="data.disabled"
                    :readonly="data.readonly"
                    :clearable="data.clearable"
    >
    </el-date-picker>

    <!--  时间选择器      -->
    <el-time-picker v-else-if="data.type === 'timePicker'"
                    :ref="data.ref"
                    v-model="formModel[data.code]"
                    :value-format="data.valueFormat"
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
          <i class="el-icon-delete" @click="delFile(item)"></i>
        </li>
      </ul>
    </div>

    <!-- 如果没有设置type，则都是input -->
    <el-input v-else
              :ref="data.ref"
              :disabled="data.disabled"
              :readonly="data.readonly"
              :clearable="data.clearable"
              :type="data.innerType"
              v-model="formModel[data.code]"></el-input>

  </el-form-item>
</template>

<script>
  import {commonRequest, getCodeTypeData} from '../api/formDesigner_api';
  import {isObjEmpty} from '../util/common.js';

  export default {
    name: 'previewFormItem',
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
      }
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
      }
    },
    watch: {
      // relationPreQueryParam(n, o){
      //   debugger;
      // }
    },
    data () {
      return {
        options: [], // 针对下拉框等的下拉数据
        fileName: '', // 附件名字
        fileList: [], // 附件列表
        USER_UPLOAD_PARAM: null, // 仅对上传组件有用的自定义查询参数
        USER_UPLOAD_SEARCH_LIST_PARAM: null, // 仅对上传组件有用的自定义查询参数
        relationPreQueryParam: {}, // 关联前置查询参数(键值的形式的)
        relationPreQueryParamKeys: {} // 关联前置查询参数(键对应的记录)
      }
    },
    created () {
      // 检查如果有码表配置的，查询其数据
      let {type, optionSetting} = this.data;
      if (optionSetting === 'static') {
        this.options = this.data.optionSetting_options;
      }
      // 码表(调用接口，查询数据)
      else if (optionSetting === 'remote') {
        if (this.data.optionSetting_codeType) {
          this.getCodeTypeList(this.data.optionSetting_codeType);
        }
      }
      // 远程接口 todo 查接口的逻辑还没有写 2021年02月07日18:08:58
      else if (optionSetting === 'remoteUrl') {
        // 如果有前置关联关系设置的，则需要先检查其前置是否有值，有再查询
        // eslint-disable-next-line camelcase
        const optionSetting_tabContent = this.data.optionSetting_tabContent;
        if (optionSetting_tabContent && optionSetting_tabContent.relationSettings &&
          optionSetting_tabContent.relationSettings.values && !isObjEmpty(optionSetting_tabContent.relationSettings.values)) {
          // 整理出查询参数
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
          if (flg) {
            this.getRemoteUrlDatas({
              url: optionSetting_tabContent.remoteUrl.value,
              method: optionSetting_tabContent.remoteMethods.value,
              params: queryParam,
              data: queryParam
            });
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
    },
    mounted () {
      if (this.data.type === 'textarea') {
        this.labelEle = this.$el.getElementsByClassName('el-form-item__label')[0];
        this.contentEle = this.$el.querySelector('.el-form-item__content .el-textarea');
        this.setLabelEleHeight(this.contentEle.offsetHeight + 'px');
      }
    },
    methods: {
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
          debugger;
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
              debugger;
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
              debugger;
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
              if (res && res.data && res.data.ok) {
                this.fileList = res.data.data;
              } else {
                this.fileList = [];
              }
            })
            .catch(e => {
              debugger;
              console.log(e)
            })
        }
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
            debugger
          })
      },

      // 针对配置了数据来源是远程接口的表单项，查询远程接口的数据
      getRemoteUrlDatas ({url, method, params, data}) {
        const that = this;
        commonRequest({
          params: params,
          data: data,
          method: method,
          url: url
        })
          .then(res => {
            // 清空当前的选中值
            this.formModel[this.data.code] = '';
            // 清空当前的下拉数据们
            this.options = [];
            if(res.data && res.data.code == '0000'){
              this.options = res.data.data.data.map(it=>{
                return {
                  label: it.name,
                  value: it.id
                }
              });
            }else{
              this.$message({
                showClose: true,
                message: res.data.codeMsg || res.data.msg || '查询失败',
                duration: 1500,
                type: 'warning'
              });
            }
          })
          .catch(e => {
            this.$message({
              showClose: true,
              message: (e && e.message)? e.message : '查询失败',
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
        if(flg){
          const optionSetting_tabContent = this.data.optionSetting_tabContent;

          this.getRemoteUrlDatas({
            url: optionSetting_tabContent.remoteUrl.value,
            method: optionSetting_tabContent.remoteMethods.value,
            params: this.relationPreQueryParam,
            data: this.relationPreQueryParam
          });
        }
      },

      clearValueAndOptions(){
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
              debugger;
              formItem.relationPreQueryParam[j] = val;
              // 假如该下拉框有选中值，再检查是否关联参数都齐了
              if(val){
                formItem.checkRelationPreQueryParam();
              }
              // 假如该下拉框没有选中值，（比如：点了清空按钮，或者选了没有值的选项），则清掉被关联的值和下拉数据
              else{
                formItem.clearValueAndOptions();
              }
            }
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
