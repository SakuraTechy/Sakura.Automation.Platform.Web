export const columns = [
    {
      title: '场景名称',
      dataIndex: 'sceneName',
      width: 100,
      ellipsis: true,
      fixed: 'left',
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
      title: '执行状态',
      dataIndex: 'status',
      width: 100,
      scopedSlots: { customRender: 'status' },
      align: 'center'
    },
    {
      title: '标签',
      dataIndex: 'tags',
      width: 150,
      ellipsis: true,
      align: 'center'
    }
  ]
