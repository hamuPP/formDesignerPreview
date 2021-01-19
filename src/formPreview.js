/**
 * Created by tangyue on 20/11/6
 */
import './plugins/element.js'

// 之所以不直接引用previeForm页面，是为了预留以后有多余的配置可以配置表单以外的内容，
// 例如表单的包裹样式，这不属于表单主体的功能
import FormDesigner from './components/previewFormContainer.vue'
// import 'element-ui/lib/theme-chalk/index.css';

export default FormDesigner;
