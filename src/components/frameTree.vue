 /**
*弹出树选择器
* Created by lzp on 21/6/1
*/

<template>
  <div class="frameTree">
    <el-dialog
      class="cus-dialog line-params-dialog person-dialog"
      :title="title"
      :visible.sync="dialogVisible"
      width="400"
      append-to-body
    >
      <div class="choose" :style="{ width: '60%' }">
        <div class="chooseTitle">{{title}}</div>
        <div class="chooseBody includeFoot">
          <el-tree
            ref="tree"
            :data="treeData"
            :props="props"
            :load="loadNode"
            :lazy="lazy"
            show-checkbox
            node-key="id"
            :default-checked-keys="defKeys"
            :check-strictly="true"
            @check-change="handleCheckChange"
          >
            <span class="custom-tree-node" slot-scope="{ data }">
              <span v-if="data.leaf">
                <i class="iconwenjian iconfont"></i>
                {{ data.text }}
              </span>
              <span v-if="!data.leaf">
                <i class="iconwenjianjia iconfont"></i>
                {{ data.text }}
              </span>
            </span>
          </el-tree>
        </div>
        <div class="chooseFoot">
          <div class="choose"></div>
        </div>
      </div>
      <div class="choose" :style="{ width: '39%' }">
        <div class="chooseTitle">
          <span class="iconfont">&#xe627;</span>选择结果
          <span class="tips">(双击名字删除)</span>
        </div>
        <div class="chooseBody">
          <el-checkbox-group v-model="delList">
            <el-checkbox
              class="showList"
              v-for="(item, index) in checkList"
              :label="item.text"
              :key="index"
            >
              <span @dblclick="delPeople(item, 'single')">
                {{
                item.text
                }}
              </span>
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="chooseFoot">
          <el-checkbox @change="checkAll" v-model="checkedAll">全选</el-checkbox>
          <span class="del" @click="delPeople(delList, 'multiple')">
            <i class="el-icon-delete"></i>
          </span>
        </div>
      </div>
      <!-- 操作栏 -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sureHand" size="mini">确定</el-button>
        <el-button @click="dialogVisible = false" size="mini">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getFrameTreeData } from "../api/formDesigner_api";
export default {
  name: "frameTree",
  props: {
    staticTreeData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      title: "",
      checkList: [],
      treeData: [],
      dialogVisible: false,
      delList: [],
      defKeys: [],
      checkedAll: false, //是否全选
      resolveData: [],
      areaTreeData: "", // 地域结构数据
      props: {
        label: "text",
        children: "zones",
        isLeaf: "leaf",
      },
      data: "",
      lazy: false,
      isCheck: true,
      url: "",
      req: {},
      areaTreeData: [],
    };
  },
  mounted() {},
  methods: {
    /**
     * 弹框初始化
     * @param data
     */
    init(data) {
      this.dialogVisible = true;
      this.data = JSON.parse(JSON.stringify(data));
      this.title = this.data.label;
      this.defKeys = [];
      this.delList = [];
      this.checkList = [];
      this.isCheck = this.data.isCheck;
      if (this.data.optionSetting == "remoteDict") {
        //码表
        this.lazy = false;
        this.treeData = [...this.staticTreeData];
        this.treeData.forEach((item) => {
          item.text = item.label;
          item.id = item.value;
        });
        if (this.data.defaultValue) {
          this.defKeys = this.data.defaultValue.split(",");
          this.defKeys.forEach((item, index) => {
            this.checkList.push({
              text: this.data.defaultValueArr.split(",")[index],
              id: item,
            });
          });
          this.$nextTick(() => {
            this.$refs.tree.setCheckedKeys(this.defKeys);
          });
        }
      } else if (this.data.optionSetting == "remoteUrl2") {
        //远程接口
        this.lazy = true;
        if (this.data.defaultValue) {
          this.defKeys = this.data.defaultValue.split(",");
          this.defKeys.forEach((item, index) => {
            this.checkList.push({
              text: this.data.defaultValueArr.split(",")[index],
              id: item,
            });
          });
        }

        this.url = this.data.optionSetting_tabContent.url;
        this.data.optionSetting_tabContent.queryParams.forEach((item) => {
          this.req[item.paramName] = item.defaultValue;
        });
      }
    },
    /**
     * 树状图展开
     * @param node
     * @param resolve
     * @returns {*}
     */
    loadNode(node, resolve) {
      if (node.level === 0) {
        this.node = node;
      }else{
        this.req.parentId = node.data ? node.data.id : "";
      }
      this.resolve = resolve;
      this.getTreeList(this.req, () => {
        resolve(this.areaTreeData);
        if (this.defKeys.length > 0) {
          this.$refs.tree.setCheckedKeys(this.defKeys);
        }
      });
    },

    /**
     * 获取树状列表数据
     * @param params
     * @param callback
     */
    getTreeList(req, callback) {
      getFrameTreeData(this.url, req)
        .then((res) => {
          if (res && res.data && res.data.data) {
            this.areaTreeData = res.data.data || [];
            this.areaTreeData.forEach((item) => {
              if (!item.leaf) {
                item.disabled = !this.data.isBranch;
              }
            });
          }
          callback();
        })
        .catch(() => {});
    },

    /**
     * 复选框点击事件
     * @param val
     * @param checked
     */
    handleCheckChange(val, checked) {
      if (this.isCheck) {
        //判断是否可多选
        if (checked == false) {
          this.checkList.forEach((item, index) => {
            if (this.checkList[index].text == val.text) {
              this.checkList.splice(index, 1);
            }
          });
        } else if (checked == true) {
          this.checkList.push(val);
        }
      } else {
        //单选
        let checkedNode = this.$refs.tree.getCheckedNodes(false, true);
        if (checkedNode.length > 1) {
          checkedNode.forEach((item) => {
            if (item.id != val.id) {
              this.$refs.tree.setChecked(item, false);
            }
          });
        }
        if (checked) {
          this.checkList.push(val);
        } else {
          this.checkList.splice(0, 1);
        }
      }
    },

    /**
     * 删除事件
     * @param val
     * @param type
     */
    delPeople(val, type) {
      this.defKeys = []; //树回显数据
      //单个删除
      if (type === "single") {
        this.checkList.splice(this.checkList.indexOf(val), 1);
      } else if (type === "multiple") {
        for (var j = 0; j < val.length; j++) {
          for (var i = 0; i < this.checkList.length; i++) {
            if (this.checkList[i].text == val[j]) {
              this.checkList.splice(i, 1);
            }
          }
        }
      }
      this.checkedAll = false; // 重置全选
      this.delList = [];
      this.treeCheck();
    },

    /**
     * 树回显勾选事件
     */
    treeCheck() {
      this.defKeys = [];
      this.checkList.forEach((item) => {
        this.defKeys.push(item.id);
      });
      this.defKeys.concat();
      this.$nextTick(function () {
        this.$refs.tree.setCheckedKeys(this.defKeys);
      });
    },

    /**
     * 全选事件
     * @param val
     */
    checkAll(val) {
      if (val == true) {
        this.checkList.forEach((item) => {
          this.delList.push(item.text);
        });
      } else if (val == false) {
        this.delList = [];
      }
    },
    sureHand() {
      let labelAry = [],
        valueAry = [];
      this.checkList.forEach((item) => {
        labelAry.push(item.text);
        valueAry.push(item.id);
      });
      this.$emit("showFrameValue", {
        name: labelAry.join(),
        value: valueAry.join(),
      });
      this.dialogVisible = false;
    },
  },
};
</script>

<style lang='scss'>
// .region {
.choose {
  display: inline-block;
  .iconfont {
    color: #5887ff;
    font-weight: 400;
    margin-right: 0.5rem;
  }
  .iconwenjianjia {
    color: #ffcb3d;
  }
  .expanded + .custom-tree-node {
    .iconwenjianjia:before {
      content: "\e65b";
    }
  }
  .chooseTitle {
    height: 20px;
    line-height: 20px;
    color: #000;
    font-weight: bold;
    padding-left: 0.5rem;
    .iconfont {
      font-size: 13px;
    }
    .tips {
      font-size: 12px;
      font-weight: normal;
      color: #ff5a09;
      margin-left: 0.5rem;
    }
  }
  .chooseBody {
    width: 100%;
    height: 23rem;
    background: #ffffff;
    border: 1px solid #dddddd;
    margin-top: 0.7rem;
    padding: 0.2rem;
    overflow: auto;
    .showList {
      display: block;
      padding: 0.2rem 1rem;
      &:hover {
        background: #ebf1ff;
      }
    }
  }
  .chooseFoot {
    height: 2rem;
    line-height: 2rem;
    width: 100%;
    background: #f9fbff;
    border: 1px solid #dddddd;
    border-top: none;
    padding: 0 1rem;
    .el-checkbox__label {
      font-size: 0.6rem;
    }
  }
  .del {
    float: right;
    cursor: pointer;
    font-size: 1.4rem;
    color: #5887ff;
  }
}
// }
</style>
