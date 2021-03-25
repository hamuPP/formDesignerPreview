 /**
*下拉树组件
* Created by lzp on 21/3/12
*/
 <template>
  <div>
    <el-popover
      popper-class="selectTree"
      placement="bottom-start"
      transition="fade-in-linear"
      v-model="visible"
      trigger="click"
      :disabled="data.disabled"
    >
      <el-tree
        :props="props"
        :load="loadNode"
        lazy
        show-checkbox
        check-strictly
        node-key="id"
        ref="rogroupEdit"
        @check="check"
        :key="treeKey"
        :style="{ width: treeWidth - 28 + 'px' }"
      >
      </el-tree>
      <el-input
        class="treeInput"
        readonly
        @click.native.stop="open"
        v-model="data.defaultValueArr"
        :disabled="data.disabled"
        slot="reference"
        :suffix-icon="icon"
        ><i
          @click="clear"
          v-if="data.defaultValueArr"
          slot="suffix"
          class="el-icon-close"
        ></i>
      </el-input>
    </el-popover>
  </div>
</template>
  <script>
import { getTreePostAPI } from "../api/formDesigner_api";
export default {
  name: "selectTree",
  props: {
    data: {
      type: Object,
      default() {
        return {};
      },
    },
    formModel: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      visible: false,
      icon: "el-icon-arrow-down",
      update: true,
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
      codeType: "",
      isCheck: false,
      flag: false,
      treeKey: 1,
      treeWidth: 0,
    };
  },
  created() {
    this.codeType = this.data.optionSetting_codeType;
  },
  mounted() {
    this.treeWidth = this.$el.getElementsByClassName(
      "treeInput"
    )[0].offsetWidth;
  },
  watch: {
    data: {
      handler(n, o) {
        if (n.optionSetting_codeType != this.codeType) {
          this.treeKey++;
          this.codeType = n.optionSetting_codeType;
        }
        this.treeWidth = this.$el.getElementsByClassName(
          "treeInput"
        )[0].offsetWidth;
      },
      deep: true,
    },
  },
  methods: {
    //打开下拉树
    open() {
      this.isCheck = this.data.isCheck;
      // this.isCheck = this.data.isCheck.value;
      // if (this.codeType) {
      //   this.flag = true;
      // }
    },
    //树结构加载节点
    loadNode(node, resolve, cb) {
      if (this.codeType) {
        if (node.level === 0) {
          this.node = node;
        }
        this.resolve = resolve;
        let req = {
          parentId: node.data ? node.data.id : "",
          codeType: this.codeType,
        };
        getTreePostAPI(req).then((res) => {
          if (res && res.data && res.data.code == "0000") {
            resolve(res.data.data);
          }
        });
      }
    },
    check(data, checkedObj) {
      if (!this.isCheck && this.$refs.rogroupEdit) {
        if (checkedObj.checkedKeys.length > 0) {
          this.$refs.rogroupEdit.setCheckedNodes([data]);
        }
      }
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
      this.data.defaultValueArr = arr.join();
      this.data.defaultValue = "";
      this.formModel[this.data.code] = "";
      dataList.forEach((item) => {
        this.data.defaultValue += item.id + ",";
        this.formModel[this.data.code] += item.id + ",";
      });
    },
    clear() {
      event.stopPropagation();
      this.$refs.rogroupEdit.setCheckedNodes([]);
      this.data.defaultValueArr = "";
      this.data.defaultValue = "";
      this.formModel[this.data.code] = "";
    },
  },
  beforeDestroy() {},
  destroyed() {},
};
</script>
 <style lang="scss">
.selectTree {
  height: 300px;
  overflow-y: auto;
  overflow-x: hidden;

  div[aria-disabled="true"] {
    .el-tree-node__content {
      cursor: not-allowed;
    }
  }
}
.treeInput {
  input {
    cursor: pointer;
  }
  .el-icon-close:before {
    cursor: pointer;
  }
.el-input__inner{
    padding-right:45px
  }
}
</style>