export const versionColumns = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 270,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '版本名称',
    dataIndex: 'name',
    width: 250,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '版本描述',
    dataIndex: 'description',
    width: 557,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '主线版本',
    dataIndex: 'status',
    width: 100,
    scopedSlots: { customRender: 'status' },
    align: 'center',
  },
  // {
  //   title: '创建人',
  //   dataIndex: 'createByName',
  //   width: 100,
  //   align: 'center',
  // },
  {
    title: '更新人',
    dataIndex: 'updateByName',
    width: 100,
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
  // {
  //   title: '更新人',
  //   dataIndex: 'updateByName',
  //   width: 100,
  //   align: 'center',
  // },
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
    width: 160,
    fixed: 'right',
    scopedSlots: {
      customRender: 'operation',
    },
    align: 'center',
  },
]
export const domainColumns = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 270,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '域名名称',
    dataIndex: 'name',
    width: 200,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '域名地址',
    dataIndex: 'url',
    width: 410,
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
    width: 150,
    ellipsis: true,
    scopedSlots: {
      customRender: 'createTime',
    },
    align: 'center',
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    width: 150,
    ellipsis: true,
    scopedSlots: {
      customRender: 'updateTime',
    },
    align: 'center',
  },
  // {
  //   title: '操作',
  //   dataIndex: 'operation',
  //   width: 250,
  //   fixed: 'right',
  //   scopedSlots: {
  //     customRender: 'operation',
  //   },
  //   align: 'center',
  // },
]
// 服务器配置
export const serverColumns = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 270,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '服务器类型',
    dataIndex: 'type',
    width: 100,
    scopedSlots: { customRender: 'type' },
    align: 'center',
  },
  {
    title: '服务器版本',
    dataIndex: 'version',
    width: 150,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '主机名称',
    dataIndex: 'host',
    width: 110,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '端口',
    width: 60,
    dataIndex: 'port',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '用户名',
    width: 80,
    dataIndex: 'userName',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '密码',
    width: 150,
    dataIndex: 'passWord',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '关联版本',
    width: 157,
    dataIndex: 'description',
    scopedSlots: { customRender: 'description' },
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
    title: '更新人',
    width: 100,
    dataIndex: 'updateByName',
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
    fixed: 'right',
    width: 160,
    scopedSlots: {
      customRender: 'operation',
    },
    align: 'center',
  },
]

// 数据库配置
export const dataBaseType = [
  {
    label: 'MySQL',
    type: 'MySQL',
    driver: 'com.mysql.jdbc.Driver',
    url: 'jdbc:mysql://localhost:port/mydb',
  },
  {
    label: 'Oracle',
    type: 'Oracle',
    driver: 'oracle.jdbc.driver.OracleDriver',
    url: 'jdbc:oracle:thin:@localhost:port:mydb',
  },
  {
    label: 'SQLServer',
    type: 'SQLServer',
    driver: 'com.microsoft.jdbc.sqlserver.SQLServerDriver',
    url: 'jdbc:sqlserver://localhost:port;databaseName=mydb',
  },
  {
    label: 'PostgreSQL',
    type: 'PostgreSQL',
    driver: 'org.postgresql.Driver',
    url: 'jdbc:postgresql://localhost:port/mydb',
  },
  {
    label: 'DB2',
    type: 'DB2',
    driver: 'com.ibm.db2.jcc.DB2Driver',
    url: 'jdbc:db2://localhost:port/mydb',
  },
  {
    label: 'SQLite',
    type: 'SQLite',
    driver: 'org.sqlite.JDBC',
    url: 'jdbc:sqlite:/path/to/database.sqlite',
  },
  {
    label: 'Sybase',
    type: 'Sybase',
    driver: 'com.sybase.jdbc4.jdbc.SybDriver',
    url: 'jdbc:sybase:Tds:localhost:port/SXABC',
  },
  {
    label: '达梦',
    type: '达梦',
    driver: 'dm.jdbc.driver.DmDriver',
    url: 'jdbc:dm://localhost:port/hive',
  },
]
export const dataBaseQueryData = [
  {
    label: '数据库ID',
    value: 'id',
  },
  {
    label: '数据库名称',
    value: 'name',
  },
  {
    label: '数据库类型',
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
export const dataBaseColumns = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 270,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '数据库类型',
    dataIndex: 'type',
    width: 100,
    scopedSlots: { customRender: 'type' },
    ellipsis: true,
    align: 'center',
  },
  {
    title: '数据库版本',
    dataIndex: 'version',
    width: 150,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '数据库名称',
    dataIndex: 'name',
    width: 110,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '端口',
    dataIndex: 'port',
    width: 60,
    ellipsis: true,
    align: 'center',
  },
  // {
  //   title: '数据库驱动',
  //   dataIndex: 'driver',
  //   width: 300,
  //   ellipsis: true,
  //   align: 'center',
  // },
  // {
  //   title: '数据库连接串',
  //   dataIndex: 'url',
  //   width: 500,
  //   ellipsis: true,
  //   align: 'center',
  // },
  {
    title: '用户名',
    dataIndex: 'userName',
    width: 80,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '密码',
    dataIndex: 'passWord',
    width: 150,
    ellipsis: true,
    align: 'center',
  },
  // {
  //   title: '最大连接数',
  //   dataIndex: 'maxActive',
  //   width: 100,
  //   ellipsis: true,
  //   align: 'center',
  // },
  // {
  //   title: '最大等待时间',
  //   dataIndex: 'maxWait',
  //   width: 100,
  //   ellipsis: true,
  //   align: 'center',
  // },
  {
    title: '描述',
    width: 157,
    dataIndex: 'description',
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
    title: '更新人',
    width: 100,
    dataIndex: 'updateByName',
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
    width: 160,
    fixed: 'right',
    scopedSlots: {
      customRender: 'operation',
    },
    align: 'center',
  },
]
export const driverType = [
  {
    label: 'MySql',
    value: 'MySql',
  },
  {
    label: 'Oracle',
    value: 'Oracle',
  },
  {
    label: 'SQLServer',
    value: 'SQLServer',
  },
]

export const projectColumns = [
  {
    title: 'ID',
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
  // {
  //   title: '项目描述',
  //   dataIndex: 'description',
  //   width: 255,
  //   ellipsis: true,
  //   align: 'center',
  // },
  {
    title: '项目地址',
    dataIndex: 'url',
    width: 450,
    scopedSlots: { customRender: 'url' },
    ellipsis: true,
    align: 'center',
  },
  {
    title: '脚本保存路径',
    dataIndex: 'path',
    width: '100%',
    ellipsis: true,
    align: 'center',
  },
  // {
  //   title: '启用状态',
  //   dataIndex: 'status',
  //   width: 100,
  //   scopedSlots: { customRender: 'status' },
  //   align: 'center',
  // },
  // {
  //   title: '创建人',
  //   dataIndex: 'createByName',
  //   width: 100,
  //   align: 'center',
  // },
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
  // {
  //   title: '更新人',
  //   dataIndex: 'updateByName',
  //   width: 100,
  //   align: 'center',
  // },
  // {
  //   title: '更新时间',
  //   dataIndex: 'updateTime',
  //   width: 150,
  //   ellipsis: true,
  //   scopedSlots: {
  //     customRender: 'updateTime',
  //   },
  //   align: 'center',
  // },
  // {
  //   title: '操作',
  //   dataIndex: 'operation',
  //   width: 250,
  //   fixed: 'right',
  //   scopedSlots: {
  //     customRender: 'operation',
  //   },
  //   align: 'center',
  // },
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
    width: 110,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '端口',
    width: 60,
    dataIndex: 'port',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '用户名',
    width: 80,
    dataIndex: 'userName',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '密码',
    width: 120,
    dataIndex: 'passWord',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '地址',
    width: 201,
    dataIndex: 'url',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '关联项目',
    width: 230,
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
  // {
  //   title: '创建人',
  //   dataIndex: 'createByName',
  //   width: 100,
  //   align: 'center',
  // },
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
    title: '更新人',
    dataIndex: 'updateByName',
    width: 100,
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
    width: 160,
    fixed: 'right',
    scopedSlots: {
      customRender: 'operation',
    },
    align: 'center',
  },
]
// 环境配置
export const useStatusOptions = [
  {
    label: '离线',
    idle: 2
  },
  {
    label: '空闲',
    idle: 1
  },
  {
    label: '使用中',
    idle: 0
  }
]
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
    title: 'ID',
    dataIndex: 'id',
    width: 270,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '环境名称',
    dataIndex: 'name',
    width: 110,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '环境描述',
    dataIndex: 'description',
    width: 491,
    ellipsis: true,
    scopedSlots: { customRender: 'description' },
    align: 'center',
  },
  {
    title: '在线状态',
    dataIndex: 'offline',
    width: 100,
    scopedSlots: { customRender: 'offline' },
    align: 'center',
  },
  {
    title: '使用状态',
    dataIndex: 'idle',
    width: 100,
    scopedSlots: { customRender: 'idle' },
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
    title: '同步人',
    dataIndex: 'createByName',
    width: 100,
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
    width: 160,
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
    title: 'ID',
    dataIndex: 'id',
    width: 270,
    ellipsis: true,
    align: 'center',
  },
  // {
  //   title: '浏览器类型',
  //   dataIndex: 'type',
  //   width: 100,
  //   scopedSlots: { customRender: 'type' },
  //   ellipsis: true,
  //   align: 'center',
  // },
  {
    title: '浏览器名称',
    dataIndex: 'name',
    width: 110,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '浏览器版本',
    dataIndex: 'version',
    width: 150,
    ellipsis: true,
    align: 'center',
  },
  // {
  //   title: '浏览器程序路径',
  //   dataIndex: 'path',
  //   width: 400,
  //   ellipsis: true,
  //   align: 'center',
  // },
  {
    title: '浏览器驱动路径',
    dataIndex: 'driver',
    width: 541,
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
    width: 160,
    fixed: 'right',
    scopedSlots: {
      customRender: 'operation',
    },
    align: 'center',
  },
]

export const sceneColumns = [
  {
    title: '场景ID',
    dataIndex: 'sceneId',
    width: 180,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '场景名称',
    dataIndex: 'name',
    width: 300,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '场景版本',
    dataIndex: 'versionName',
    width: 120,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '场景等级',
    dataIndex: 'level',
    width: 80,
    align: 'center',
  },
  // {
  //   title: '标签',
  //   dataIndex: 'tags',
  //   // scopedSlots: { customRender: 'tags' },
  //   width: 100,
  //   ellipsis: true,
  //   align: 'center',
  // },
  // {
  //   title: '创建人',
  //   dataIndex: 'createByName',
  //   width: 70,
  //   align: 'center',
  // },
  // {
  //   title: '责任人',
  //   width: 70,
  //   scopedSlots: { customRender: 'principalId' },
  //   dataIndex: 'principalId',
  //   align: 'center',
  // },
  // {
  //   title: '执行状态',
  //   dataIndex: 'status',
  //   width: 80,
  //   scopedSlots: { customRender: 'status' },
  //   align: 'center'
  // },
  // {
  //   title: '用例数',
  //   width: 60,
  //   dataIndex: 'caseTotal',
  //   align: 'center',
  // },
  // {
  //   title: '通过',
  //   width: 60,
  //   dataIndex: 'casePass',
  //   align: 'center',
  // },
  // {
  //   title: '失败',
  //   width: 60,
  //   dataIndex: 'caseFail',
  //   align: 'center',
  // },
  // {
  //   title: '跳过',
  //   width: 60,
  //   dataIndex: 'caseSkip',
  //   align: 'center',
  // },
  // {
  //   title: '步骤数',
  //   width: 60,
  //   dataIndex: 'stepTotal',
  //   align: 'center',
  // },
  // {
  //   title: '通过',
  //   width: 60,
  //   dataIndex: 'stepPass',
  //   align: 'center',
  // },
  // {
  //   title: '失败',
  //   width: 60,
  //   dataIndex: 'stepFail',
  //   align: 'center',
  // },
  // {
  //   title: '跳过',
  //   width: 60,
  //   dataIndex: 'stepSkip',
  //   align: 'center',
  // },
  // {
  //   title: '通过率',
  //   width: 70,
  //   dataIndex: 'passRate',
  //   align: 'center',
  // },
  {
    title: '上次结果',
    dataIndex: 'executeResult',
    width: 80,
    ellipsis: true,
    align: 'center'
  },
  // {
  //   title: '创建时间',
  //   dataIndex: 'createTime',
  //   width: 150,
  //   ellipsis: true,
  //   align: 'center',
  //   scopedSlots: { customRender: 'createTime' },
  // },
  // {
  //   title: '最后更新时间',
  //   dataIndex: 'updateTime',
  //   width: 150,
  //   ellipsis: true,
  //   scopedSlots: { customRender: 'updateTime' },
  //   align: 'center',
  // },
  // {
  //   title: '操作',
  //   dataIndex: 'operation',
  //   fixed: 'right',
  //   width: 220,
  //   scopedSlots: { customRender: 'operation' },
  //   align: 'center',
  // },
]