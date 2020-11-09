<template>
  <div class="app" id="app">
    <FormDesigner ref="FD"
                  :view="isView"
                  card
                  workflow
                  :se="isSe"
                  :id="formId"
    ></FormDesigner>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        // 以下几个参数由调用方来传给表单设计器预览插件
        isView: false,
        isSe: false,
        formId: '1323817116486471680'
      }
    },
    created() {
      debugger;
    },
    mounted() {
      debugger;
    },
    beforeDestroy() {

    },

  }
</script>

<style lang="scss">
  .app{
    height: 100%;
    background: #f5f5f5;
    padding: 40px 83px 50px 72px;
    overflow: auto;
  }

</style>
