// 帐号配置
export const automationType = [
  {
    label: 'WEB自动化',
    type: 'web',
  },
  {
    label: 'APP自动化',
    type: 'app',
  },
  {
    label: 'API自动化',
    type: 'api',
  },
]
// 项目配置
export const projectQueryData = [
  {
    label: '项目ID',
    value: 'id',
  },
  {
    label: '项目名称',
    value: 'name',
  },
  {
    label: '项目描述',
    value: 'description',
  },
  {
    label: '启用状态',
    value: 'status',
  },
  {
    label: '创建人',
    value: 'createByName',
  },
  // {
  //   label: '修改人',
  //   value: 'updateByName',
  // },
  {
    label: '创建时间',
  },
]
export const projectColumns = [
  {
    title: '项目ID',
    dataIndex: 'id',
    width: 270,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '项目名称',
    dataIndex: 'name',
    width: 250,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '项目描述',
    dataIndex: 'description',
    width: 235,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '项目地址',
    dataIndex: 'url',
    width: 440,
    ellipsis: true,
    align: 'center',
  },
  // {
  //   title: '项目路径',
  //   dataIndex: 'path',
  //   width: 440,
  //   ellipsis: true,
  //   align: 'center',
  // },
  {
    title: '启用状态',
    dataIndex: 'status',
    width: 100,
    scopedSlots: { customRender: 'status' },
    align: 'center',
  },
  {
    title: '创建人',
    dataIndex: 'createByName',
    width: 100,
    align: 'center',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 160,
    ellipsis: true,
    scopedSlots: {
      customRender: 'createTime',
    },
    align: 'center',
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    width: 160,
    ellipsis: true,
    scopedSlots: {
      customRender: 'updateTime',
    },
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 250,
    fixed: 'right',
    scopedSlots: {
      customRender: 'operation',
    },
    align: 'center',
  },
]
// Jenkins配置
export const jenkinsQueryData = [
  {
    label: 'ID',
    value: 'id',
  },
  {
    label: 'IP',
    value: 'ip',
  },
  {
    label: '描述',
    value: 'description',
  },
  {
    label: '启用状态',
    value: 'status',
  },
  {
    label: '创建人',
    value: 'createByName',
  },
  // {
  //   label: '修改人',
  //   value: 'updateByName',
  // },
  {
    label: '创建时间',
  },
]
export const jenkinsColumns = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 270,
    ellipsis: true,
    align: 'center',
  },
  {
    title: 'IP',
    dataIndex: 'ip',
    width: 120,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '端口',
    width: 80,
    dataIndex: 'port',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '用户名',
    width: 95,
    dataIndex: 'userName',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '密码',
    width: 130,
    dataIndex: 'passWord',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '地址',
    width: 180,
    dataIndex: 'url',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '项目',
    width: 220,
    dataIndex: 'job',
    ellipsis: true,
    align: 'center',
  },
  // {
  //   title: '描述',
  //   width: 200,
  //   dataIndex: 'description',
  //   ellipsis: true,
  //   align: 'center',
  // },
  {
    title: '启用状态',
    dataIndex: 'status',
    width: 100,
    scopedSlots: { customRender: 'status' },
    align: 'center',
  },
  {
    title: '创建人',
    dataIndex: 'createByName',
    width: 100,
    align: 'center',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 160,
    ellipsis: true,
    scopedSlots: {
      customRender: 'createTime',
    },
    align: 'center',
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    width: 160,
    ellipsis: true,
    scopedSlots: {
      customRender: 'updateTime',
    },
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 250,
    fixed: 'right',
    scopedSlots: {
      customRender: 'operation',
    },
    align: 'center',
  },
]
// 环境配置
export const environmentQueryData = [
  {
    label: '环境ID',
    value: 'id',
  },
  {
    label: '环境名称',
    value: 'name',
  },
  {
    label: '环境描述',
    value: 'description',
  },
  // {
  //   label: '启用状态',
  //   value: 'status',
  // },
  {
    label: '使用状态',
    value: 'idle',
  },
  {
    label: '同步人',
    value: 'createByName',
  },
  // {
  //   label: '修改人',
  //   value: 'updateByName',
  // },
  {
    label: '同步时间',
  },
]
export const environmentColumns = [
  {
    title: '环境ID',
    dataIndex: 'id',
    width: 270,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '环境名称',
    dataIndex: 'name',
    width: 150,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '环境描述',
    dataIndex: 'description',
    width: 419,
    ellipsis: true,
    scopedSlots: { customRender: 'description' },
    align: 'center',
  },
  {
    title: '在线状态',
    dataIndex: 'offline',
    width: 120,
    scopedSlots: { customRender: 'offline' },
    align: 'center',
  },
  {
    title: '使用状态',
    dataIndex: 'idle',
    width: 120,
    scopedSlots: { customRender: 'idle' },
    align: 'center',
  },
  {
    title: '启用状态',
    dataIndex: 'status',
    width: 120,
    scopedSlots: { customRender: 'status' },
    align: 'center',
  },
  {
    title: '同步人',
    dataIndex: 'createByName',
    width: 120,
    align: 'center',
  },
  // {
  //   title: '创建时间',
  //   dataIndex: 'createTime',
  //   width: 150,
  //   ellipsis: true,
  //   scopedSlots: {
  //     customRender: 'createTime',
  //   },
  //   align: 'center',
  // },
  {
    title: '同步时间',
    dataIndex: 'updateTime',
    width: 160,
    ellipsis: true,
    scopedSlots: {
      customRender: 'updateTime',
    },
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 250,
    fixed: 'right',
    scopedSlots: {
      customRender: 'operation',
    },
    align: 'center',
  },
]
// 浏览器配置
export const browserType = [
  {
    label: '谷歌浏览器',
    type: 'Chrome',
    version: '108.0.5359.71',
    officialDownload: 'https://www.google.cn/intl/zh-CN/chrome/',
    driverDownload: 'http://chromedriver.storage.googleapis.com/108.0.5359.71/chromedriver_win32.zip',
    path: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    driver: 'C:/Program Files/Google/Chrome/Application/chromedriver.exe',
    profile: 'C:/Users/user06/AppData/Local/Google/Chrome/User Data/Default'
  },
  {
    label: '火狐浏览器',
    type: 'Firefox',
    version: '114.0.2',
    officialDownload: 'https://www.firefox.com.cn/download/#product-desktop-release',
    driverDownload: 'https://github.com/mozilla/geckodriver/releases/download/v0.31.0/geckodriver-v0.31.0-win64.zip',
    path: 'C:/Program Files/Mozilla Firefox/firefox.exe',
    driver: 'C:/Program Files/Mozilla Firefox/geckodriver.exe',
    profile: 'C:/Users/user06/AppData/Roaming/Mozilla/Firefox/Profiles/vi2c8er8.default'
  }
]
export const browserQueryData = [
  {
    label: '浏览器ID',
    value: 'id',
  },
  {
    label: '浏览器名称',
    value: 'name',
  },
  {
    label: '浏览器类型',
    value: 'type',
  },
  {
    label: '启用状态',
    value: 'status',
  },
  {
    label: '创建人',
    value: 'createByName',
  },
  {
    label: '创建时间',
  },
]
export const browserColumns = [
  {
    title: '浏览器ID',
    dataIndex: 'id',
    width: 270,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '浏览器名称',
    dataIndex: 'name',
    width: 100,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '浏览器版本',
    dataIndex: 'version',
    width: 125,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '浏览器程序路径',
    dataIndex: 'path',
    width: 400,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '浏览器驱动路径',
    dataIndex: 'driver',
    width: 420,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '浏览器类型',
    dataIndex: 'type',
    width: 100,
    scopedSlots: { customRender: 'type' },
    ellipsis: true,
    align: 'center',
  },
  {
    title: '启用状态',
    dataIndex: 'status',
    width: 100,
    scopedSlots: { customRender: 'status' },
    align: 'center',
  },
  {
    title: '创建人',
    dataIndex: 'createByName',
    width: 100,
    align: 'center',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 160,
    ellipsis: true,
    scopedSlots: {
      customRender: 'createTime',
    },
    align: 'center',
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    width: 160,
    ellipsis: true,
    scopedSlots: {
      customRender: 'updateTime',
    },
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 250,
    fixed: 'right',
    scopedSlots: {
      customRender: 'operation',
    },
    align: 'center',
  },
]