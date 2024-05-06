import request from '@/utils/request'
import qs from 'qs'
//** **** 项目管理 start ***** */
// 获取项目列表
export function getProjectList(params) {
  return request({
    url: '/project/projectConfig/list',
    method: 'get',
    params,
  })
}
// 新增项目
export function addProject(data) {
  return request({
    url: '/project/projectConfig',
    method: 'post',
    data,
  })
}
// 修改项目
export function editProject(data) {
  return request({
    url: '/project/projectConfig',
    method: 'put',
    data,
  })
}
// 删除项目
export function deleteProject(data) {
  return request({
    url: `/project/projectConfig/remove`,
    method: 'put',
    data
  })
}
// 修改项目状态
export function updateProjectConfigStatus(data) {
  return request({
    url: '/project/projectConfig/updateStatus',
    method: 'put',
    data
  })
}
// 导出项目配置
export function exportProject() {
  return request({
    url: `/project/projectConfig/export`,
    method: 'get',
    responseType: 'blob',
    headers:{ 'Content-Type': 'application/json; application/octet-stream'},
  })
}
// 获取系统下所有用户
export function getAllUsersOfSystem() {
  return request({
    url: '/system/user/getAll',
    method: 'get',
  })
}

//** **** 环境管理 start ***** */
// 获取环境列表信息
export function getEnvironmentList(params) {
  return request({
    url: '/project/environmentConfig/list',
    method: 'get',
    params,
  })
}
// 获取环境详细信息
export function getEnvironmentInfo(id) {
  return request({
    url: `/project/environmentConfig/${id}`,
    method: 'get',
  })
}
// 新增环境
export function addEnvironment(data) {
  return request({
    url: '/project/environmentConfig',
    method: 'post',
    data,
  })
}
// 修改环境
export function editEnvironment(data) {
  return request({
    url: '/project/environmentConfig',
    method: 'put',
    data,
  })
}
// 删除环境
export function deleteEnvironment(data) {
  return request({
    url: `/project/environmentConfig/remove`,
    method: 'put',
    data
  })
}
// 修改环境状态
export function updateEnvironmentStatus(data) {
  return request({
    url: '/project/environmentConfig/updateStatus',
    method: 'put',
    data
  })
}
// 导出环境配置
export function exportEnvironmentConfig(data) {
  return request({
    url: `/project/environmentConfig/export`,
    method: 'post',
    responseType: 'blob',
    headers:{ 'Content-Type': 'application/json; application/octet-stream'},
    data,
  })
}

//** **** 版本配置 ***** */
// 新增版本
export function addVersion(data) {
  return request({
    url: '/project/environmentConfig/addVersion',
    method: 'post',
    data,
  })
}
// 修改版本
export function editVersion(data) {
  return request({
    url: '/project/environmentConfig/editVersion',
    method: 'put',
    data
  })
}
// 删除版本
export function removeVersion(data) {
  return request({
    url: `/project/environmentConfig/removeVersion`,
    method: 'delete',
    data
  })
}

/** **** 域名配置 ***** */
export function addDomain(data) {
  return request({
    url: '/project/environmentConfig/addDomain',
    method: 'post',
    data,
  })
}
export function editDomain(data) {
  return request({
    url: '/project/environmentConfig/editDomain',
    method: 'put',
    data
  })
}
export function removeDomain(data) {
  return request({
    url: `/project/environmentConfig/removeDomain`,
    method: 'delete',
    data
  })
}

/** **** 帐号配置 ***** */
export function addAccount(data) {
  return request({
    url: '/project/environmentConfig/addAccount',
    method: 'post',
    data,
  })
}
export function editAccount(data) {
  return request({
    url: '/project/environmentConfig/editAccount',
    method: 'put',
    data
  })
}
export function removeAccount(data) {
  return request({
    url: `/project/environmentConfig/removeAccount`,
    method: 'delete',
    data
  })
}

/** **** 服务器配置 ***** */
export function addServer(data) {
  return request({
    url: '/project/environmentConfig/addServer',
    method: 'post',
    data,
  })
}
export function editServer(data) {
  return request({
    url: '/project/environmentConfig/editServer',
    method: 'put',
    data
  })
}
export function removeServer(data) {
  return request({
    url: `/project/environmentConfig/removeServer`,
    method: 'delete',
    data
  })
}

/** **** 数据库配置 ***** */
export function addDataBase(data) {
  return request({
    url: '/project/environmentConfig/addDataBase',
    method: 'post',
    data,
  })
}
export function editDataBase(data) {
  return request({
    url: '/project/environmentConfig/editDataBase',
    method: 'put',
    data
  })
}
export function removeDataBase(data) {
  return request({
    url: `/project/environmentConfig/removeDataBase`,
    method: 'delete',
    data
  })
}
// 校验数据库配置
export function checkDataBase(data) {
  return request({
    url: '/system/environment/validate',
    method: 'post',
    data,
  })
}

//** **** 自动化配置管理 start ***** */
// 获取自动化配置列表信息
export function getAutomationList(params) {
  return request({
    url: '/project/automationConfig/list',
    method: 'get',
    params,
  })
}
// 获取自动化配置详细信息
export function getAutomationInfo(id) {
  return request({
    url: `/project/automationConfig/${id}`,
    method: 'get',
  })
}
// 新增自动化配置
export function addAutomation(data) {
  return request({
    url: '/project/automationConfig',
    method: 'post',
    data,
  })
}
// 修改自动化配置
export function editAutomation(data) {
  return request({
    url: '/project/automationConfig',
    method: 'put',
    data,
  })
}
// 删除自动化配置
export function deleteAutomation(data) {
  return request({
    url: `/project/automationConfig/remove`,
    method: 'put',
    data
  })
}
// 修改自动化配置状态
export function updateAutomationStatus(data) {
  return request({
    url: '/project/automationConfig/updateStatus',
    method: 'put',
    data
  })
}
// 导出自动化配置配置
export function exportAutomationConfig(data) {
  return request({
    url: `/project/automationConfig/export`,
    method: 'post',
    responseType: 'blob',
    headers:{ 'Content-Type': 'application/json; application/octet-stream'},
    data,
  })
}

//** **** 项目配置 ***** */
// 新增项目
export function addAutomationProject(data) {
  return request({
    url: '/project/automationConfig/addProject',
    method: 'post',
    data,
  })
}
// 修改项目
export function editAutomationProject(data) {
  return request({
    url: '/project/automationConfig/editProject',
    method: 'put',
    data
  })
}
// 删除项目
export function removeAutomationProject(data) {
  return request({
    url: `/project/automationConfig/removeProject`,
    method: 'delete',
    data
  })
}
//** **** Jenkins配置 ***** */
// 新增Jenkins
export function addAutomationJenkins(data) {
  return request({
    url: '/project/automationConfig/addJenkins',
    method: 'post',
    data,
  })
}
// 修改Jenkins
export function editAutomationJenkins(data) {
  return request({
    url: '/project/automationConfig/editJenkins',
    method: 'put',
    data
  })
}
// 删除Jenkins
export function removeAutomationJenkins(data) {
  return request({
    url: `/project/automationConfig/removeJenkins`,
    method: 'delete',
    data
  })
}

//** **** 环境配置 ***** */
// 新增环境
export function addAutomationEnvironment(data) {
  return request({
    url: '/project/automationConfig/addEnvironment',
    method: 'post',
    data,
  })
}
// 修改环境
export function editAutomationEnvironment(data) {
  return request({
    url: '/project/automationConfig/editEnvironment',
    method: 'put',
    data
  })
}
// 删除环境
export function removeAutomationEnvironment(data) {
  return request({
    url: `/project/automationConfig/removeEnvironment`,
    method: 'delete',
    data
  })
}
// 同步环境
export function syncAutomationEnvironment1(id) {
  return request({
    url: `/project/automationConfig/syncEnvironment/${id}`,
    method: 'get',
  })
}
// 同步环境
export function syncAutomationEnvironment(data) {
  return request({
    url: `/project/automationConfig/syncEnvironment`,
    method: 'post',
    data,
  })
}

//** **** 浏览器配置 ***** */
// 新增浏览器
export function addAutomationBrowser(data) {
  return request({
    url: '/project/automationConfig/addBrowser',
    method: 'post',
    data,
  })
}
// 修改浏览器
export function editAutomationBrowser(data) {
  return request({
    url: '/project/automationConfig/editBrowser',
    method: 'put',
    data
  })
}
// 删除浏览器
export function removeAutomationBrowser(data) {
  return request({
    url: `/project/automationConfig/removeBrowser`,
    method: 'delete',
    data
  })
}























// 获取版本管理列表
export function getVersionList(params) {
  return request({
    url: '/system/version/list',
    method: 'get',
    params,
  })
}
// 获取版本详细信息
export function getVersionInfo(id) {
  return request({
    url: `/system/version/${id}`,
    method: 'get',
  })
}

// 版本状态切换
export function changeVersionStatus(id) {
  return request({
    url: `/system/version/change/${id}`,
    method: 'get',
  })
}
// 最新版切换
export function setLatestVersion(data) {
  return request({
    url: `/system/version/latest`,
    method: 'put',
    data,
  })
}
//** **** 版本管理 end ***** */
//** **** 配置管理 start ***** */
// 获取配置管理列表
export function getConfigurationList(params) {
  return request({
    url: '/system/configuration/list',
    method: 'get',
    params,
  })
}
// 新增配置管理
export function addConfiguration(data) {
  return request({
    url: '/system/configuration',
    method: 'post',
    data,
  })
}
// 修改配置管理
export function editConfiguration(data) {
  return request({
    url: '/system/configuration',
    method: 'put',
    data,
  })
}
// 删除配置管理
export function deleteConfiguration(params) {
  return request({
    url: `/system/configuration/${params}`,
    method: 'delete',
  })
}

//** **** 配置管理 end ***** */




export function getAllProject() {
  return request({
    url: '/system/project/getAll',
    method: 'get',
  })
}