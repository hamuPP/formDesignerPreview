<template>
  <div class="DialogForm">
    <!-- 属性列表 -->
    <div class="attr-con">
      <div
        v-for="(item,index) in DialogattrData"
        :key="index"
        :class="{'long': item.type, 'short': !item.type}"
      >
        <div class="item-left">
          <span>{{item.label}}</span>
        </div>
        <div class="item-right">
          <span>{{item.value}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "DialogForm",
  props: ["title", "DialogattrData"],
  data() {
    return {};
  },
  methods: {},
};
</script>
<style lang="scss">
$senon-color: #247ffb;
$bg-box-blue: #e4f5ff;
$text-box-blue: #718dc4; /* 展示数据字体颜色 */
.DialogForm {
  text-align: left;
  line-height: 0;
  height: 450px;
  overflow: auto;
  .form-header {
    height: 30px;
    line-height: 30px;
    border-bottom: 1px solid #dde5f0;
  }
  .title-icon {
    display: inline-block;
    width: 1px;
    height: 1px;
    border: 5px solid;
    border-color: transparent transparent transparent $senon-color;
  }
  .attr-con {
    padding: 4px 10px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .short {
      display: flex;
      width: 49%;
      border: 1px solid $bg-box-blue;
      min-height: 30px;
      line-height: 30px;
      font-size: 12px;
      margin: 3px 0;
    }
    .long {
      display: flex;
      width: 100%;
      border: 1px solid $bg-box-blue;
      min-height: 30px;
      line-height: 30px;
      font-size: 12px;
      margin: 3px 0;
    }
    .item-left {
      text-align: right;
      width: 110px;
      padding-right: 10px;
      background: #e4f5ff;
      border: 1px solid #c0d2f1;
      color: #718dc4;
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }

    .item-right {
      width: calc(100% - 110px);
      color: #606266;
      padding-left: 10px;
      border: 1px solid #c0d2f1;
      border-radius: 4px;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
}
</style>