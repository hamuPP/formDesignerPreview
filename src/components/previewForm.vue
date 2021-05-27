/**
* Created by tangyue on 20/10/23
* 使用方式：
* <previewForm ref="FD"
*             view ---> 渲染样式区别：Boolean,预览|编辑。加上view就表示是预览的样式,不加就是编辑的样式
* </previewForm>
*/
<template>
  <el-form
    :class="formClassStr"
    :size="fdFormData.size"
    :label-width="fdFormData.labelWidth + 'px'"
    :model="formModel"
    ref="fdForm"
    :rules="rules"
    :disabled="view"
  >
    <el-row v-for="(it, index) in fdFormItems" :key="index" :gutter="35">
      <el-col
        v-for="(item, key) in it"
        :key="key"
        :span="item.width"
        :style="colStyle(item)"
      >
        <!--    如果是有分组的(分组的自定义样式是套在分组的元素上的)  --start--  -->
        <template v-if="item.type === 'group'">
          <div class="fd-form-group" :class="item.className">
            <div v-if="item.label" class="fd-form-group__header" :id="item.frontId">
              {{ item.label }}
            </div>
            <el-row
              v-for="(child, childIdx) in item.children"
              :key="childIdx"
              :gutter="35"
            >
              <el-col
                v-for="(cItem, cKey) in child"
                :key="cKey"
                :span="cItem.width"
                :style="colStyle(cItem)"
              >
                <previewFormItem
                  ref="fdFormItem"
                  :view="view"
                  :formModel="formModel"
                  :data="cItem"
                  :labelWidth="fdFormData.labelWidth"
                  :lineMarginBottom="fdFormData.lineMarginBottom"
                ></previewFormItem>
              </el-col>
            </el-row>
          </div>
        </template>
        <!--    如果是有分组的  --end--  -->

        <!--    如果是tabs的 --start--  -->
        <template v-else-if="item.type === 'tabs'">
          <div class="fd-form-group__tobedel fd-form-tabs" :class="item.className">
           <div class="fd-form-tabs__header">
             <div v-for="(item, index) in item.header"
                  :key="index"
                  class="fd-form-tabs__item" :class="{'active': currentActiveTabIndex === index}"
                  @click.stop="tabsHeaderClickHand(index)">{{item}}
             </div>
           </div>
            <div class="fd-form-tabs__body">
              <div v-for="(b, bIndex) in item.children"
                   :key="bIndex"
                   class="fd-form-tabs__body-item"
                   v-show="currentActiveTabIndex === bIndex">
                <el-row v-for="(_b, _bIndex) in b" :key="_bIndex" :gutter="35">
                  <el-col
                          v-for="(cItem, cKey) in _b"
                          :key="cKey"
                          :span="cItem.width"
                          :style="colStyle(cItem)"
                  >
                    <previewFormItem
                            ref="fdFormItem"
                            :view="view"
                            :formModel="formModel"
                            :data="cItem"
                            :labelWidth="fdFormData.labelWidth"
                            :lineMarginBottom="fdFormData.lineMarginBottom"
                    ></previewFormItem>
                  </el-col>
                </el-row>
              </div>
            </div>
<!--            <el-row-->
<!--                    v-for="(child, childIdx) in item.children"-->
<!--                    :key="childIdx"-->
<!--                    :gutter="35"-->
<!--            >-->
<!--              <el-col-->
<!--                      v-for="(cItem, cKey) in child"-->
<!--                      :key="cKey"-->
<!--                      :span="cItem.width"-->
<!--                      :style="colStyle(cItem)"-->
<!--              >-->
<!--                <previewFormItem-->
<!--                        ref="fdFormItem"-->
<!--                        :view="view"-->
<!--                        :formModel="formModel"-->
<!--                        :data="cItem"-->
<!--                        :labelWidth="fdFormData.labelWidth"-->
<!--                        :lineMarginBottom="fdFormData.lineMarginBottom"-->
<!--                ></previewFormItem>-->
<!--              </el-col>-->
<!--            </el-row>-->
          </div>
        </template>
        <!--    如果是tabs的 --end--  -->

        <!--   非分组的表单项  --start--   -->
        <previewFormItem
          v-else
          ref="fdFormItem"
          :view="view"
          :formModel="formModel"
          :data="item"
          :formCode='formCode'
          :labelWidth="fdFormData.labelWidth"
          :lineMarginBottom="fdFormData.lineMarginBottom"
        ></previewFormItem>
        <!--   非分组的表单项  --end--   -->
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
// 预设皮肤的几个参数
import { getRefs } from "../util/common";
import previewFormItem from "./previewFormItem.vue";

const SKIN_OPTIONS = {
  "fd-form--blue": {
    labelWidth: 150,
    lineMarginBottom: 6,
  },
};
export default {
  name: 'previewForm',
  components: { previewFormItem },
  data() {
    return {
      skin: "", // 预设的表格的样式名称
      formClassStr: "",
      formCode:'',
      currentActiveTabIndex: 0,
    };
  },
  props: {
    // 是否为预览模式，模式是编辑模式啦
    view: {
      type: Boolean,
      default: false,
    },
    card: {
      type: Boolean,
      default: false
    },
    // 表单的id
    id: {
      type: [Number, String],
      default: null
    },

    rules: {
      type: Object,
      default () {
        return {}
      }
    },
    // // 是否采用用户自配的规则，即props中传入的rules。,有以下4种植
    // // only: 仅采用用户的规则，忽视表单编辑器中的配置。
    // // formPriority 合并表单编辑器中的配置和用户配置，若有冲突，以表单编辑器中的配置为准
    // // userPriority 合并表单编辑器中的配置和用户配置，若有冲突，以用户自定义的配置为准
    // // '',默认，不采用用户的规则，以表单编辑器中的配置为准
    // useCustormRule: {
    //   type: String,
    //   default: ''
    // },
    // 是否采用用户自配的规则，即props中传入的rules。
    // 若是，则表单这里将会无视表单编辑器中配置的校验数据
    useCustormRule: {
      type: Boolean,
      default: false
    },
    formModel: {
      type: Object,
      default () {
        return {};
      }
    },
    fdFormItems: {
      type: Array,
      default() {
        return [];
      }
    },
    fdFormData: {
      type: Object,
      default () {
        return {};
      }
    }
  },
  watch: {
    fdFormData(n, o) {
      console.log(n);
      this.formCode=n.code
      this.skin = n.skin;
      this.formClassStr =
        `fd-form fd-form--preview ${n.skin} ${n.customClassName}` +
        (n.size ? ` fd-form--${n.size}` : "");
    }
  },
  created() {
    this.skin = this.fdFormData.skin;
    this.formCode = this.fdFormData.code;
    this.formClassStr =
      `fd-form fd-form--preview ${this.skin} ${this.fdFormData.customClassName}` +
      (this.fdFormData.size ? ` fd-form--${this.fdFormData.size}` : "");
  },
  mounted(){
    this.$bus.$on('selectChange',(data)=>{
      this.selectChange(data)
    })

  },
  methods: {
    colStyle (item) {
      let str = '';
      if (item.displayInline) {
        str += 'clear: both;';
      }
      if (item.hidden) {
        str += 'display: none';
      }
      return str;
    },

    /// //// 组件外会用到的方法：
    // 返回表单组件
    getForm () {
      return this.$refs.fdForm;
    },
    // 返回表单里面的每个输入组件
    getRef(refName) {
      return getRefs(this, refName);
    },
    // 给输入组件绑定事件，返回的参数与elementUI的Api写的相同
    addEvent(eventType, refName, func) {
      let refs = getRefs(this, refName);
      refs.forEach((ref) => {
        ref.$on(eventType, func);
      });
    },
    //根据下拉框值改变表单元素状态
    selectChange(data) {
      if (data.length > 0) {
        let fn=(params)=>{
          data.forEach(item=>{
            params.forEach(itArr=>{
            itArr.forEach(it=>{
              if (it.type == "table") {
                if (item.code == it.code && item.label == it.tName) {
                  if (item.state == "edit") {
                    it.disabled = false;
                    it.hidden = false;
                    it.readonly = false;
                  } else if (item.state == "disabled") {
                    it.disabled = true;
                    it.hidden = false;
                    it.readonly = true;
                  } else if (item.state == "hidden") {
                    it.disabled = false;
                    it.hidden = true;
                    it.readonly = false;
                  }
                }
              }else if(it.type=='group'){
                fn(it.children)
              }else{
                 if (item.code == it.code && item.label == it.label) {
                  if (item.state == "edit") {
                    it.disabled = false;
                    it.hidden = false;
                    it.readonly = false;
                  } else if (item.state == "disabled") {
                    it.disabled = true;
                    it.hidden = false;
                    it.readonly = false;
                  } else if (item.state == "hidden") {
                    it.disabled = false;
                    it.hidden = true;
                    it.readonly = false;
                  }
                }
              }
            })
          })

          })
        }
        fn(this.fdFormItems)
      } else {
        let fn=(params)=>{
          params.forEach(itArr=>{
           itArr.forEach(it=>{
             if(it.type=='group'){
               fn(it.children)
             }else{
                it.disabled = false;
                it.hidden = false;
                it.readonly = false;
             }
           })
          })
        }
        fn(this.fdFormItems)
      }
    },
    tabsHeaderClickHand(index){
      this.currentActiveTabIndex = index;
    }
  },
};
</script>
<style lang='scss'>
  .cus-dialog{
	.el-dialog{

	}
	.el-dialog__header{
		padding: 0 10px;
		background: #52bee5;
		.el-dialog__title{
			font-size: 12px;
			line-height: 30px;
			color: #fff;
		}
		.el-dialog__headerbtn{
			top: 6px;
			right: 10px;
		}
		.el-dialog__close{
			color: #fff;
		}
	}
	.el-dialog__body{
		padding: 20px 20px 10px;
	}
	// 尾部
	.dialog-footer{
		text-align: center;
		padding: 10px;
		.el-button{
			padding: 6px 13px;
			font-size: 12px;
		}
	}
	// 里面有transfer组件的，修改transfer组件的样式 --start--
	.el-transfer {
		font-size: 12px;
		.el-transfer-panel{
			.el-transfer-panel__header{
				height: 30px;
				line-height: 30px;
				.el-checkbox{
					line-height: 30px;
					.el-checkbox__label{
						font-size: 13px;
					}
				}
			}
		}

		// 中间的那两个转移按钮的样式
		.el-transfer__buttons{
			.el-button{
				padding: 6px 13px;
				font-size: 12px;
			}
		}
	}
	// 里面有transfer组件的，修改transfer组件的样式 --end--

}
/*
* 自定义的table组件的样式
 */
.table-blue2-toolbar{
	height: 32px;
	line-height: 32px;
	.el-button{
		line-height: 26px;
		padding: 0;
		text-align: center;
	}
	.title{
		font-size: 13px;
		.iconfont{
			color: #2ca5fe;
			margin-right: 3px;
		}
	}
	.header-btn{
		float: right;
		height: 26px;
		width: 52px;
		margin: 5px 0 0 5px;
	}
	.el-button--default{
		border-color: #7bbafd;
		color: #7bbafd;
	}
}
.table-blue2 {
	width: 100%;
	font-size: 12px !important;
	// 重写原本的header样式
	.el-table__header {
		th {
			color: #fff;
			background: #3bb0f5;
		}
	}
	// 覆盖掉原本的table的样式
	&.el-table {
		td {
			padding: 2px 0;
		}
		th {
			padding: 2px 0;
		}
		.el-button--text {
			padding: 0;
		}
	}
	// 操作列，即只放了图片的列
	.operate-col {
		.iconfont {
			cursor: pointer;
			margin: 0 5px;
			&:hover {
				color: red;
			}
		}
	}

	// 表格中的input组件
	.el-input__inner{
		height: 23px;
		line-height: 23px;
		padding: 0 20px 0 5px;
	}
	.el-input__suffix{
		right: 0;
		.el-input__icon{
			//height: 23px;
			line-height: 23px;
		}

	}
}
// 节点的人员定义
.person-dialog{
	.el-dialog{
		width: 800px;
	}
	.people-define-group {
		height: 360px;
		& > .el-col {
			height: 100%;
		}
		.org-tree-wrap {
			height: 100%;
			overflow: auto;
			background: #fff;
		}
		.people-table-wrap {
			height: 100%;
			.people-search-input{
				.el-input__inner{
					height: 26px;
					line-height: 26px;
				}
				.el-input__prefix{
					height: 26px;
					.el-input__icon{
						line-height: 26px;
					}
				}
				height: 40px;
			}
			.el-table {
				width: 100%;
				height: calc(100% - 30px - 42px);
			}
		}

		.people-transfer-btn {
			padding: 0;
			//display: block;
			display: block;
			margin: 30px auto;
		}

	}
	.people-define-group-title{
		font-size: 13px;
		color: #333;
		padding: 5px;
	}
	.people-type-radio-group{
		height: auto;
		text-align: center;
		margin: 5px 0;
	}
	.Pagination{
		height: 30px;
		margin: 0;
		padding: 0;
		border-top: 1px solid #dcdcdc;
		border-bottom: 1px solid #dcdcdc;
		background: #fff;
		text-align: center;
	}
	.right-table{
		height: calc(100% - 40px);
		margin: 40px 0 0;
	}
	.move-col{
		 padding-top: 120px;
		.people-transfer-btn{
			display: block;
			margin: 30px auto;
			padding: 5px;
		}
	}
	.Pagination{
		border: 1px solid rgb(235, 238, 245);
		border-top: none;
		border-left: none;
	}
}
</style>
