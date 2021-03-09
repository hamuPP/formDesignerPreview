/**
 * Created by tangyue on 21/3/5
 */
const text =
`
import axios from "../utils/request";
const baseUrl = window.g.baseUrl;
const WORKFLOW_FORM_CONFIG = \`\${baseUrl}/workflow/form/config/\`;
const WORKFLOW_FORM = \`\${baseUrl}/workflow/form/data/\`;

// 根据表单的code获取表单模板的信息
export function getFormTemplateInfoService(data) {
  return axios({
    url:  \`\${WORKFLOW_FORM_CONFIG}getFormByCode\`,
    method: 'post',
    params: data
  })
};

// 查询表单
export function getForm(data) {
  return axios({
    url: baseUrl + '/workflow/form/config/getForm',
    method: 'post',
    params: data
  })
};

export function getFormInitDataService(data){
  return axios({
    method: 'get',
    url:  \`\${WORKFLOW_FORM}getFormInitData\`,
    params: data,
  })
}
`;

export default text;
