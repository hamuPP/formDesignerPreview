/**
 * Created by tangyue on 20/11/11
 */
import axios from './axios';
import {baseUrl} from './commonUrl';

// 查询
export function getForm(data) {
  return axios({
    url: baseUrl + '/workflow/form/config/getForm',
    method: 'post',
    params: data
  })
}
