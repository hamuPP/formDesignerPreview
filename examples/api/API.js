/**
 * Created by tangyue on 20/11/11
 */
import axios from 'axios';
// const BASE_URL = 'http://192.168.11.204:9090'
//  const BASE_URL = 'http://192.168.11.186:9999'
//  const BASE_URL = 'http://171.221.227.31:9999'
 // const BASE_URL = 'http://192.168.11.204:9090'
const BASE_URL = window.g.baseUrl || 'http://192.168.16.191:9090'
// 查询
export function getForm (data) {
  return axios({
    url: BASE_URL + '/workflow/form/config/getForm',
    method: 'post',
    params: data
  })
}
