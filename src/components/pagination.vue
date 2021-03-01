<template>
  <div class="Pagination paginationConts">
    <el-pagination
      @size-change="sizeChange"
      @current-change="currentChange"
      :current-page="config.currentPage"
      :page-sizes="[10, 20, 50]"
      :page-size="config.pageSize"
      :prev-text=prevText
      :next-text=nextText
      :layout=layout
      :small="small"
      :pager-count="pagerCount"
      :total="config.pageTotal">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    name: "Pagination",
    props: {
      small: {
        type: Boolean,
        default(){
          return false
        }
      },
      pagerCount: {
        type: Number,
        default(){
          return 5
        }
      },
      prevText: {
        type: String,
        default(){
          return '上一页'
        }
      },
      nextText: {
        type: String,
        default(){
          return '下一页'
        }
      },
      config: {
        type:Object,
        default(){
          return {}
        }
      },
      layout: {
        type: String,
        default(){
          return 'prev,pager,next,jumper,sizes,total'
        }
      }
    },
    methods: {
      //分页条目数改变
      sizeChange(val) {
        this.$emit('page-change', 1, val);
      },
      //分页当前页变化
      currentChange(val) {
        this.$emit('page-change', val, this.config.pageSize);
      },
    }
  }
</script>

<style lang="scss">
.paginationConts{
  .el-pagination .el-pagination__jump, .el-pagination .btn-next, .el-pagination .el-pager, .el-pagination .btn-prev{
    float: none !important;
  }
}
</style>
<!--/*
“公共分页组件”，使用方式：
在父组件中引入分页组件
 import Pagination from '../../../components/common/pagination.vue'
  components: {Pagination},
在父组件的template中直接使用
    <Pagination @page-change="pageChange" :config="configPage" ></Pagination>
    其中pageChange和configPage可自己命名,但pageTotal、pageSize、currentPage不可换名字
     configPage:{
          pageTotal:10,
          pageSize:10,
          currentPage:1
        } ------需在父组件的data设置configPage默认值，当每次请求tableList时，需给configPage重新复制，
     其他需要刷新表格的时候(如搜索)传递的分页也更改为this.configPage.currentPage
     pageChange(current,pagesize){
        let that = this;
        that.getTableList(that.tableListService,{
          pageSize:current,
          pageNum:pagesize,
          输入框字段:that.searchForm.字段,//需要加，这样才能在搜索的不会重新刷新数据
        });
      },
      例子可参见“角色管理”index_role.vue
*-->
