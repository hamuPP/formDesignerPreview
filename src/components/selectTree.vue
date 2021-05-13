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
        :data="shownTreeData"
        :props="treeProps"
        :load="loadNode"
        :lazy="lazy"
        show-checkbox
        check-strictly
        :node-key="nodeKey"
        ref="rogroupEdit"
        @check="check"
        :key="treeKey"
        :style="{ width: treeWidth - 28 + 'px' }"
      >
      </el-tree>
      <el-input
        class="treeInput"
        :readonly="!data.localSearchable"
        @input="debounceInputChange"
        @click.native.stop="open"
        v-model="data.defaultValueArr"
        :disabled="data.disabled"
        slot="reference"
        :suffix-icon="icon"
        ><i
          @click="clear"
          v-if="data.clearable && data.defaultValueArr"
          slot="suffix"
          class="el-icon-close"
        ></i>
      </el-input>
    </el-popover>
  </div>
</template>
  <script>
    import {debounce} from 'throttle-debounce';
    import { getTreePostAPI } from "../api/formDesigner_api";
export default {
  name: "selectTree",
  props: {
    // element tree的props属性，主要不要和vue的props搞混了
    treeProps: {
      type: Object,
      default(){
        return {
          label: "text",
          children: "children",
          isLeaf: "leaf",
        }
      }
    },
    data: {
      type: Object,
      default() {
        return {};
      },
    },
    nodeKey: {
      type: String,
      default: 'id'
    },
    // 树的数据（非懒加载模式下用的）
    staticTreeData: {
      type: Array,
      default(){
        return []
      }
    },
    // 是否懒加载，默认不是懒加载
    lazy: {
      type: Boolean,
      default: false
    },
    formModel: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    shownTreeData: {
      get(){
        if(this.previousQuery){
          return this.filteredTreeData;
        }
        else{
          return this.staticTreeData;
        }
      }
    }
  },
  data() {
    return {
      visible: false,
      icon: "el-icon-arrow-down",
      update: true,
      graph: null,
      dialogVisible: false,
      title: "下拉树",
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
      previousQuery: null,// 上传搜索的信息
      filteredTreeData: [],
    };
  },
  created() {
    this.debounceInputChange = debounce(0, (val) => {
      this.inputChange(val);
    });
    // 如果当前是配置的码表
    if(this.data.optionSetting === 'remote') {
      this.codeType = this.data.optionSetting_codeType;
    }
  },
  mounted() {
    this.treeWidth = this.$el.getElementsByClassName(
      "treeInput"
    )[0].offsetWidth;

    // 根据defaultValue设置默认勾选的节点
    if(this.data.defaultValue){
      try{
        this.$refs.rogroupEdit.setCheckedKeys(this.data.defaultValue.split(','));
      }catch(e){
        console.log(e)
      }
    }
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
      let maxCount = this.data.multItemCounts || 0;// 多选时最多可选项，如果是 null 则不限制

      // 单选的情况
      if (!this.isCheck && this.$refs.rogroupEdit) {
        if (checkedObj.checkedKeys.length > 0) {
          this.$refs.rogroupEdit.setCheckedNodes([data]);
        }
      }

      // 多选的情况
      if(this.isCheck && maxCount){
        if (checkedObj.checkedKeys.length > maxCount) {
          let _keys = checkedObj.checkedKeys;
          for(let i = 0,len = _keys.length;i<len;i++){
            if(_keys[i] === data.value){
              _keys.splice(i, 1, 0)
            }
          }

          this.$message.error("超出最大选项数量");
          this.$refs.rogroupEdit.setCheckedKeys(_keys);
        }
      }

      let dataList = [];
      let arr = [];
      let treeData = this.$refs.rogroupEdit.getCheckedNodes(true, false);
      treeData.forEach((item) => {
        arr.push(item[this.treeProps.label]);

        if (this.roleType == "rolegroups") {
          dataList.push({
            id: item.id,
            name: item.text,
          });
        } else {
          dataList.push({
            id: item[this.nodeKey],
            name: item[this.treeProps.label]
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
    inputChange(val){
      this.previousQuery = val;
      if (val) {
        this.filteredTreeData = this.staticTreeData.filter(it =>{
          return it[this.treeProps.label].indexOf(val) > -1
        });
      } else {
        this.filteredTreeData = [];
      }
      debugger;
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
