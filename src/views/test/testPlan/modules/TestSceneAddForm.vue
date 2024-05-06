<template>
  <ant-modal
    modalWidth="1640"
    modalHeight="880"
    :visible="open"
    :modal-title="formTitle"
    :adjust-size="true"
    @cancel="cancel"
  >
    <a-card :bordered="false" class="container" slot="content">
      <split splitHeight="100%" :leftWidth="leftWidth">
        <template slot="paneL">
          <div>
            <tree-list class="scrollable" ref="treeList" @onClick="onClick" @ok="getTreeData" :showAddModal="false" />
          </div>
        </template>
        <template slot="paneR">
          <tab-list
            style="margin-top: 5px"
            @changeLeftWidth="changeLeftWidth"
            @setSceneList="setSceneList"
            ref="sceneList"
            :newTitle="newTitle"
            :tab="tab"
            :projectId="projectId"
          >
            <template slot="table">
              <!-- 条件搜索 -->
              <ui-search style="margin-top: -10px;"
                ref="uiSearch"
                :versionOptions="versionOptions"
                :memberOptions="memberOptions"
                :resultOptions="resultOptions"
                @handleQuery="handleQuery"
                @changeParam="changeParam"
                @resetQuery="resetQuery"
              ></ui-search>
              <a-divider style="margin: 5px 10px 0px 10px"></a-divider>
              <!-- table表格 -->
              <advance-table
                :scroll="{ x: 1070, y: 420 }"
                :columns="columns"
                :data-source="list"
                title="场景列表"
                :loading="loading"
                rowKey="id"
                @refresh="getList"
                size="middle"
                :components="isDragTable"
                bordered
                tableKey="ui-test-automation-index-table"
                :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                :format-conditions="true"
                :pagination="{
                  current: queryParam.pageNum,
                  pageSize: queryParam.pageSize,
                  pageSizeOptions: ['10', '20', '30', '40', '50', '1000'],
                  total: total,
                  showSizeChanger: true,
                  showLessItems: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`,
                  onChange: changeSize,
                  customRow: onClickRow,
                  onShowSizeChange: onSizeChange,
                }"
              >
                <div class="table-operations" slot="button">
                  <a-button type="primary" @click="handleAssociateAll()" v-hasPermi="['test:testPlan:addTestScene']">
                    <a-icon type="play-circle" />关联所有
                  </a-button>
                </div>
                <span slot="tags" slot-scope="{ record }">
                  {{ getTags(record.tags) }}
                </span>
                <span slot="executeStatus" slot-scope="{ record }">
                  {{ record.debugRecordList.length>0 ? record.debugRecordList[0].executeStatus :'未开始' }}
                </span>
                <span slot="scenePassRate" slot-scope="{ record }">
                  {{ record.debugRecordList.length>0&&record.debugRecordList[0].executeStatus==='已完成' ? record.debugRecordList[0].scenePassRate : '-' }}
                </span>
                <span slot="executeResult" slot-scope="{ record }">
                  {{ record.debugRecordList.length>0&&record.debugRecordList[0].executeStatus==='已完成' ? record.debugRecordList[0].executeResult : '-' }}
                </span>
                <span slot="duration" slot-scope="{ record }">
                  {{ record.debugRecordList.length>0&&record.debugRecordList[0].executeStatus==='已完成' ? formatDuration(record.debugRecordList[0].duration)  : '-' }}
                </span>
                <span slot="caseTotal" slot-scope="{ record }">
                  {{ record.debugRecordList.length>0&&record.debugRecordList[0].executeStatus==='已完成' ? record.debugRecordList[0].caseTotal : '-' }}
                </span>
                <span slot="casePass" slot-scope="{ record }">
                  {{ record.debugRecordList.length>0&&record.debugRecordList[0].executeStatus==='已完成' ? record.debugRecordList[0].casePass : '-' }}
                </span>
                <span slot="caseFail" slot-scope="{ record }">
                  {{ record.debugRecordList.length>0&&record.debugRecordList[0].executeStatus==='已完成' ? record.debugRecordList[0].caseFail : '-' }}
                </span>
                <span slot="caseSkip" slot-scope="{ record }">
                  {{ record.debugRecordList.length>0&&record.debugRecordList[0].executeStatus==='已完成' ? record.debugRecordList[0].caseSkip : '-' }}
                </span>
                <span slot="stepTotal" slot-scope="{ record }">
                  {{ record.debugRecordList.length>0&&record.debugRecordList[0].executeStatus==='已完成' ? record.debugRecordList[0].stepTotal : '-' }}
                </span>
                <span slot="stepPass" slot-scope="{ record }">
                  {{ record.debugRecordList.length>0&&record.debugRecordList[0].executeStatus==='已完成' ? record.debugRecordList[0].stepPass : '-' }}
                </span>
                <span slot="stepFail" slot-scope="{ record }">
                  {{ record.debugRecordList.length>0&&record.debugRecordList[0].executeStatus==='已完成' ? record.debugRecordList[0].stepFail : '-' }}
                </span>
                <span slot="stepSkip" slot-scope="{ record }">
                  {{ record.debugRecordList.length>0&&record.debugRecordList[0].executeStatus==='已完成' ? record.debugRecordList[0].stepSkip : '-' }}
                </span>
                <span slot="executeName" slot-scope="{ record }">
                  {{ record.debugRecordList.length>0&&record.debugRecordList[0].executeStatus==='已完成' ? record.debugRecordList[0].executeName : '-' }}
                </span>
                <!-- <span slot="principalId" slot-scope="{ record }">
                  {{ findNodeId(memberOptions, record.principalId, 'name') }}
                </span> -->
                <span slot="result" slot-scope="{ record }">
                  <a-badge :status="record.result == '1' ? 'processing' : 'error'" :text="resultTypeFormat(record)" />
                </span>
                <span slot="createTime" slot-scope="{ record }">
                  {{ parseTime(record.createTime) }}
                </span>
                <span slot="updateTime" slot-scope="{ record }">
                  {{ parseTime(record.updateTime) }}
                </span>
              </advance-table>
            </template>
          </tab-list>
        </template>
      </split>
    </a-card>
    <template slot="footer">
      <span style="margin-right: 10px">已选中 {{ sceneList1.length }} 条数据</span>
      <a-button @click="cancel()"> 取消 </a-button>
      <a-button type="primary" @click="addTestScene()"> 确定 </a-button>
    </template>
  </ant-modal>
</template>

<script>
import * as api from '@/api/api'
import AntModal from '@/components/pt/dialog/AntModal'
import TreeList from '@/views/ui/automation/components/TreeList.vue'
import Split from '@/components/pt/split/Index'
import AdvanceTable from '@/components/pt/table/AdvanceTable'
import AddOrEditForm from '@/views/ui/automation/modules/AddOrEditForm.vue'
import TabList from '@/components/pt/tab/tabList.vue'
import { findChildItem, findChildId } from '@/utils/sakura'
import { levelOptions, statusOptions } from '@/utils/options'
import UiSearch from '@/views/ui/automation/components/UiSearch.vue'
import CopyScence from '@/views/ui/automation/modules/OperationC.vue'
import executScenceForm from '@/views/ui/automation/modules/executScenceForm.vue'

import { getUiNodeAll, getUiNode, getSceneList } from '@/api/ui'

export default {
  name: 'Element',
  props: {
    tab: {
      type: String,
      default: 'UI自动化测试',
    },
    projectId: {
      type: String,
    },
    memberOptions: {
      type: Array,
    },
    testPlanId: {
      type: String,
    },
  },
  components: {
    AntModal,
    TreeList,
    Split,
    AdvanceTable,
    TabList,
    UiSearch,
    AddOrEditForm,
    CopyScence,
    executScenceForm,
  },
  // 给下拉列表树提供树形数据
  provide() {
    return {
      // treeData: this.treeData,
      TestPlanOptions: this.TestPlanOptions,
    }
  },
  computed: {
    isDragTable() {
      return this.dragTable(this.columns)
    },
  },
  data() {
    return {
      open: false,
      formTitle: '',

      leftWidth: '300',
      newTitle: '新建场景',
      levelOptions,
      statusOptions,
      resultOptions: [],
      versionOptions: [],

      environment_Id: '',
      loading: false,
      total: 0,
      statusColor: ['#f25f62', '#5cbc31', '#888c92'], // 控制用例状态颜色
      estateColor: ['#c71218', '#f25f62', '#e69736'], // 控制用例等级颜色
      selectedRowKeys: [],
      selectedRows: [],
      multiple: true,
      names: [],
      ids: [],
      sceneIds: [],
      sceneList: [],
      sceneList1: [],
      sceneList2: [],
      sceneList3: [],
      sceneListTitle: '',
      activeId: '', // 控制选中的node颜色
      showIcon: true, // 控制node的icon操作是否显示
      showPreviewModal: false,
      version: {},
      queryParam: {
        pageNum: 1,
        pageSize: 10,
        sceneId: '',
        name: '',
        versionId: '',
        versionName: '',
        moduleName: '',
        level: '',
        status: '',
        executeResultType: 'debug',
        executeResult: '',
        createByName: '',
        principalName: '',
        estate: '',
      },
      columns: [
        {
          title: '场景ID',
          dataIndex: 'sceneId',
          width: 180,
          ellipsis: true,
          align: 'center',
          sorter: {
            compare: (a, b) => a.sceneId - b.sceneId,
            multiple: 3,
          },
        },
        {
          title: '场景名称',
          dataIndex: 'name',
          width: 320,
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
          width: 80,
          scopedSlots: { customRender: 'executeStatus' },
          align: 'center',
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
          width: 80,
          ellipsis: true,
          align: 'center',
        },
        {
          title: '运行耗时',
          dataIndex: 'debugRecordList[0].duration',
          scopedSlots: { customRender: 'duration' },
          width: 100,
          ellipsis: true,
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
        // {
        //   title: '操作',
        //   dataIndex: 'operation',
        //   fixed: 'right',
        //   width: 220,
        //   scopedSlots: { customRender: 'operation' },
        //   align: 'center',
        // },
      ],
      list: [],
      newTree: {},
      treeData: [],
    }
  },
  created() {
    // this.$http.get(`/dict/sys_normal_result`).then((response) => {
    //   this.resultOptions = response.result.list
    // })
  },
  watch: {
    activeId: {
      handler(val) {
        // console.log('val: ' + val)
        // this.getList()
      },
    },
    sceneList(newVal, oldVal) {
      // console.log('sceneList变化了', newVal, oldVal);
      // this.sceneList.length = newVal.length;
    },
    'queryParam.pageNum1': function (newVal, oldVal) {
      console.log('pageNum变化了', newVal, oldVal)
      console.log(this.selectedRows);
      this.sceneList1 = []
      this.sceneList1.push(...this.selectedRows);
      console.log(this.sceneList1);
    },
  },
  mounted() {},
  methods: {
    // 获取列表
    async getList() {
      try {
        const { projectId, activeId, queryParam, treeData } = this
        let arr = [activeId]
        let childItem = findChildItem(treeData, activeId)
        // let moduleIds = activeId === treeData[0].id ? [] : findChildId(childItem, arr)
        let moduleIds = this.queryParam.versionId != '' ? findChildId(childItem, arr) : []
        // let moduleIds = this.queryParam.versionId != "" && this.queryParam.moduleName!=='全部场景' ? arr:[]
        const params = {
          ...queryParam,
          projectId,
          moduleIds,
          testPlanId: this.testPlanId,
          testSceneState: 'association',
        }
        this.loading = true
        const response = await getSceneList(params)
        this.list = response.data.list
        this.list.forEach((item, index) => {
          item.debugRecordList = item.debugRecord ? JSON.parse(item.debugRecord) : []
        })
        this.total = response.data.total
        this.sceneList = this.list
        if (this.sceneListTitle === '所有场景') {
          this.sceneList1 = this.sceneList
        }
        // getSceneList(params).then((response) => {
        //   this.list = response.data.list
        //   this.list.forEach((item, index) => {
        //     item.debugRecordList = item.debugRecord ? JSON.parse(item.debugRecord) : []
        //   })
        //   this.total = response.data.total
        //   return this.list
        // })
        // if (this.sceneListTitle === '所有场景') {
        //   this.sceneList = this.list
        // }
        // console.log(response);
        // if (response.code === '200') {
        //     console.log('Response data:', response.data);
        //     const tabs = document.querySelectorAll('.ant-modal-body');
        //     console.log(tabs[0])
        //     tabs[0].style.padding = '0';
        // } else {
        //     console.error('Error:', response.message);
        // }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        this.loading = false
        // this.close()
      }
    },
    // 获取当前计划项目环境下的所有版本
    async getAllVersions() {
      const queryParam = {
        projectId: this.projectId,
      }
      await api.getEnvironmentList(queryParam).then((response) => {
        response.data.list.forEach((item, index) => {
          if (item.status === 1) {
            this.environment_Id = item.id
            var versionList = JSON.parse(item.versionConfig)
            this.versionOptions = []
            versionList.forEach((item, index) => {
              if (item.delFlag === 0) {
                this.versionOptions.push(item)
                if (item.status === 1) {
                  this.version = item
                  this.queryParam.versionId = item.id
                  this.$refs.uiSearch.searchParam.versionId = item.id
                  this.$refs.uiSearch.searchParam.versionName = item.name
                }
              }
            })
          }
        })
      })
      // await this.getTreeData()
    },
    getTags(tags) {
      if (!tags) {
        return tags
      } else {
        return JSON.parse(tags).join(',')
      }
    },
    // 获取树形结构
    getTreeData() {
      // const { projectId } = this
      if (this.queryParam.versionId !== '') {
        getUiNode(this.projectId, this.queryParam.versionId).then((response) => {
          this.treeData = response?.data || {}
          const setting = {
            iconDisabled: true,
          }
          this.treeData = [{ ...this.treeData, ...setting }]
          this.$nextTick(() => {
            this.$refs.treeList.getTreeData(
              this.treeData,
              this.projectId,
              this.queryParam.versionId,
              this.queryParam.versionName
            )
          })
        })
      }
    },
    getTreeDataAll() {
      // const { projectId } = this
      getUiNodeAll(this.projectId).then((response) => {
        this.treeData = response?.data || {}
        const setting = {
          iconDisabled: true,
        }
        this.treeData = [{ ...this.treeData, ...setting }]
        this.$nextTick(() => {
          this.$refs.treeList.getTreeData(this.treeData, this.projectId, this.queryParam.versionId)
        })
      })
    },
    resultTypeFormat(row) {
      return this.selectDictLabel(this.resultOptions, row.result)
    },
    // 是否显示左侧侧边菜单
    changeLeftWidth(width, key) {
      this.leftWidth = width
      if (key === '0') {
        this.getTreeData(this.activeId)
        this.getList()
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const treeElement = this.$refs.treeList.$el
        console.log(treeElement)
        treeElement.scrollIntoView({ behavior: 'smooth', block: 'end' })
      })
    },
    scrollToNode(node) {
      console.log(node)
      this.$nextTick(() => {
        const targetElement = document.getElementById(node)
        if (targetElement) {
          console.log(targetElement)
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'end' })
        }
      })
    },
    // 点击树节点
    onClick(params) {
      // console.log('onClick', params)
      this.activeId = params
      // this.getTreeData()
      this.treeData.forEach((node) => {
        this.getAllChildren(node)
      })
      this.getList()
      this.$refs.treeList.moduleId = params
      // this.scrollToBottom()
      // this.scrollToNode(this.selectedKeys[0])
    },
    getAllChildren(node) {
      if (node.id === this.activeId) {
        this.queryParam.moduleName = node.name
      } else if (node.children) {
        node.children.forEach((child) => {
          this.getAllChildren(child)
        })
      }
    },
    // 监听查询参数改变
    changeParam(searchParam) {
      // console.log(searchParam);
      this.queryParam = Object.assign(this.queryParam, searchParam)
      this.handleQuery()
    },
    async handleQuery() {
      try {
        if (this.queryParam.versionId !== '') {
          this.$refs.treeList.clearSelectedkeys()
          this.getTreeData()
        } else {
          // this.getTreeDataAll()
          await this.getList()
        }
      } catch (error) {
        console.error('Error:', error)
      }
    },
    close() {
      this.selectedRowKeys = []
      this.sceneList1 = []
      this.multiple = !this.selectedRowKeys.length
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.$emit('close')
      this.selectedRowKeys = []
      this.sceneList1 = []
      this.multiple = !this.selectedRowKeys.length
      this.$refs.treeList.clearSelectedkeys()
    },
    resetQuery() {
      this.selectedRowKeys = []
      this.ids = []
      this.sceneIds = []
      this.sceneList1 = []
      this.multiple = !this.selectedRowKeys.length
      this.queryParam = {
        pageNum: 1,
        pageSize: 10,
        sceneId: '',
        name: '',
        versionId: '',
        versionName: '',
        level: '',
        status: '',
        executeResultType: 'debug',
        executeResult: '',
        createByName: '',
        principalName: '',
        estate: '',
      }
    },
    getAllPageList() {
      this.selectedRowKeys = []
      this.multiple = !this.selectedRowKeys.length
      this.sceneList = []
      this.getAllVersions()
      this.handleQuery()
    },
    //切换tab标签后设置场景信息
    setSceneList(record) {
      this.sceneList = []
      this.sceneList.push(record)
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.open = true
      this.formTitle = '关联测试场景'
      this.getAllPageList()
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.open = true
      this.formTitle = '修改测试计划'
      this.okButton = '确定'
      this.form = Object.assign(this.form, row)
      this.form.memberIds = []
      row.memberList.forEach((item, index) => {
        this.form.memberIds.push(item.id)
      })
      this.form.principalIds = []
      row.principalList.forEach((item, index) => {
        this.form.principalIds.push(item.id)
      })
      this.form.planTime = []
      this.form.planTime.push(row.plannedStartTime)
      this.form.planTime.push(row.plannedEndTime)
    },
    handleAssociateAll1() {
      if (this.queryParam.versionId !== '') {
        this.sceneList = this.list
      } else {
        this.$message.error('请选择场景版本！')
      }
    },
    async handleAssociateAll() {
      if (this.queryParam.versionId !== '') {
        // this.queryParam.pageSize = 1000
        this.sceneListTitle = '所有场景'
        await this.getList()
        this.sceneListTitle = ''
      } else {
        this.$message.error('请选择场景版本！')
      }
    },
    addTestScene() {
      // console.log(this.sceneList);
      let params = {
        testPlanId: this.testPlanId,
        sceneIdList: this.sceneList1.map((item) => item.id),
        // projectConfig: this.project,
        // automationConfig: this.automation
      }
      if(params.sceneIdList.length<1){
        this.$message.warning('请选择需要关联的测试场景!')
      }else{
        api.addTestScene(params).then((response) => {
          this.$message.success('添加成功')
          this.open = false
          this.$emit('getList')
        })
      }
    },
    onShowSizeChange(current, pageSize) {
      this.queryParam.pageSize = pageSize
      this.getList()
    },
    onSizeChange(current, size) {
      this.queryParam.pageNum = 1
      this.queryParam.pageSize = size;
      this.getList()
    },
    changeSize(current, pageSize) {
      this.queryParam.pageNum = current
      this.queryParam.pageSize = pageSize
      this.getList()
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      this.ids = this.selectedRows.map((item) => item.id)
      this.names = this.selectedRows.map((item) => item.name)
      this.sceneIds = this.selectedRows.map((item) => item.sceneId)
      this.sceneList2 = []
      this.selectedRowKeys.forEach((item) => {
        for(var scene of this.sceneList)
        if(item===scene.id){
          this.sceneList2.push(scene)
          break
        }
      })
      this.sceneList1.push(...this.sceneList2)
      this.sceneList3 = []
      this.selectedRowKeys.forEach((item) => {
        for(var scene of this.sceneList1)
        if(item===scene.id){
          this.sceneList3.push(scene)
          break
        }
      })
      this.sceneList1=this.sceneList3
      console.log(this.sceneList1);
      this.single = selectedRowKeys.length !== 1
      this.multiple = !selectedRowKeys.length
    },
    onClickRow(record) {
      return {
        on: {
          click: () => {
            const keys = []
            console.log(record);
            // keys.push(record.id)
            keys.push(record)
            this.selectedRowKeys = keys
          },
        },
      }
    },
  },
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
  position: relative;
}
.fixed-top {
  position: sticky;
  width: 100%;
  top: 0;
}
::v-deep .ant-modal-body {
  padding: 0px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
}
.scrollable {
  // height: 100%;
  max-height: calc(100vh - 195px);
  margin-top: 2px;
  // margin-bottom: 5px;
  overflow-y: scroll;
}
.case-status {
  padding: 2px 5px;
  color: #fff;
  border-radius: 5%;
}
</style>
