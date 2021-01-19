/**
 * Created by tangyue on 20/10/27
 */
import axios from './axios';
import {baseUrl} from './commonUrl';

// 通用查询方法
export function commonRequest ({params, data, method, url, headers = {}}) {
  return axios({
    url: url,
    method: method,
    data: data,
    params: params,
    headers: headers
  })
}

// 保存
export function saveForm (data) {
  return axios({
    url: baseUrl + '/workflow/form/config/saveForm',
    method: 'post',
    data: data
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

export function createForm (data) {
  return axios({
    url: baseUrl + '/workflow/form/config/createForm',
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
