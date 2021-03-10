/**
* 一长条的按钮组操作栏，默认是不展开的哦。
* Created by tangyue on 20/12/29
*/
<template>
  <div class="toolbox-buttons" :class="{'is-expanded': isExpanded}">
    <span
            v-if="!isExpanded"
            class="iconfont iconxiangyou operate-icon"
            @click="showOperate(true)">
    </span>
    <div v-if='isExpanded'>
      <span class="iconfont iconLeft operate-icon" @click="showOperate(false)"></span>
      <!--  展开后的内容，由调用页自己控制   -->
      <slot></slot>
<!--      <div class="btn">-->
<!--        <el-button v-if="opList.signin" type="primary" size="mini" @click="signinHandle">确认受理</el-button>-->
<!--        <el-button v-if="boId&&opList.submit" type="primary" size="mini" @click="submitHandle">提交</el-button>-->
<!--        <el-button v-if="opList.transfer" type="primary" size="mini" @click="moveHandle">移交</el-button>-->
<!--        <el-button v-if="opList.reject" type="primary" size="mini" @click="rejectHandle">驳回</el-button>-->
<!--        <el-button v-if="opList.terminate" type="primary" size="mini" @click="terminateHandle">终止</el-button>-->
<!--        <el-button type="primary" size="mini" @click="saveHandle">保存</el-button>-->
<!--        <el-button type="warning" size="mini" @click="cancelSaveBasicInfo">取消</el-button>-->
<!--      </div>-->
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ToolboxButtons',
    props: {
      // 样式控制，是否在下面？
      bottom: {
        type: Boolean,
        default: false
      },
      // 是否展开，默认是不展开哦
      expand: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      isExpanded: {
        get(){
          return this.expand;
        },
        set(val){
          this.$emit("update:expand", val);
        }
      }
    },
    methods: {
      showOperate(type){
        this.isExpanded = type;
      }
    }
  }
</script>

<style scoped>

</style>