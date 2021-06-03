/**
 * Created by tangyue on 20/11/6
 */
import './plugins/element.js'

// import toolboxButtons from './components/ToolboxButtons'
// import CusMsgbox from './components/cus_msgbox/index.js'
// import CusButton from './components/CusButton/index.vue'

// 之所以不直接引用previeForm页面，是为了预留以后有多余的配置可以配置表单以外的内容，
// 例如表单的包裹样式，这不属于表单主体的功能
import FormDesigner from './components/previewFormContainer.vue'
// import 'element-ui/lib/theme-chalk/index.css';
// FormDesigner.install = function (_v) {
//   if (_v) {
//
//     // todo 注释掉下面的3个组件，我不确定是否有用到
//     _v.component('CusButton', CusButton);
//     // _v.component('toolboxButtons', toolboxButtons)
//     _v.prototype.Alert = CusMsgbox.alert;
//     _v.prototype.Confirm = CusMsgbox.confirm;
//   }
// };
export default FormDesigner;
