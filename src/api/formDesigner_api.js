/**
 * Created by tangyue on 20/10/27
 */
import axios from './axios';
import {baseUrl} from './commonUrl';

// 通用查询方法
export function commonRequest ({params, data, method, url, headers = {}}) {
  return axios({
    url: (url.startsWith('http:') || url.startsWith('https:')) ? url : baseUrl + url,
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
