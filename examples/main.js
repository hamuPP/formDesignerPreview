/**
 * Created by ty on 18/1/31.
 */
'use strict';
import 'babel-polyfill'

/* 引入Vue相关 */
import Vue from 'vue'
import ElementUI from 'element-ui';

// import VueRouter from 'vue-router';
// import Routers from './router';
import FormDesigner from '../src/formPreview.js';
import '../src/assets/scss/index.scss';

import App from './app.vue';
Vue.prototype.$bus = new Vue()
Vue.component('FormDesigner', FormDesigner);
import 'element-ui/lib/theme-chalk/index.css';

// Vue.use(VueRouter);
Vue.use(ElementUI)

// // 路由配置
// const RouterConfig = {
//     // routes: Routers
// };

// const router = new VueRouter(RouterConfig);

// eslint-disable-next-line no-new
new Vue({
    el: '#appExample',
    // router: router,
    render: h => h(App)
});
