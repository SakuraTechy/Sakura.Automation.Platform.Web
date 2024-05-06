// 版本配置
export const versionQueryData = [{
    label: '版本ID',
    value: 'id',
  },
  {
    label: '版本名称',
    value: 'projectName',
  },
  {
    label: '版本描述',
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
  }
]
export const versionColumns = [{
    title: '版本ID',
    dataIndex: 'id',
    width: 200,
    ellipsis: true,
    align: 'center'
  },
  {
    title: '版本名称',
    dataIndex: 'name',
    width: 200,
    ellipsis: true,
    align: 'center'
  },
  {
    title: '版本描述',
    width: 200,
    dataIndex: 'abbreviate',
    ellipsis: true,
    align: 'center'
  },
  {
    title: '启用状态',
    width: 200,
    dataIndex: 'lastDomain',
    ellipsis: true,
    align: 'center'
  },
  {
    title: '创建人',
    dataIndex: 'createByName',
    align: 'center'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 200,
    ellipsis: true,
    scopedSlots: {
      customRender: 'createTime'
    },
    align: 'center'
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    width: 200,
    ellipsis: true,
    scopedSlots: {
      customRender: 'updateTime'
    },
    align: 'center'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    fixed: 'right',
    width: 280,
    scopedSlots: {
      customRender: 'operation'
    },
    align: 'center'
  }
]

// 域名配置
export const domainQueryData = [{
    label: '域名ID',
    value: 'id',
  },
  {
    label: '域名名称',
    value: 'projectName',
  },
  {
    label: '域名地址',
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
  }
]
export const domainColumns = [{
    title: '域名ID',
    dataIndex: 'id',
    width: 200,
    ellipsis: true,
    align: 'center'
  },
  {
    title: '域名名称',
    dataIndex: 'name',
    width: 200,
    ellipsis: true,
    align: 'center'
  },
  {
    title: '域名地址',
    width: 200,
    dataIndex: 'abbreviate',
    ellipsis: true,
    align: 'center'
  },
  {
    title: '启用状态',
    width: 200,
    dataIndex: 'lastDomain',
    ellipsis: true,
    align: 'center'
  },
  {
    title: '创建人',
    dataIndex: 'createByName',
    align: 'center'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 200,
    ellipsis: true,
    scopedSlots: {
      customRender: 'createTime'
    },
    align: 'center'
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    width: 200,
    ellipsis: true,
    scopedSlots: {
      customRender: 'updateTime'
    },
    align: 'center'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    fixed: 'right',
    width: 280,
    scopedSlots: {
      customRender: 'operation'
    },
    align: 'center'
  }
]

// 账号配置
export const accountQueryData = [{
    label: '账号ID',
    value: 'id',
  },
  {
    label: '账号名称',
    value: 'projectName',
  },
  {
    label: '账号描述',
    value: 'abbreviate',
  },
  {
    label: '账号类型',
    value: 'status',
  },
  {
    label: '创建人',
    value: 'createByName',
  },
  {
    label: '创建时间',
  }
]
export const accountColumns = [{
    title: '账号ID',
    dataIndex: 'id',
    width: 200,
    ellipsis: true,
    align: 'center'
  },
  {
    title: '账号名称',
    dataIndex: 'name',
    width: 200,
    ellipsis: true,
    align: 'center'
  },
  {
    title: '账号密码',
    width: 200,
    dataIndex: 'password',
    ellipsis: true,
    align: 'center'
  },
  {
    title: '账号描述',
    width: 200,
    dataIndex: 'abbreviate',
    ellipsis: true,
    align: 'center'
  },
  {
    title: '账号类型',
    width: 200,
    dataIndex: 'type',
    ellipsis: true,
    align: 'center'
  },
  {
    title: '启用状态',
    width: 200,
    dataIndex: 'lastDomain',
    ellipsis: true,
    align: 'center'
  },
  {
    title: '创建人',
    width: 200,
    dataIndex: 'createByName',
    align: 'center'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 200,
    ellipsis: true,
    scopedSlots: {
      customRender: 'createTime'
    },
    align: 'center'
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    width: 200,
    ellipsis: true,
    scopedSlots: {
      customRender: 'updateTime'
    },
    align: 'center'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    fixed: 'right',
    width: 280,
    scopedSlots: {
      customRender: 'operation'
    },
    align: 'center'
  }
]

// 服务器配置
export const serverQueryData = [{
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
  }
]
export const serverColumns = [{
    title: '主机ID',
    dataIndex: 'id',
    width: 200,
    ellipsis: true,
    align: 'center'
  },
  {
    title: '主机名称',
    dataIndex: 'name',
    width: 200,
    ellipsis: true,
    align: 'center'
  },
  {
    title: '主机端口',
    width: 200,
    dataIndex: 'password',
    ellipsis: true,
    align: 'center'
  },
  {
    title: '用户名',
    width: 200,
    dataIndex: 'abbreviate',
    ellipsis: true,
    align: 'center'
  },
  {
    title: '密码',
    width: 200,
    dataIndex: 'type',
    ellipsis: true,
    align: 'center'
  },
  {
    title: '主机描述',
    width: 200,
    dataIndex: 'des',
    ellipsis: true,
    align: 'center'
  },
  {
    title: '启用状态',
    width: 200,
    dataIndex: 'lastDomain',
    ellipsis: true,
    align: 'center'
  },
  {
    title: '创建人',
    width: 200,
    dataIndex: 'createByName',
    align: 'center'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 200,
    ellipsis: true,
    scopedSlots: {
      customRender: 'createTime'
    },
    align: 'center'
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    width: 200,
    ellipsis: true,
    scopedSlots: {
      customRender: 'updateTime'
    },
    align: 'center'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    fixed: 'right',
    width: 280,
    scopedSlots: {
      customRender: 'operation'
    },
    align: 'center'
  }
]

// 数据库配置
export const DBQueryData = [{
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
}
]
export const DBColumns = [{
  title: '数据库ID',
  dataIndex: 'id',
  width: 200,
  ellipsis: true,
  align: 'center'
},
{
  title: '数据库名称',
  dataIndex: 'name',
  width: 200,
  ellipsis: true,
  align: 'center'
},
{
  title: '数据库连接串',
  width: 200,
  dataIndex: 'password',
  ellipsis: true,
  align: 'center'
},
{
  title: '用户名',
  width: 200,
  dataIndex: 'abbreviate',
  ellipsis: true,
  align: 'center'
},
{
  title: '密码',
  width: 200,
  dataIndex: 'type',
  ellipsis: true,
  align: 'center'
},
{
  title: '数据库类型',
  width: 200,
  dataIndex: 'des',
  ellipsis: true,
  align: 'center'
},
{
  title: '启用状态',
  width: 200,
  dataIndex: 'lastDomain',
  ellipsis: true,
  align: 'center'
},
{
  title: '创建人',
  width: 200,
  dataIndex: 'createByName',
  align: 'center'
},
{
  title: '创建时间',
  dataIndex: 'createTime',
  width: 200,
  ellipsis: true,
  scopedSlots: {
    customRender: 'createTime'
  },
  align: 'center'
},
{
  title: '更新时间',
  dataIndex: 'updateTime',
  width: 200,
  ellipsis: true,
  scopedSlots: {
    customRender: 'updateTime'
  },
  align: 'center'
},
{
  title: '操作',
  dataIndex: 'operation',
  fixed: 'right',
  width: 280,
  scopedSlots: {
    customRender: 'operation'
  },
  align: 'center'
}
]