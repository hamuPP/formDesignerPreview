/**
*人选选择组件弹框 
* Created by lzp on 21/3/2
*/
<template>
  <el-dialog
    class="cus-dialog line-params-dialog person-dialog"
    :title="title"
    :visible.sync="dialogVisible"
    width="400"
    append-to-body
  >
    <el-row class="people-define-group">
      <!-- 树结构 -->
      <el-col :span="6">
        <div class="org-tree-wrap">
          <el-tree
            :props="props"
            :load="loadNode"
            lazy
            @node-click="handleNodeClick"
          >
          </el-tree>
        </div>
      </el-col>
      <!-- 人员列表 -->
      <el-col :span="10">
        <div class="people-table-wrap">
          <el-input
            class="people-search-input"
            style="width: 100%"
            placeholder="请输入内容"
            prefix-icon="el-icon-search"
            v-model="userSearchValue"
            @input="getTableData"
          >
          </el-input>
          <el-table
            ref="leftTable"
            :data="tableData"
            border
            class="table-blue2"
          >
            <el-table-column type="selection" align="center" width="60">
            </el-table-column>
            <el-table-column prop="name" align="center" label="姓名">
            </el-table-column>
          </el-table>
          <Pagination
            @page-change="handleCurrentChange"
            :config="configPage"
            :layout="pageLayout"
            prevText=""
            nextText=""
            small
          >
          </Pagination>
        </div>
      </el-col>
      <!-- 左移、右移 -->
      <el-col :span="2" class="move-col">
        <el-button
          class="people-transfer-btn"
          type="primary"
          icon="el-icon-arrow-right"
          circle
          size="mini"
          @click="selectPeople(1)"
        >
        </el-button>
        <el-button
          class="people-transfer-btn"
          type="primary"
          size="mini"
          icon="el-icon-arrow-left"
          circle
          @click="unselectPeople(1)"
        >
        </el-button>
      </el-col>
      <!-- 已选人员 -->
      <el-col :span="6">
        <el-table
          ref="rightTable"
          :data="selectedPeople"
          border
          @row-click="bindParm"
          class="table-blue2 right-table"
        >
          <el-table-column type="selection" align="center" width="60">
          </el-table-column>
          <el-table-column prop="name" align="center" label="姓名">
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!-- 操作栏 -->
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="sureHand" size="mini">确定</el-button>
      <el-button @click="dialogVisible = false" size="mini">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getUser, getOrgTree } from "../api/formDesigner_api";
import Pagination from "./pagination.vue";
export default {
  name: "line-param-edit-dialog",
  components: { Pagination },
  props: ["sigleChose"],
  data() {
    return {
      graph: null,
      title: "选择人员",
      dialogVisible: false,
      props: {
        label: "text",
        children: "children",
        isLeaf: "leaf",
      },
      MessageConfig: {
        showMessage: false, //打开消息提示框
        MsgBoxType: "", //消息提示框类型
        MsgText: "",
      },
      currentClickedOrgId: "", // 当前点击的组织树的id
      userSearchValue: "", //搜索条件
      tableData: [], //人员选择
      selectedPeople: [], //已选人员
      conditionSql: "",
      //分页参数
      configPage: {
        pageTotal: 0,
        pageSize: 10,
        currentPage: 1,
      },
      pageLayout: "prev,pager,next,total", // 分页的布局配置。如果没有这个参数，则组件内会采用其默认的配置
    };
  },
  watch: {},
  methods: {
    //初始化方法，显示弹框
    show(users, data) {
      this.dialogVisible = true;
      this.title = data.label;
      this.tableData = [];
      if (users.length) {
        let list = [];
        users.forEach((it) => {
          list.push({
            name: it.userName,
            id: it.userId,
            condition: it.condition,
            inparam: it.inparam,
          });
        });
        this.selectedPeople = list;
      } else {
        this.selectedPeople = [];
      }
    },
    hide() {
      this.dialogVisible = false;
    },
    bindParm(row, column, e) {
      this.$refs.paramEditDialog.show(this.graph, row, "person");
    },
    //树结构加载节点
    loadNode(node, resolve, cb) {
      if (node.level === 0) {
        this.node = node;
      }
      let req = {
        condition: "",
        parentId: node.data ? node.data.id : 0,
      };
      getOrgTree(req).then((res) => {
        if (res && res.data && res.data.code == "0000") {
          resolve(res.data.data);
        }
      });
    },
    //树节点点击
    handleNodeClick(data) {
      this.currentClickedOrgId = data.id;
      this.getTableData(); //获取人员列表
    },
    // 请求组织下的人员
    getTableData() {
      let queryParams = {
        searchValue: this.userSearchValue,
        orgId: this.currentClickedOrgId,
        condition: this.conditionSql,
        userCondition: this.conditionSql,
        // 分页参数
        page: this.configPage.currentPage, // 第几页
        limit: this.configPage.pageSize, // 每页几条
      };
      getUser(queryParams).then((res) => {
        if (res && res.data && res.data.code == "0000") {
          this.tableData = res.data.data.data;
          // 处理分页参数
          this.configPage.pageTotal = parseInt(res.data.data.total);
        }
      });
    },
    //分页 todo 未调试和检查接口
    handleCurrentChange(cur, page) {
      let that = this;
      this.configPage.currentPage = cur;
      this.configPage.pageSize = page;
      // 查询下一页的人员

      this.getTableData();
    },
    // 选人
    selectPeople(tableNo) {
      let selection = this.$refs.leftTable.selection; //选中的值
      console.log(selection);
      let newLeftData = [],
        newRightData = [];
      selection.forEach((item) => {
        item.id = item.userId;
        if (!this.isInArray(item.id, this.selectedPeople, "id")) {
          newRightData.push(item);
        }
      });
      this.selectedPeople = this.selectedPeople.concat(newRightData);
      this.tableData.forEach((it) => {
        if (!this.isInArray(it.id, selection, "id")) {
          newLeftData.push(it);
        }
      });
      this.tableData = newLeftData;
    },
    isInArray(child, arr, key) {
      for (var i = 0, len = arr.length; i < len; i++) {
        var c = key ? arr[i][key] : arr[i];
        if (c == child) {
          return true;
        }
      }
      return false;
    },
    // 取消选人
    unselectPeople(tableNo) {
      let table = {
        1: this.$refs.rightTable,
        2: this.$refs.table4,
        3: this.$refs.table6,
      }[tableNo];
      let leftTableData = {
        1: "tableData",
        2: "table3Data",
        3: "table5Data",
      }[tableNo];
      let rightTableData = {
        1: "selectedPeople",
        2: "table4Data",
        3: "table6Data",
      }[tableNo];
      let selection = table.selection;
      let newRightData = [];
      this[leftTableData] = this[leftTableData].concat(selection); // 把选中的行，添加到左边的table里
      this[rightTableData].forEach((it) => {
        if (!this.isInArray(it.id, selection, "id")) {
          newRightData.push(it);
        }
      });
      this[rightTableData] = newRightData;
    },
    // 点击确定，
    sureHand() {
      let ids = [];
      let names = [];
      let usersData = [];
      this.selectedPeople.forEach((it) => {
        ids.push(it.id);
        names.push(it.name);
        usersData.push({
          userId: it.id,
          userName: it.name,
          condition: it.condition,
          inparam: it.inparam,
        });
      });
      this.$emit("personSure", usersData, names.join(), ids.join());
      this.dialogVisible = false;
    },
  },
};
</script>

<style lang="scss">
.person-dialog {
  .people-define-group {
    .people-table-wrap {
      .Pagination {
        height: 42px;
      }
    }
  }
}
</style>