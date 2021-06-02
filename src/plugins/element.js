/**
 * 只引入我用到的的elementui组件
 * Created by tangyue on 20/11/17
 */
import Vue from 'vue';
// 完整引入的写法
import ElementUI from 'element-ui';
// 引入其他公共组件
import CusMsgbox from '../components/cus_msgbox/index.js'
import CusButton from '../components/CusButton/index.vue'
import CusDialog from '../components/CusDialog/index'

Vue.use(ElementUI);
console.log('888_1', CusMsgbox);
console.log('888_2', CusMsgbox.alert);
console.log('888_3', Vue);

Vue.prototype.$cusAlert = CusMsgbox.alert;
Vue.prototype.$cusConfirm = CusMsgbox.confirm;
Vue.component('CusButton', CusButton);
Vue.component('cusDialog', CusDialog);

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