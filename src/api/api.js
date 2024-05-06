import request from '@/utils/request'

//** **** UI测试 start ***** */
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

// 获取系统下所有用户
export function getAllUsersOfSystem() {
  return request({
    url: '/system/user/getAll',
    method: 'get',
  })
}

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

//** **** 测试管理 start ***** */
//** ** 测试计划 start *** */
// 查询测试管理-测试计划列表
export function getTestPlanList (params) {
  return request({
    url: '/test/testPlan/list',
    method: 'get',
    params: params
  })
}

// 查询测试管理-测试计划详细
export function getTestPlanInfo (id) {
  return request({
    url: `/test/testPlan/${id}`,
    method: 'get'
  })
}

// 新增测试管理-测试计划
export function addTestPlan (data) {
  return request({
    url: '/test/testPlan',
    method: 'post',
    data: data
  })
}

// 修改测试管理-测试计划
export function updateTestPlan (data) {
  return request({
    url: '/test/testPlan',
    method: 'put',
    data: data
  })
}

// 删除测试管理-测试计划
export function deleteTestPlan (data) {
  return request({
    url: `/test/testPlan/remove`,
    method: 'put',
    data: data
  })
}

// 导出测试管理-测试计划
export function exportTestPlan (query) {
  return request({
    url: '/test/testPlan/export',
    method: 'get',
    params: query
  })
}

// 导出测试管理-测试计划
export function uiCaseList (data) {
  return request({
    url: '/test/testPlan/uiCaseList',
    method: 'post',
    data: data
  })
}

// 添加测试计划-测试场景
export function addTestScene (data) {
  return request({
    url: '/test/testPlan/addTestScene',
    method: 'post',
    data: data
  })
}

// 删除测试计划-测试场景
export function removeTestScene (data) {
  return request({
    url: '/test/testPlan/removeTestScene',
    method: 'post',
    data: data
  })
}

// 获取初始化数据
export function getInitData (dictTypes) {
  return request({
    url: '/test/testPlan/getInitData/' + dictTypes,
    method: 'get'
  })
}

//** ** 测试报告 start *** */
// 查询测试管理-测试报告列表
export function getTestReportList (params) {
  return request({
    url: '/test/testReport/list',
    method: 'get',
    params: params
  })
}

// 查询测试管理-测试报告详细
export function getTestReportInfo (id) {
  return request({
    url: `/test/testReport/${id}`,
    method: 'get'
  })
}

// 删除测试管理-测试报告
export function deleteTestReport (data) {
  return request({
    url: '/test/testReport/remove',
    method: 'put',
    data: data
  })
}

// 查询测试管理-测试度量报表信息
export function getTestMetricList (data) {
  return request({
    url: '/test/testMetric/list',
    method: 'post',
    data: data
  })
}

//** ** 定时任务 start *** */
// 查询测试管理-定时任务列表
export function getTimedTaskList (params) {
  return request({
    url: '/test/timedTask/list',
    method: 'get',
    params: params
  })
}

// 查询测试管理-定时任务详细
export function getTimedTaskInfo (id) {
  return request({
    url: `/test/timedTask/${id}`,
    method: 'get'
  })
}

// 新增测试管理-定时任务
export function addTimedTask (data) {
  return request({
    url: '/test/timedTask',
    method: 'post',
    data: data
  })
}

// 修改测试管理-定时任务
export function updateTimedTask (data) {
  return request({
    url: '/test/timedTask',
    method: 'put',
    data: data
  })
}

// 删除测试管理-定时任务
export function deleteTimedTask (data) {
  return request({
    url: `/test/timedTask/remove`,
    method: 'put',
    data: data
  })
}

// 导出测试管理-定时任务
export function exportTimedTask (query) {
  return request({
    url: '/test/timedTask/export',
    method: 'get',
    params: query
  })
}
// 查询测试管理-定时任务执行日志列表
export function getTimedTaskLogList (params) {
  return request({
    url: '/test/timedTask/getLogList',
    method: 'get',
    params: params
  })
}

// 删除定时任务执行日志
export function delJobLog (jobLogId) {
  return request({
    url: '/monitor/jobLog/' + jobLogId,
    method: 'delete'
  })
}

// 清空定时任务执行日志
export function cleanJobLog () {
  return request({
    url: '/monitor/jobLog/clean',
    method: 'delete'
  })
}