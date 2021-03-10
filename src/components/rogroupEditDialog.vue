/**
*下拉树组件弹框 
* Created by lzp on 21/3/2
*/
<template>
  <el-dialog
    class="cus-dialog line-params-dialog person-dialog rolegroups"
    :title="title"
    :visible.sync="dialogVisible"
    width="400"
    append-to-body
  >
    <el-tree
      :props="props"
      :load="loadNode"
      lazy
      show-checkbox
      check-strictly
      node-key="id"
      ref="rogroupEdit"
      :default-checked-keys="defaultData"
      @check="check"
    >
    </el-tree>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="sureHand" size="mini">确定</el-button>
      <el-button @click="dialogVisible = false" size="mini">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getTreePostAPI } from "../api/formDesigner_api";
export default {
  name: "line-group-param-edit-dialog",
  data() {
    return {
      graph: null,
      dialogVisible: false,
      title: "下拉树",
      props: {
        label: "text",
        children: "children",
        isLeaf: "leaf",
      },
      currentClickedOrgId: "", // 当前点击的组织树的id
      roleName: "", //搜索条件
      tableData: [], //人员选择
      selectedRole: [], //已选人员
      defaultData: [],
      url: "", //自定义的请求地址
      methods: "", //请求方式
      responseType: { label: "", value: "" }, //配置响应参数
      isCheck: true,
    };
  },
  watch: {},
  methods: {
    //初始化方法，显示弹框
    show(data) {
      this.title = data.label;
      this.isCheck = data.isCheck;
       this.codeType = data.optionSetting_codeType;
      // this.url = data.optionSetting_tabContent.remoteUrl.value;
      // this.methods = data.optionSetting_tabContent.remoteMethods.value;
      // this.responseType.label =
      //   data.optionSetting_tabContent.remoteResponse.from.label;
      // this.responseType.value =
      //   data.optionSetting_tabContent.remoteResponse.from.value;
      // this.props.label = this.responseType.label;
      this.dialogVisible = true;
      if (!data.defaultValue && this.$refs.rogroupEdit) {
        this.$refs.rogroupEdit.setCheckedNodes([]);
      }
    },
    hide() {
      this.dialogVisible = false;
    },
    //是否多选
    check(data, checkedObj) {
      if (!this.isCheck && this.$refs.rogroupEdit) {
        if (checkedObj.checkedKeys.length > 0) {
          this.$refs.rogroupEdit.setCheckedNodes([data]);
        }
      }
    },
    //树结构加载节点
    loadNode(node, resolve, cb) {
      if (node.level === 0) {
        this.node = node;
      }

      let req = {
        parentId: node.data ? node.data.id : "",
         codeType:this.codeType
      };
      getTreePostAPI( req).then((res) => {
        if (res && res.data && res.data.code == "0000") {
            resolve(res.data.data);
          }
        });
      // if (this.methods == "post") {
      //   getTreePostAPI(this.url, this.methods, req).then((res) => {
      //     if (res && res.data && res.data.code == "0000") {
      //       resolve(res.data.data);
      //     }
      //   });
      // } else {
      //   getTreeGetAPI(this.url, this.methods, req).then((res) => {
      //     if (res && res.data && res.data.code == "0000") {
      //       resolve(res.data.data);
      //     }
        // });
      // }
    },
    // 点击确定，
    sureHand() {
      let dataList = [],
        arr = [];
      let treeData = this.$refs.rogroupEdit.getCheckedNodes(true, false);
      treeData.forEach((item) => {
        arr.push(item.text);
        if (this.roleType == "rolegroups") {
          dataList.push({
             id: item.id,
            name: item.text,
          });
        } else {
          dataList.push({
           id: item.id,
            name: item.text,
          });
        }
      });
      this.$emit("rogroup", {
        value: dataList,
        name: arr.join(),
      });
      this.dialogVisible = false;
    },
  },
};
</script>
<style >
.rolegroups .el-dialog {
  width: 360px;
}
.rolegroups .el-dialog__body {
  height: 360px;
  overflow: auto;
}
</style>