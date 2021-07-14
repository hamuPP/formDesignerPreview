<template>
  <!--      @confirm="dialogConfirmHand"-->
  <!--      @cancel="dialogCancelHand"-->
  <!--      @close="closeHand"-->
  <cus-dialog
      :visible.sync="dialogVisible"
      :width="dialogWidth"
      :title="dialogTitle"
      type="aoi2"
      custom-class="form-common-dialog"
      :append-to-body="true"
  >
    <div class="form-common-dialog-body" :key="index">
      <!--  配置子表单的形式打开弹窗    -->
      <template v-if="mode == 1" >
        <previewForm
            ref="form"
            view
            :id="formId"
            :userId="userId"
            :linkFormCode='code'
            :version="formVersion"
            :rules="formRules"
            useCustormRule
            :formModel.sync="formModel"
            :fdFormItems="fdFormItems"
            :fdFormData="fdFormData"
            showAnchor
            :outerHeaderHeight="85"
            :outerheightHeight="46"
            
        >
        </previewForm>
      </template>
      <template v-if="mode == 2">
        <slot></slot>
      </template>
    </div>
    <span slot="footer" class="dialog-footer">
      <!--  配置子表单的形式打开弹窗    -->
      <template v-if="mode == 1">
         <el-button v-for="(btn, index) in footerBtns"
                    :key="index"
                    @click="btnClick(btn, index)">
        {{btn}}
      </el-button>
      </template>
      <template v-if="mode == 2">
        <el-button @click="confirmBtnClickHand">{{confirmBtn}}</el-button>
        <el-button @click="cancelBtnClickHand">{{cancelBtn}}</el-button>
      </template>

    </span>
  </cus-dialog>
</template>

<script>
import CusDialog from '../CusDialog'
import previewForm from '../previewForm.vue'
// api 相关
import {getLinkFormByCodeService} from '../../api/formDesigner_api.js'
import {flatList, getFormModel, formateList} from '../../util/common'
import {getUrlQueryParams} from '@/util/utils';
export default {
  name: 'commonDialog',
  components: {CusDialog, previewForm},
  data () {
    return {
      mode: null,// 2种表单处理模式，具体看点击确定取消按钮的逻辑处理
      dialogVisible: false,
      dialogTitle: '',
      dialogWidth: '50%',
      footerBtns: [],
      formModel: {},
      formItem: null,
      formVersion: "", //表单版本号
      mainFormCode: "", //主表单code
      formVisible: false, // 表单是否显示
      edit: false,
      userId: sessionStorage.getItem("user_id"),
      formRules: {}, // 表单的校验规则
      fdFormItems: [],
      fdFormData: {},
      formId:'',
      code:'',
      index:1
    }
  },
  methods: {
    // 配置子表单式的打开弹窗 {openDialogTitle, dialogWidth, openDialogContent, openDialogFooterBtns},
    showDialog(formItem){
      debugger;
      this.mode = 1;
      this.dialogTitle = formItem.click.openDialogTitle;
      this.formItem = formItem;
      this.openDialogContent = formItem.click.openDialogContent;
      this.code = formItem.click.openDialogContent;
      // this.dialogTitle = openDialogTitle;
      this.dialogWidth = '50%';
      // this.formItem = formItem;
      // 按钮
      this.footerBtns = formItem.click.openDialogFooterBtns.filter(it =>{
        return it;
      });
      this.dialogVisible = true;
      
      this.getLinkFormByCode(this.openDialogContent);
    },
    // 使用代码的打开弹窗
    showCustormDialog({titleText, dialogWidth, confirmBtn, cancelBtn, confirmCb, cancleCb, content, content2}){
      debugger;
      this.mode = 2;
      this.dialogTitle = titleText;
      this.dialogWidth = dialogWidth;
      this.confirmBtn = confirmBtn;
      this.cancelBtn = cancelBtn;
      this.confirmCb = confirmCb;
      this.cancleCb = cancleCb;
      // this.content = content;
      // this.content2 = content2;
      this.dialogVisible = true;
    },

    getLinkFormByCode(formCode){
      let urlParmas = getUrlQueryParams();
      this.formVersion = urlParmas.version;
      this.mainFormCode = urlParmas.formCode;
      let formData = {
        mainFormCode: this.mainFormCode,
        version: this.formVersion,
        formCode: formCode,
      };
      getLinkFormByCodeService(formData)
          .then((res) => {
            debugger;
            if (res.data && res.data.code == "0000") {
              this.formId = res.data.data.id || "";
              let configContent = JSON.parse(res.data.data.configContent);
              console.log(configContent,'configContent');
              let _fields = res.data.data.fields;
              // 表单配置项数据合并
              let fmData = configContent.fm;
              // 域们的数据
              let list = configContent.list;
              let flatLists = (this.flatFdFormList = flatList(
                  this,
                  configContent.list,
                  _fields
              ));
              // 不论是否为新建或回显，都需要先做一个空值的，否则若有checkbox，则checkbox的值类型会报错
              this.formModel = getFormModel(
                  this,
                  flatLists,
                  "defaultValue",
                  false
              );

              this.fdFormData = fmData;
              this.fdFormItems = formateList(list);
              this.formVisible = true; // 显示表单
              this.index++
              // this.$nextTick(()=>{ todo
              //   this.formCode=this.code
              //   setRoleOptions.call(this);
              // })
            }else{}
          })
          .catch(() => {});
    },

    btnClick(btn, index){

      this.dialogVisible = false;// TODO 目前是直接关闭

      // let closeDialog = () =>{
      //   this.dialogVisible = false;
      // };
      // this.$emit('dialogBtnClick', {formItem: this.formItem, btnText: btn, formModel: this.formModel}, closeDialog)
    },
    confirmBtnClickHand(){
      this.confirmCb(_=>{ this.dialogVisible = false;})
    },
    cancelBtnClickHand(){
      this.cancleCb(_=>{ this.dialogVisible = false;})
    }
  }
}
</script>