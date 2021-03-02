/**
*下拉树组件弹框 
* Created by lzp on 21/3/2
*/
<template>
  <el-dialog
    class="cus-dialog line-params-dialog person-dialog rolegroups"
    title="选择角色"
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
    >
    </el-tree>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="sureHand" size="mini">确定</el-button>
      <el-button @click="dialogVisible = false" size="mini">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  getTreePostAPI,
  getTreeGetAPI,
} from "../api/formDesigner_api";
export default {
  name: "line-group-param-edit-dialog",
  data() {
    return {
      graph: null,
      dialogVisible: false,
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
      responseType: { label: "" }, //配置响应参数
    };
  },
  watch: {
 
  },
  methods: {
    //初始化方法，显示弹框
    show(data) {
      this.url = data.optionSetting.tabs.remoteUrl.tabContent.remoteUrl.value;
      this.methods =
        data.optionSetting.tabs.remoteUrl.tabContent.remoteMethods.value;
      this.responseType.label =
        data.optionSetting.tabs.remoteUrl.tabContent.remoteResponse.from.label;
      this.props.label = this.responseType.label;
      this.dialogVisible = true;
      if(!data.defaultValue.value){
        this.$refs.rogroupEdit.setCheckedNodes([]);
      }
      this.tableData = [];
      // this.roleType = type;
      // if (parentObj[type] && parentObj[type].length) {
      //   let arr = [];
      //   parentObj[type].forEach((item) => {
      //     console.log(item);
      //     arr.push({
      //       id: Number(item.roleGroupId),
      //     });
      //   });
      //   this.defaultData = arr;
      // } else {
      //   this.defaultData = [];
      // }
      // this.$nextTick(() => {
      //   console.log(this.defaultData);
      //   this.$refs.rogroupEdit.setCheckedNodes(this.defaultData);
      // });
    },
    hide() {
      this.dialogVisible = false;
    },
    //树结构加载节点
    loadNode(node, resolve, cb) {
      if (node.level === 0) {
        this.node = node;
      }
      this.resolve = resolve;
      let req = {
        parentId: node.data ? node.data.id : "",
      };
      if (this.methods == "post") {
        getTreePostAPI(this.url, this.methods, req).then((res) => {
          resolve(res.data);
        });
      } else {
        getTreeGetAPI(this.url, this.methods, req).then((res) => {
          resolve(res.data);
        });
      }
    },
    // 点击确定，
    sureHand() {
      let dataList = [],
        arr = [];
      let treeData = this.$refs.rogroupEdit.getCheckedNodes(true, false);
      treeData.forEach((item) => {
        arr.push(item.text);
        // dataList.push(item.id);
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
      // this.selectedRole.forEach(it => {
      //   arr.push(it.name);
      //   dataList.push({
      //     roleId: it.id,
      //     roleName: it.name,
      //   })
      // });
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