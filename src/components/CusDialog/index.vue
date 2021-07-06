/**
* Created by tangyue on 21/5/31
* 对elenmente dialog的扩展，原api都可以直接用
* 使用例子：
<!--<cus-dialog-->
<!--        :visible.sync="visibleDialog"-->
<!--        title="测试弹框"-->
<!--        custom-class="your custom class,"-->
<!--        type="primary"-->
<!--        @opened="$_handleOpened"-->
<!--&gt;-->
<!--  这是一段内容-->
<!--</cus-dialog>-->
*/
<template>
  <el-dialog :visible.sync="visibleDialog"
             :width="dialogWidth"
             v-bind="$attrs"
             v-on="$listeners"
             :custom-class="customDialogClass"
             :append-to-body="dialogAppendToBody"
              @close="closeHandle"
             :close-on-click-modal="clickModalClose">

    <!--内容区域的默认插槽-->
    <slot></slot>

    <!--使用弹框的footer插槽添加按钮-->
    <template #footer>
      <!--对外继续暴露footer插槽，有个别弹框按钮需要自定义-->
      <slot name="footer">
        <!--将取消与确定按钮集成到内部-->
        <span>
          <el-button type="primary" @click="$_handleConfirm">确定</el-button>
          <el-button @click="$_handleCancel">取消</el-button>
        </span>
      </slot>
    </template>
  </el-dialog>
</template>
<script>
  export default {
    //默认情况下父作用域的不被认作 props 的 attribute 绑定 (attribute bindings)
    //将会“回退”且作为普通的 HTML attribute 应用在子组件的根元素上。
    //通过设置 inheritAttrs 到 false，这些默认行为将会被去掉
    inheritAttrs: false,
    props: {
      // 对外暴露visible属性，用于显示隐藏弹框
      visible: {
        type: Boolean,
        default: false
      },
      width: {
        type: String,
        default: '50%'
      },
      customClass: {
        type: String,
        default: ''
      },
      type: {
        type: String,
        default: ''
      },
      appendToBody: {
        type: Boolean,
        default: false
      },
      closeOnClickModal: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      // 通过计算属性，对.sync进行转换，外部也可以直接使用visible.sync
      visibleDialog: {
        get() {
          return this.visible;
        },
        set(val) {
          this.$emit("update:visible", val);
        }
      },
      dialogAppendToBody: {
        get() {
          return this.appendToBody;
        },
      },
      clickModalClose: {
        get() {
          return this.closeOnClickModal;
        },
      },
      dialogWidth : {
        get(){
          return this.width
        }
      },
      customDialogClass: {
        get() {
          return [this.customClass, 'cus-dialog',  this.type? 'cus-dialog--'+ this.type : ''].join(' ')
        },
        set(val) {
          this.$emit("update:customClass", [this.customClass, 'cus-dialog', this.type? 'cus-dialog--'+ this.type: ''].join(' '));
        }
      }
    },
    methods: {
      /**
       * 对外抛出cancel事件,由被调用方执行关闭弹窗的行为
       */
      $_handleCancel() {
        this.$emit("cancel");
      },

      /**
       * 对外抛出 confirm事件，由被调用方执行关闭弹窗的行为
       */
      $_handleConfirm() {
        this.$emit("confirm");
      },

      /**
       * 关闭弹框
       */
      closeHandle(){
        this.$emit("close");
      }
    }
  };
</script>
<style lang="scss">
.el-dialog{

    .el-dialog__headerbtn {
        height: 30px;
        top: 3px !important;
    }
    //.el-dialog__footer{
    //    .el-button--primary{
    //        background: #1b6ef6;
    //        border-color: #1b6ef6;
    //    }
    //    .el-button--default{
    //        border-color: #1b6ef6;
    //        color: #1b6ef6;
    //    }
    //}
}
</style>
