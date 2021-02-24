/**
 * 消息弹框公共组件
 * Create by xyh on 2020/8/20
 *使用方法在父组件中引入后
 * <MessageBox :showMessage.sync="MessageConfig.showMessage" :MessageConfig="MessageConfig" @checkyes="checkyes"></MessageBox>
 *参数 MessageConfig{
     showMessage:false,//打开消息提示框
      MsgBoxType:'',//消息提示框类型
      MsgText:''//消息弹框显示的信息
 }

 @checkyes="checkyes"  //该方法用于返回确认框返回确认
 *
 */
<template>
  <div class="MessageBox">
    <el-dialog
      @open="open"
      :visible.sync="MessageConfig.showMessage"
      :close-on-click-modal='false'
      :modal="false"
    >
      <div v-if="MessageConfig.MsgBoxType=='success'" class="success diocontent">
        <div class="msgconten">
          <span class="iconfont">
            <img src="../../assets/tips_images/ic-ywc.png" alt="">
          </span>
          <div class="msgtitle">操作成功</div>
          <div class="msgbody">{{MessageConfig.MsgText}}</div>
        </div>
      </div>
      <div v-show="MessageConfig.MsgBoxType=='warning'" class="warning diocontent">
        <div class="msgconten">
          <span class="iconfont">
            <img src="../../assets/tips_images/ic_gj.png" alt="">
          </span>
          <div class="msgtitle">消息提示</div>
          <div class="msgbody">{{MessageConfig.MsgText}}
            <div v-if="MessageConfig.MsgHTML" v-html="MessageConfig.MsgHTML"></div>
          </div>
        </div>
      </div>
      <div v-show="MessageConfig.MsgBoxType=='error'" class="error diocontent">
        <div class="msgconten">
          <span class="iconfont">
            <img src="../../assets/tips_images/ic_error.png" alt="">
          </span>
          <div class="msgtitle">操作失败</div>
          <div class="msgbody">{{MessageConfig.MsgText}}</div>
        </div>
      </div>
      <div v-show="MessageConfig.MsgBoxType=='confirm'" class="confirm diocontent">
        <div class="msgconten">
            <span class="iconfont">
              <img src="../../assets/tips_images/ic_tip.png" alt="">
            </span>
            <div class="msgtitle">确认提示</div>
            <div class="msgbody">{{MessageConfig.MsgText}}</div>
        </div>
        <!-- <div class="dialog-footer">
           <el-button @click="closeModal" class="dialogbtn exit">取 消</el-button>
        <el-button @click="yesok" class="dialogbtn" >确 定</el-button>
        </div> -->
      </div>
      <div v-if="MessageConfig.MsgBoxType=='confirm'" slot="footer" class="dialog-footer">
        <el-button @click="closeModal" class="dialogbtn exit">取 消</el-button>
        <el-button @click="yesok" class="dialogbtn" :loading="confirmLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "MessageBox",
  props: ["showMessage", "title", "width",'MessageConfig','confirmLoading'],
  data() {
    return {
      type: this.MessageConfig.MsgBoxType, //消息弹框类型
      checkyes:true,//确认框选择是
      // footer:false
    };
  },
  methods: {
    open() {
      if(this.MessageConfig.MsgBoxType!="confirm"){
        setTimeout(() => {
        this.closeModal();
      }, 3500);
      }
    },
    closeModal() {
      this.$emit("update:showMessage", false);
      this.$emit("checkno", false);
    },
    yesok() {
      this.$emit("update:showMessage", false);
      this.$emit("checkyes", this.checkyes);
    },
  },
};
</script>
<style lang="scss">
@import "../../styles/commonVar.scss";
.MessageBox {
  .el-dialog {
    // width: 40%;
    // height: 160px;
    margin-top: 35vh !important;
    width: 280px;
    // border: 1px solid #247FFB;
    box-shadow: 1px 0px 8px 0px #247FFB;
    box-sizing: border-box;
  }
  .el-dialog__footer {
    display: block;
    width: 277.5px;
    height: 40px;
    background: rgb(255, 255, 255);
    padding: 0;
    line-height: 40px;
    text-align: center;
    border-top: 1px solid rgb(226,223,224);
    border-bottom: 1px solid rgb(172,197,234);
    margin-bottom: 0;
  }
  .dialogbtn {
    width: 70px;
    height: 26px;
    padding: 0;
    border-radius: 5px;
    background: $color-orange;
    color: #ffffff;
    font-size: 12px;
  }
  .exit {
    background: #ffffff;
    color: #595959;
  }
  .el-button:active {
    border-color: #ffffff;
  }
  .el-dialog__header {
    padding: 15px 0 0 0;
  }
  .el-dialog__body {
    padding: 0;
    /*height: 130px;*/
    line-height: 40px;
  }
  .iconfont {
    display: block;
    line-height: 20px;
  }
  .msgconten {
    width: auto;
    margin: 0 auto;
    display: inline-block;
    text-align: center;
  }
  .msgtitle {
    height: 20px;
    line-height: 20px;
    font-size: 16px;
    font-weight: 400;
    display: inline-block;
    color: #000000;
    // padding-left: 80px;
  }
  .msgbody {
    height: 50px;
    line-height: 20px;
    font-size: 12px;
    display: block;
    text-align: center;
    // padding-left: 40px;
  }

  .diocontent {
    display: flex;
  }
  .success span {
    color: rgb(131, 204, 36);
  }
  .warning span {
    color: rgb(240, 176, 86);
  }
  .error span {
    color: rgb(230, 104, 110);
  }
  .confirm span {
    color: rgb(253, 158, 60);
  }
}
</style>
