/**
* Created by tangyue on 20/10/23
*/
<template>
  <div
    class="fd-form-item"
    :class="{
          uploadHeight: data.type === 'uploadNewFile'
       }"
  >
    <!--    <div style="color: red;">{{formModel}}</div>-->
    <!--  区分组件类型：type：目前有table\input两种，后续应该还有select等。注意table不是输入型组件,并且table没有label,所以单独提出来  -->
    <template v-if="data.type === 'table'">
      <div
        class="fd-formTable"
        :class="{ empty: !data.tableCols.length }"
        style="margin-bottom:6px"
      >
        <p class="fd-formTable__emptyMsg" v-if="!data.tableCols.length">您尚未为表格设置列数据</p>
        <template v-else>
          <!--  1：是；0：否        -->
          <!-- <div
            v-if="data.showTitleHeader.value === 1"
            class="fd-formTable__toolbox"
          >
            {{ data.title.value }}
          </div>-->
          <h3 style="margin:6px 0;float:left;color:black">{{data.tName}}</h3>
          <div v-if="!data.readonly" style="text-align: right; margin-bottom: 5px">
            <el-button type="primary" round size="mini" @click="addTableRow ">新增行</el-button>
          </div>
          <el-tree
            v-show="treeShow"
            class="tree-box"
            :data="treeData"
            show-checkbox
            ref="tree"
            node-key="label"
            @check-change="checkChange"
            :default-checked-keys="defaultDataArray"
          ></el-tree>
          <el-table
            style="width: 100%"
            ref="tableInForm"
            stripe
            :data="data.tableData"
            header-cell-class-name="fd-formTable__headerItem"
            @header-contextmenu="headerContextmenu"
          >
            <template slot="empty">
              <div class="tableNodata">
                <img src="../assets/images/404_images/nodata.png" alt="#" />
                <span>暂无数据</span>
              </div>
            </template>
            <el-table-column
              v-if="data.showSerial === 1"
              type="index"
              width="50"
              align="center"
              label="序号"
            ></el-table-column>
            <el-table-column
              v-for="(col, index) in tablecolumnCopy"
              :key="index"
              align="center"
              :label="col.label"
              :width="col.width"
              show-overflow-tooltip
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
                      @blur="validateTabColRules(col, col.componentTypeValueAttr, scope.row[col.prop], col.prop)"
                      type="password"
                    ></el-input>
                    <span style="margin-left: 10px" v-else>
                      {{
                      scope.row[col.prop]
                      }}
                    </span>
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
                      @blur="validateTabColRules(col, col.componentTypeValueAttr, scope.row[col.prop], col.prop)"
                      type="number"
                    ></el-input>
                    <span style="margin-left: 10px" v-else>
                      {{
                      scope.row[col.prop]
                      }}
                    </span>
                  </div>
                  <!--自动搜索组件-->
                  <div v-else-if="col.componentTypeValueAttr.dataType.value === 'url'">
                    <el-autocomplete
                      v-if="currentIndex == scope.$index"
                      v-model="scope.row[col.prop]"
                      placeholder="请输入内容"
                      @click.native.stop
                      :disabled="col.componentTypeValueAttr.disabled.value"
                      :readonly="col.componentTypeValueAttr.readonly.value"
                      :clearable="col.componentTypeValueAttr.clearable.value"
                    ></el-autocomplete>
                    <span style="margin-left: 10px" v-else>
                      {{
                      scope.row[col.prop]
                      }}
                    </span>
                  </div>
                  <!-- 默认的文本框展示 -->
                  <div v-else>
                    <el-input
                      v-model="scope.row[col.prop]"
                      v-if="currentIndex == scope.$index"
                      :disabled="col.componentTypeValueAttr.disabled.value"
                      :readonly="col.componentTypeValueAttr.readonly.value"
                      :clearable="col.componentTypeValueAttr.clearable.value"
                      @blur="validateTabColRules(col, col.componentTypeValueAttr, scope.row[col.prop], col.prop)"
                    ></el-input>
                    <span
                      :style="{
                      'margin-left': '10px',
                      'color':(col.componentTypeValueAttr.isURL&&col.componentTypeValueAttr.isURL.value)?'blue':'',
                      'cursor':(col.componentTypeValueAttr.isURL&&col.componentTypeValueAttr.isURL.value)?'pointer':''}"
                      @click="herf(col,scope.row)"
                      v-else
                    >
                      {{
                      scope.row[col.prop]
                      }}
                    </span>
                  </div>
                </div>
                <div v-else-if="col.componentTypeValue === 'select'">
                  <el-select
                    v-model="scope.row[col.prop]"
                    class="el_select_self"
                    v-if="currentIndex == scope.$index"
                    placeholder="请选择"
                    :filterable="col.componentTypeValueAttr.filterable.value"
                    :disabled="col.componentTypeValueAttr.disabled.value"
                    :clearable="col.componentTypeValueAttr.clearable.value"
                    @blur="validateTabColRules(col, col.componentTypeValueAttr, scope.row[col.prop], col.prop)"
                  >
                    <el-option
                      v-for="item in col.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                  <span style="margin-left: 10px" v-else>
                    {{
                    getShowTableLabelForValue(scope.row[col.prop], col.options)
                    }}
                  </span>
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
                    @blur="validateTabColRules(col, col.componentTypeValueAttr, scope.row[col.prop], col.prop)"
                  ></el-input-number>
                  <span style="margin-left: 10px" v-else>
                    {{
                    scope.row[col.prop]
                    }}
                  </span>
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
                    @blur="validateTabColRules(col, col.componentTypeValueAttr, scope.row[col.prop], col.prop)"
                    placeholder="选择日期"
                  ></el-date-picker>
                  <span style="margin-left: 10px" v-else>
                    {{
                    getShowTableTextForDate(scope.row[col.prop], col.componentTypeValueAttr)
                    }}
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              v-if="!data.tableCols[data.tableCols.length - 1].isHide"
              label="操作"
              :width="data.tableCols[data.tableCols.length - 1].width||200"
              align="center"
            >
              <template slot-scope="scope">
                <span v-if="currentIndex == scope.$index">
                  <el-button type="text" size="small" @click="handleUse(scope.$index, scope.row)">应用</el-button>
                  <el-button
                    type="text"
                    size="small"
                    @click="handleCancel(scope.$index, scope.row)"
                  >取消</el-button>
                </span>
                <span v-else>
                  <el-button
                    v-if="data.tableCols[data.tableCols.length - 1].showEditBtnForOperation&&!data.readonly"
                    type="text"
                    size="small"
                    @click="handleEdit(scope.$index, scope.row)"
                  >编辑</el-button>
                  <el-button
                    v-if="data.tableCols[data.tableCols.length - 1].showDelBtnForOperation&&!data.readonly"
                    @click="handleDelete(scope.$index)"
                    type="text"
                    size="small"
                  >删除</el-button>
                </span>
                <!--新增按钮功能-->
                <span class="ml-sm">
                  <el-button
                    v-for="(item, index) in data.tableCols[data.tableCols.length - 1].buttonList"
                    :key="index"
                    type="text"
                    size="small"
                    :disabled="data.readonly&&item.code!='scan'"
                    @click="dealFuncStr(item, index,scope.row)"
                    v-if="scope.row[item.code]&&(item.code == 'scan' && data.tableCols[data.tableCols.length - 1].showScanBtnForOperation || (item.code != 'scan'&&!data.readonly))"
                  >{{item.name}}</el-button>
                </span>
              </template>
            </el-table-column>
          </el-table>
          <div v-if="data.isPagination" class="pagination">
            <el-pagination
              :page-sizes="[10, 20, 30, 50, 100]"
              :page-size="page.limit"
              background
              layout="sizes, total ,slot"
              :total="page.total"
              @size-change="sizeChange"
            >
              <span>（右键点击表头可编辑列）</span>
            </el-pagination>
            <el-pagination
              :current-page.sync="page.current"
              :page-sizes="[10, 20, 30, 50, 100]"
              :page-size="page.limit"
              background
              layout="prev, pager, next, jumper"
              :total="page.total"
              @current-change="currentChange"
            />
          </div>
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
      <div style="min-height:200px;border:1px solid #b9c2dd" v-html="data.htmlValue"></div>
    </template>
    <!--  (预览模式不要附件，编辑模式有附件，但附件的样式是特殊的)  -->
    <!-- //TODO 这个属性有变化，还没有改这里   -->
    <el-form-item
      v-else-if="data.type !== 'uploadNewFile' || (data.type === 'uploadNewFile' && !view)"
      :prop="data.code"
      :label="data.label"
      :class="data.className"
      :style="{
            'marginBottom': data.type === 'dividingLine'? 0 : lineMarginBottom + 'px'
          }"
      :rules="itemRules"
    >
      <!-- 选择人员树组件 -->
      <template v-if="data.type==='user'">
        <el-form-item class="form-item suffix-button" prop="paramExpress">
          <el-input
            clearable
            :disabled="data.disabled"
            v-model="data.defaultName"
            @clear="clearExpress"
            v-on:click.native.stop="openPerRoleDialog()"
          ></el-input>
          <!-- <el-button
            size="mini"
            type="danger"
            circle
            title="清除"
             :disabled="data.disabled"
            icon="el-icon-delete"
            style="margin-bottom: 22px;margin-left:4px"
             @click="clearExpress()"
          ></el-button>-->
        </el-form-item>
      </template>

      <!-- 新选择人员树组件 -->
      <template v-else-if="data.type==='newUser'">
        <el-form-item>
          <el-input
            :disabled="data.disabled"
            v-model="data.defaultName"
            :clearable="data.clearable"
            v-on:click.native.stop="openNewPerRoleDialog(data.isMultiple)"
            @clear="clearExpress"
          ></el-input>
          <!-- <el-button
            size="mini"
            type="danger"
            circle
             :disabled="data.disabled.value"
            title="清除"
            icon="el-icon-delete"
            style="margin-bottom: 22px;margin-left:4px"
          @click="clearExpress()"-->
          <!-- ></el-button> -->
        </el-form-item>
      </template>

      <!-- 下拉树组件 -->
      <template v-else-if="data.type==='tree'">
        <el-form-item class="form-item suffix-button" prop="paramExpress">
          <selectTree
            nodeKey="value"
            :treeProps="treeProps"
            :data="data"
            :lazy="false"
            :staticTreeData="options"
            :formModel="formModel"
            :formModelCn="formModelCn"
          ></selectTree>
        </el-form-item>
      </template>
      <!-- 弹出框下拉树组件 -->
      <template v-else-if="data.type=='treeBox'">
        <el-form-item class="form-item suffix-button" prop="paramExpress">
          <el-input
            :clearable="data.clearable"
            :disabled="data.disabled"
            v-model="data.defaultValueArr"
            @clear="clearGogroup"
            @click.native.stop="openFrameTreeDialog()"
          ></el-input>
        </el-form-item>
      </template>
      <!--  区分输入组件的类型      -->
      <!--   多行文本     -->
      <el-input
        v-else-if="data.type === 'textarea'"
        :ref="data.ref"
        v-model="formModel[data.code]"
        type="textarea"
        :rows="data.rows"
        resize="none"
        autosize
        :disabled="data.disabled"
        :readonly="data.readonly"
        :clearable="data.clearable"
        @click.native="inputClickHand"
        @change="inputChangeHand"
        @focus="inputFocusHand"
        @blur="inputBlurHand"
      ></el-input>
      <!--   单选组     -->
      <el-radio-group
        v-else-if="data.type === 'radio'"
        :ref="data.ref"
        v-model="formModel[data.code]"
        :disabled="data.disabled"
        :readonly="data.readonly"
        :clearable="data.clearable"
        @change="selectChangeHand"
        @click.native="inputClickHand"
        @focus="inputFocusHand"
        @blur="inputBlurHand"
      >
        <el-radio v-for="radio in options" :key="radio.value" :label="radio.value">{{radio.label}}</el-radio>
      </el-radio-group>

      <!--   多选组   -->
      <el-checkbox-group
        v-else-if="data.type === 'checkbox'"
        :ref="data.ref"
        v-model="formModel[data.code]"
        :disabled="data.disabled"
        :readonly="data.readonly"
        :clearable="data.clearable"
        @click.native="inputClickHand"
        @change="inputChangeHand"
        @focus="inputFocusHand"
        @blur="inputBlurHand"
      >
        <el-checkbox
          v-for="(check, index) in options"
          :key="index"
          :label="check.value"
        >{{check.label}}</el-checkbox>
      </el-checkbox-group>

      <!--   评分     -->
      <el-rate
        v-else-if="data.type === 'rate'"
        :ref="data.ref"
        v-model="formModel[data.code]"
        :disabled="data.disabled"
        :readonly="data.readonly"
        :clearable="data.clearable"
        @click.native="inputClickHand"
        @change="inputChangeHand"
        @focus="inputFocusHand"
        @blur="inputBlurHand"
      ></el-rate>

      <!--   下拉框     -->
      <el-select
        v-else-if="data.type === 'select'"
        :ref="data.ref"
        v-model="formModel[data.code]"
        :disabled="data.disabled"
        :clearable="data.clearable"
        :filterable="data.filterable"
        :multiple="data.multiple==true"
        collapse-tags
        @change="selectChangeHand"
        @click.native="inputClickHand"
        @focus="inputFocusHand"
        @blur="inputBlurHand"
      >
        <el-option
          v-for="item in data.options||options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>

      <!--  日期选择器      -->
      <el-date-picker
        v-else-if="data.type === 'datePicker'"
        :ref="data.ref"
        v-model="formModel[data.code]"
        :type="data.innerType"
        :format="data.isCustormFormat? data.custormFormat : data.format"
        :value-format="data.isCustormValueFormat ? data.custormValueFormat : data.valueFormat"
        :disabled="data.disabled"
        :readonly="data.readonly"
        :clearable="data.clearable"
        @click.native="inputClickHand"
        @change="inputChangeHand"
        @focus="inputFocusHand"
        @blur="inputBlurHand"
      ></el-date-picker>

      <!--  时间选择器      -->
      <el-time-picker
        v-else-if="data.type === 'timePicker'"
        :ref="data.ref"
        v-model="formModel[data.code]"
        :format="data.isCustormFormat? data.custormFormat : data.format"
        :value-format="data.isCustormValueFormat ? data.custormValueFormat : data.valueFormat"
        :disabled="data.disabled"
        :readonly="data.readonly"
        :clearable="data.clearable"
        @click.native="inputClickHand"
        @change="inputChangeHand"
        @focus="inputFocusHand"
        @blur="inputBlurHand"
      ></el-time-picker>

      <!--  时间范围选择器      -->
      <el-time-picker
        v-else-if="data.type === 'timePickerRange'"
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
        @click.native="inputClickHand"
        @change="inputChangeHand"
        @focus="inputFocusHand"
        @blur="inputBlurHand"
      ></el-time-picker>
      <!--  按钮     (按钮只有一个click事件) -->
      <el-button
        v-else-if="data.type === 'button'"
        :ref="data.ref"
        :type="data.innerType"
        :round="data.round"
        :circle="data.circle"
        :icon="data.icon"
        :size="data.size"
        :disabled="data.disabled || counting"
        :class="{'auto-width': data.fixParentWidth}"
        @click.native="inputClickHand"
      >
        <template v-if="data.defaultValue">{{data.defaultValue}}</template>
        <span v-if="counting" class="countdown">({{countNumber}})</span>
      </el-button>

      <!--  分割线  -->
      <div
        v-else-if="data.type === 'dividingLine'"
        class="fd-formItem__dividingLine"
        :style="{
                'height': data.thickness + 'px',
                'background': data.color,
                'marginTop': data.marginTop + 'px',
                'marginBottom': data.marginBottom + 'px',
                'marginLeft': '-' + labelWidth + 'px'
             }"
      >
        <template v-if="formModel[data.code]">{{formModel[data.code]}}</template>
      </div>

      <!--   上传附件   -->
      <div
        v-else-if="data.type === 'uploadFile'&&isHistory!='isHistory'"
        class="fd-formItem__upload-file"
      >
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
            <a
              class="file-detail"
              :href="getDownURL(item, data.disabled)"
              download
              title="下载"
            >{{item.name}}</a>
            <i class="el-icon-delete file-del-icon" @click="delFile(item)"></i>
          </li>
        </ul>
      </div>
      <template v-else-if="data.type === 'uploadNewFile'">
        <!-- 新附件上传 -->
        <el-upload
          v-if="isHistory!='isHistory'"
          class="upload-demo"
          action="string"
          ref="newFile"
          :show-file-list="false"
          :auto-upload="true"
          :http-request="uploadNewFile"
          :disabled="data.disabled"
          :multiple="data.isMultiple"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <ul class="el-upload-list file-template el-upload-list--text" @click.stop="()=>{}">
            <li
              class="el-upload-list__item is-ready"
              v-for="(fileItem, fileIndex) in fileTemplate"
              :key="fileIndex"
            >
              <a class="el-upload-list__item-name" :href="getDownURL(fileItem)" download title="下载">
                <i class="el-icon-document"></i>
                {{fileItem.name}}
              </a>
            </li>
          </ul>
          <div
            class="el-upload__tip"
            @click.stop="()=>{}"
          >只能上传{{data.upLoadFileType.join("、")}}文件，且不超过{{data.fileUploadSize}}KB</div>
          <ul class="el-upload-list el-upload-list--text" @click.stop="()=>{}">
            <li
              class="el-upload-list__item is-ready"
              v-for="(fileItem, fileIndex) in fileList"
              :key="fileIndex"
            >
              <a
                class="el-upload-list__item-name"
                :href="getDownURL(fileItem, data.disabled)"
                download
                title="下载"
              >
                <i class="el-icon-document"></i>
                {{fileItem.name}}
              </a>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click.stop="deleteFile(fileItem)"
              ></el-button>
            </li>
          </ul>
        </el-upload>
      </template>

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
        :min="data.minValue || 0"
        :max="data.maxValue || 0"
        @click.native="inputClickHand"
        @change="inputChangeHand"
        @focus="inputFocusHand"
        @blur="inputBlurHand"
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
        :options="options && options.length? options[0].children : []"
        @change="selectCascaderChange($event, data)"
        @click.native="inputClickHand"
        @focus="inputFocusHand"
        @blur="inputBlurHand"
      ></el-cascader>

      <!--   业务公共字段-操作人当前角色  （有input和select两种）   -->
      <template v-else-if="data.fieldType === 'userRole'">
        <el-select
          v-if="data.showType === 'select'"
          :ref="data.ref"
          v-model="formModel[data.code]"
          :disabled="data.disabled"
          :readonly="data.readonly"
          :clearable="data.clearable"
          @change="selectChangeHand"
          @click.native="inputClickHand"
          @focus="inputFocusHand"
          @blur="inputBlurHand"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>

        <el-input
          v-else
          :ref="data.ref"
          v-model="formModel[data.code]"
          :disabled="data.disabled"
          :readonly="data.readonly"
          :clearable="data.clearable"
          @click.native="inputClickHand"
          @change="inputChangeHand"
          @focus="inputFocusHand"
          @blur="inputBlurHand"
        ></el-input>
      </template>

      <!--   业务公共字段-流水号     -->
      <el-input
        v-else-if="data.type === 'sheetFlowCode'"
        :ref="data.ref"
        v-model="formModel[data.code]"
        :disabled="data.disabled"
        :readonly="data.readonly"
        :clearable="data.clearable"
        @click.native="inputClickHand"
        @change="inputChangeHand"
        @focus="inputFocusHand"
        @blur="inputBlurHand"
      ></el-input>

      <!--   业务公共字段-操作人     -->
      <el-input
        v-else-if="data.type === 'operator'"
        :ref="data.ref"
        v-model="formModel[data.code]"
        :disabled="data.disabled"
        :readonly="data.readonly"
        :clearable="data.clearable"
        @click.native="inputClickHand"
        @change="inputChangeHand"
        @focus="inputFocusHand"
        @blur="inputBlurHand"
      ></el-input>

      <!--   业务公共字段-操作人部门     -->
      <el-input
        v-else-if="data.type === 'operatorDept'"
        :ref="data.ref"
        v-model="formModel[data.code]"
        :disabled="data.disabled"
        :readonly="data.readonly"
        :clearable="data.clearable"
        @click.native="inputClickHand"
        @change="inputChangeHand"
        @focus="inputFocusHand"
        @blur="inputBlurHand"
      ></el-input>
      <!--   业务公共字段-操作人联系方式     -->
      <el-input
        v-else-if="data.type === 'operatorMobile'"
        :ref="data.ref"
        v-model="formModel[data.code]"
        :disabled="data.disabled"
        :readonly="data.readonly"
        k
        :clearable="data.clearable"
        @click.native="inputClickHand"
        @change="inputChangeHand"
        @focus="inputFocusHand"
        @blur="inputBlurHand"
      ></el-input>

      <!--   业务公共字段-操作时间     -->
      <el-date-picker
        v-else-if="data.type === 'operateTime'"
        :ref="data.ref"
        :format="data.format||'yyyy-MM-dd HH:mm:ss'"
        :value-format="data.format||'yyyy-MM-dd HH:mm:ss'"
        v-model="formModel[data.code]"
        type="datetime"
        :disabled="data.disabled"
        :computereadonly="data.readonly"
        @click.native="inputClickHand"
        @change="inputChangeHand"
        @focus="inputFocusHand"
        @blur="inputBlurHand"
      ></el-date-picker>

      <!-- 如果没有设置type，则都是input --start-- -->
      <template v-else>
        <!-- 搜索 -->
        <el-autocomplete
          v-if="data.isAutocompletable"
          v-model="formModel[data.code]"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入内容"
          @select="handleSelect"
          :disabled="data.disabled"
          :readonly="data.readonly"
          @click.native="inputClickHand"
          @change="inputChangeHand"
          @focus="inputFocusHand"
          @blur="inputBlurHand"
        ></el-autocomplete>

        <el-input
          v-else-if="data.validationSetting && data.validationSetting.dataType.value === 'number'"
          :ref="data.ref"
          :disabled="data.disabled"
          :readonly="data.readonly"
          :clearable="data.clearable"
          type="number"
          v-model.number="formModel[data.code]"
          @click.native="inputClickHand"
          @change="inputChangeHand"
          @focus="inputFocusHand"
          @blur="inputBlurHand"
        ></el-input>
        <el-input
          v-else-if="data.validationSetting && data.validationSetting.dataType.value === 'password'"
          :ref="data.ref"
          :disabled="data.disabled"
          :readonly="data.readonly"
          :clearable="data.clearable"
          type="password"
          v-model="formModel[data.code]"
          @click.native="inputClickHand"
          @change="inputChangeHand"
          @focus="inputFocusHand"
          @blur="inputBlurHand"
        ></el-input>
        <el-input
          v-else
          :ref="data.ref"
          :disabled="data.disabled"
          :readonly="data.readonly"
          :clearable="data.clearable"
          v-model="formModel[data.code]"
          @click.native="inputClickHand"
          @change="inputChangeHand"
          @focus="inputFocusHand"
          @blur="inputBlurHand"
        ></el-input>
      </template>

      <!-- 如果没有设置type，则都是input --end-- -->
      <personEditDialog ref="personEditDialog" @personSure="personSure"></personEditDialog>
      <!-- <rogroupEditDialog

      ref="rogroupEditDialog"
      @rogroup="rogroup"
      ></rogroupEditDialog>-->
    </el-form-item>
    <!--新版选人组件弹出框-->
    <newPersonEditDialog
      ref="newPersonEditDialog"
      :sourceTreeList="data.treeTabList ? data.treeTabList.selectedList : []"
      :isMultiple="data.isMultiple ? data.isMultiple.value : false"
      @personSure="personSure"
    ></newPersonEditDialog>
    <CusDialog
      ref="cusDialog"
      :visible.sync="visible"
      :appendToBody="true"
      :title="diaformTitle"
      :closeOnClickModal="true"
      width="65%"
      @cancel="cancel"
      @confirm="confirm"
    >
      <tableDialog :DialogattrData="DialogattrData"></tableDialog>
    </CusDialog>
    <!-- 弹出框下拉树 -->
    <frameTree ref="frameTree" :staticTreeData="options" @showFrameValue="showFrameValue"></frameTree>
    <MessageBox
      :showMessage.sync="MessageConfig.showMessage"
      :MessageConfig="MessageConfig"
      @checkyes="checkyesDel"
      @checkno="checkDeleteNo"
    ></MessageBox>
  </div>
</template>

<script>
const downloadServiceUrl =
  window.g && window.g.downloadServiceUrl ? window.g.downloadServiceUrl : "";
const FORM_IMG_URL =
  window.g && window.g.formImgUrl
    ? window.g.formImgUrl
    : "http://192.168.11.203:9000";

import moment from "moment";
import wangEditor from "wangeditor";
import {
  commonRequest,
  getCodeTypeData,
  getNames,
  uploadFiles,
  getPointCodeSheetData,
  getUploadedFileList,
  getAllFiles,
  delFileNew,
  getFormTableSqlList,
  getFormTableSqlPage,
  getFormTablesPage,
  getFormTablesList,
  getFrameTreeDataById,
} from "../api/formDesigner_api";
import { isObjEmpty, validateRegType } from "../util/common.js";
import MessageBox from "./MessageBox.vue";
import selectTree from "./selectTree";
import frameTree from "./frameTree";
import personEditDialog from "./personEditDialog.vue";
import CusDialog from "./CusDialog/index";
import newPersonEditDialog from "./newPersonEditDialog";
import rogroupEditDialog from "./rogroupEditDialog.vue";
import tableDialog from "./tableDialog.vue";
import { baseUrl } from "../api/commonUrl";
export default {
  name: "previewFormItem",
  components: {
    MessageBox,
    personEditDialog,
    newPersonEditDialog,
    rogroupEditDialog,
    selectTree,
    frameTree,
    CusDialog,
    tableDialog,
  },
  props: {
    // 是否为预览模式，模式是编辑模式啦
    view: {
      type: Boolean,
      default: false,
    },
    formModel: {
      type: Object,
      default() {
        return {};
      },
    },
    formModelCn: {
      type: Object,
      default: () => {},
    },
    formModelCnFlag: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default() {
        return {};
      },
    },
    labelWidth: {
      type: [Number, String],
      default: 0,
    },
    version: {
      type: [Number, String],
      default: "",
    },
    //用于流转信息隐藏附件上传
    isHistory: {
      type: String,
      default: "",
    },
    // 表单的id
    boId: {
      type: [Number, String],
      default: null,
    },
    //link表单的code
    linkFormCode: {
      type: [Number, String],
      default: null,
    },
    lineMarginBottom: {
      type: Number,
      default: 0,
    },
    rules: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    componentRootForm() {
      let parent = this.$parent;
      let parentName = parent.$options.name;
      while (parentName !== "previewForm") {
        parent = parent.$parent;
        parentName = parent.$options.name;
      }
      return parent;
    },
    componentFormContainer() {
      let parent = this.$parent;
      let parentName = parent.$options.name;
      while (parentName !== "previewFormContainer") {
        parent = parent.$parent;
        parentName = parent.$options.name;
      }
      return parent;
    },
    sqlData() {
      let obj = {
        formCode: this.$route.query.formCode,
        version: this.version,
        map: {},
        tableCode: this.data.code,
        linkFormCode: this.linkFormCode,
      };

      this.data.optionSetting_tabContent.queryParams.forEach((item) => {
        if (item.formItem == "constant") {
          obj.map[item.paramName] = item.defaultValue;
        } else {
          //有linkFormCode，是子表单，子表单里的表格要用主表单里的元素
          if (this.linkFormCode) {
            let mainFormModel = JSON.parse(
              sessionStorage.getItem("mainFormModel")
            );
            obj.map[item.paramName] = mainFormModel[item.paramName];
          } else {
            obj.map[item.paramName] = this.formModel[item.paramName];
          }
        }
      });
      return obj;
    },
    tableParams() {
      let obj = {
        boId: this.boId,
        formCode: this.$route.query.formCode,
        version: this.version,
        tableCode: this.data.code,
      };
      return obj;
    },
    itemRules: {
      get() {
        let rule = [];
        if (!this.data.hidden) {
          if (
            this.rules &&
            this.rules[this.data.code] &&
            this.rulesEle instanceof Array
          ) {
            rule = [...this.rulesEle, ...this.rules[this.data.code]];
          } else if (this.rules && this.rules[this.data.code]) {
            rule = [...this.rules[this.data.code]];
          } else if (this.rulesEle instanceof Array) {
            rule = [...this.rulesEle];
          }

          return rule;
        }
      },
      set(val) {
        console.log("set", val);
      },
    },
  },
  watch: {
    editorTxt: {
      handler(n, o) {
        this.editor.txt.html(this.formModel[this.data.code]);
      },
      deep: true,
    },
    "data.disabled"(n, o) {
      if (this.data.type == "richText") {
        if (n) {
          this.editor.$textElem.attr("contenteditable", false);
        } else {
          this.editor.$textElem.attr("contenteditable", true);
        }
      }
    },
    formModel: {
      handler(n, o) {
        if (this.formModelCnFlag) {
          if (this.data && this.data.type && this.formModel[this.data.code]) {
            if (this.data.type == "checkbox") {
              let obj = [];
              this.formModel[this.data.code].forEach((it) => {
                this.options.forEach((item) => {
                  if (it == item.value) {
                    obj.push(item.label);
                  }
                });
              });
              this.formModelCn[this.data.code] = obj.join();
            } else if (this.data.type == "cascader"&&this.options.length) {
              let label = [];
              let fn = (ele, item) => {
                ele.forEach((it) => {
                  if (it.value == item) {
                    label.push(it.label);
                  } else if (it.children && it.children.length > 0) {
                    fn(it.children, item);
                  }
                });
              };
              this.formModel[this.data.code].forEach((item) => {
                fn(this.options, item);
              });
              this.formModelCn[this.data.code] = label.join();
            } else if (this.data.type == "select"||this.data.showType === 'select') {
              if (this.data.multiple == true) {
                let obj = [];
                this.formModel[this.data.code].forEach((it) => {
                  this.options.forEach((item) => {
                    if (it == item.value) {
                      obj.push(item.label);
                    }
                  });
                });
                this.formModelCn[this.data.code] = obj.join();
              } else {
                this.options.forEach((item) => {
                  if (item.value == this.formModel[this.data.code]) {
                    this.formModelCn[this.data.code] = item.label;
                  }
                });
              }
            }
          }
        }
      },
      deep: true,
    },
    options: {
      handler(n, o) {
        if (this.formModelCnFlag) {
          if (n.length > 0) {
          if (this.data && this.data.type && this.formModel[this.data.code]) {
            if (this.data.type == "checkbox") {
              let obj = [];
              this.formModel[this.data.code].forEach((it) => {
                this.options.forEach((item) => {
                  if (it == item.value) {
                    obj.push(item.label);
                  }
                });
              });
              this.formModelCn[this.data.code] = obj.join();
            } else if (this.data.type == "cascader") {
              let label = [];
              let fn = (ele, item) => {
                ele.forEach((it) => {
                  if (it.value == item) {
                    label.push(it.label);
                  } else if (it.children && it.children.length > 0) {
                    fn(it.children, item);
                  }
                });
              };
              this.formModel[this.data.code].forEach((item) => {
                fn(this.options, item);
              });
              this.formModelCn[this.data.code] = label.join();
            } else if (this.data.type == "select"||this.data.showType === 'select'){
              if (this.data.multiple == true) {
                let obj = [];
                this.formModel[this.data.code].forEach((it) => {
                  this.options.forEach((item) => {
                    if (it == item.value) {
                      obj.push(item.label);
                    }
                  });
                });
                this.formModelCn[this.data.code] = obj.join();
              } else  {
                this.options.forEach((item) => {
                  if (item.value == this.formModel[this.data.code]) {
                    this.formModelCn[this.data.code] = item.label;
                  }
                });
              }
            }
          }
          }
        }
      },
      deep: true,
    },
    'data.hidden'(n, o){
      if(!n && this.data.type === 'textarea'){
       this.setLabelEleHeight(this.contentEle.offsetHeight + "px");
      }
    },
  },
  data() {
    return {
      moment: moment,
      options: [], // 针对下拉框等的下拉数据
      fileName: "", // 附件名字
      fileTemplate: [], //附件模板
      fileList: [], // 附件列表
      USER_UPLOAD_PARAM: null, // 仅对上传组件有用的自定义查询参数
      USER_UPLOAD_SEARCH_LIST_PARAM: null, // 仅对上传组件有用的自定义查询参数
      relationPreQueryParam: {}, // 关联前置查询参数(键值的形式的)
      relationPreQueryParamKeys: {}, // 关联前置查询参数(键对应的记录)
      rulesEle: [],
      tableData: [], //表格数据
      currentIndex: null, //用于行内编辑
      delRolIndex: null, //用于删除
      MessageConfig: {
        showMessage: false, //打开消息提示框
        MsgBoxType: "", //消息提示框类型
        MsgText: "",
      },
      formSetting: [], //表单元素状态控制
      editor: null,
      editorHtml: "",
      editorFlag: true,
      formCode: "",
      editorTxt: "",
      // 下拉树组件的props属性
      treeProps: {
        label: "label",
        children: "children",
        isLeaf: "leaf",
      },
      page: {
        total: 0,
        limit: 10,
        page: 1,
      },
      treeShow: false, //是否展示表头列筛选
      treeData: [], //表头列筛选数据
      defaultDataArray: [],
      tablecolumnCopy: [],
      visible: false,
      diaformTitle: "详情", //dialog框信息标题
      DialogattrData: [], //dialog表单信息
      counting: false, // 正在倒计时
      countNumber: 0,
      TIMER: null,
    };
  },
  created() {
    // 检查如果有码表配置的，查询其数据
    let { type, optionSetting, validationSetting, formSetting_children } = this.data;
    if (optionSetting === "static") {
      let newList = [];
      this.data.optionSetting_tabContent.forEach((it) => {
        if (it.label && it.label.value) {
          newList.push({
            label: it.label.value,
            value: it.value.value,
          });
        }
      });
      this.options = newList;
    }
    // 码表(调用接口，查询数据)
    else if (optionSetting === "remote") {
      if (this.data.optionSetting_codeType) {
        this.getCodeTypeList(this.data.optionSetting_codeType);
      }
    }
    // 字典表
    else if (optionSetting === "remoteDict") {
      const optionSetting_tabContent = this.data.optionSetting_tabContent;
      if (
        optionSetting_tabContent &&
        optionSetting_tabContent.relationSettings &&
        optionSetting_tabContent.relationSettings.values &&
        !isObjEmpty(optionSetting_tabContent.relationSettings.values)
      ) {
        // 整理出查询参数
        let queryP = this.getRelationQueryParams(optionSetting_tabContent);
        console.log("queryP" + queryP, this.data);
        if (queryP) {
          this.getRemoteUrlDatas({
            url:
              optionSetting_tabContent.remoteUrl &&
              optionSetting_tabContent.remoteUrl.value
                ? optionSetting_tabContent.remoteUrl.value
                : "/admin/sysdict/list",
            method:
              optionSetting_tabContent.remoteMethods &&
              optionSetting_tabContent.remoteMethods.value
                ? optionSetting_tabContent.remoteMethods.value
                : "get",
            ...queryP,
            // params: queryParam,
            // data: queryParam
          });
        }
      } else {
        this.getRemoteUrlDatas({
          url:
            optionSetting_tabContent.remoteUrl &&
            optionSetting_tabContent.remoteUrl.value
              ? optionSetting_tabContent.remoteUrl.value
              : "/admin/sysdict/list",
          method:
            optionSetting_tabContent.remoteMethods &&
            optionSetting_tabContent.remoteMethods.value
              ? optionSetting_tabContent.remoteMethods.value
              : "get",
          params: {
            parentValue: optionSetting_tabContent.codeType.value || "root", // 这是我们字典后端接的查询参数
          },
        });
      }
    }
    // 远程接口（初版）
    else if (optionSetting === "remoteUrl") {
      // 如果有前置关联关系设置的，则需要先检查其前置是否有值，有再查询
      // eslint-disable-next-line camelcase
      const optionSetting_tabContent = this.data.optionSetting_tabContent;
      if (
        optionSetting_tabContent &&
        optionSetting_tabContent.relationSettings &&
        optionSetting_tabContent.relationSettings.values &&
        !isObjEmpty(optionSetting_tabContent.relationSettings.values)
      ) {
        // 整理出查询参数
        let queryP = this.getRelationQueryParams(optionSetting_tabContent);

        if (queryP) {
          try {
            this.getRemoteUrlDatas({
              url: optionSetting_tabContent.remoteUrl.value,
              method: optionSetting_tabContent.remoteMethods.value,
              ...queryP,
            });
          } catch (e) {}
        }
      }
      // 没有配置前置关联查询参数，则现在就查询后台接口
      else {
        this.getRemoteUrlDatas({
          url: optionSetting_tabContent.remoteUrl.value,
          method: optionSetting_tabContent.remoteMethods.value,
        });
      }
    }
    //获取表格数据(建表)
    else if (this.data.type == "table" && this.data.isCreateDataBaseTable) {
      if (this.data.isPagination) {
        this.getFormTablesPage();
      } else {
        this.getFormTablesList();
      }
    }
    // 远程接口（2版）
    else if (optionSetting === "remoteUrl2") {
      // todo 前置关联还没有加入
      // 如果有前置关联关系设置的，则需要先检查其前置是否有值，有再查询
      // eslint-disable-next-line camelcase
      if (this.data.type == "table" && this.data.isCreateDataBaseTable) {
      } else if (this.data.type != "treeBox") {
        const optionSetting_tabContent = JSON.parse(
          JSON.stringify(this.data.optionSetting_tabContent)
        );
        if (
          optionSetting_tabContent &&
          optionSetting_tabContent.relationSettings &&
          optionSetting_tabContent.relationSettings.values &&
          !isObjEmpty(optionSetting_tabContent.relationSettings.values) &&
          !this.formModel[this.data.code]
        ) {
          this.getRelationQueryParams(optionSetting_tabContent);
        } else {
          // // 没有配置前置关联查询参数，则现在就查询后台接口
          // 处理queryParams，拼接查询参数
          let params = {};
          let data = {};
          let headers = {};
          for (
            let i = 0, len = optionSetting_tabContent.queryParams.length;
            i < len;
            i++
          ) {
            let it = optionSetting_tabContent.queryParams[i];
            // 空键名的不要
            if (!it.paramName) {
              break;
            }
            if (
              !it.defaultValue &&
              optionSetting_tabContent &&
              optionSetting_tabContent.relationSettings &&
              optionSetting_tabContent.relationSettings.values &&
              !isObjEmpty(optionSetting_tabContent.relationSettings.values) &&
              this.formModel[this.data.code]
            ) {
              this.getRelationQueryParams(optionSetting_tabContent);
              it.defaultValue =
                this.formModel[
                  optionSetting_tabContent.relationSettings.values.parentValue[1]
                ];
            }
            if (it.paramType === "params") {
              params[it.paramName] = it.defaultValue;
            } else if (it.paramType === "body") {
              data[it.paramName] = it.defaultValue;
            } else if (it.paramType === "header") {
              headers[it.paramName] = it.defaultValue;
            }
          }
          optionSetting_tabContent.url &&
            this.getRemoteUrlDatas({
              url: optionSetting_tabContent.url,
              method: optionSetting_tabContent.method,
              data: data,
              params: params,
              headers: headers,
              successCallback: optionSetting_tabContent.successCallback,
            });
        }
      }
    }
    //获取表格数据(sql)
    else if (
      optionSetting === "sqlConfigure" &&
      !this.data.isCreateDataBaseTable
    ) {
      if (this.data.isPagination) {
        this.getFormTableSqlPage();
      } else {
        this.getFormTableSqlList();
      }
    }
    //获取表格数据(建表)
    // else if (
    //   optionSetting === "sqlConfigure" &&
    //   this.data.isCreateDataBaseTable
    // ) {
    //   if (this.data.isPagination) {
    //     this.getFormTablesPage();
    //   } else {
    //     this.getFormTablesList();
    //   }
    // }
    // 判断是否有控制表单元素状态的下拉框
    if (formSetting_children) {
      this.formSetting = formSetting_children;
    }

    // 检查是否有配置校验规则(前提是：不使用用户自定义的规则)
    if (this.componentRootForm.useCustormRule) {
      if (validationSetting) {
        let rules = [];
        // 必填
        if (validationSetting.required && validationSetting.required.selected) {
          // 区分输入组件的类型，书写不同的触发模式
          let triggerType = "blur";
          if (this.data.type === "calcNumber" || this.data.type === "select") {
            triggerType = ["change", "blur"];
          }
          rules.push({
            required: true,
            message: "请输入必填信息",
            trigger: triggerType,
          });
        }
        // 数据类型
        if (validationSetting.dataType && validationSetting.dataType.selected) {
          let validationDataValue = validationSetting.dataType.value;
          let txt = "";
          for (let i = 0, len = validationSetting.dataType.options.length; i < len; i++) {
            let child = validationSetting.dataType.options[i];
            if (child.value === validationDataValue) {
              txt = child.label;
            }
          }
          if (validationDataValue === "password") {
          }
          // 手机类型的，给它整个正则校验
          else if (validationDataValue === "mobile") {
            rules.push({
              pattern: eval("/^(1)\\d{10}$/"),
              message: "手机格式不正确",
            });
          }
          // 其他类型的，用 elementui 自己的校验配置的type即可
          else if(validationDataValue === 'number'){
            // 假如当前的值不是number，则转为number
            if(!this.formModel[this.data.code]){
              this.formModel[this.data.code] = 0
            }else if(typeof this.formModel[this.data.code] === 'string'){
              this.formModel[this.data.code] = Number(this.formModel[this.data.code]);
            }
            rules.push({
              type: validationDataValue,
              message: `仅限${txt}类型`,
            });
          }
          else if (validationDataValue === 'string') {
            // 假如当前的值不是string，则转为string(目前场景只转number就行了)
            if (typeof this.formModel[this.data.code] === 'number') {
              this.formModel[this.data.code] = String(this.formModel[this.data.code]);
            }
            rules.push({
              type: validationDataValue,
              message: `仅限${txt}类型`,
            });
          }
          else {
            rules.push({
              type: validationDataValue,
              message: `仅限${txt}类型`,
            });
          }
        }

        // 自定义正则
        if (
          validationSetting.regExpPattern &&
          validationSetting.regExpPattern.selected &&
          validationSetting.regExpPattern.value
        ) {
          try {
            // eslint-disable-next-line no-eval
            let _value = eval(validationSetting.regExpPattern.value);
            rules.push({
              pattern: _value,
              message: `错误格式(${validationSetting.regExpPattern.value})`,
            });
          } catch (e) {
            console.log("错误的正则表达式:", e);
          }
        }

        // 长度控制
        if (validationSetting.lengthControl && validationSetting.lengthControl.selected) {
          let min = validationSetting.lengthControl.min;
          let max = validationSetting.lengthControl.max;
          if (max && max !== min) {
            // 特殊处理，因为我们的傻逼业务，数字的情况如果有长度控制，就转为str取length
            if (validationSetting.dataType.value === 'number'){
              rules.push({
                validator: function(rule, value, callback){
                  let length = String(value).length;
                  if(length >= min && length <= max){
                    callback();
                  }else{
                    callback(new Error(`长度在 ${min} 到 ${max} 个字符`));
                  }
                }
              });
            }else{
              rules.push({
                min: min,
                max: max,
                message: `长度在 ${min} 到 ${max} 个字符`,
              });
            }
          }
        }
        this.rulesEle = rules;
      }
    }
    if (this.data.type == "treeBox") {
      this.data.defaultValue = this.formModel[this.data.code];
      if (
        this.data.optionSetting_tabContent.echoUrl &&
        this.formModel[this.data.code]
      ) {
        //根据提供的接口和value值查询回显中文值
        let obj = { id: this.formModel[this.data.code] };
        this.data.optionSetting_tabContent.queryParams.forEach((item) => {
          obj[item.paramName] = item.defaultValue;
        });
        let url = this.data.optionSetting_tabContent.echoUrl;
        getFrameTreeDataById(url, obj)
          .then((res) => {
            if (res) {
              this.data.defaultValueArr = res.data.data.text;
            }
          })
          .catch(() => {});
      } else {
        this.data.defaultValueArr = this.formModel[this.data.code];
      }
    }
    // 处理富文本的值
    if (this.data.type == "richText") {
      this.editorTxt = this.formModel[this.data.code];
    }
    //查询附件模板
    if (this.data.type == "uploadNewFile") {
      if (this.data.businessType && this.data.fileTemplate) {
        let queryData = {
          businessType: this.data.businessType,
          boId: this.data.fileTemplate,
        };
        getAllFiles(queryData)
          .then((res) => {
            if (res && res.data && res.data.code == "0000") {
              this.fileTemplate = res.data.data.data;
              console.log(this.fileTemplate, "fileTemplate");
            }
          })
          .catch((e) => {
            console.log(e);
          });
      }
    }
    //处理表格表头
    if (this.data.type == "table") {
      this.data.tableCols.forEach((item) => {
        if (item.label != "操作" && !item.isHide) {
          this.tablecolumnCopy.push(item);
        }
      });
    }
  },
  mounted() {
    this.treeData = [...this.tablecolumnCopy];
    this.treeData.forEach((item) => {
      this.defaultDataArray.push(item.label);
    });
    // if (this.data.type === "uploadNewFile") {
    //   this.getNewFileList();
    // }
    if (this.data.type === "textarea") {
      this.labelEle = this.$el.getElementsByClassName("el-form-item__label")[0];
      this.contentEle = this.$el.querySelector(
        ".el-form-item__content .el-textarea"
      );
      this.setLabelEleHeight(this.contentEle.offsetHeight + "px");
    }
    this.renderUploadStyles();
    if (this.data.type == "richText") {
      // 配置富文本编辑器的参数以及各种回调函数
      this.initRichTextSettings();
    }
    if (this.data.type == "cascader") {
      if (!this.data.optionSetting_tabContent.codeType.value) {
        return;
      }
      // 查询码表数据option 并且渲染到页面
      if (this.data.optionSetting === "remoteDict") {
        let params = {
          rootValue: "",
        };
        params.rootValue = this.data.optionSetting_tabContent.codeType.value;
        this.getCascaderOptions(params.rootValue, this.data.code);
      }
    }
    if (this.data.type == "datePicker" || this.data.type == "timePicker") {
      if (
        this.data.isDefaultValueUseCurrentTime &&
        !this.formModel[this.data.code]
      ) {
        var formatDateTime = function (date) {
          var y = date.getFullYear();
          var m = date.getMonth() + 1;
          m = m < 10 ? "0" + m : m;
          var d = date.getDate();
          d = d < 10 ? "0" + d : d;
          var h = date.getHours();
          h = h < 10 ? "0" + h : h;
          var minute = date.getMinutes();
          minute = minute < 10 ? "0" + minute : minute;
          var second = date.getSeconds();
          second = second < 10 ? "0" + second : second;
          return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
        };
        this.formModel[this.data.code] = formatDateTime(new Date());
      }
    }
  },
  beforeDestroy() {
    if (this.TIMER) {
      clearInterval(this.TIMER);
    }
    this.counting = false;
    this.countNumber = 0;
  },
  methods: {
    renderUploadStyles() {
      // fileList
    },
    // 设置label元素的高度与行高
    setLabelEleHeight(newHeight) {
      this.labelEle.style.height = newHeight;
      this.labelEle.style.lineHeight = newHeight;
    },
    // 添加附件信息
    addFileName() {
      this.fileName = this.$refs.file.files[0].name;
    },
    // 上传到服务器
    upFile() {
      const uploadOptions = this.data.uploadSettings; // 上传相关配置（诸如接口地址、请求方式）
      // 判断文件是否为空
      if (this.$refs.file.value === "") {
        this.$message({
          showClose: true,
          message: "请选择上传的目标文件!",
          duration: 1000,
          type: "warning",
        });
        return false;
      } else {
        // 找到配置的请求体、接口地址、查询方式
        let param = new FormData();
        param.append("files", this.$refs.file.files[0]);
        param.append("access_token", sessionStorage.getItem("access_token"));

        // 用户自定义添加的参数,这是例如在引用页面，用户可能需要再添加一些参数
        if (this.USER_UPLOAD_PARAM) {
          for (let key in this.USER_UPLOAD_PARAM) {
            if (key) {
              param.append(key, this.USER_UPLOAD_PARAM[key]);
            }
          }
        }

        // 遍历配置的请求体，加上这些参数
        uploadOptions.bodyParam.forEach((it) => {
          if (it && it.label) {
            param.append(it.label, it.value);
          }
        });

        // 向后端发送请求
        commonRequest({
          data: param,
          method: uploadOptions.uploadMethod,
          url: uploadOptions.uploadUrl,
          headers: { "Content-Type": "multipart/form-data" },
        })
          .then((res) => {
            if (res.data.ok) {
              // 上传成功
              this.$message({
                showClose: true,
                message: "上传成功",
                duration: 1500,
                type: "success",
              });
              this.fileName = ""; // 清空文件
            } else {
              this.$message({
                showClose: true,
                message: res.data.codeMsg || res.data.msg || "上传失败",
                duration: 1500,
                type: "warning",
              });
            }
            // 改为不论上传成功与否，都请求列表数据
            this.getFileList();
          })
          .catch((e) => {});
      }
    },
    // 查询附件列表
    getFileList() {
      if (this.data.listRequestUrl) {
        // 遍历配置的请求体，加上这些参数
        let queryData = {};
        if (this.data.bodyParam) {
          this.data.bodyParam.forEach((it) => {
            queryData[it.label] = it.value;
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
          url: this.data.listRequestUrl,
        })
          .then((res) => {
            console.log("查询附件的值", res);

            if (res && res.data && res.data.code == "0000") {
              this.fileList = res.data.data.data;
            } else {
              this.fileList = [];
            }
          })
          .catch((e) => {
            console.log(e);
          });
      }
    },
    getNewFileList() {
      let queryData = {};
      this.fileList = [];
      // 用户自定义添加的参数,这是例如在引用页面，用户可能需要再添加一些参数
      if (this.USER_UPLOAD_SEARCH_LIST_PARAM) {
        for (let key in this.USER_UPLOAD_SEARCH_LIST_PARAM) {
          if (key) {
            queryData[key] = this.USER_UPLOAD_SEARCH_LIST_PARAM[key];
          }
        }
      }
      if (!this.linkFormCode) {
        queryData.typeId = "main";
      } else {
        queryData.typeId = sessionStorage.getItem("nodeCode");
        queryData.attribute4 = sessionStorage.getItem("nextNodeCode");
      }
      getUploadedFileList(queryData).then((res) => {
        if (res && res.data && res.data.code == "0000") {
          this.fileList = res.data.data.data;
          // TODO this.$emit("getUploadedFileList", this.fileList)
        }
      });
    },
    //新文件上传删除附件
    deleteFile(row) {
      delFileNew(row.id)
        .then((response) => {
          this.$message({
            showClose: true,
            message: "删除成功!",
            duration: 1000,
            type: "success",
          });
          this.getNewFileList();
        })
        .catch((error) => {
          this.$message.error("删除文件失败");
        });
    },
    // // 下载地址
    // getDownURL (row) {
    //   debugger;
    //   // 处理url。如果是以http或者https开头的，则直接使用；若否，则依次取baseUrl。和本地的ip
    //   let url = this.data.downloadServiceUrl;
    //   let _url = '';
    //   if (url.startsWith('http:') || url.startsWith('https:')){
    //     _url = url
    //   }
    //   else if (baseUrl) {
    //     _url = baseUrl + url;
    //   }
    //   else {
    //     _url = window.location.origin + url
    //   }
    //   return (
    //      _url +
    //     row.id +
    //     '?access_token=' +
    //     sessionStorage.getItem('access_token')
    //   );
    // },
    // 删除附件
    // 新文件上传下载地址
    getDownURL(row, disabled) {
      if (disabled) {
        return "#";
      } else {
        return (
          downloadServiceUrl +
          "/" +
          row.id +
          "?access_token=" +
          sessionStorage.getItem("access_token")
        );
      }
    },
    delFile(row) {
      commonRequest({
        method: "DELETE",
        url: this.data.delFileUrl + row.id,
      }).then((response) => {
        this.$message({
          showClose: true,
          message: "删除成功!",
          duration: 1000,
          type: "success",
        });

        this.getNewFileList();
        // this.getFileList();
      });
    },
    // 获取码表数据列表
    getCodeTypeList(codeType) {
      getCodeTypeData({ codeType: codeType })
        .then((res) => {
          if (res && res.data && res.data.ok) {
            this.options = res.data.data.map((it) => {
              return {
                label: it.NAME,
                value: it.ID,
              };
            });
          }
        })
        .catch((e) => {});
    },
    // 针对配置了数据来源是远程接口的表单项，查询远程接口的数据
    getRemoteUrlDatas({
      url,
      method,
      params,
      data,
      needClearFormValue,
      headers = {},
      successCallback,
    }) {
      const that = this;
      commonRequest({
        url: url,
        params: params,
        data: data,
        method: method,
        headers: headers,
      })
        .then((res) => {
          // 如果有needClearFormValue，则需要清空当前的选中值
          if (needClearFormValue) {
            this.formModel[this.data.code] = "";
          }
          // 清空当前的下拉数据们
          this.options = [];
          // 如果有自定义的回调函数，则执行自定义的
          if (successCallback) {
            try {
              let fn = new Function("resData", successCallback);
              this.options = fn(res) || [];
            } catch (e) {
              console.log(e);
            }
          }
          // 没有自定义的回调函数，则执行默认逻辑
          else {
            if (res.data && res.data.code == "0000") {
              if (
                res.data.data.data &&
                res.data.data.data.constructor === Array
              ) {
                this.options = res.data.data.data.map((it) => {
                  return {
                    label: it.lable || it.name,
                    value: it.value || it.id,
                  };
                });
              } else {
                this.options = res.data.data.map((it) => {
                  return {
                    label: it.lable || it.name,
                    value: it.value || it.id,
                  };
                });
              }
            } else {
              this.$message({
                showClose: true,
                message: res.data.codeMsg || res.data.msg || "查询失败",
                duration: 1500,
                type: "warning",
              });
            }
          }
        })
        .catch((e) => {
          this.$message({
            showClose: true,
            message: e && e.message ? e.message : "查询失败",
            duration: 1500,
            type: "warning",
          });
          // 清空当前的选中值
          this.formModel[this.data.code] = "";
          // 清空当前的下拉数据们
          this.options = [];
        });
    },

    // 检查当前表单项的前置关联查询参数。若都有值，则需要向后台查询接口
    checkRelationPreQueryParam(val) {
      let flg = true;
      for (let i in this.relationPreQueryParam) {
        if (!i || !this.relationPreQueryParam[i]) {
          flg = false;
          break;
        }
      }
      if (flg) {
        const optionSetting_tabContent = this.data.optionSetting_tabContent;
        if (this.data.optionSetting == "remoteUrl2") {
          let params = {};
          let data = {};
          let headers = {};
          for (
            let i = 0, len = optionSetting_tabContent.queryParams.length;
            i < len;
            i++
          ) {
            let it = optionSetting_tabContent.queryParams[i];
            // 空键名的不要
            if (!it.paramName) {
              break;
            }
            if (it.paramType === "params") {
              params[it.paramName] = it.defaultValue || val;
            } else if (it.paramType === "body") {
              data[it.paramName] = it.defaultValue || val;
            } else if (it.paramType === "header") {
              headers[it.paramName] = it.defaultValue || val;
            }
          }

          this.getRemoteUrlDatas({
            url: optionSetting_tabContent.url,
            method: optionSetting_tabContent.method,
            data: data,
            params: params,
            headers: headers,
            successCallback: optionSetting_tabContent.successCallback,
            needClearFormValue: true,
          });
        } else if (this.data.optionSetting == "remoteDict") {
          this.getRemoteUrlDatas({
            url: optionSetting_tabContent.remoteUrl
              ? optionSetting_tabContent.remoteUrl.value
              : "/admin/sysdict/list", // 以现在的情况，如果不是，即是字典表查询
            method: optionSetting_tabContent.remoteUrl
              ? optionSetting_tabContent.remoteMethods.value
              : "get",
            params: this.relationPreQueryParam,
            data: this.relationPreQueryParam,
            needClearFormValue: true, // 是否需要清空当前表单项的绑定值
          });
        }
      }
    },

    clearValueAndOptions() {
      // 清空当前的选中值
      this.formModel[this.data.code] = "";
      // 清空当前的下拉数据们
      this.options = [];
    },
    // 处理配置的按钮执行点击事件
    dealFuncStr(item, index, row) {
      this.DialogattrData = [];
      for (const key in row) {
        if (key != "cloumnOpera") {
          this.data.tableCols.forEach((item) => {
            if (item.prop == key) {
              if (item.componentTypeValue == "select") {
                item.options.forEach((it) => {
                  if (it.value == row[key]) {
                    this.DialogattrData.push({
                      label: item.label,
                      value: it.label,
                    });
                  }
                });
              } else {
                this.DialogattrData.push({
                  label: item.label,
                  value: row[key],
                });
              }
            }
          });
        }
      }
      if (item.code == "scan") {
        // this.DialogattrData=[]
        // for(const key in row){
        //   if(key!='cloumnOpera'){
        //     this.data.tableCols.forEach(item=>{
        //       if(item.prop==key){
        //         if(item.componentTypeValue=="select"){
        //           item.options.forEach(it=>{
        //             if(it.value==row[key]){
        //           this.DialogattrData.push({
        //             label:item.label,
        //             value:it.label
        //               })
        //             }
        //           })
        //         }else{
        //             this.DialogattrData.push({
        //                 label:item.label,
        //                 value:row[key]
        //              })
        //             }
        //       }
        //     })
        //   }
        // }
        this.visible = true;
      } else if (!item.clickFuncStr) {
        let args = {
          item: item,
          row: row,
          data: this.data,
          rowData: this.DialogattrData,
        };
        this.componentFormContainer.$emit("tableItemClick", args);
        // this.MessageConfig.showMessage = true;
        // this.MessageConfig.MsgBoxType = "warning";
        // this.MessageConfig.MsgText = "绑定事件的方法为空！";
      } else if (item.clickFuncStr) {
      }
    },
    //取消表格查看弹窗
    cancel() {
      this.visible = false;
    },
    //
    confirm() {
      this.visible = false;
    },
    // 下拉框的选中值改变后的事件
    selectChangeHand(val) {
      // if (this.formModelCnFlag) {
      //   if (this.data && this.data.multiple == true) {
      //     let obj = [];
      //     val.forEach((it) => {
      //       this.options.forEach((item) => {
      //         if (it == item.value) {
      //           obj.push(item.label);
      //         }
      //       });
      //     });
      //     this.formModelCn[this.data.code] = obj.join();
      //   } else {
      //     this.options.forEach((item) => {
      //       if (item.value == val) {
      //         this.formModelCn[this.data.code] = item.label;
      //       }
      //     });
      //   }
      // }
      const FD_FORM_ITEM_LIST = this.componentRootForm.$refs.fdFormItem;
      // 检查当前表单中的所有表单项的前置关联查询参数
      for (let i = 0, len = FD_FORM_ITEM_LIST.length; i < len; i++) {
        let formItem = FD_FORM_ITEM_LIST[i];
        for (let j in formItem.relationPreQueryParamKeys) {
          if (
            j &&
            formItem.relationPreQueryParamKeys[j] &&
            formItem.relationPreQueryParamKeys[j] === this.data.code
          ) {
            formItem.relationPreQueryParam[j] = val;
            // 假如该下拉框有选中值，再检查是否关联参数都齐了
            if (val) {
              formItem.checkRelationPreQueryParam(val);
            }
            // 假如该下拉框没有选中值，（比如：点了清空按钮，或者选了没有值的选项），则清掉被关联的值和下拉数据
            else {
              formItem.clearValueAndOptions();
            }
          }
        }
      }
      // 判断当前下拉框是否有配置更改其他表单元素的状态
      if (this.formSetting.length > 0) {
        let data = [];
        let flag = false;
        this.formSetting.forEach((item) => {
          if (item.value == val && item.editSettingArray) {
            flag = true;
            data = JSON.parse(JSON.stringify(item.editSettingArray));
          }
        });
        if (flag) {
          this.$bus.$emit("selectChange", data);
        } else {
          this.$bus.$emit("selectChange", data);
        }
      }

      // 执行自定义的change事件
      this.inputChangeHand(val);
    },
    // 打开选择人员或角色弹框
    openPerRoleDialog() {
      if (this.$refs.personEditDialog && !this.data.disabled) {
        this.$refs.personEditDialog.show(this.data.defaultValueArr, this.data);
      }
    },
    // 将选人弹窗中确定的人员更新到表单中
    personSure(usersData, names, ids) {
      // usersData:选中的人，用于弹框回显，names：选中的人，用于展示
      this.formModelCn[this.data.code] = names;
      this.data.defaultName = names;
      this.data.defaultValueArr = [...usersData];
      this.formModel[this.data.code] = ids;
    },
    //清空选中人员
    clearExpress() {
      event.stopPropagation();
      this.data.defaultName = "";
      this.data.defaultValueArr = [];
      this.formModel[this.data.code] = "";
      this.formModelCn[this.data.code] = "";
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
    //打开下拉树弹框
    openFrameTreeDialog() {
      if (this.$refs.frameTree && !this.data.disabled) {
        this.$refs.frameTree.init(this.data, this.formModel);
      }
    },
    //将弹出框下拉树的值展示在input中
    showFrameValue({ value, name }) {
      this.data.defaultValueArr = name;
      this.formModelCn[this.data.code] = name;
      this.data.defaultValue = value;
      this.formModel[this.data.code] = value;
    },
    //清空下拉树选中的值
    clearGogroup() {
      event.stopPropagation();
      this.data.defaultValueArr = "";
      this.data.defaultValue = "";
      this.formModel[this.data.code] = "";
      this.formModelCn[this.data.code] = "";
    },
    //新增行
    addTableRow(event) {
      event.stopPropagation();
      let obj = {};
      this.data.tableCols.forEach((item) => {
        obj[item.prop] = "";
      });
      this.data.tableData.push(obj);
    },
    //删除行
    handleDelete(index) {
      event.stopPropagation();
      this.MessageConfig.showMessage = true;
      this.MessageConfig.MsgBoxType = "confirm";
      this.MessageConfig.MsgText = "确认删除该行数据？";
      this.delRolIndex = index;
    },
    //确认删除
    checkyesDel(data) {
      if (data) {
        this.data.tableData.splice(this.delRolIndex, 1);
      }
    },
    // 取消删除事件
    checkDeleteNo(data) {
      if (!data) {
        this.delRolIndex = null;
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
      debugger;
      event.stopPropagation();
      var isValidate = true;
      // 在应用时提示有必填项的校验
      for (let item of this.data.tableCols) {
        debugger;
        if (
          !row[item.prop] &&
          row[item.prop] !== 0 &&
          item.componentTypeValueAttr.required.selected
        ) {
          this.$message.error(`请填写列名为："${item.label}"的必填项!`);
          isValidate = false;
          break;
        } else {
          // col.componentTypeValueAttr, scope.row[col.prop], col.prop
          isValidate = this.validateTabColRules(
            item,
            item.componentTypeValueAttr,
            row[item.prop],
            item.prop
          );
          if (!isValidate) {
            break;
          }
        }
      }
      //
      if (isValidate) {
        this.MessageConfig.showMessage = true;
        this.MessageConfig.MsgBoxType = "success";
        this.MessageConfig.MsgText = "应用成功";
        this.currentIndex = null;
        this.dealTableColumnData();
      }
    },
    // 动态表格文本框组件是开启设置规则进行校验
    validateTabColRules(col, inputVal, colValue, propName) {
      if (!inputVal || !col) {
        return true;
      }
      let isValidate = true;
      let inputValueType = inputVal.dataType ? inputVal.dataType.value : "";
      let propColName = ""; // 当前列的列名
      // 获取当前列的表头名称

      for (let item of this.data.tableCols) {
        if (propName === item.prop) {
          propColName = item.label;
        }
      }
      // 判断必填
      if (inputVal.required.selected) {
        if (!colValue) {
          this.$message.error(`列名为："${propColName}"的数据不能为空`);
          isValidate = false;
          return isValidate;
        }
      }

      // 判断选择的数据类型
      if (col.componentTypeValue === "input" && inputVal.dataType.selected) {
        isValidate = validateRegType(colValue, inputValueType);
        for (let opItem of inputVal.dataType.options) {
          if (inputValueType === opItem.value) {
            !isValidate &&
              this.$message.error(
                `列名为："${propColName}"、数据格式为"${opItem.label}"的数据验证失败`
              );
            break;
          }
        }
        if (!isValidate) {
          return isValidate;
        }
      }
      // 判断自定义正则表达式
      if (inputVal.regExpPattern.selected && inputVal.regExpPattern.value) {
        isValidate = validateRegType(
          colValue,
          "",
          inputVal.regExpPattern.value
        );
        if (!isValidate) {
          this.$message.error(
            `列名为："${propColName}"、数据格式为自定义正则表达式的数据验证失败`
          );
          return isValidate;
        }
      }
      // 验证长度
      if (
        inputVal.lengthControl.selected &&
        (Array.isArray(colValue) ||
          Object.prototype.toString.call(colValue) === "[object String]")
      ) {
        if (inputVal.lengthControl.min > colValue.length) {
          isValidate = false;
          this.$message.error(
            `列名为："${propColName}"的数据长度不能小于最小长度为${inputVal.lengthControl.min}`
          );
          return isValidate;
        }
        if (inputVal.lengthControl.max < colValue.length) {
          isValidate = false;
          this.$message.error(
            `列名为："${propColName}"的数据长度不能大于最大长度为${inputVal.lengthControl.max}`
          );
          return isValidate;
        }
      }
      return isValidate;
    },
    //取消编辑
    handleCancel(index, row) {
      event.stopPropagation();
      for (let key in this.data.tableData[index]) {
        for (let dekey in this.defaultData) {
          if (key == dekey) {
            this.data.tableData[index][key] = this.defaultData[dekey];
          }
        }
      }
      this.currentIndex = null;
      this.dealTableColumnData();
    },
    // 遍历所有得table row数据 判断对应得类型 显示对应得值
    dealTableColumnData() {
      this.data.tableData.length > 0 &&
        this.data.tableData.map((item, index) => {
          if (item) {
            for (var colItem in item) {
              this.data.tableCols.map((tableItem, tableIndex) => {
                if (tableItem.componentTypeValue === "input") {
                  tableItem.prop === colItem &&
                    item[colItem] &&
                    (item[colItem] = item[colItem].toString());
                } else if (tableItem.componentTypeValue === "inputNumber") {
                  tableItem.prop === colItem &&
                    (item[colItem] = Number(item[colItem]));
                } else if (tableItem.componentTypeValue === "select") {
                } else if (tableItem.componentTypeValue === "datePicker") {
                  tableItem.prop === colItem &&
                    (item[colItem] = item[colItem]
                      ? moment(item[colItem]).format("YYYY-MM-DD")
                      : "");
                }
              });
            }
          }
        });
    },
    querySearchAsync(queryString, cb) {
      debugger;
      console.log(this.data);
      // if(queryString){
      //   if(!this.data.searchUrl){
      //     let url = '/workflow/form/data/getNames'
      //     this.formCode=this.$parent.$parent.$parent.$parent.$parent.$parent.formCode
      //     let data={
      //       fieldValue:this.formModel[this.data.code],
      //       fieldCode:this.data.code,
      //       formCode:this.formCode
      //     }
      //     let callBackArr = [];
      //     if(!this.formCode||!this.data.code) return
      //     getNames(url,data).then(res=>{
      //       if(res&&res.data&&res.data.data){
      //         res.data.data.forEach(item=>{
      //         if(item.indexOf(queryString)>-1){
      //           callBackArr.push({value:item,label:item})
      //         }
      //       })
      //       }
      //        cb(callBackArr);
      //     })
      //
      //   }
      //   else{
      //     let data = {
      //       fieldValue:this.formModel[this.data.code],
      //     }
      //     let callBackArr = [];
      //     getNames(this.data.searchUrl,data).then(res=>{
      //        if(res&&res.data&&res.data.data){
      //          res.data.data.forEach(item=>{
      //         if(item.indexOf(queryString)>-1){
      //            callBackArr.push({value:item,label:item})
      //         }
      //       })
      //        }
      //        cb(callBackArr);
      //     })
      //
      //   }
      // }
      const that = this;

      if (queryString) {
        let dt = this.data.searchUrl_tabContent;
        // 拼接查询参数
        let params = {
          fieldValue: this.data.defaultValue.value,
        };
        let data = {
          fieldValue: this.data.defaultValue.value,
        };
        let headers = {};
        let urlAddress = "";
        for (let i = 0, len = dt.queryParams.length; i < len; i++) {
          let it = dt.queryParams[i];
          // 空键名的不要
          if (!it.paramName && it.paramType !== "urlParams") {
            break;
          }
          if (it.paramType === "params") {
            params[it.paramName] = it.defaultValue;
          } else if (it.paramType === "body") {
            data[it.paramName] = it.defaultValue;
          } else if (it.paramType === "header") {
            headers[it.paramName] = it.defaultValue;
          } else if (it.paramType === "urlParams") {
            let urlParams = [it.defaultValue ? it.defaultValue : ""];
            urlAddress =
              dt.url[dt.url.length - 1] === "/"
                ? `${dt.url}${urlParams[0]}`
                : `${dt.url}/${urlParams[0]}`;
            break;
          }
        }
        let req = {
          url: urlAddress || dt.url,
          method: dt.method,
          data: data,
          params: params,
          headers: headers,
        };
        commonRequest(req)
          .then((res) => {
            try {
              let fn = new Function("resData", dt.successCallback);
              let todo = fn(res);
              cb(todo);
            } catch (e) {
              console.log(e);
            }
          })
          .catch((e) => {});
      }
    },
    handleSelect(item) {
      this.formModel[this.data.code] = item.label;
    },
    // 对于有设置前置关联的普通下拉和码表下拉，找到联动查询参数
    getRelationQueryParams(optionSetting_tabContent) {
      let queryParam = {}; // 值版本
      let queryParamKeys = {}; // 键对应的版本
      let flg = true;
      let values = optionSetting_tabContent.relationSettings.values;
      for (let key in values) {
        let it = values[key];
        var targetKey = it[1]; // 找到前置关联的字段的名称；
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

      return flg
        ? {
            params: queryParam,
            data: queryParam,
          }
        : flg;
    },
    // 新附件上传 上传文件
    uploadNewFile(params) {
      let fileName = params.file.name;
      let pos = fileName.lastIndexOf(".");
      let lastName = fileName.substring(pos, fileName.length);
      if (
        this.data.upLoadFileType &&
        this.data.upLoadFileType.indexOf(lastName.toLowerCase()) === -1
      ) {
        let tipTxt = "";
        this.data.upLoadFileType.length > 0 &&
          this.data.upLoadFileType.map((value, index) => {
            if (index === 0) {
              tipTxt += `${value}`;
            } else {
              tipTxt += `、${value}`;
            }
          });
        this.$message.error(`文件必须为${tipTxt}类型`);
        // this.resetCompressData()
        return false;
      }
      // 限制上传文件的大小
      const isLt = params.file.size / 1024 > this.data.fileUploadSize;
      if (isLt) {
        this.$message.error(
          `上传文件大小不得大于${this.data.fileUploadSize}KB!`
        );
        return false;
      }
      if (this.fileList.length >= this.data.totalUploadCounts) {
        this.$message.error(
          `上传文件的数量不能超过${this.data.totalUploadCounts}个`
        );
        return false;
      }
      // 判断文件是否为空
      if (false) {
        this.$message({
          showClose: true,
          message: "请选择上传的目标文件!",
          duration: 1000,
          type: "warning",
        });
        return false;
      } else {
        // 找到配置的请求体、接口地址、查询方式
        let param = new FormData();
        param.append("files", params.file);
        param.append("access_token", sessionStorage.getItem("access_token"));
        if (!this.linkFormCode) {
          param.append("typeId", "main");
        } else {
          param.append("typeId", sessionStorage.getItem("nodeCode"));
        }
        // 用户自定义添加的参数,这是例如在引用页面，用户可能需要再添加一些参数
        if (this.USER_UPLOAD_PARAM) {
          for (let key in this.USER_UPLOAD_PARAM) {
            if (key) {
              param.append(key, this.USER_UPLOAD_PARAM[key]);
            }
          }
        }
        // 向后端发送请求
        return new Promise((resolve, reject) => {
          uploadFiles(param)
            .then((res) => {
              if (res && res.data && res.data.code == "0000") {
                // 上传成功
                this.$message({
                  showClose: true,
                  message: "上传成功",
                  duration: 1500,
                  type: "success",
                });
                this.getNewFileList();
                resolve(params);
              } else {
                this.$message({
                  showClose: true,
                  message: res.data.codeMsg || res.data.msg || "上传失败",
                  duration: 1500,
                  type: "warning",
                });

                reject(false);
              }
              // 改为不论上传成功与否，都请求列表数据
              // this.getFileList();
            })
            .catch((e) => {
              this.$message({
                showClose: true,
                message: "上传失败",
                duration: 1500,
                type: "warning",
              });
              reject(false);
            })
            .finally(() => {});
        });
      }
    },

    // 配置富文本编辑器的参数以及各种回调函数
    initRichTextSettings() {
      const that = this;
      let className = ".richText" + this.data.frontId;
      const editor = new wangEditor(className);
      editor.config.height = this.data.height || 200; // 高度(200是我settings.js中设置的最小值)
      editor.config.showLinkImg = false;
      // 使用服务器上传图片与使用base64图片不能同时存在
      editor.config.uploadImgServer = this.data.uploadUrl || "";
      // editor.config.uploadImgShowBase64 = true;

      // 配置alt选项
      editor.config.showLinkImgAlt = false;
      editor.config.zIndex = 50;
      // 配置超链接
      editor.config.showLinkImgHref = false;
      editor.config.excludeMenus = [
        "emoticon",
        "video",
        // 'image',
      ];
      // 配置 onchange 回调函数，将数据同步到 vue 中
      editor.config.onchange = (newHtml) => {
        this.editorData = newHtml;
        this.formModel[this.data.code] = editor.txt.html();
      };
      editor.config.pasteTextHandle = function (pasteStr) {
        debugger;
        // return '<img src="https://www.wangeditor.com/imgs/ali-pay.jpeg"/>'
        return pasteStr;
      };

      /**
       * 自定义图片上传
       * @param resultFiles 选中的文件列表
       * @param insertImgFn 是获取图片 url 后，插入到编辑器的方法
       */
      editor.config.customUploadImg = function (resultFiles, insertImgFn) {
        // 拼接查询参数，并且向后台递交请求
        let param = new FormData();
        console.log("开始上传 :token:", sessionStorage.getItem("access_token"));

        param.append("access_token", sessionStorage.getItem("access_token"));
        resultFiles.forEach((file) => {
          param.append("files", file);
        });

        commonRequest({
          data: param,
          method: "POST",
          url: that.data.uploadUrl,
          headers: { "Content-Type": "multipart/form-data" },
        })
          .then((res) => {
            if (res && res.data && res.data.code == "0000") {
              res.data.data.forEach((it) => {
                insertImgFn(FORM_IMG_URL + it.url);
              });
            } else {
              this.MessageConfig.showMessage = true;
              this.MessageConfig.MsgBoxType = "warning";
              this.MessageConfig.MsgText =
                res.data && res.data.msg ? res.data.msg : "上传失败";
            }
          })
          .catch((e) => {
            debugger;
          });
      };

      // 创建编辑器
      editor.create();

      // 处理只读和禁用
      if (this.data.readonly || this.data.disabled) {
        editor.disable();
      }

      this.editor = editor;
    },
    // 动态表格下拉框根据value显示对应的label
    getShowTableLabelForValue(value, options) {
      let resultArr = options.filter((item) => {
        return item.value === value;
      });
      return resultArr.length > 0 ? resultArr[0].label : "";
    },
    // 动态表格下显示自定义日期格式的文本
    getShowTableTextForDate(value, attr) {
      if (attr.isDeafultNowDate.value) {
        if (attr.selfShowValueFormat.value) {
          return this.moment().format(attr.inputFormatShow.value);
        }
        return this.moment().format("YYYY-MM-DD");
      } else {
        if (attr.selfShowValueFormat.value) {
          return value
            ? this.moment(value).format(attr.inputFormatShow.value)
            : this.moment().format(attr.inputFormatShow.value);
        }
        return value ? this.moment(value).format("YYYY-MM-DD") : "";
      }
    },
    /**
     * 页数大小点击
     * @param size
     */
    sizeChange(limit) {
      this.page = {
        ...this.page,
        page: 1,
        limit,
      };
      if (this.data.isCreateDataBaseTable) {
        this.getFormTablesPage();
      } else {
        this.getFormTableSqlPage();
      }
    },
    /**
     * 页码点击
     * @param current
     */
    currentChange(page) {
      this.page = {
        ...this.page,
        page,
      };
      if (this.data.isCreateDataBaseTable) {
        this.getFormTablesPage();
      } else {
        this.getFormTableSqlPage();
      }
    },
    /**
     * 表头右击弹出选项
     * @param column
     * @param event
     */
    headerContextmenu(column, event) {
      this.treeShow = true;
      window.addEventListener("click", this.closeMenu);
      event.preventDefault();
      this.treeData.forEach((item) => {
        this.$set(item, "disabled", false);
      });
      this.treeData.forEach((item) => {
        if (!this.defaultDataArray.includes(item.label)) {
          this.defaultDataArray.push(item.label);
        }
      });
      if (this.$refs.tree.getCheckedNodes().length == 1) {
        this.treeData.forEach((item) => {
          if (this.$refs.tree.getCheckedNodes()[0].label == item.label) {
            item.disabled = true;
          }
        });
      }
    },

    /**
     * 显示隐藏表头列
     */
    checkChange() {
      if (this.$refs.tree.getCheckedNodes().length == 1) {
        this.treeData.forEach((item) => {
          if (this.$refs.tree.getCheckedNodes()[0].label == item.label) {
            item.disabled = true;
          }
        });
      } else {
        this.treeData.forEach((item) => {
          item.disabled = false;
        });
      }
      this.tableColumnTree(this.$refs.tree.getCheckedNodes());
    },
    /**
     * 右击选择表格列展示
     * @param val
     */
    tableColumnTree(val) {
      const arr = [];
      this.data.tableCols.forEach((item) => {
        val.forEach((param) => {
          if (item.label === param.label) {
            arr.push(item);
          }
        });
      });
      this.tablecolumnCopy = arr;
    },
    herf(col, row) {
      if (col.componentTypeValueAttr.isURL.value) {
        let url = col.componentTypeValueAttr.isURLCode.value && "url";
        console.log(row, "row[url]");
        if (row[url]) {
          this.$router.push({
            path: row[url],
          });
        }
      } else {
        return;
      }
    },
    //根据配置sql查询不分页列表
    getFormTableSqlList() {
      getFormTableSqlList(this.sqlData).then((res) => {
        if (res && res.data) {
          this.data.tableData = res.data.data || [];
          //处理显示不同的按钮显示隐藏
          if (
            this.data.tableCols.length > 0 &&
            this.data.tableCols[this.data.tableCols.length - 1].label == "操作"
          ) {
            this.data.tableCols[
              this.data.tableCols.length - 1
            ].buttonList.forEach((item) => {
              if (item.show) {
                if (item.show.indexOf("=") != -1) {
                  let num = item.show.indexOf("=");
                  let left = item.show.substring(0, num);
                  let right = item.show.substring(num + 1);
                  this.data.tableData.forEach((ele) => {
                    if (ele[left] == right) {
                      ele[item.code] = true;
                    } else {
                      ele[item.code] = false;
                    }
                  });
                } else {
                  this.data.tableData.forEach((it) => {
                    it[item.code] = true;
                  });
                }
              } else {
                this.data.tableData.forEach((it) => {
                  it[item.code] = true;
                });
              }
            });
          }
        }
      });
    },
    //根据配置sql查询分页列表
    getFormTableSqlPage() {
      let obj = {
        ...this.page,
        ...this.sqlData,
      };
      getFormTableSqlPage(obj).then((res) => {
        if (res && res.data && res.data.data) {
          this.data.tableData = res.data.data.data || [];
          this.page.total = res.data.data.total
            ? parseInt(res.data.data.total)
            : 0;
          //处理显示不同的按钮显示隐藏
          if (
            this.data.tableCols.length > 0 &&
            this.data.tableCols[this.data.tableCols.length - 1].label == "操作"
          ) {
            this.data.tableCols[
              this.data.tableCols.length - 1
            ].buttonList.forEach((item) => {
              if (item.show) {
                if (item.show.indexOf("=") != -1) {
                  let num = item.show.indexOf("=");
                  let left = item.show.substring(0, num);
                  let right = item.show.substring(num + 1);
                  this.data.tableData.forEach((ele) => {
                    if (ele[left] == right) {
                      ele[item.code] = true;
                    } else {
                      ele[item.code] = false;
                    }
                  });
                } else {
                  this.data.tableData.forEach((it) => {
                    it[item.code] = true;
                  });
                }
              } else {
                this.data.tableData.forEach((it) => {
                  it[item.code] = true;
                });
              }
            });
          }
        }
      });
    },
    //不分页查询子表格数据
    getFormTablesList() {
      getFormTablesList(this.tableParams).then((res) => {
        if (res && res.data && res.data.data) {
          let data = res.data.data || {};
          this.data.tableData = [];
          data.rows.forEach((item) => {
            let obj = {};
            if (item.id) {
              obj.id = item.id;
            }
            item.columns.forEach((cIt) => {
              obj[cIt.code] = cIt.value;
            });
            this.data.tableData.push(obj);
          });
          //处理显示不同的按钮显示隐藏
          if (
            this.data.tableCols.length > 0 &&
            this.data.tableCols[this.data.tableCols.length - 1].label == "操作"
          ) {
            this.data.tableCols[
              this.data.tableCols.length - 1
            ].buttonList.forEach((item) => {
              if (item.show) {
                if (item.show.indexOf("=") != -1) {
                  let num = item.show.indexOf("=");
                  let left = item.show.substring(0, num);
                  let right = item.show.substring(num + 1);
                  this.data.tableData.forEach((ele) => {
                    if (ele[left] == right) {
                      ele[item.code] = true;
                    } else {
                      ele[item.code] = false;
                    }
                  });
                } else {
                  this.data.tableData.forEach((it) => {
                    it[item.code] = true;
                  });
                }
              } else {
                this.data.tableData.forEach((it) => {
                  it[item.code] = true;
                });
              }
            });
          }
        }
      });
    },
    //分页查询子表格数据
    getFormTablesPage() {
      let obj = {
        ...this.page,
        ...this.tableParams,
      };
      getFormTablesPage(obj).then((res) => {
        if (res && res.data && res.data.data) {
          let data = res.data.data.data || [];
          this.page.total = res.data.data.total
            ? parseInt(res.data.data.total)
            : 0;
          this.data.tableData = [];
          data.forEach((item) => {
            item.rows.forEach((it) => {
              let obj = {};
              if (it.id) {
                obj.id = it.id;
              }
              it.columns.forEach((cIt) => {
                obj[cIt.code] = cIt.value;
              });
              this.data.tableData.push(obj);
            });
          });
          //处理显示不同的按钮显示隐藏
          if (
            this.data.tableCols.length > 0 &&
            this.data.tableCols[this.data.tableCols.length - 1].label == "操作"
          ) {
            this.data.tableCols[
              this.data.tableCols.length - 1
            ].buttonList.forEach((item) => {
              if (item.show) {
                if (item.show.indexOf("=") != -1) {
                  let num = item.show.indexOf("=");
                  let left = item.show.substring(0, num);
                  let right = item.show.substring(num + 1);
                  this.data.tableData.forEach((ele) => {
                    if (ele[left] == right) {
                      ele[item.code] = true;
                    } else {
                      ele[item.code] = false;
                    }
                  });
                } else {
                  this.data.tableData.forEach((it) => {
                    it[item.code] = true;
                  });
                }
              } else {
                this.data.tableData.forEach((it) => {
                  it[item.code] = true;
                });
              }
            });
          }
        }
      });
    },
    /**
     * 关闭弹框
     */
    closeMenu() {
      window.removeEventListener("click", this.closeMenu);
      this.treeShow = false;
      this.defaultDataArray = [];
    },
    // 页面加载获取对应值得下拉选项
    getCascaderOptions(value, codeValue) {
      if (!value) {
        return;
      }
      let param = {
        rootValue: value,
      };
      debugger;
      getPointCodeSheetData(param)
        .then((res) => {
          if (res && res.data && res.data.code == "0000") {
            debugger;
            this.options = [res.data.data];
          }
        })
        .catch((error) => {
          debugger;
          this.options = [];
          throw error;
        })
        .finally(() => {});
    },

    selectCascaderChange(ev, data) {
      if (
        ev &&
        ev.length > 1 &&
        data.isMultiple &&
        ev.length > data.multItemCounts
      ) {
        this.$message.error("超出最大选项数量");
      }

      this.inputChangeHand();
    },

    // 打开新人员选择弹框
    openNewPerRoleDialog() {
      debugger;
      if (this.$refs.newPersonEditDialog && !this.data.disabled) {
        debugger;
        this.$refs.newPersonEditDialog.show(
          this.data.defaultValueArr,
          this.data,
          !this.data.isMultiple,
          {
            sourceTreeList:
              this.data.treeTabList.selectedList.length > 0
                ? this.data.treeTabList.selectedList
                : [this.data.treeTabList.options[0]],
            isMultiple: this.data.isMultiple.value,
          }
        );
      }
    },
    inputClickHand() {
      let val =
        this.data.type === "button"
          ? this.data.defaultValue
          : this.formModel[this.data.code];
      let args = {
        formItem: this.data,
        value: val,
        F: this.componentFormContainer,
      };

      // 倒计时开始
      if (this.data.type === "button") {
        this.startCountingDown();
      }
      // 尝试把自定义函数字符串转为函数并执行
      if (this.data && this.data.click) {
        let codeString = this.data.click.value;
        let behavior = this.data.click.behavior;
        if (codeString) {
          try {
            let fnc = new Function(codeString);
            fnc(this.componentFormContainer, val);
          } catch (e) {
            console.log(e);
            args.error = e;
          }
        }

        // todo 打开弹窗的还没有做
        if (behavior === "openDialog") {
          this.componentFormContainer.$refs.commonDialog.showDialog(this.data);
        }
      }
      // 不论是否有自定义函数，这个都会触发emit,以便使用者可以在回调函数里进行其他行为
      this.componentFormContainer.$emit("formItemClick", args);
    },
    inputChangeHand(value) {
      debugger;
      let val =
        this.data.type === "button"
          ? this.data.defaultValue
          : this.formModel[this.data.code];
      let args = {
        formItem: this.data,
        value: val,
        F: this.componentFormContainer,
      };
      // 尝试把自定义函数字符串转为函数并执行
      if (this.data && this.data.change) {
        let codeString = this.data.change.value;
        let behavior = this.data.change.behavior;
        if (codeString) {
          try {
            let fnc = new Function(codeString);
            fnc(this.componentFormContainer, val);
          } catch (e) {
            // throw e;
            // console.log(e);
            args.error = e;
          }
        }
        // todo 打开弹窗的还没有做
        if (behavior === "openDialog") {
        }
      }
      // if (this.data && this.data.type && this.data.type == "checkbox") {
      //   let obj = [];
      //   value.forEach((it) => {
      //     this.options.forEach((item) => {
      //       if (it == item.value) {
      //         obj.push(item.label);
      //       }
      //     });
      //   });
      //   this.formModelCn[this.data.code] = obj.join();
      // }
      // if (this.data && this.data.type && this.data.type == "cascader") {
      //   let label = [];
      //   let fn = (ele, item) => {
      //     ele.forEach((it) => {
      //       if (it.value == item) {
      //         label.push(it.label);
      //       } else if (it.children && it.children.length > 0) {
      //         fn(it.children, item);
      //       }
      //     });
      //   };
      //   this.formModel[this.data.code].forEach((item) => {
      //     fn(this.options, item);
      //   });
      //   this.formModelCn[this.data.code] = label.join();
      // }
      this.componentFormContainer.$emit("formItemChange", args);
    },
    inputFocusHand() {
      let val =
        this.data.type === "button"
          ? this.data.defaultValue
          : this.formModel[this.data.code];

      let args = { formItem: this.data, value: val };
      // 尝试把自定义函数字符串转为函数并执行
      if (this.data && this.data.focus) {
        let codeString = this.data.focus.value;
        let behavior = this.data.focus.behavior;
        if (codeString) {
          try {
            let fnc = new Function(codeString);
            fnc(this.componentFormContainer, this.formModel[this.data.code]);
          } catch (e) {
            // throw e;
            args = { error: e, formItem: this.data, value: val };
          }
        }
        // todo 打开弹窗的还没有做
        if (behavior === "openDialog") {
        }
      }
      this.componentFormContainer.$emit("formItemFocus", args);
    },
    inputBlurHand() {
      let val =
        this.data.type === "button"
          ? this.data.defaultValue
          : this.formModel[this.data.code];
      let args = {
        formItem: this.data,
        value: val,
        F: this.componentFormContainer,
      };
      // 尝试把自定义函数字符串转为函数并执行
      if (this.data && this.data.blur) {
        let codeString = this.data.blur.value;
        let behavior = this.data.blur.behavior;
        if (codeString) {
          try {
            let fnc = new Function(codeString);
            fnc(this.componentFormContainer, this.formModel[this.data.code]);
          } catch (e) {
            // throw e;
            args.error = e;
          }
        }
        // todo 打开弹窗的还没有做
        if (behavior === "openDialog") {
        }
      }
      this.componentFormContainer.$emit("formItemBlur", args);
    },
    startCountingDown() {
      const that = this;
      let timeInterval = this.data.click.timeInterval;
      if (timeInterval) {
        if (timeInterval.constructor === String) {
          timeInterval = Number(timeInterval);
        }
        this.counting = true;
        this.countNumber = timeInterval;
        this.TIMER = setInterval(function () {
          if (that.countNumber === 0) {
            clearInterval(that.TIMER);
            that.counting = false;
          }

          that.countNumber--;
        }, 1000);
      }
    },
  },
};
</script>

<style lang="scss">
.tree-box {
  z-index: 9999;
  position: absolute;
  top: 34px;
  left: 0;
  border: 1px solid #cfe7fe;
  padding-right: 10px;
  max-height: 240px;
  overflow-y: auto;
}
.fd-form-item .el-date-editor .el-range__icon{
  line-height: 24px;
}
.fd-form-item .el-date-editor .el-range-input{
  width: 44%;
}
.fd-form-item .el-date-editor .el-range__close-icon{
  line-height: 24px;
}
.tree-box .el-checkbox__inner {
  width: 12px;
  height: 12px;
}
.tree-box .el-tree-node__label {
  font-size: 12px;
}
.fd-form-item .el-table thead {
  color: #000;
  font-size: 12px;
}
.fd-form-item .el-table th {
  padding: 0.52rem 0;
}
.fd-form-item .tableNodata {
  margin-top: 20px !important;
  display: flex !important;
  align-items: center !important;
  flex-direction: column !important;
}
.fd-form-item {
  .countdown {
    color: #888;
  }
  .fd-formTable .pagination {
    display: flex;
    justify-content: space-between;
  }
}
</style>

