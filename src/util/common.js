/**
 * Created by tangyue on 20/10/12
 */
// 样式控制的组件
const STYLE_FORM_COMPONENTS = ['dividingLine', 'button'];
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

export const flatList = function (that, list, fields) {
  let result = [];
  // 获取字段的业务字段类型
  let getBuzFieldType = (code) => {
    for (let i = 0, len = fields.length; i < len; i++) {
      if (fields[i].code === code) {
        return fields[i].fieldType;
      }
    }
  };
  let fn = (arr) => {
    arr.forEach(it => {
      if (it.type === 'group') {
        fn(it.children)
      }

      else if (it.type === 'tabs') {
        for (let j = 0, jlen = it.children.length; j < jlen; j++) {
          fn(it.children[j]);
        }
      }
      else {
        it.fieldType = getBuzFieldType(it.code);
        if (it.fieldType === 'userRole') {
          it.showType = 'select';// showType在表单这边标识组件的类型，
          that.userRoleFormItem = it;
          it.disabled = that.status !== 'draft';
        }

        result.push(it)
      }
    })
  };
  fn(list);
  return result;
};
/**
 * 做出表单的绑定值,注意如果有分组，则需要把分组的数据移出来。关于表单的初始值（建单人等信息，formInitData）也会在这一步整进来
 * @param n 字段列表
 * @param valueFieldKey 值的字段，
 * @param useInitData 是否采用初始值，
 * @returns {{}}
 */
export const getFormModel = (that, n, valueFieldKey, useInitData, tables) => {
  let obj = {};
  debugger;
  let fn = function (list) {
    list.forEach(it => {
      if (!it.type) {
        it.type = getType(it.code, that.flatFdFormList);// 旧版的数据里有type,后面接口改了没有type了，我不想大改逻辑，所以这里直接再循环一遍找吧
      }
      if (it.type === 'group' && it.children && it.children.length) {
        fn(it.children);
      }
      else if (it.type === 'tabs') {
        for (let j = 0, jlen = it.children.length; j < jlen; j++) {
          fn(it.children[j]);
        }
      }
      else {
        if (it.type === 'checkbox') {
          // 如果是建单人等字段
          let _val = (useInitData && it.fieldType) ? that.formInitData[it.code] : it[valueFieldKey];

          obj[it.code] = _val ?
              (_val.constructor === String ? _val.split(',') : _val)
              : [];
        }
        else if (it.type === 'rate') {
          // 如果是建单人等字段
          let _val = (useInitData && it.fieldType) ? that.formInitData[it.code] : it[valueFieldKey];
          obj[it.code] = _val ? Number(_val) : 0;
        }
        else if (it.type === 'timePickerRange') {
          // 如果是建单人等字段
          let _val = (useInitData && it.fieldType) ? that.formInitData[it.code] : it[valueFieldKey];

          obj[it.code] = _val ? (_val.constructor === String ? _val.split(',') : _val) : null;
        }
        else if (it.fieldType == 'userRole'/* it.type === 'operatorRole' && (!that.boId || that.status === 'draft')*/) {
          debugger;
          let _val = useInitData ? that.formInitData[it.code] : it[valueFieldKey];
          that.userRoleFormItem_val = _val;
          obj[it.code] = '';
        }
        // 排除掉样式组件（例如分割线，这些是样式，不是表单值）
        else if (!STYLE_FORM_COMPONENTS.includes(it.type)) {
          // 如果是建单人等字段
          let _val = (useInitData && it.fieldType) ? that.formInitData[it.code] : it[valueFieldKey];
          obj[it.code] = _val || '';// 如果有null，不要null，整个空字符串
        }
      }

    });
  };
  fn(n);
  console.log(obj)
  return obj;
};

export const formateList = function (dataList) {
  const BASE_COUNT = 24;//基数：多少个为一组
  let list = [];
  let fn = (dataList, parent) => {
    let count = 0;
    dataList.forEach(it => {
      let span = it.width;
      let displayInline = it.displayInline;

      // 假如有一项为24,则它自为一行，
      let index;
      let lastNum = count / BASE_COUNT;// 之前的表单项的总和
      if (span == 24 && lastNum !== Math.floor(lastNum)) {
        index = Math.ceil(lastNum);
        count = (index + 1) * 24;
      }
      else if (displayInline) {
        // 假如除不尽，则把现在的count补满为24的整数
        if (count / 24 !== Math.floor(count / 24)) {
          count = Math.ceil(count / 24) * 24 + 24;
        } else {
          count += 24;
        }
        let num = count / BASE_COUNT;
        index = Math.floor(num) === num ? num - 1 : Math.floor(num);// 整数-1，小数向下取整
      }
      else {
        count += span;
        let num = count / BASE_COUNT;
        index = Math.floor(num) === num ? num - 1 : Math.floor(num);// 整数-1，小数向下取整
      }
      if (parent) {
        !parent.children && (parent.children = []);
        !parent.children[index] && (parent.children[index] = []);
        parent.children[index].push(it)
      } else {
        !list[index] && (list[index] = []);
        list[index].push(it);
      }

      // 分组的
      if (it.type === 'group') {
        if (it.children && it.children.length) {
          let metaChildren = [].concat(it.children);// 原始的子成员数据
          it.children = [];
          fn(metaChildren, it);
        }
      } else if (it.type === 'tabs') {
        let _metaC = [].concat(it.children);
        it.children = [];
        _metaC.forEach(child => {
          let _metaChildren = [].concat(child);// 原始的子成员数据
          let _it = {};
          fn(_metaChildren, _it);
          it.children.push(_it.children)
        });
      }
    });
  };
  fn(dataList);
  return list;
};