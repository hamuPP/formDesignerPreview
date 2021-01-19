/**
 * Created by tangyue on 20/11/10
 */
// 当请求失败或者出错的时候，显示通用的提示信息
export const showQueryErrorMessage = (scope, resData, opt = {}) => {
  let msg = '请求繁忙，请稍后再试';
  if (resData.constructor === ReferenceError) {
    msg = resData.message;
  } else {
    msg = resData.codeMsg || resData.message ||
      (resData.error && resData.error.constructor === String && resData.error) ||
      (resData.data && resData.data.constructor === Object && resData.data.error || '提交失败');
  }
  // 如果上述操作没能得到提示文字，则在此处赋值一个固定的提示文字
  if (!msg) {
    msg = '提交失败'
  }
  scope.$message({
    duration: opt.duration || 0,
    showClose: true,
    message: msg,
    type: 'warning',
    offset: (document && document.body) ? document.body.clientHeight / 2 : 100,
    onClose: (opt.onClose && opt.onClose.constructor === Function) ? opt.onClose : _ => {}

  });
};
export const showQuerySuccessMessage = (scope, opt = {}) => {
  let msg = opt.msg || '提交成功';
  scope.$message({
    duration: opt.duration || 0,
    showClose: true,
    message: msg,
    type: 'success',
    offset: (document && document.body) ? document.body.clientHeight / 2 : 100,
    onClose: (opt.onClose && opt.onClose.constructor === Function) ? opt.onClose : _ => {}
  });
};

// 获取浏览器传参（即：？后面的参数）
export const getUrlQueryParams = () => {
  let urlSearch = window.location.search;
  if (!urlSearch || !urlSearch.substr(1)) {
    return {}
  }
  let searchList = urlSearch.substr(1).split('&');
  let searchObj = {};
  searchList.forEach(it => {
    let arr = it.split('=');
    searchObj[arr[0].trim()] = arr[1].trim();
  });
  return searchObj;
};