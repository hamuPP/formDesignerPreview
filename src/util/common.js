/**
 * Created by tangyue on 20/10/12
 */

/**
 * 根据指定的ref名来获取在配置界面配置过ref的组件
 * @param that
 * @param refName
 * @returns {string}
 */
export const getRefs = (that, refName) => {
  let results = [];
  let allFormItems = that.$refs.fdFormItem;
  allFormItems.forEach(it => {
    if (it.$refs[refName]) {
      results.push(it.$refs[refName])
    }
  });
  return results;
};

export const isObjEmpty = (obj) => {
  for (let name in obj) {
    return false;
  }
  return true;
};

// 正则表达式验证 @str：目标值, @regStr:自定义验证正则表达式字符， @type验证类型 手机、邮箱、url
export const validateRegType = function(str, type, regStr = "") {
  debugger
  var pattern = ""
  if (!type && !regStr) {
    return true
  }
  if(type === "mobile") {
    pattern = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
  } else if (type === "email") {
    pattern = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
  } else if (type === "url") {
    pattern = /^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*([\?&]\w+=\w*)*$/
  } else if (type === "string" || type === "password") {
    return true
  } else if (type === "number") {
    pattern = /^(\-|\+)?\d+(\.\d+)?$/
  } else if (!type) {
    pattern = new RegExp(regStr)
  }
  return pattern.test(str)
}
