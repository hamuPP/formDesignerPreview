/**
 * Created by tangyue on 21/3/5
 */
const text =
`
import axios from "../utils/request";
const baseUrl = window.g.baseUrl;
const WORKFLOW_BASE = \`\${baseUrl}/workflow/engine/\`;
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

// (25行)查询表单
export function getForm(data) {
  return axios({
    url: baseUrl + '/workflow/form/config/getForm',
    method: 'post',
    params: data
  })
};

// 34行
export const initWorkFlowService = (reqData)=>{
  return axios({
    method: 'post',
    url: WORKFLOW_BASE + 'initWorkflow',
    data: reqData
  })
};

// (41行)
export const getWorkflowInsService = (reqData)=>{
  return axios({
    method: 'post',
    url: WORKFLOW_BASE + 'getInstance',
    data: reqData
  })
};

// （49行）
export const saveCusComplaintService = (reqData)=>{
  return axios({
    method: 'post',
    url: \`\${WORKFLOW_FORM}saveFormData\`,
    data: reqData,
  })
};

// (65行)获取业务表单的数据
export const getFormBuzData = (reqData)=>{
  return axios({
    method: 'post',
    url: \`\${WORKFLOW_FORM}getFormData\`,
    params: reqData,
  })
};

// （74行）
export const setParameterService = (reqData)=>{
  return axios({
    method: 'post',
    url: \`\${WORKFLOW_FORM}setParameter\`,
    data: reqData,
  })
};

// (142行)
export function getFormInitDataService(data){
  return axios({
    method: 'get',
    url:  \`\${WORKFLOW_FORM}getFormInitData\`,
    params: data,
  })
}

export function getFiles({method, params, url}){
 debugger;
 return axios({
    method: 'get',
    url: url,
    params: params
  })
}

`;

export default text;
