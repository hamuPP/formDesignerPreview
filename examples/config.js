// var base = 'http://192.168.11.204:9090';
// var base = 'http://192.168.11.186:9999'
// var base = 'http://192.168.11.189:9999'
// var base = 'http://171.221.227.31:9999'
// var base = 'http://192.168.13.197:9999'
var base = 'http://192.168.11.189:9999'
// var base = 'http://192.168.16.191:9090'

window.g = {
  // Auth: 'Basic cGlnOnBpZw==', // 'Basic cGlnOnBpZw==',// 以前用的Basic ZW9tczpwaWc=
  Auth: 'Basic ZW9tczpwaWc=', // 'Basic cGlnOnBpZw==',// 以前用的Basic ZW9tczpwaWc=
  baseUrl: base,
  baseUrls: base + '/iplatform-workflow',
  ruleUrl:'http://192.168.11.12:8080',//规则平台前端地址（杨伟哥地址）
  nacosurl:'http://119.3.77.65:8001/nacos',//链路追踪前端地址
  nacosApiurl:'http://119.3.77.65:8848',//链路追踪后台地址
  linkUrl:'http://10.18.11.142:8088',//链路追踪外部地址
  formImgUrl: 'http://192.168.11.203:9000',// 富文本编辑器内图片预览的地址
  downloadServiceUrl: base + '/senon-file-center/files/download',
  platformId: 'eoms',// 登录时的platformId参数的值，如果这里不配置，将会采用默认值eoms
  workflowRulesEditable: false,// 是否在流程中使用规则
  workflowMessageEditable: false,// 是否在流程中使用消息
  loginMenus: [1,2,3,4,5,6],// 普通登录后的菜单显示控制,：1.流程编排中心,2.日志平台,3.消息平台，4.规则平台，5.接口平台, 6.管理控制台
  loginTenantMenus: [1, 4, 6],// 租户登录后的菜单显示控制：1.流程编排中心,2.日志平台,3.消息平台，4.规则平台，5.接口平台, 6.管理控制台

}
