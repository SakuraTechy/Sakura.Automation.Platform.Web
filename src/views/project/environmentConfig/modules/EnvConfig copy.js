export const enableStatusOptions = [
  {
    label: '已启用',
    id: 1,
  },
  {
    label: '未启用',
    id: 0,
  },
]
// 版本配置
export const versionQueryData = [
  {
    label: '版本ID',
    value: 'id',
  },
  {
    label: '版本名称',
    value: 'name',
  },
  {
    label: '版本描述',
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
export const versionColumns = [
  {
    title: '版本ID',
    dataIndex: 'id',
    width: 270,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '版本名称',
    dataIndex: 'name',
    width: 200,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '版本描述',
    dataIndex: 'description',
    width: 345,
    ellipsis: true,
    align: 'center',
  },
  // {
  //   title: '启用状态',
  //   width: 200,
  //   dataIndex: 'status',
  //   ellipsis: true,
  //   align: 'center'
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

// 域名配置
export const domainQueryData = [
  {
    label: '域名ID',
    value: 'id',
  },
  {
    label: '域名名称',
    value: 'name',
  },
  {
    label: '域名地址',
    value: 'url',
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
export const domainColumns = [
  {
    title: '域名ID',
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
    width: 345,
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

// 帐号配置
export const accountType = [
  {
    label: '管理员帐号',
    value: 'systems',
  },
  {
    label: '安全员账号',
    value: 'securitys',
  },
  {
    label: '审核员账号',
    value: 'audits',
  },
]
export const accountQueryData = [
  {
    label: '帐号ID',
    value: 'id',
  },
  {
    label: '帐号名称',
    value: 'userName',
  },
  {
    label: '帐号描述',
    value: 'description',
  },
  {
    label: '帐号类型',
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
export const accountColumns = [
  {
    title: '帐号ID',
    dataIndex: 'id',
    width: 270,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '帐号名称',
    dataIndex: 'userName',
    width: 195,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '帐号密码',
    dataIndex: 'passWord',
    width: 200,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '帐号描述',
    dataIndex: 'description',
    width: 200,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '帐号类型',
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

// 服务器配置
export const serverQueryData = [
  {
    label: '主机ID',
    value: 'id',
  },
  {
    label: '主机名称',
    value: 'projectName',
  },
  {
    label: '主机描述',
    value: 'abbreviate',
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
export const serverColumns = [
  {
    title: '主机ID',
    dataIndex: 'id',
    width: 200,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '主机名称',
    dataIndex: 'host',
    width: 200,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '主机端口',
    width: 200,
    dataIndex: 'prot',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '用户名',
    width: 200,
    dataIndex: 'userName',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '密码',
    width: 200,
    dataIndex: 'password',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '主机描述',
    width: 200,
    dataIndex: 'des',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '启用状态',
    width: 200,
    dataIndex: 'lastDomain',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '创建人',
    width: 200,
    dataIndex: 'createByName',
    align: 'center',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 200,
    ellipsis: true,
    scopedSlots: {
      customRender: 'createTime',
    },
    align: 'center',
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    width: 200,
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
    width: 280,
    scopedSlots: {
      customRender: 'operation',
    },
    align: 'center',
  },
]

// 数据库配置
export const DBQueryData = [
  {
    label: '数据库ID',
    value: 'id',
  },
  {
    label: '数据库名称',
    value: 'projectName',
  },
  {
    label: '数据库类型',
    value: 'abbreviate',
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
export const DBColumns = [
  {
    title: '数据库ID',
    dataIndex: 'id',
    width: 200,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '数据库名称',
    dataIndex: 'name',
    width: 200,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '数据库连接串',
    width: 200,
    dataIndex: 'password',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '用户名',
    width: 200,
    dataIndex: 'abbreviate',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '密码',
    width: 200,
    dataIndex: 'type',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '数据库类型',
    width: 200,
    dataIndex: 'des',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '启用状态',
    width: 200,
    dataIndex: 'lastDomain',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '创建人',
    width: 200,
    dataIndex: 'createByName',
    align: 'center',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 200,
    ellipsis: true,
    scopedSlots: {
      customRender: 'createTime',
    },
    align: 'center',
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    width: 200,
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
    width: 280,
    scopedSlots: {
      customRender: 'operation',
    },
    align: 'center',
  },
]
