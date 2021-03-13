/**
* 抄的以前jws在jx项目写的东西，我改动了一些符合本项目的代码
* Created by tangyue on 21/3/12
*
*/
<template>
  <!--  悬浮目录（锚点）  -->
      <ul v-if="list && list.length"
          class="anchorPoint"
          :class="{'noWanchorPoint':!isShoWanchorPoint}" >
        <div class="el-icon-d-arrow-right" :class="{'shrinkIcon':!isShoWanchorPoint}" @click.stop="clickWanchorPoint"></div>
        <el-radio-group v-model="catalogCur">
          <li v-for="(item,index) in list" :key="index"  @click="jump(index)" class="anchorPoint-li">
            <!-- <span class="icon iconfont icondanxuanweixuan"></span>
            <span>{{item}}</span> -->
            <el-radio :label="index">{{item}}</el-radio>
          </li>
        </el-radio-group>
      </ul>
</template>

<script>
  export default {
    name: 'anchor',
    // props: {
    //   form: {
    //     type:
    //   }
    // },
    data(){
      return {
        // 锚点是否展示
        isShoWanchorPoint:true,
        catalogCur: null,
        list: []
      }
    },
    created() {
      this.generateAnchorList();
    },
    methods: {
      // 生成锚点列表
      generateAnchorList() {
        this.list = [];
        try {
          let form = this.$parent.$refs.form;// form组件
          let groupHeaders = form.$el.getElementsByClassName('fd-form-group__header');// form组件的分组们的标题的集合
          if (groupHeaders && groupHeaders.length) {
            for (let i = 0, len = groupHeaders.length; i < len; i++) {
              console.log(groupHeaders[i].innerText)
              this.list.push(groupHeaders[i].innerText);
            }
            this.catalogCur = 0;
          }
          console.log(this.list);
        }catch(e){
          console.log(e)
          this.catalogCur = null;
        }
      },
      // 重新渲染锚点的数据
      reset() {
        this.generateAnchorList();
      },
      // 锚点伸缩点击事件
      clickWanchorPoint(){
        this.isShoWanchorPoint = !this.isShoWanchorPoint;
      },
      /*目录点击定位效果：有兼容问题，借鉴了很多其他方法却一直不成功，无奈之后使用了scrollIntoView*/
      jump (index) {
        this.catalogCur = index;
        let jump = document.querySelectorAll('.fd-form-group__header')
        jump[index].scrollIntoView({block: "start", behavior: "smooth"});
      }
    }
  }
</script>

<style scoped lang="scss">
@import "../../assets/scss/components/anchor_point.scss";
</style>
