<template>
  <!--      @confirm="dialogConfirmHand"-->
  <!--      @cancel="dialogCancelHand"-->
  <!--      @close="closeHand"-->
  <cus-dialog
      :visible.sync="dialogVisible"
      width="60%"
      :title="dialogTitle"
      type="primary2"
      custom-class="form-common-dialog"
      :append-to-body="true"
  >
    <div class="form-common-dialog-body">
      <template v-if="mode == 1"></template>
      <template v-if="mode == 2">
        <slot></slot>
      </template>
    </div>
    <span slot="footer" class="dialog-footer">
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
export default {
  name: 'commonDialog',
  data(){
    return {
      mode: null,//2种表单处理模式，具体看点击确定取消按钮的逻辑处理
      dialogVisible: false,
      dialogTitle: false,
      footerBtns: [],
      formModel: {},
      formItem: null,
    }
  },
  methods: {
    // 配置子表单式的打开弹窗
    showDialog({openDialogTitle, openDialogContent, openDialogFooterBtns}, formItem){
      this.mode = 1;
      this.dialogTitle = openDialogTitle;
      this.formItem = formItem;
      // 空按钮不显示
      this.footerBtns = openDialogFooterBtns.filter(it =>{
        return it;
      });
      this.dialogVisible = true;
    },
    // 使用代码的打开弹窗
    showCustormDialog({titleText, confirmBtn, cancelBtn, confirmCb, cancleCb, content, content2}){
      debugger;
      this.mode = 2;
      this.dialogTitle = titleText;
      this.confirmBtn = confirmBtn;
      this.cancelBtn = cancelBtn;
      this.confirmCb = confirmCb;
      this.cancleCb = cancleCb;
      // this.content = content;
      // this.content2 = content2;
      this.dialogVisible = true;
    },

    btnClick(btn, index){
      let closeDialog = ()=>{
        this.dialogVisible = false;
      };
      this.$emit('dialogBtnClick', {formItem: this.formItem, btnText: btn, formModel: this.formModel}, closeDialog)
    },
    confirmBtnClickHand(){
      this.confirmCb(_=>{ this.dialogVisible = false;})
    },
    cancelBtnClickHand(){
      this.confirmCb(_=>{ this.dialogVisible = false;})
    }
  }
}
</script>

<style scoped>

</style>