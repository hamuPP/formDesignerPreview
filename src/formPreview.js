/**
 * Created by tangyue on 20/11/6
 */
import Vue from 'vue';
import ElementUI from 'element-ui';

import FormDesigner from './components/previewFormContainer.vue'
Vue.use(ElementUI);

// 以下代码是从某个vue-cli的打包项目文章中复制来的，不知道有效没有，反正这里也用不到
// const components = [
//   preview,
// ];
//
// const install = function (Vue) {
//   components.map(component => {
//     Vue.component(component.name, component);
//   })
// }
//
// /* 支持使用标签的方式引入 */
// if (typeof window !== 'undefined' && window.Vue) {
//   install(window.Vue);
// }
//
export default FormDesigner;
