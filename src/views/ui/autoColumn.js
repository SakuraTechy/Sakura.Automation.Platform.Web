/*
 * @Author: liuzhi liuzhi@sakura.com
 * @Date: 2022-10-25 09:55:04
 * @LastEditors: liuzhi liuzhi@sakura.com
 * @LastEditTime: 2022-10-28 10:12:50
 * @FilePath: \Sakura.Test.Platform.Web\src\views\ui\autoColumn.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export const columns = [
  {
    title: '场景ID',
    dataIndex: 'sceneId',
    width: 180,
    fixed: 'left',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '场景名称',
    dataIndex: 'name',
    width: 368,
    // fixed: 'left',
    ellipsis: true,
    align: 'center',
    sorter: {
      compare: (a, b) => a.name - b.name,
      multiple: 3,
    },
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
  {
    title: '标签',
    dataIndex: 'tags',
    // scopedSlots: { customRender: 'tags' },
    width: 100,
    ellipsis: true,
    align: 'center',
  },
  {
    title: '执行状态',
    dataIndex: 'debugRecordList[0].executeStatus',
    scopedSlots: { customRender: 'executeStatus' },
    width: 80,
    align: 'center'
  },
  {
    title: '通过率',
    width: 70,
    dataIndex: 'debugRecordList[0].scenePassRate',
    scopedSlots: { customRender: 'scenePassRate' },
    align: 'center',
  },
  {
    title: '执行结果',
    dataIndex: 'debugRecordList[0].executeResult',
    scopedSlots: { customRender: 'executeResult' },
    width: 90,
    ellipsis: true,
    align: 'center'
  },
  {
    title: '运行耗时',
    width: 100,
    dataIndex: 'debugRecordList[0].duration',
    scopedSlots: { customRender: 'duration' },
    align: 'center',
  },
  {
    title: '用例数',
    width: 60,
    dataIndex: 'debugRecordList[0].caseTotal',
    scopedSlots: { customRender: 'caseTotal' },
    align: 'center',
  },
  {
    title: '通过',
    width: 60,
    dataIndex: 'debugRecordList[0].casePass',
    scopedSlots: { customRender: 'casePass' },
    align: 'center',
  },
  {
    title: '失败',
    width: 60,
    dataIndex: 'debugRecordList[0].caseFail',
    scopedSlots: { customRender: 'caseFail' },
    align: 'center',
  },
  {
    title: '跳过',
    width: 60,
    dataIndex: 'debugRecordList[0].caseSkip',
    scopedSlots: { customRender: 'caseSkip' },
    align: 'center',
  },
  {
    title: '步骤数',
    width: 60,
    dataIndex: 'debugRecordList[0].stepTotal',
    scopedSlots: { customRender: 'stepTotal' },
    align: 'center',
  },
  {
    title: '通过',
    width: 60,
    dataIndex: 'debugRecordList[0].stepPass',
    scopedSlots: { customRender: 'stepPass' },
    align: 'center',
  },
  {
    title: '失败',
    width: 60,
    dataIndex: 'debugRecordList[0].stepFail',
    scopedSlots: { customRender: 'stepFail' },
    align: 'center',
  },
  {
    title: '跳过',
    width: 60,
    dataIndex: 'debugRecordList[0].stepSkip',
    scopedSlots: { customRender: 'stepSkip' },
    align: 'center',
  },
  {
    title: '创建人',
    dataIndex: 'createByName',
    width: 70,
    align: 'center',
  },
  {
    title: '责任人',
    width: 70,
    scopedSlots: { customRender: 'principalName' },
    dataIndex: 'principalName',
    align: 'center',
  },
  {
    title: '执行人',
    dataIndex: 'debugRecordList[0].executeName',
    scopedSlots: { customRender: 'executeName' },
    width: 70,
    align: 'center',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 160,
    ellipsis: true,
    align: 'center',
    scopedSlots: { customRender: 'createTime' },
  },
  {
    title: '最后更新时间',
    dataIndex: 'updateTime',
    width: 160,
    ellipsis: true,
    scopedSlots: { customRender: 'updateTime' },
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    fixed: 'right',
    width: 220,
    scopedSlots: { customRender: 'operation' },
    align: 'center',
  },
]
