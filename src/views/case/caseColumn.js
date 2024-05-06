export const columns = [
    {
      title: '用例名称',
      dataIndex: 'caseName',
      width: 100,
      ellipsis: true,
      fixed: 'left',
      align: 'center'
    },
    {
      title: '所属模块',
      dataIndex: 'module',
      width: 100,
      ellipsis: true,
      align: 'center',
      scopedSlots: { customRender: 'module' }
    },
    {
      title: '标签',
      dataIndex: 'tags',
      width: 150,
      ellipsis: true,
      align: 'center'
    },
    {
      title: '版本',
      dataIndex: 'versionId',
      width: 100,
      align: 'center',
      scopedSlots: { customRender: 'versionId' }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 200,
      ellipsis: true,
      align: 'center',
      scopedSlots: { customRender: 'createTime' }
    },
    {
      title: '用例描述',
      dataIndex: 'describe',
      width: 100,
      ellipsis: true,
      align: 'center',
      scopedSlots: { customRender: 'describe' }
    },
     {
      title: '用例状态',
      dataIndex: 'status',
      width: 100,
      scopedSlots: { customRender: 'status' },
      align: 'center'
    },
    {
      title: '用例等级',
      dataIndex: 'estate',
      width: 100,
      scopedSlots: { customRender: 'estate' },
      align: 'center'
    },
    {
      title: '创建人',
      dataIndex: 'createBy',
      width: 100,
      align: 'center'
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 200,
      ellipsis: true,
      scopedSlots: { customRender: 'updateTime' },
      align: 'center'
    },
    {
      title: '责任人',
      width: 100,
      dataIndex: 'responsible',
      align: 'center'
    },
    {
      title: '操作',
      dataIndex: 'operation',
      fixed: 'right',
      width: 100,
      scopedSlots: { customRender: 'operation' },
      align: 'center'
    }
  ]
