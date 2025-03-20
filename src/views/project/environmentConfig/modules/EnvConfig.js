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
    width: 288,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '版本描述',
    dataIndex: 'description',
    width: 400,
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
    title: '主线版本',
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
    width: 188,
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

// 服务器配置
export const serverType = [
  {
    label: 'Linux',
    type: 'Linux'
  },
  {
    label: 'Windows',
    type: 'Windows'
  }
]
export const serverQueryData = [
  {
    label: '主机ID',
    value: 'id',
  },
  {
    label: '主机名称',
    value: 'host',
  },
  {
    label: '主机描述',
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
  {
    label: '创建时间',
  },
]
export const serverColumns = [
  {
    title: '主机ID',
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
    ellipsis: true,
    align: 'center',
  },
  {
    title: '服务器版本',
    dataIndex: 'version',
    width: 130,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '主机名称',
    dataIndex: 'host',
    width: 120,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '主机端口',
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
    width: 160,
    dataIndex: 'passWord',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '主机描述',
    width: 270,
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
    title: '创建人',
    width: 100,
    dataIndex: 'createByName',
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
    fixed: 'right',
    width: 250,
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
    sql: 'SELECT VERSION();'
  },
  {
    label: 'Oracle',
    type: 'Oracle',
    driver: 'oracle.jdbc.driver.OracleDriver',
    url: 'jdbc:oracle:thin:@localhost:port:mydb',
    sql: 'SELECT * FROM v$version;'
  },
  {
    label: 'SQLServer',
    type: 'SQLServer',
    driver: 'com.microsoft.sqlserver.jdbc.SQLServerDriver',
    url: 'jdbc:sqlserver://localhost:port;databaseName=mydb',
    sql: 'SELECT @@VERSION;'
  },
  {
    label: 'PostgreSQL',
    type: 'PostgreSQL',
    driver: 'org.postgresql.Driver',
    url: 'jdbc:postgresql://localhost:port/mydb',
    sql: 'SELECT version();'
  },
  {
    label: 'Greenplum',
    type: 'Greenplum',
    driver: 'org.postgresql.Driver',
    url: 'jdbc:postgresql://localhost:port/mydb',
    sql: 'SELECT version();'
  },
  {
    label: 'Sybase',
    type: 'Sybase',
    driver: 'com.sybase.jdbc4.jdbc.SybDriver',
    url: 'jdbc:sybase:Tds:localhost:port/mydb',
    sql: 'SELECT @@version'
  },
  {
    label: 'Hive',
    type: 'Hive',
    driver: 'org.apache.hive.jdbc.HiveDriver',
    url: 'jdbc:hive2://localhost:port/mydb',
    sql: 'SELECT @@version'
  },
  {
    label: 'TiDB',
    type: 'TiDB',
    driver: 'com.mysql.cj.jdbc.Driver',
    url: 'jdbc:mysql://localhost:port/mydb',
    sql: 'SELECT @@VERSION;'
  },
  {
    label: 'OceanBase',
    type: 'OceanBase',
    driver: 'com.mysql.jdbc.Driver',
    url: 'jdbc:mysql://localhost:port/mydb',
    sql: 'SELECT @@VERSION;'
  },
  {
    label: 'Teradata',
    type: 'Teradata',
    driver: 'com.teradata.jdbc.TeraDriver',
    url: 'jdbc:teradata://localhost/DATABASE=mydb,DBS_PORT=port',
    sql: 'SELECT @@VERSION;'
  },
  {
    label: 'MariaDB',
    type: 'MariaDB',
    driver: 'org.mariadb.jdbc.Driver',
    url: 'jdbc:mysql://localhost:port/mydb',
    sql: 'SELECT @@VERSION;'
  },
  {
    label: 'KingBase',
    type: 'KingBase',
    driver: 'com.kingbase8.Driver',
    url: 'jdbc:kingbase8://localhost:port/mydb',
    sql: 'SELECT @@VERSION;'
  },
  {
    label: 'IRIS',
    type: 'IRIS',
    driver: 'com.intersystems.jdbc.IRISDriver',
    url: 'jdbc:IRIS://localhost:port/mydb',
    sql: 'SELECT @@VERSION;'
  },
  {
    label: 'Informix',
    type: 'Informix',
    driver: 'com.informix.jdbc.IfxDriver',
    url: 'jdbc:informix-sqli://localhost:port/mydb:informixserver=informix',
    sql: 'SELECT @@VERSION;'
  },
  {
    label: 'DB2',
    type: 'DB2',
    driver: 'com.ibm.db2.jcc.DB2Driver',
    url: 'jdbc:db2://localhost:port/mydb',
    sql: 'SELECT version();'
  },
  {
    label: 'Cache',
    type: 'Cache',
    driver: 'com.intersys.jdbc.CacheDriver',
    url: 'jdbc:Cache://localhost:port/mydb',
    sql: 'SELECT version();'
  },
  {
    label: 'GaussDB',
    type: 'GaussDB',
    driver: 'org.postgresql.Driver',
    url: 'jdbc:postgresql://localhost:port/mydb',
    sql: 'SELECT version();'
  },
  {
    label: 'Gbase8a',
    type: 'Gbase8a',
    driver: 'com.gbase.jdbc.Driver',
    url: 'jdbc:gbase://localhost:port/mydb',
    sql: 'SELECT version();'
  },
  {
    label: 'Gbase8s',
    type: 'Gbase8s',
    driver: 'com.gbasedbt.jdbc.Driver',
    url: 'jdbc:gbasedbt-sqli://localhost:port/mydb:GBASEDBTSERVER=gbaseserver;CLIENT_LOCALE=zh_cn.utf8;SQLMODE=GBase;NEWCODESET=UTF8,zh_cn.UTF8,57372;DB_LOCALE=zh_CN.57372;',
    sql: 'SELECT version();'
  },
  {
    label: 'TDengine',
    type: 'TDengine',
    driver: 'com.taosdata.jdbc.rs.RestfulDriver',
    url: 'jdbc:TAOS-RS://localhost:port/mydb',
    sql: 'SELECT version();'
  },
  {
    label: 'Hbase',
    type: 'Hbase',
    driver: 'org.apache.phoenix.jdbc.PhoenixDriver',
    url: 'jdbc:phoenix:localhost:port/mydb',
    sql: 'SELECT version();'
  },
  {
    label: '达梦',
    type: '达梦',
    driver: 'dm.jdbc.driver.DmDriver',
    url: 'jdbc:dm://localhost:port/schema=mydb',
    sql: 'SELECT version();'
  },
  {
    label: 'MongoDB',
    type: 'MongoDB',
    driver: 'com.dbschema.MongoJdbcDriver',
    url: 'mongodb://userName:passWord@localhost:port/mydb?authSource=admin',
    sql: 'SELECT version();'
  }
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
    title: '数据库ID',
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
    width: 160,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '数据库名称',
    dataIndex: 'name',
    width: 160,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '数据库端口',
    dataIndex: 'port',
    width: 100,
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
    title: '数据库用户名',
    dataIndex: 'userName',
    width: 110,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '数据库密码',
    dataIndex: 'passWord',
    width: 236,
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
