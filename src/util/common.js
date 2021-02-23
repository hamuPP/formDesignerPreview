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
