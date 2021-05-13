/**
 * Created by tangyue on 20/10/27
 */
import axios from './axios';
import {baseUrl} from './commonUrl';

let fileUploadUrl = `${baseUrl}`

// 通用查询方法
export function commonRequest ({params, data, method, url, headers = {}}) {
  // 处理url。如果是以http或者https开头的，则直接使用；若否，则依次取baseUrl。和本地的ip
  let _url = '';
  if (url.startsWith('http:') || url.startsWith('https:')){
    _url = url
  }
  else if (baseUrl) {
    _url = baseUrl + url;
  }
  else {
    _url = window.location.origin + url
  }
  return axios({
    url: _url,
    method: method,
    data: data,
    params: params,
    headers: headers
  })
}

// 查询
export function getForm (data) {
  return axios({
    url: baseUrl + '/workflow/form/config/getForm',
    method: 'post',
    params: data
  })
}

// 获取所有的码表列表
export function getCodeTypeList (url, data) {
  return axios({
    url: baseUrl + url,
    method: 'post',
    data: data
  })
}
// 获取具体的某个码表下的数据
export function getCodeTypeData (data) {
  return axios({
    url: baseUrl + '/workflow/form/config/getFieldCodeType',
    method: 'post',
    params: data
  })
}

//获取组织
export function getOrgTree (data) {
  return axios({
    url:baseUrl+'/workflow/user/queryOrgTree',
    method:'post',
    data:data
  })
}

//获取人员
export function getUser (data) {
  return axios({
    url:baseUrl+'/workflow/user/getUsers',
    method:'post',
    data:data
  })
}

// 选人组件获取对应得树列表数据
export function getTranserPerTreeList({url, data}){
  return axios({
    method: 'post',
    url: `${baseUrl}${url}`,
    myContentType: 'application/json',
    data: data
  })
}

// 下拉树的自定义接口post
export function getTreePostAPI(data) {
  return axios({
    url: baseUrl + '/workflow/tree/queryTree',
    method: 'post',
    data:data
  })
}

// 下拉树的自定义接口get
export function getTreeGetAPI(url, method,data) {
  return axios({
    url: baseUrl + url,
    method: method,
    params:data
  })
}

//得到收索字段列表
export function getNames(url, data) {
  return axios({
    url: baseUrl + url,
    method: 'get',
    params:data
  })
}

// 上传附件
export function uploadFiles(data){
  return axios({
    method: 'post',
    url: fileUploadUrl + '/senon-file-center/files/upload',
    data: data,
    attFile: true,
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
}

// 根据某个码表的id获取对应码表下面的所有数据
export function getPointCodeSheetData(data) {
  return axios({
    url: baseUrl + `/admin/sysdict/tree/${data.rootValue}`,
    method: 'get'
  })
}

// 删除附件
export function delFile(data){
  return axios({
    method: 'DELETE',
    url: fileUploadUrl + '/senon-file-center/files/del/' + data,
  })
}

// 下载附件
export function downLoadFile(data){
  return axios({
    method: 'DELETE',
    url: fileUploadUrl + '/senon-file-center/files/download/' + data,
  })
}

// 根据票据获取文件列表
export function getUploadedFileList(data) {
  return axios({
    method: 'get',
    url: fileUploadUrl + '/senon-file-center/files/getAllFiles',
    myContentType: 'application/json',// 自定义content-type
    params: data
  })
}

// 删除附件(新)
export function delFileNew(data){
  return axios({
    method: 'DELETE',
    url: fileUploadUrl + '/senon-file-center/files/del/' + data,
  })
}
