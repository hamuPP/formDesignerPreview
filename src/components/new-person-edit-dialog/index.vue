/**
* 新选人组件弹框
* Created by cgf on 21/4/21
* Modified by ty on 21/7/7
*/
<template>
  <cus-dialog
      :visible.sync="dialogVisible"
      width="900px"
      :title="title"
      type="aoi2"
      @close="closeHand"
      custom-class="form-common-dialog__todo  person-dialog new_dialog"
      append-to-body
  >
    <div class="form-common-dialog-body">
      <el-row class="people-define-group" :gutter="8">
        <!-- 树结构 -->
        <el-col :span="7">
          <div class="org-tree-wrap">
            <el-tabs
                v-model="activeTabName"
                type="card"
                :before-leave="beforeLeavHand"
                tab-position="bottom"
                class="tabPersonRoleClass">
              <!--  有多少个tabs，由父组件判断，父组件传入多少个，这里就显示多少个-->
              <el-tab-pane v-for="(it, index) in sourceTreeList"
                           :key="index"
                           :label="it.title"
                           :name="it.title"
              >
                <el-input v-if="it.treeProps.searchable"
                          class="searchCandidate"
                          placeholder="请输入关键字查询"
                          suffix-icon="el-icon-search"
                          clearable
                          @change="searchInputChange"
                          v-model="currentSearchValue">
                </el-input>
                <!-- 树结构，区分是否为懒加载，（todo:其实现在接口是懒加载，所以只写了懒加载） -->
                <div class="cus-treeSelectTransfer__tree-wrapper ">
                  <el-tree
                      v-if="it.treeProps.lazy && treeVisible && it.title === activeTabName"
                      node-key="id"
                      ref="tree"
                      :props="it.treeProps.props"
                      :load="loadNode"
                      lazy
                      @check="nodeCheckClick"
                      @node-click="handleNodeClick"
                      show-checkbox
                  >
                        <span slot-scope="{ node, data }">
                        <span class="custom-tree-node-text" :data-type="data.type">{{ node.label }}</span>
                        </span>
                  </el-tree>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-col>
        <!-- 人员列表 -->
        <el-col :span="8">
          <div class="people-table-wrap">
            <el-input
                class="people-search-input"
                placeholder="请输入内容"
                prefix-icon="el-icon-search"
                v-model="userSearchValue"
                @change="getTableData"
            >
            </el-input>
            <el-table
                ref="leftTable"
                :data="tableData"
                border
                @select="select"
                class="table-blue2"
                @select-all="selectAll"
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
        <el-col :span="1" class="move-col">
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
        <el-col :span="8">
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
    </div>

    <!-- 操作栏 -->
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="sureHand" size="mini">确定</el-button>
      <el-button @click="dialogVisible = false" size="mini">取消</el-button>
    </span>
  </cus-dialog>


<!--  <el-dialog-->
<!--      class="cus-dialog person-dialog new_dialog"-->
<!--      :title="title"-->
<!--      :close-on-click-modal="false"-->
<!--      :visible.sync="dialogVisible"-->
<!--      @close="closeHand"-->
<!--      width="900"-->
<!--      append-to-body-->
<!--  >-->
<!--    <el-row class="people-define-group" :gutter="8">-->
<!--      &lt;!&ndash; 树结构 &ndash;&gt;-->
<!--      <el-col :span="7">-->
<!--        <div class="org-tree-wrap">-->
<!--          <el-tabs-->
<!--              v-model="activeTabName"-->
<!--              type="card"-->
<!--              :before-leave="beforeLeavHand"-->
<!--              tab-position="bottom"-->
<!--              class="tabPersonRoleClass">-->
<!--            &lt;!&ndash;  有多少个tabs，由父组件判断，父组件传入多少个，这里就显示多少个&ndash;&gt;-->
<!--            <el-tab-pane v-for="(it, index) in sourceTreeList"-->
<!--                         :key="index"-->
<!--                         :label="it.title"-->
<!--                         :name="it.title"-->
<!--            >-->
<!--              <el-input v-if="it.treeProps.searchable"-->
<!--                        class="searchCandidate"-->
<!--                        placeholder="请输入关键字查询"-->
<!--                        suffix-icon="el-icon-search"-->
<!--                        clearable-->
<!--                        @change="searchInputChange"-->
<!--                        v-model="currentSearchValue">-->
<!--              </el-input>-->
<!--              &lt;!&ndash; 树结构，区分是否为懒加载，（todo:其实现在接口是懒加载，所以只写了懒加载） &ndash;&gt;-->
<!--              <div class="cus-treeSelectTransfer__tree-wrapper ">-->
<!--                <el-tree-->
<!--                    v-if="it.treeProps.lazy && treeVisible && it.title === activeTabName"-->
<!--                    node-key="id"-->
<!--                    ref="tree"-->
<!--                    :props="it.treeProps.props"-->
<!--                    :load="loadNode"-->
<!--                    lazy-->
<!--                    @check="nodeCheckClick"-->
<!--                    @node-click="handleNodeClick"-->
<!--                    show-checkbox-->
<!--                >-->
<!--                        <span slot-scope="{ node, data }">-->
<!--                        <span class="custom-tree-node-text" :data-type="data.type">{{ node.label }}</span>-->
<!--                        </span>-->
<!--                </el-tree>-->
<!--              </div>-->
<!--            </el-tab-pane>-->
<!--          </el-tabs>-->
<!--        </div>-->
<!--      </el-col>-->
<!--      &lt;!&ndash; 人员列表 &ndash;&gt;-->
<!--      <el-col :span="8">-->
<!--        <div class="people-table-wrap">-->
<!--          <el-input-->
<!--              class="people-search-input"-->
<!--              placeholder="请输入内容"-->
<!--              prefix-icon="el-icon-search"-->
<!--              v-model="userSearchValue"-->
<!--              @change="getTableData"-->
<!--          >-->
<!--          </el-input>-->
<!--          <el-table-->
<!--              ref="leftTable"-->
<!--              :data="tableData"-->
<!--              border-->
<!--              @select="select"-->
<!--              class="table-blue2"-->
<!--              @select-all="selectAll"-->
<!--          >-->
<!--            <el-table-column type="selection" align="center" width="60">-->
<!--            </el-table-column>-->
<!--            <el-table-column prop="name" align="center" label="姓名">-->
<!--            </el-table-column>-->
<!--          </el-table>-->
<!--          <Pagination-->
<!--              @page-change="handleCurrentChange"-->
<!--              :config="configPage"-->
<!--              :layout="pageLayout"-->
<!--              prevText=""-->
<!--              nextText=""-->
<!--              small-->
<!--          >-->
<!--          </Pagination>-->
<!--        </div>-->
<!--      </el-col>-->
<!--      &lt;!&ndash; 左移、右移 &ndash;&gt;-->
<!--      <el-col :span="1" class="move-col">-->
<!--        <el-button-->
<!--            class="people-transfer-btn"-->
<!--            type="primary"-->
<!--            icon="el-icon-arrow-right"-->
<!--            circle-->
<!--            size="mini"-->
<!--            @click="selectPeople(1)"-->
<!--        >-->
<!--        </el-button>-->
<!--        <el-button-->
<!--            class="people-transfer-btn"-->
<!--            type="primary"-->
<!--            size="mini"-->
<!--            icon="el-icon-arrow-left"-->
<!--            circle-->
<!--            @click="unselectPeople(1)"-->
<!--        >-->
<!--        </el-button>-->
<!--      </el-col>-->
<!--      &lt;!&ndash; 已选人员 &ndash;&gt;-->
<!--      <el-col :span="8">-->
<!--        <el-table-->
<!--            ref="rightTable"-->
<!--            :data="selectedPeople"-->
<!--            border-->
<!--            @row-click="bindParm"-->
<!--            class="table-blue2 right-table"-->
<!--        >-->
<!--          <el-table-column type="selection" align="center" width="60">-->
<!--          </el-table-column>-->
<!--          <el-table-column prop="name" align="center" label="姓名">-->
<!--          </el-table-column>-->
<!--        </el-table>-->
<!--      </el-col>-->
<!--    </el-row>-->
<!--    &lt;!&ndash; 操作栏 &ndash;&gt;-->
<!--    <span slot="footer" class="dialog-footer">-->
<!--      <el-button type="primary" @click="sureHand" size="mini">确定</el-button>-->
<!--      <el-button @click="dialogVisible = false" size="mini">取消</el-button>-->
<!--    </span>-->
<!--  </el-dialog>-->
</template>

<script>
import CusDialog from '../CusDialog'
import {
  getUser,
  getOrgTree,
  getTranserPerTreeList
} from "../../api/formDesigner_api";
import Pagination from "./../pagination.vue";
export default {
  name: 'nwPerDilg',
  components: { Pagination, CusDialog},
  props: {
  },
  data() {
    return {
      graph: null,
      title: "选择人员",
      dialogVisible: false,
      activeTabName: '',
      props: {
        label: "text",
        children: "children",
        isLeaf: "leaf",
      },
      currentSearchValue: '',// 当前显示的树的搜索框的值
      tabNameList: [],// 选人树的tabs的名称们
      MessageConfig: {
        showMessage: false, //打开消息提示框
        MsgBoxType: "", //消息提示框类型
        MsgText: "",
      },
      currentClickedOrgId: "", // 当前点击的组织树的id
      userSearchValue: "", //搜索条件
      tableData: [], //人员选择
      selectedPeople: [], //已选人员
      treeVisible: false,// 是否显示树?
      sourceTreeList: [],
      isMultiple: false,
      conditionSql: "",
      //分页参数
      configPage: {
        pageTotal: 0,
        pageSize: 10,
        currentPage: 1,
      },
      isCheckOne: false,
      rootNode: null,
      rootNode_resolve: null,
      // 复选框选中树得节点数据
      selectedCheckBoxNodeList: [],
      // 当前所属组件数据信息
      data: {},
      pageLayout: "prev,pager,next,total", // 分页的布局配置。如果没有这个参数，则组件内会采用其默认的配置
    };
  },
  watch: {
  },
  methods: {
    //初始化参数信息
    initParam(dataOptions){
      var {sourceTreeList, isMultiple } = dataOptions
      this.sourceTreeList = sourceTreeList
      this.isMultiple = isMultiple
      this.tabNameList = sourceTreeList.map(it => {
        return it.title;
      });
      this.activeTabName = this.tabNameList[0];// 默认的激活标签是第一个tab
    },
    //初始化方法，显示弹框
    show(users, data, isCheckOne, dataOptions) {
      // 赋值传递过来得参数
      this.initParam(dataOptions)
      this.isCheckOne = isCheckOne;
      this.title = data.label;
      this.rootNode = null;
      this.rootNode_resolve = null;
      this.treeVisible = false;
      this.dialogVisible = true;
      this.tableData = [];
      this.data = data
      console.log(users);
      if (users.length) {
        let list = [];
        users.forEach((it) => {
          list.push({
            name: it.userName,
            id: it.userId,
            condition: it.condition||'',
            inparam: it.inparam||'',
          });
        });
        this.selectedPeople = list;
      } else {
        this.selectedPeople = [];
      }
      this.$nextTick(_ => {
        this.treeVisible = true;
      })
    },
    closeHand() {
      this.resetViar()
    },
    hide() {
      this.dialogVisible = false;
    },
    // 重置各种变量为初始值
    resetViar() {
      this.treeVisible = false;
      this.dialogVisible = false
      this.currentSearchValue = '';
      // if (this.rootNode) {
      //   this.rootNode.childNodes = [];
      //   this.rootNode.checked = false;
      // }
      this.allClear()
    },
    bindParm(row, column, e) {
      this.$refs.paramEditDialog.show(this.graph, row, "person");
    },
    select(selection, row) {
      if (this.isCheckOne) {
        this.$refs.leftTable.clearSelection();
        this.$refs.leftTable.toggleRowSelection(row, true);
      }
    },
    selectAll(selection) {
      if (this.isCheckOne) {
        this.$refs.leftTable.clearSelection();
      }
    },
    // 查询输入框改变了值
    searchInputChange(val) {
      this.rootNode.childNodes = [];
      this.rootNode.checked = false;
      this.refreshTree(val);
    },
    // 根据查询值，重新查询树
    refreshTree(val) {
      this.loadNode(this.rootNode, this.rootNode_resolve);
    },
    //树结构加载节点
    loadNode(node, resolve, cb) {
      let reqData = {
        condition: "",
        parentId: node.data ? node.data.id : 0,
        deptIds: ""
      };

      let apiUrl = '';
      let searchType = 'data';// 默认-->指定axios的参数方式是params还是data
      for (let i = 0, len = this.sourceTreeList.length; i < len; i++) {
        let child = this.sourceTreeList[i];
        if (child.title == this.activeTabName) {
          if (node.level === 0 && this.data.selectedTreeNodesKeys && this.data.selectedTreeNodesKeys.length) {
            // 需要请求发送选中得所有nodes keys数据给后端
            // 这个地方只需要 重置apiurl得值就可以了，角色和组织的接口都需要
            reqData.parentId = ''
            var arrKeys = this.data.selectedTreeNodesKeys.map((item, index) => {
              return item.id
            })
            reqData.deptIds = arrKeys.join(',')
          }
          apiUrl = child.treeProps.apiUrl;
          // 加入搜索框的值
          reqData[child.treeProps.searchKey] = this.currentSearchValue || '';
          reqData = Object.assign({},
              reqData,
              child.treeProps.searchParams || {}
          );
          searchType = child.treeProps.searchType;
          break;
        }
      }
      // to do ---- 判断上次保存得nodes是否是空 空则正常请求数据 有值时则传递给后端
      if (node.level === 0) {
        this.rootNode = node;//这里是关键！在data里面定义一个变量，将node.level == 0的node存起来
        this.rootNode_resolve = resolve;//同上，把node.level == 0的resolve也存起来
      }
      if (node.level > 0) {
        reqData.parentId = node.data.id;
      }
      this.resolve = resolve;
      // this.$emit('treeRequestPending', true);
      // 向后台查询数据
      getTranserPerTreeList({data: reqData, url: apiUrl, searchType: searchType})
          .then(res=>{
            // 请求成功的情况
            if(res && res.data && res.data.code == '0000'){
              let resData = res.data.data;
              if(resData.constructor === Array && resData.length){
                var newN = [];
                resData.forEach(it => {
                  let newIt = Object.assign({}, it)
                  newN.push(newIt)
                });
                this.resolve(newN);
              }
              else{
                this.resolve([]);
              }
            }
            // 请求失败的情况
            else{
              this.resolve([]);
            }
          })
          .catch(e=>{
            // debugger;
            this.resolve([]);
          })
    },
    //树节点点击
    handleNodeClick(data) {
      debugger
      this.currentClickedOrgId = data.id;
      this.configPage.currentPage = 1
      this.getTableData(); //获取人员列表
    },
    // 复选框点击事件
    nodeCheckClick(nowObj, {checkedNodes}){
      console.log("选中复选框得对象当前对象", nowObj)
      console.log("选中复选框选中对象", checkedNodes)
      this.selectedCheckBoxNodeList = checkedNodes
    },
    beforeLeavHand(activeName, oldActiveName) {
      // 如果是初始化页面的时候，返回true即可
      console.log('before leave', (typeof activeName === 'undefined' || typeof oldActiveName === 'undefined' || activeName === '0'));
      // debugger;
      if (typeof activeName === 'undefined' || typeof oldActiveName === 'undefined' || activeName === '0' || oldActiveName === '0') {
        return true;
      }
      // 如果点击了不同的树tab，则重新请求新的树，并且清空之前所选的所有节点
      else if (activeName !== oldActiveName) {
        console.log('do clear')
        // 清空之前的搜索条件
        this.currentSearchValue = '';
        // todo 点击的tab不同，检查此时是否有已经派发和抄送的选择，有则提示
        this.allClear();
        return true;
      }
    },
    // 清空所有树的勾选状态
    clearTreeSelection() {
      if (this.$refs.tree) {
        if (this.$refs.tree.constructor === Array) {
          for (let i = 0, len = this.$refs.tree.length; i < len; i++) {
            this.$refs.tree[i].setCheckedKeys([]);
          }
        } else {
          this.$refs.tree.setCheckedKeys([]);
        }
      }
    },
    /**
     * 清空全部已选人
     */
    allClear() {
      // todo  清空选中项，注意：不要用初始值来做，因为如果初始值有值
      // this.formateTargetList();
      //清空当前人员得数据
      this.selectedPeople = [];
      this.tableData = []
      this.userSearchValue = ""
      this.selectedCheckBoxNodeList = []
      this.configPage = {
        pageTotal: 0,
        pageSize: 10,
        currentPage: 1,
      }
      // 清空树的勾选状态
      this.clearTreeSelection();
    },
    // 请求组织下的人员
    getTableData() {
      debugger
      let queryParams = {
        searchValue: this.userSearchValue,
        //orgId: this.currentClickedOrgId,
        orgId: "",
        roleIds: "",
        condition: this.conditionSql,
        userCondition: this.conditionSql,
        // 分页参数
        page: this.configPage.currentPage, // 第几页
        limit: this.configPage.pageSize, // 每页几条
      };
      if (this.activeTabName === "组织") {
        queryParams.orgId = this.currentClickedOrgId
      } else if (this.activeTabName === "角色") {
        queryParams.roleIds = this.currentClickedOrgId
      }
      getUser(queryParams)
          .then((res) => {
            if(res && res.data && res.data.code == '0000'){
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
      if (this.isCheckOne) {
        if (this.selectedPeople.length > 0) {
          this.tableData.push(this.selectedPeople[0]);
          this.selectedPeople.splice(0,1,selection[0])
        } else {
          this.selectedPeople = newRightData;
        }
      } else {
        this.selectedPeople = this.selectedPeople.concat(newRightData);
      }

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
      debugger;
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
      debugger;

      // selectedTreeNodesKeys
      this.$emit("personSure", usersData, names.join(), ids.join(), {type: "newUser", selectedNodes: this.selectedCheckBoxNodeList});
      this.dialogVisible = false;
    },
  },
};
</script>

<style lang="scss">
$input-line-height: 26px;
.person-dialog.new_dialog {

  .el-dialog{
    width: 900px;
  }
  .el-dialog__body{
    background: #f2f6f9;
    .people-table-wrap{
      background: #fff;
      .people-search-input{
        margin: 10px;
        width: calc(100% - 20px);
        height:auto !important;
      }
      .el-table{
        height: calc(100% - 46px - 42px);
      }
    }
  }
  .tabPersonRoleClass.el-tabs{
    height: 100%;
    overflow: hidden;
    .el-tabs__content{
      height: calc(100% - 31px);
      border-bottom: 1px solid #f1f1f1;
      .el-tab-pane{
        height: 100%;
        .cus-treeSelectTransfer__tree-wrapper {
          height: calc(100% - 46px);
          overflow: auto;
        }
      }

      .tree-line{
        // 点中时的背景颜色
        .el-tree-node:focus>.el-tree-node__content {
          background-color:transparent;
        }
        // 悬浮时的背景颜色
        .el-tree-node__content:hover {
          background-color: transparent;
        }
        .el-tree-node {
          position: relative;
          padding-left: 16px; // 缩进量
        }
        .el-tree-node__children {
          padding-left: 16px; // 缩进量
        }
        // 一级

        // & >.el-tree-node>.el-tree-node__content::before{
        //     content: '+';
        // }
        // 竖线

        .el-tree-node::before {
          content: "";
          height: 100%;
          width: 1px;
          position: absolute;
          left: -3px;
          top: -26px;
          border-width: 1px;
          border-left: 1px dashed #52627C;
        }
        //一级节点的竖线
        & >.el-tree-node>.el-tree-node__children>.el-tree-node::before{
          left: 8px;
        }

        // 当前层最后一个节点的竖线高度固定
        .el-tree-node:last-child::before {
          height: 38px; // 可以自己调节到合适数值
        }

        // 横线
        .el-tree-node::after {
          content: "";
          width: 24px;
          height: 20px;
          position: absolute;
          left: -3px;
          top: 12px;
          border-width: 1px;
          border-top: 1px dashed #52627C;
        }
        //一级节点的横线
        & >.el-tree-node>.el-tree-node__children>.el-tree-node::after{
          width: 11px;
          left: 8px;
        }

        // 去掉最顶层的虚线，放最下面样式才不会被上面的覆盖了
        & > .el-tree-node::after {
          border-top: none;
        }
        & > .el-tree-node::before {
          // border-left: none;
          left: 21px;
          top:20px;
          height: 70%;
        }
        & > .el-tree-node:nth-last-child(2):before {
          border-left: none;
        }

        // & > .el-tree-node:nth-of-type(3)::before {
        //   border-left: none;
        // }
        // 展开关闭的icon
        .el-tree-node__expand-icon{
          font-size: 16px;
          // 叶子节点（无子节点）
          &.is-leaf{
            color: transparent;
            // display: none; // 也可以去掉
          }
        }
      }
      .searchCandidate{
        display: block;
        height: $input-line-height;
        line-height: $input-line-height;
        width: 90%;
        margin: 10px auto;
        .el-input__inner{
          height: $input-line-height;
          line-height: $input-line-height;
        }
        .el-input__suffix{
          .el-input__icon{
            line-height: $input-line-height;
          }
        }
      }
    }
    .el-tabs__header.is-bottom{
      border: none;
      margin: 0;
      .el-tabs__nav.is-bottom{
        .el-tabs__item.is-bottom.is-active{
          background-color: #f7faff;
          color: #175eff;
          border-radius: 4px;
        }
        .el-tabs__item{
          height: 30px;
          line-height: 30px;
          padding: 0 30px;
        }
      }
    }
  }
  .el-dialog__footer{
    background: #e2e9f0;
  }
  .people-define-group {
    .people-table-wrap {
      .Pagination {
        height: 42px;
      }
    }
  }
}
</style>