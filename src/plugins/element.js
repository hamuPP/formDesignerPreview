/**
 * 只引入我用到的的elementui组件
 * Created by tangyue on 20/11/17
 */
import Vue from 'vue';
// 完整引入的写法
import ElementUI from 'element-ui';
// 引入其他公共组件
import CusButton from '../components/CusButton/index.vue'
// import CusDialog from '../components/CusDialog/index'

Vue.use(ElementUI);

// 已知在打包后，无法使用this.$cusAlert。所以这里就不要了（因为打包方案，我没用install）
// import CusMsgbox from '../components/cus_msgbox/index.js'
// Vue.prototype.$cusAlert = CusMsgbox.alert;
// Vue.prototype.$cusConfirm = CusMsgbox.confirm;

Vue.component('CusButton', CusButton);
// Vue.component('cusDialog', CusDialog);

// 按需引`入
// import {
//   Row,
//   Col,
//   Form,
//   FormItem,
//   Icon,
//   Input,
//   InputNumber,
//   Radio,
//   RadioGroup,
//   RadioButton,
//   Checkbox,
//   CheckboxButton,
//   CheckboxGroup,
//   Select,
//   Option,
//   OptionGroup,
//   Button,
//   ButtonGroup,
//   DatePicker,
//   TimeSelect,
//   TimePicker
// } from 'element-ui';
//
// Vue.use(Row);
// Vue.use(Col);
// Vue.use(Form);
// Vue.use(FormItem);
// Vue.use(Icon);
// Vue.use(Input);
// Vue.use(InputNumber);
// Vue.use(Radio);
// Vue.use(RadioGroup);
// Vue.use(RadioButton);
// Vue.use(Checkbox);
// Vue.use(CheckboxButton);
// Vue.use(CheckboxGroup);
// Vue.use(Select);
// Vue.use(Option);
// Vue.use(OptionGroup);
// Vue.use(DatePicker);
// Vue.use(TimeSelect);
// Vue.use(TimePicker);
// Vue.use(Button);
// Vue.use(Button);
// Vue.use(ButtonGroup);