import request from '@/utils/request'

// 获取所有节点信息
export function getUiNodeAll(projectId,versionId) {
  return request({
    url: `/system/automation/node/${projectId}`,
    method: 'get',
  })
}
export function getUiNode(projectId,versionId) {
  return request({
    url: `/system/automation/node/${projectId}/${versionId}`,
    method: 'get',
  })
}
// 获取当前目录下的子节点
export function getUiNodeList(id) {
  return request({
    url: `/system/automation/node/list/${id}`,
    method: 'get',
  })
}
// 新增子节点
export function addUiNodeList(data) {
  return request({
    url: `/system/automation/node`,
    method: 'post',
    data
  })
}
// 修改子节点
export function editUiNodeList(data) {
  return request({
    url: `/system/automation/node`,
    method: 'put',
    data
  })
}
// 删除当前子节点
export function deleteUiNodeList(id) {
  return request({
    url: `/system/automation/node/${id}`,
    method: 'delete',
  })
}
// 获取场景列表
export function getSceneList(data) {
  return request({
    url: `/system/automation/list`,
    method: 'post',
    // params: data ,
    data
  })
}
// 新增场景
export function addScenceList(data) {
  return request({
    url: `/system/automation`,
    method: 'post',
    data
  })
}
// 编辑场景
export function editScenceList(data) {
  return request({
    url: `/system/automation`,
    method: 'put',
    data
  })
}
// 删除场景
export function deleteScenceList(params) {
  return request({
    url: `/system/automation/${params}`,
    method: 'delete',
  })
}
// 复制测试场景
export function copySence(data) {
  return request({
    url: `/system/automation/copy`,
    method: 'post',
    data
  })
}
export function copySenceAll(data) {
  return request({
    url: `/system/automation/copyAll`,
    method: 'post',
    data
  })
}
// 单个导出测试场景
export function exportScence(params) {
  return request({
    url: `/system/automation/export/${params}`,
    method: 'get',
    responseType: 'blob',
    headers:{ 'Content-Type': 'application/json; application/octet-stream'},
  })
}
// 批量导出测试场景
export function exportScenceList(params) {
  return request({
    url: `/system/automation/exports/${params}`,
    method: 'get',
    responseType: 'blob',
    headers:{ 'Content-Type': 'application/json; application/octet-stream'},
  })
}
// 导出项目下所有测试场景
export function exportScenceAll(data) {
  return request({
    url: `/system/automation/exportAll`,
    method: 'post',
    responseType: 'blob',
    headers:{ 'Content-Type': 'application/json; application/octet-stream'},
    data
  })
}
// 执行场景测试
// export function execScence(id) {
//   return request({
//     url: `/system/automation/exec/${id}`,
//     method: 'get',
//   })
// }
export function execScence(data) {
  return request({
    url: `/system/automation/exec`,
    method: 'post',
    data
  })
}
// 执行场景测试
export function execScenceAll(data) {
  return request({
    url: `/system/automation/execAll`,
    method: 'post',
    data
  })
}
// 获取场景基本信息
export function getScenceInfo(id) {
  return request({
    url: `/system/automation/${id}`,
    method: 'get',
  })
}
// 获取项目下所有版本
export function getVersionList(projectId) {
  return request({
    url: `/system/version/getVersion/${projectId}`,
    method: 'get',
  })
}

// 获取所有场景用例列表信息
export function getSenceCaseList(id) {
  return request({
    url: `/system/automation/${id}`,
    method: 'get',
  })
}
// 新增用例
export function addScenceCaseList(data) {
  return request({
    url: `/system/automation/addCase`,
    method: 'post',
    data
  })
}
// 编辑用例
export function editScenceCaseList(data) {
  return request({
    url: `/system/automation/editCase`,
    method: 'put',
    data
  })
}
// 删除用例
export function delSenceCaseList(data) {
  return request({
    url: `/system/automation/deleteCase`,
    method: 'delete',
    data
  })
}
// 复制用例
export function copySenceCaseList(data) {
  return request({
    url: `/system/automation/copyCase`,
    method: 'post',
    data
  })
}
// 获取用例详细信息
export function getSenceCaseInfo(data) {
  return request({
    url: `/system/automation/getCase`,
    method: 'post',
    data
  })
}
// 新增步骤
export function addSenceStep(data) {
  return request({
    url: `/system/automation/addStep`,
    method: 'post',
    data
  })
}
// 编辑步骤
export function editSenceStep(data) {
  return request({
    url: `/system/automation/editStep`,
    method: 'put',
    data
  })
}
// 获取步骤详细信息
export function getSenceStepInfo(data) {
  return request({
    url: `/system/automation/getStep`,
    method: 'post',
    data
  })
}
// 删除步骤
export function delSenceStepList(data) {
  return request({
    url: `/system/automation/deleteStep`,
    method: 'delete',
    data
  })
}
// 复制步骤
export function copySenceStepList(data) {
  return request({
    url: `/system/automation/copyStep`,
    method: 'post',
    data
  })
}
// 移动步骤
export function dragSenceStepInfo(data) {
  return request({
    url: `/system/automation/dragStep`,
    method: 'put',
    data
  })
}
// 复制用例
export function copyCase(data) {
  return request({
    url: `/system/automation/copyCase`,
    method: 'post',
    data
  })
}
// 复制步骤
export function copyStep(data) {
  return request({
    url: `/system/automation/copyStep`,
    method: 'post',
    data
  })
}
