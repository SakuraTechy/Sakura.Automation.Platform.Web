import Mock from 'mockjs2'
import { builder } from '../util'
import { mockCase1, mockCase2, mockCase3, mockTest } from './case'
import { mockAuto1, mockAuto2, mockAuto3 } from './automation'
import { mockElement1, mockElement2, mockElement3 } from './element'
import { mockProject, mockEnvironment, mockVersion } from './project'
import { mocklocateType, mockCaseEstate, mockStatus, mockResult, mockCaseType } from './dict'
import { mockReport } from './report'

const mockRouter = (options) => {
  console.log('options', options)
  const mockRouter = [
	{
	'name': 'System',
	'path': '/system',
	'hidden': false,
	'redirect': 'noRedirect',
	'component': 'Layout',
	'alwaysShow': true,
	'isFrame': '1',
	'meta': {
		'title': '系统管理',
		'icon': 'setting',
		'noCache': false,
		'remark': '系统管理目录'
	},
	'children': [{
		'name': 'Org',
		'path': 'org',
		'hidden': false,
		'redirect': 'noRedirect',
		'component': 'ParentView',
		'alwaysShow': true,
		'isFrame': '1',
		'meta': {
			'title': '组织管理',
			'icon': 'appstore',
			'noCache': false,
			'remark': ''
		},
		'children': [{
			'name': 'User',
			'path': 'user',
			'hidden': false,
			'component': 'system/user/SysUserIndex',
			'isFrame': '1',
			'meta': {
				'title': '用户管理',
				'icon': 'team',
				'noCache': false,
				'remark': '主要维护平台相关用户信息'
			}
		}, {
			'name': 'Dept',
			'path': 'dept',
			'hidden': false,
			'component': 'system/dept/SysDeptIndex',
			'isFrame': '1',
			'meta': {
				'title': '部门管理',
				'icon': 'cluster',
				'noCache': false,
				'remark': '部门管理菜单'
			}
		}, {
			'name': 'Post',
			'path': 'post',
			'hidden': false,
			'component': 'system/post/PostIndex',
			'isFrame': '1',
			'meta': {
				'title': '岗位管理',
				'icon': 'idcard',
				'noCache': false,
				'remark': '岗位管理菜单'
			}
		}]
	}, {
		'name': 'Auth',
		'path': 'auth',
		'hidden': false,
		'redirect': 'noRedirect',
		'component': 'ParentView',
		'alwaysShow': true,
		'isFrame': '1',
		'meta': {
			'title': '权限管理',
			'icon': 'solution',
			'noCache': false,
			'remark': ''
		},
		'children': [{
			'name': 'Role',
			'path': 'role',
			'hidden': false,
			'component': 'system/role/QueryList',
			'isFrame': '1',
			'meta': {
				'title': '角色管理',
				'icon': 'contacts',
				'noCache': false,
				'remark': '维护平台各角色数据以及权限分配.'
			}
		}, {
			'name': 'SysAuth',
			'path': 'sysAuth',
			'hidden': false,
			'component': 'system/role/SysRoleAuth',
			'isFrame': '1',
			'meta': {
				'title': '菜单授权',
				'icon': 'api',
				'noCache': false,
				'remark': ''
			}
		}]
	},
	{
		'name': 'SysSetting',
		'path': 'sysSetting',
		'hidden': false,
		'redirect': 'noRedirect',
		'component': 'ParentView',
		'alwaysShow': true,
		'isFrame': '1',
		'meta': {
			'title': '系统设置',
			'icon': 'setting',
			'noCache': false,
			'remark': ''
		},
		'children': [
			{
			'name': 'Menu',
			'path': 'menu',
			'hidden': false,
			'component': 'system/menu/MenuIndex',
			'isFrame': '1',
			'meta': {
				'title': '菜单管理',
				'icon': 'bars',
				'noCache': false,
				'remark': '平台所有菜单维护'
			}
		}
	]
	}]
    },
	{
		'name': 'Case',
		'path': '/case',
		'hidden': false,
		'redirect': 'noRedirect',
		'component': 'Layout',
		'alwaysShow': true,
		'isFrame': '1',
		'meta': {
			'title': '测试跟踪',
			'icon': 'desktop',
			'noCache': false,
			'remark': '测试跟踪目录'
		},
		'children': [{
			'name': 'Function',
			'path': 'function',
			'hidden': false,
			'component': 'case/function/index',
			'isFrame': '1',
			'meta': {
				'title': '功能用例',
				'icon': 'file-protect',
				'noCache': false,
				'remark': '功能用例'
			}
		}]
	},
	{
		'name': 'Uitest',
		'path': '/uitest',
		'hidden': false,
		'redirect': 'noRedirect',
		'component': 'Layout',
		'alwaysShow': true,
		'isFrame': '1',
		'meta': {
			'title': 'UI测试',
			'icon': 'experiment',
			'noCache': false,
			'remark': 'UI测试'
		},
		'children': [{
			'name': 'Automation',
			'path': 'automation',
			'hidden': false,
			'component': 'uitest/automation/index',
			'isFrame': '1',
			'meta': {
				'title': 'UI自动化',
				'icon': 'funnel-plot',
				'noCache': false,
				'remark': 'UI自动化'
			}
		}]
	},
	{
		'name': 'ProjectSetting',
		'path': '/projectSetting',
		'hidden': false,
		'redirect': 'noRedirect',
		'component': 'Layout',
		'alwaysShow': true,
		'isFrame': '1',
		'meta': {
			'title': '项目设置',
			'icon': 'setting',
			'noCache': false,
			'remark': '项目设置'
		},
		'children': [{
			'name': 'Project',
			'path': 'project',
			'hidden': false,
			'component': 'projectSetting/project/index',
			'isFrame': '1',
			'meta': {
				'title': '项目管理',
				'icon': 'project',
				'noCache': false,
				'remark': '平台所有项目管理'
			}
		},
		{
			'name': 'Environmentenu',
			'path': 'environment',
			'hidden': false,
			'component': 'projectSetting/environment/index',
			'isFrame': '1',
			'meta': {
				'title': '环境管理',
				'icon': 'environment',
				'noCache': false,
				'remark': '平台所有环境配置'
			}
		}]
	}
  ]
  return builder(mockRouter)
}
Mock.mock(/\/api\/ui\/element\/1/, 'get', mockElement1)
Mock.mock(/\/api\/ui\/element\/2/, 'get', mockElement3)
Mock.mock(/\/api\/ui\/element\/5/, 'get', mockElement2)
Mock.mock(/\/api\/user\/router/, 'get', mockRouter)
// Mock.mock(/\/api\/system\/project/, 'get', mockProject)
// Mock.mock(/\/api\/system\/environment/, 'get', mockEnvironment)
Mock.mock(/\/api\/system\/case\/1/, 'get', mockCase1)
Mock.mock(/\/api\/system\/case\/2/, 'get', mockCase3)
Mock.mock(/\/api\/system\/case\/5/, 'get', mockCase2)
Mock.mock(/\/api\/system\/case\/test/, 'get', mockTest)
// Mock.mock(/\/api\/system\/automation\/1/, 'get', mockAuto1)
// Mock.mock(/\/api\/system\/automation\/2/, 'get', mockAuto2)
// Mock.mock(/\/api\/system\/automation\/5/, 'get', mockAuto3)
// Mock.mock(/\/api\/system\/version/, 'get', mockVersion)
Mock.mock(/\/api\/dict\/sys_normal_locate/, 'get', mocklocateType)
Mock.mock(/\/api\/dict\/sys_normal_estate/, 'get', mockCaseEstate)
Mock.mock(/\/api\/dict\/sys_normal_status/, 'get', mockStatus)
Mock.mock(/\/api\/dict\/sys_normal_result/, 'get', mockResult)
Mock.mock(/\/api\/dict\/sys_normal_case-type/, 'get', mockCaseType)
Mock.mock(/\/api\/ui\/report/, 'get', mockReport)
