<template>
  <div>
    <a-card :bordered="false" class="container">
      <split splitHeight="100%" :leftWidth="leftWidth" :style="{ marginTop: `-15px` }">
        <template slot="paneL">
          <div>
            <a-select class="fixed-top" v-model="testPlan.id" placeholder="请选择计划" option-filter-prop="children"
              @change="handleChange" show-search allowClear>
              <a-select-option v-for="(item, index) in testPlanOptions" :key="index" :value="item.id" :title="item.name">
                {{ item.name }}
              </a-select-option>
            </a-select>
            <tree-list class="scrollable" ref="treeList" @onClick="onClick" @ok="getTreeData" :showAddModal="false"></tree-list>
          </div>
        </template>
        <template slot="paneR">
          <tab-list style="margin-top: 5px" @changeLeftWidth="changeLeftWidth" @setSceneList="setSceneList" ref="sceneList" :newTitle="newTitle"
            :fixedTab="fixedTab" :tab="tab" :projectId="project.id">
            <template :slot="fixedTab">
              <!-- 条件搜索 -->
              <ui-search ref="uiSearch" :versionOptions="versionOptions" :memberOptions="memberOptions"
                :resultOptions1="resultOptions1" @handleQuery="handleQuery" @changeParam="changeParam"
                @resetQuery="resetQuery">
              </ui-search>
              <a-divider style="margin: 10px 10px 0px 10px;"></a-divider>
              <!-- table表格 -->
              <advance-table :scroll="{ x: 1500, y: 420 }" :columns="columns" :data-source="list"
                :loading="loading" rowKey="id" @refresh="getList" size="middle" :components="isDragTable" bordered
                tableKey="ui-test-automation-index-table"
                :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :format-conditions="true"
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
                }">
                <div class="table-operations" slot="button">
                  <a-button type="danger" :disabled="multiple" @click="handleDelete" v-hasPermi="['test:testPlan:removeTestScene']">
                    <a-icon type="delete" />批量取消
                  </a-button>
                  <a-button type="danger" :disabled="multiple" @click="handleExecut" v-hasPermi="['ui:automation:exec']">
                    <a-icon type="right-circle" />批量执行
                  </a-button>
                  <a-button type="primary" @click="handleExecutAll" v-hasPermi="['ui:automation:exec']">
                    <a-icon type="play-circle" />执行所有
                  </a-button>
                </div>
                <span slot="tags" slot-scope="{ record }">
                  {{ getTags(record.tags) }}
                </span>
                <!-- <span slot="status" slot-scope="{ record }">
                  {{ findNodeId(statusOptions, record.status, 'label') }}
                </span> -->
                <span slot="status" slot-scope="{ record }">
                  <a-button v-for="(item, index) in getFilterArray(statusOptions, (item) => item.id === getExecuteStatus(record))" :key="index"
                    :style="{ height: '25px', color: 'white', backgroundColor: getButtonStyle(record)[0], borderColor: getButtonStyle(record)[1] }"
                  > {{ item.label }} 
                  </a-button>
                </span>
                <span slot="principalId" slot-scope="{ record }">
                  {{ findNodeId(memberOptions, record.principalId, 'name') }}
                </span>
                <span slot="createTime" slot-scope="{ record }">
                  {{ parseTime(record.createTime) }}
                </span>
                <span slot="updateTime" slot-scope="{ record }">
                  {{ parseTime(record.updateTime) }}
                </span>
                <span slot="operation" slot-scope="{ record }">
                  <a @click="handleExecut(record)" v-hasPermi="['ui:automation:exec']"> 执行 </a>
                  <a-divider type="vertical" v-hasPermi="['ui:automation:exec']" />
                  <a @click="handleDelete(record)" v-hasPermi="['test:testPlan:removeTestScene']"> 取消 </a>
                  <a-divider type="vertical" v-hasPermi="['test:testPlan:removeTestScene']" />
                  <a @click="handleConsoleUrl(record)" v-hasPermi="['ui:automation:exec']"> 日志 </a>
                  <a-divider type="vertical" v-hasPermi="['ui:automation:exec']" />
                  <a @click="handleTestReportUrl(record)" v-hasPermi="['ui:automation:exec']"> 报告 </a>
                  <a-divider type="vertical" v-hasPermi="['ui:automation:exec']" />
                </span>
              </advance-table>
            </template>
            <template :slot="tab">
              <!-- 条件搜索 -->
              <ui-search style="margin-top: -10px;" ref="uiSearch" :versionOptions="versionOptions" :memberOptions="memberOptions"
                :resultOptions1="resultOptions1" @handleQuery="handleQuery" @changeParam="changeParam"
                @resetQuery="resetQuery">
              </ui-search>
              <a-divider style="margin: 3px 10px 0px 10px;"></a-divider>
              <!-- table表格 -->
              <advance-table :scroll="{ x: 1500, y: 433 }" :columns="columns" :data-source="list" :needTitle="false"
                :loading="loading" rowKey="id" @refresh="getList" size="middle" :components="isDragTable" bordered
                tableKey="ui-test-automation-index-table"
                :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :format-conditions="true"
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
                }">
                <div class="table-operations" slot="button">
                  <a-space :size="8" style="margin-left: 8px">
                    <a-button type="primary" @click="handleAdd()" v-hasPermi="['test:testPlan:addTestScene']">
                      <a-icon type="plus-square" />关联测试场景
                    </a-button>
                  </a-space>
                  <a-space :size="8" style="margin-right: 8px">
                    <a-button type="danger" :disabled="multiple" @click="handleDelete()" v-hasPermi="['test:testPlan:removeTestScene']">
                      <a-icon type="delete" />批量删除
                    </a-button>
                    <!-- <a-button type="danger" :disabled="multiple" @click="handleExecut()" v-hasPermi="['ui:automation:exec']">
                     <a-icon type="right-circle" />批量执行
                    </a-button> -->
                    <a-dropdown :disabled="multiple">
                      <template #overlay>
                        <a-menu>
                          <a-menu-item v-for="(item) in testReportExecutionModeOptions" :key="item.id" @click="handleExecut(record, item)">
                            {{ item.name }}
                          </a-menu-item>
                        </a-menu>
                      </template>
                      <a-button type="danger" v-hasPermi="['ui:automation:exec']">
                        <a-icon type="right-circle" />批量执行
                      </a-button>
                    </a-dropdown>
                   <!-- <a-button type="primary" @click="handleExecutAll()" v-hasPermi="['ui:automation:exec']">
                      <a-icon type="play-circle" />执行所有
                   </a-button> -->
                    <a-dropdown>
                      <template #overlay>
                        <a-menu>
                          <a-menu-item v-for="(item) in testReportExecutionModeOptions" :key="item.id" @click="handleExecutAll(record, item)">
                            {{ item.name }}
                          </a-menu-item>
                        </a-menu>
                      </template>
                      <a-button type="primary" v-hasPermi="['ui:automation:exec']">
                        <a-icon type="play-circle" />执行所有
                      </a-button>
                    </a-dropdown>
                  </a-space>
                </div>
                <span slot="tags" slot-scope="{ record }">
                  {{ getTags(record.tags) }}
                </span>
                <!-- <span slot="status" slot-scope="{ record }">
                  {{ findNodeId(statusOptions, record.status, 'label') }}
                </span> -->
                <span slot="executeStatus" slot-scope="{ record }">
                  <a-button v-for="(item, index) in getFilterArray(testPlanStatusOptions, (item) => item.name === getTestRecord(record.testRecordList,'testPlanId').executeStatus)" :key="index"
                    :style="{ height: '25px', color: 'white', backgroundColor: getButtonStyle(record)[0], borderColor: getButtonStyle(record)[1] }"
                    > {{ item.name }} 
                  </a-button>
                </span>
                <span slot="casePassRate" slot-scope="{ record }">
                  {{ getTestRecord(record.testRecordList,"testPlanId").casePassRate }}
                </span>
                <span slot="executeResult" slot-scope="{ record }">
                  <a-button v-for="(item, index) in getFilterArray(resultOptions, (item) => item.label === getTestRecord(record.testRecordList,'testPlanId').executeResult)" :key="index"
                      :style="{ height: '25px', color: 'white', backgroundColor: getButtonStyle1(record)[0], borderColor: getButtonStyle1(record)[1] }"
                    > {{ item.label }} 
                  </a-button>
                </span>
                <span slot="duration" slot-scope="{ record }">
                  {{ formatDuration(getTestRecord(record.testRecordList,'testPlanId').duration) }}
                </span>
                <span slot="executeName" slot-scope="{ record }">
                  {{ getTestRecord(record.testRecordList,"testPlanId").executeName }}
                </span>
                <!-- <span slot="executeStatus" slot-scope="{ record }">
                  <div v-if="getTestRecord(record.testRecordList,'testPlanId').executeStatus!==undefined">
                    <a-button v-for="(item, index) in getFilterArray(testPlanStatusOptions, (item) => item.name === getTestRecord(record.testRecordList,'testPlanId').executeStatus)" :key="index"
                      :style="{ height: '25px', color: 'white', backgroundColor: getButtonStyle(record)[0], borderColor: getButtonStyle(record)[1] }"
                      > {{ item.name }} 
                    </a-button>
                  </div>
                  <div v-else>
                    <a-button
                      :style="{ height: '25px', color: 'white', backgroundColor: getButtonStyle(record)[0], borderColor: getButtonStyle(record)[1] }"
                      > 未开始
                    </a-button>
                  </div>
                </span>
                <span slot="casePassRate" slot-scope="{ record }">
                  {{ findJsonArray(record.testRecordList,"testPlanId","xx","executeStatus")==='已完成' ? getTestRecord(record.testRecordList,"testPlanId").casePassRate : '-' }}
                </span>
                <span slot="executeResult" slot-scope="{ record }">
                  <div v-if="getTestRecord(record.testRecordList,'testPlanId').executeStatus!==undefined&&getTestRecord(record.testRecordList,'testPlanId').executeResult!==undefined">
                    <a-button v-for="(item, index) in getFilterArray(resultOptions, (item) => item.label === getTestRecord(record.testRecordList,'testPlanId').executeResult)" :key="index"
                      :style="{ height: '25px', color: 'white', backgroundColor: getButtonStyle1(record)[0], borderColor: getButtonStyle1(record)[1] }"
                      > {{ item.label }} 
                    </a-button>
                  </div>
                  <div v-else>
                    {{ "-" }}
                  </div>
                </span> -->
                <!-- <span slot="duration" slot-scope="{ record }">
                  {{ formatDuration(getTestRecord(record.testRecordList,'testPlanId').duration) }}
                </span>
                <span slot="result" slot-scope="{ record }">
                  <a-badge :status="record.result == '1' ? 'processing' : 'error'" :text="resultTypeFormat(record)" />
                </span> -->
                <!-- <span slot="principalId" slot-scope="{ record }">
                  {{ findNodeId(memberOptions, record.principalId, 'name') }}
                </span> -->
                <!-- <span slot="executeName" slot-scope="{ record }">
                  {{ record.testRecordList.length>0 ? getTestRecord(record.testRecordList,"testPlanId").executeName : '-' }}
                </span> -->
                <span slot="createTime" slot-scope="{ record }">
                  {{ parseTime(record.createTime) }}
                </span>
                <span slot="updateTime" slot-scope="{ record }">
                  {{ parseTime(record.updateTime) }}
                </span>
                <span slot="operation" slot-scope="{ record }">
                  <a @click="handleDelete(record)" v-hasPermi="['test:testPlan:removeTestScene']"> 删除 </a>
                  <a-divider type="vertical" v-hasPermi="['test:testPlan:removeTestScene']" />
                  <!-- <a @click="handleExecut(record)" v-hasPermi="['ui:automation:exec']"> 执行 </a> -->
                  <a-dropdown>
                    <template #overlay>
                      <a-menu>
                        <a-menu-item v-for="(item) in testReportExecutionModeOptions" :key="item.id" @click="handleExecut(record, item)">
                            {{ item.name }}
                        </a-menu-item>
                      </a-menu>
                    </template>
                    <a v-hasPermi="['ui:automation:exec']"> 执行 </a>
                  </a-dropdown>
                  <a-divider type="vertical" v-hasPermi="['ui:automation:exec']" />
                  <a @click="handleConsoleUrl(record)" v-hasPermi="['ui:automation:exec']"> 日志 </a>
                  <a-divider type="vertical" v-hasPermi="['ui:automation:exec']" />
                  <a @click="handleTestReportUrl(record)" v-hasPermi="['ui:automation:exec']"> 报告 </a>
                  <!-- <a-divider type="vertical" v-hasPermi="['ui:automation:exec']" /> -->
                </span>
              </advance-table>
            </template>
            <template #addForm="info">
              <add-or-edit-form ref="addOrEditForm" :active-id="activeId" :treeData="treeData" :projectId="projectId"
                :scene-info="info.content" :testPlanOptions="testPlanOptions" :memberOptions="memberOptions"
                :versionOptions="versionOptions" :version="version" :sceneList="sceneList" @onSave="handleUpdateCase">
              </add-or-edit-form>
            </template>
          </tab-list>
        </template>
      </split>
    </a-card>
    <!-- 复制测试场景弹窗 -->
    <CopyScence
      ref="copyScenceForm"
      :testPlanOptions="testPlanOptions"
      :environment_Id="environment_Id"
      :versionOptions="versionOptions"
      :sceneList="sceneList"
      @getList="getAllPageList"
    ></CopyScence>
    <!-- 执行测试场景弹窗 -->
    <executScenceForm
      ref="executScenceForm"
      :AqueryParam="queryParam"
      :Aids="ids"
      :sceneIds="sceneIds"
      :sceneList="sceneList1"
      :testPlan="testPlan"
      @getList="getList"
      @close="close"
    ></executScenceForm>
    <TestSceneAddForm
      ref="TestSceneAddForm"
      :tab="tab"
      :projectId="record.projectId"
      :memberOptions="memberOptions"
      :testPlanId="testPlan.id"
      @getList="getList"
      @close="close"
      >
    </TestSceneAddForm>
  </div>
</template>

<script>
import * as api from '@/api/api'
import TreeList from '@/views/ui/automation/components/TreeList.vue'
import Split from '@/components/pt/split/Index'
import AdvanceTable from '@/components/pt/table/AdvanceTable'
import AddOrEditForm from '@/views/ui/automation/modules/AddOrEditForm.vue'
import TabList from './TabList'
import { findChildItem, findChildId } from '@/utils/sakura'
import { levelOptions, statusOptions, resultOptions } from '@/utils/options'
import UiSearch from '@/views/ui/automation/components/UiSearch.vue'
import CopyScence from '@/views/ui/automation/modules/OperationC.vue'
import executScenceForm from '@/views/ui/automation/modules/executScenceForm.vue'
import TestSceneAddForm from './TestSceneAddForm.vue'
import { testPlanStatusOptions, testReportExecutionModeOptions } from '@/views/test/components/Config'
import * as utils from '@/utils/sakura'

import {
  getUiNodeAll,
  getUiNode,
  getSceneList,
  deleteScenceList,
  exportScence,
  exportScenceList,
  exportScenceAll,
  execScence,
  execScenceAll,
  getScenceInfo,
} from '@/api/ui'
import log from '@/utils/log'

export default {
  name: 'Element',
  props: {
    fixedTab: {
      type: String,
      default: '功能测试'
    },
    tab: {
      type: String,
      default: 'UI自动化测试'
    },
    record: {
      type: Object,
    },
    memberOptions: {
      type: Array,
    },
  },
  components: {
    TreeList,
    Split,
    AdvanceTable,
    TabList,
    UiSearch,
    AddOrEditForm,
    CopyScence,
    executScenceForm,
    TestSceneAddForm
  },
  // 给下拉列表树提供树形数据
  provide() {
    return {
      // treeData: this.treeData,
      testPlanOptions: this.testPlanOptions,
    }
  },
  computed: {
    isDragTable() {
      return this.dragTable(this.columns)
    }
  },
  data() {
    return {
      leftWidth: '300',
      newTitle: '新建场景',
      levelOptions,
      statusOptions,
      resultOptions,
      resultOptions1: [],
      versionOptions: [],
      testPlanOptions: [], // 所有计划列表
      testReportExecutionModeOptions,
      testPlanStatusOptions,
      // testPlanId: '',
      testPlan: {
        id: '',
        name: '',
        projectId: '',
        testSceneState: 'select',
      },
      project: {
        id: '',
        name: '',
        abbreviate: '',
      },
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
        executeStatus: '',
        executeResultType: 'plan',
        executeResult: '',
        createByName: '',
        principalName: '',
        estate: ''
      },
      columns: [
        {
          title: '场景ID',
          dataIndex: 'sceneId',
          width: 180,
          fixed: 'left',
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
          width: 308,
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
          // dataIndex: 'status',
          width: 100,
          scopedSlots: { customRender: 'executeStatus' },
          align: 'center',
        },
        {
          title: '通过率',
          width: 70,
          // dataIndex: 'testRecordList[0].casePassRate',
          // dataIndex: 'testRecordList',
          scopedSlots: { customRender: 'casePassRate' },
          align: 'center',
        },
        {
          title: '执行结果',
          width: 100,
          // dataIndex: 'testRecordList[0].executeResult',
          // dataIndex: 'testRecordList1',
          scopedSlots: { customRender: 'executeResult' },
          ellipsis: true,
          align: 'center',
        },
        {
          title: '运行耗时',
          width: 100,
          dataIndex: 'duration',
          scopedSlots: { customRender: 'duration' },
          align: 'center',
        },
        // {
        //   title: '用例数',
        //   width: 60,
        //   dataIndex: 'testRecordList[0].caseTotal',
        //   align: 'center',
        // },
        // {
        //   title: '通过',
        //   width: 60,
        //   dataIndex: 'testRecordList[0].casePass',
        //   align: 'center',
        // },
        // {
        //   title: '失败',
        //   width: 60,
        //   dataIndex: 'testRecordList[0].caseFail',
        //   align: 'center',
        // },
        // {
        //   title: '跳过',
        //   width: 60,
        //   dataIndex: 'testRecordList[0].caseSkip',
        //   align: 'center',
        // },
        // {
        //   title: '步骤数',
        //   width: 60,
        //   dataIndex: 'testRecordList[0].stepTotal',
        //   align: 'center',
        // },
        // {
        //   title: '通过',
        //   width: 60,
        //   dataIndex: 'testRecordList[0].stepPass',
        //   align: 'center',
        // },
        // {
        //   title: '失败',
        //   width: 60,
        //   dataIndex: 'testRecordList[0].stepFail',
        //   align: 'center',
        // },
        // {
        //   title: '跳过',
        //   width: 60,
        //   dataIndex: 'testRecordList[0].stepSkip',
        //   align: 'center',
        // },
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
          width: 70,
          scopedSlots: { customRender: 'executeName' },
          ellipsis: true,
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
      ],
      list: [],
      newTree: {},
      treeData: [],
    }
  },
  created() {
    this.getAllTestPlanList()
    // this.$http.get(`/dict/sys_normal_result`).then((response) => {
    //   this.resultOptions1 = response.result.list
    // })
  },
  watch: {
    activeId: {
      handler(val) {
        // console.log('val: ' + val)
        // this.getList()
      },
    },
    testPlan: {
      handler(newVal, oldVal) {
        // console.info(newVal, oldVal)
        // this.handleQuery()
        // this.handleChange(newVal.id)
      },
      deep: true
    },
  },
  mounted() {
  },
  methods: {
    // 获取列表
    async getList() {
      const { projectId, activeId, queryParam, treeData } = this
      let arr = [activeId]
      let childItem = findChildItem(treeData, activeId)
      // let moduleIds = activeId === treeData[0].id ? [] : findChildId(childItem, arr)
      let moduleIds = this.queryParam.versionId != "" ? findChildId(childItem, arr) : []
      // let moduleIds = this.queryParam.versionId != "" && this.queryParam.moduleName!=='全部场景' ? arr:[]
      const params = {
        ...queryParam,
        projectId,
        moduleIds,
        testPlanId: this.testPlan.id,
        testSceneState: this.testPlan.testSceneState
      }
      this.loading = true
      try {
        const response = await getSceneList(params);
        this.list = response.data.list
        this.list.forEach((item, index) => {
          item.caseList = item.caseMsg?JSON.parse(item.caseMsg) : []
          item.testRecordList = item.testRecord?JSON.parse(item.testRecord) : []
        })
        this.sceneList = this.list
        if (this.sceneListTitle === '所有场景') {
          this.sceneList1 = this.list
        }
        this.total = response.data.total
      }catch (error) {
        console.error('Error fetching scene list:', error);
      }finally {
        this.loading = false
        // this.close()
      }
      // getSceneList(params).then((response) => {
      //   this.list = response.data.list
      //   this.list.forEach((item, index) => {
      //     item.caseList = item.caseMsg?JSON.parse(item.caseMsg) : []
      //     item.testRecordList = item.testRecord?JSON.parse(item.testRecord) : []
      //   })
      //   // console.log(this.list);
      //   this.sceneList = this.list
      //   if (this.sceneListTitle === '所有场景') {
      //     this.sceneList1 = this.list
      //   }
      //   this.total = response.data.total
      //   this.loading = false
      //   // this.close()
      // })
    },
    // 获取所有的测试计划
    getAllTestPlanList() {
      const queryParam = {
        // pageNum: 1,
        // pageSize: 10
        orderByColumn: 'a.projectId, a.createTime',
        isAsc: 'desc',
      }
      api.getTestPlanList(queryParam).then((response) => {
        this.testPlanOptions = response.data.list
        for(var testPlan of this.testPlanOptions){
          // console.log(this.record)
          if(testPlan.id === this.record.id){
            this.testPlan.id = testPlan.id
            this.testPlan.name = testPlan.name
            this.testPlan.projectId = testPlan.projectId
            break
          }
        }
        this.getAllVersions()
      })
    },
    // 计划选择发生变化
    handleChange(newValue) {
      // console.log(newValue)
      for(var testPlan of this.testPlanOptions){
        if(testPlan.id === newValue){
          this.testPlan.id = testPlan.id
          this.testPlan.projectId = testPlan.projectId
          break
        }
      }
      // this.testPlan.projectId = this.testPlanOptions[index].id
      // this.project.name = this.testPlanOptions[index].name
      // this.project.abbreviate = this.testPlanOptions[index].abbreviate
      // localStorage.setItem('projectId', this.testPlanOptions[index].id);
      // localStorage.setItem('name', this.testPlanOptions[index].name);
      // localStorage.setItem('abbreviate', this.testPlanOptions[index].abbreviate);
      this.$refs.treeList.clearSelectedkeys()
      this.$refs.uiSearch.resetQuery()
      this.getAllVersions()
    },
    // 获取当前计划环境下的所有版本
    async getAllVersions() {
      const queryParam = {
        projectId: this.testPlan.projectId
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
    getFilterArray(array, condition) {
      return array.filter((item) => {
        return condition(item)
      })
    },
    findJsonArray1(jsonArray, targetKey, targetParamsName, targetParamsValue) {
      targetParamsName = localStorage.getItem('userName')
      return utils.findJsonArray(jsonArray, targetKey, targetParamsName, targetParamsValue)
    },
    findJsonArray(jsonArray, targetKey, targetParamsName, targetParamsValue) {
      targetParamsName = this.testPlan.id
      // console.log(utils.findJsonArray(jsonArray, 'testPlanId','4e5fa9519ea34f88bc88ce78180db37b', 'executeStatus'));
      return utils.findJsonArray(jsonArray, targetKey,targetParamsName, targetParamsValue)
    },
    getTestRecord1(jsonArray, executeName) {
      executeName = localStorage.getItem('userName')
      jsonArray.sort((a, b) => b.buildNumber - a.buildNumber);
      // return record.testRecordList.find(item => item.executeName === '刘智').casePassRate
      const result =jsonArray.filter(testRecord => testRecord.executeName === executeName)[0]
      // console.log(result);
      return result?result:[]
    },
    getTestRecord(jsonArray, testPlanId) {
      jsonArray.sort((a, b) => b.buildNumber - a.buildNumber);
      const result = jsonArray.filter(testRecord => testRecord.testPlanId === this.testPlan.id)[0]
      // console.log(result);
      return result?result:[]
    },
    getExecuteStatus(record) {
      let executeStatus = record.testRecordList.length>0?this.findJsonArray(record.testRecordList,"testPlanId","xx","executeStatus"):'未开始'
      // console.log(executeStatus);
      return executeStatus
    },
    getRxecuteResult(record) {
      let executeStatus = record.testRecordList.length>0?this.findJsonArray(record.testRecordList,"testPlanId","xx","executeStatus"):'未开始'
      let executeResult = executeStatus!=='未开始'? this.findJsonArray(record.testRecordList,"testPlanId","xx","executeResult"):'-'
      return executeResult
    },
    getButtonStyle(record) {
    //  let executeStatus = this.getExecuteStatus(record)
     let executeStatus = this.getTestRecord(record.testRecordList,'testPlanId').executeStatus
      switch (executeStatus) {
        case '未开始':
          return ['#909399', '#909399']
        case '进行中':
          return ['#ff4d4f', '#ff4d4f']
        case '已完成':
          return ['#05c878', '#05c878']
        default:
          return ['#909399', '#909399'];
      }
    },
    getButtonStyle1(record) {
    //  let executeResult = this.getRxecuteResult(record)
     let executeResult = this.getTestRecord(record.testRecordList,'testPlanId').executeResult
      switch (executeResult) {
        case '-':
          return ['#909399', '#909399']
        case '不通过':
          return ['#ff4d4f', '#ff4d4f']
        case '全部通过':
          return ['#05c878', '#05c878']
        default:
          return ['#ff4d4f', '#ff4d4f'];
      }
    },
    getAllPageList() {
      // this.getTreeData()
      this.getList()
      this.getTreeData()
      this.getAllVersions()
    },
    // 获取树形结构
    getTreeData() {
      // const { projectId } = this
      if(this.queryParam.versionId!==''){
        getUiNode(this.testPlan.projectId, this.queryParam.versionId).then((response) => {
          this.treeData = response?.data || {}
          const setting = {
            iconDisabled: true,
          }
          this.treeData = [{ ...this.treeData, ...setting }]
          this.$nextTick(() => {
           this.$refs.treeList.getTreeData(this.treeData, this.testPlan.projectId, this.queryParam.versionId, this.queryParam.versionName)
          })
        })
      }
    },
    getTreeDataAll() {
      // const { projectId } = this
      getUiNodeAll(this.testPlan.projectId).then((response) => {
        this.treeData = response?.data || {}
        const setting = {
          iconDisabled: true,
        }
        this.treeData = [{ ...this.treeData, ...setting }]
        this.$nextTick(() => {
          this.$refs.treeList.getTreeData(this.treeData, this.testPlan.projectId, this.queryParam.versionId)
        })
      })
    },
    resultTypeFormat(row) {
      return this.selectDictLabel(this.resultOptions1, row.result)
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
        const treeElement = this.$refs.treeList.$el;
        console.log(treeElement);
        treeElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
      });
    },
    scrollToNode(node) {
      console.log(node);
      this.$nextTick(() => {
        const targetElement = document.getElementById(node);
        if (targetElement) {
          console.log(targetElement);
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      });
    },
    // 点击树节点
    onClick(params) {
      // console.log('onClick', params)
      this.activeId = params
      // this.getTreeData()
      this.treeData.forEach((node) => {
        this.getAllChildren(node);
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
        node.children.forEach(child => {
          this.getAllChildren(child);
        })
      }
    },
    // 监听查询参数改变
    changeParam(searchParam) {
      // console.log(searchParam);
      this.queryParam = Object.assign(this.queryParam, searchParam)
      this.handleQuery()
    },
    handleQuery() {
      if (this.queryParam.versionId !== '') {
        this.$refs.treeList.clearSelectedkeys()
        this.getTreeData()
      } else {
        // this.getTreeDataAll()
        this.getList()
      }
    },
    close() {
      this.selectedRowKeys = []
      this.sceneList1 = []
      this.multiple = !this.selectedRowKeys.length
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
        executeResultType: 'plan',
        executeStatus: '',
        executeResult: '',
        createByName: '',
        principalName: '',
        estate: ''
      }
    },
    //切换tab标签后设置场景信息
    setSceneList(record) {
      console.log(record);
      this.sceneList = []
      this.sceneList.push(record)
    },
    // 保存后更新场景
    handleUpdateCase(record) {
      // console.log(record)
      const updateTitle = record.name
      this.$nextTick(() => {
        this.sceneList = []
        this.sceneList.push(record)
        this.$refs.sceneList.handleUpdateCase(record, updateTitle)
      })
    },
    handleAdd() {
      this.$nextTick(() => {
        this.$refs.TestSceneAddForm.handleAdd()
      })
    },
    // 编辑场景
    handleUpdate(record) {
      const editTitle = record.name
      const id = record.id
      this.$nextTick(() => {
        this.sceneList = []
        this.sceneList.push(record)
        // this.version.id = record.versionId
        this.$refs.sceneList.addTab(record, editTitle, id)
      })
    },
    // 删除场景
    handleDelete1(row) {
      var that = this
      const ids = row.id || this.ids
      const names = row.name || this.names
      this.$Modal.confirm({
        title: '确认删除所选中数据?',
        content: '当前选中为' + names + '的数据',
        onOk() {
          return deleteScenceList(ids).then(() => {
            that.$message.success('删除成功')
            that.getTreeData()
            that.getList()
            that.onSelectChange([], [])
          })
        },
        onCancel() { },
      })
    },
    // 取消关联场景
    handleDelete(record) {
      if (record) {
        // this.selectedRowKeys = []
        this.selectedRowKeys.push(record.id)
      }
      let params = {
        testPlanId: this.testPlan.id,
        sceneIdList: this.selectedRowKeys,
        // projectConfig: this.project,
        // automationConfig: this.automation
      }
      api.removeTestScene(params).then((response) => {
        this.$message.success('取消关联成功')
        this.getList()
      })
      .catch((error) => {
        that.$message.error('删除失败')
        reject(error)
      })
      this.open = false
      this.getList()
      this.close()
    },
    // 复制场景
    handleCopy(record) {
      if (this.queryParam.versionId !== '') {
        this.$nextTick(() => {
          this.$refs.copyScenceForm.handleAdd(record)
        })
      } else {
        this.$message.error('请选择场景版本！')
      }
    },
    async handleCopyAll(record) {
      if (this.queryParam.versionId !== '') {
        // this.queryParam.pageSize = 1000
        this.handleQuery()
        setTimeout(() => {
          // console.log(this.sceneList);
          this.$nextTick(() => {
            this.$refs.copyScenceForm.handleAdd(record)
          })
        }, 2000)
      } else {
        this.$message.error('请选择场景版本！')
      }
    },
    /** 单个导出场景操作 */
    handleExport(record) {
      var that = this
      // console.log(record, 'edit')
      const ids = record.id || this.ids
      const sceneIds = record.sceneId || this.sceneIds
      this.$Modal.confirm({
        title: '是否确认导出?',
        content: '当前选中为' + sceneIds + '的数据',
        onOk() {
          return exportScence(ids)
            .then((res) => {
              if (res.status != 404) {
                that.readBlobDown(res, sceneIds, 'application/xml')
                // saveAs(res, '导出文件名称.xml')
                that.$message.success('导出成功', 3)
              }
            })
            .catch((error) => {
              that.$message.error('导出失败', 3)
              reject(error)
            })
        },
        onCancel() { },
      })
    },
    /** 批量导出场景操作
     * zip文件提示损坏：https://blog.csdn.net/jhhjkn/article/details/125318805
     */
    handleExports(row) {
      var that = this
      const ids = row.id || this.ids
      const names = row.name || this.names
      const sceneIds = row.sceneId || this.sceneIds
      const project = this.project
      this.$Modal.confirm({
        title: '是否确认导出?',
        content: '当前选中为' + sceneIds + '的数据',
        onOk() {
          return new Promise((resolve, reject) => {
            exportScenceList(ids)
              .then((res) => {
                if (res.status != 404) {
                  that.readBlobDown(res, project.abbreviate, 'application/zip')
                  that.$message.success('导出成功', 3)
                }
                resolve(res)
              })
              .catch((error) => {
                that.$message.error('导出失败', 3)
                reject(error)
              })
          })
        },
        onCancel() { },
      })
    },
    handleExportss(record) {
      var that = this
      // console.log(record, 'edit')
      const ids = record.id || this.ids
      const sceneIds = record.sceneId || this.sceneIds
      this.$Modal.confirm({
        title: '是否确认导出?',
        content: '当前选中为' + sceneIds + '的数据',
        onOk() {
          return exportScenceList(ids)
            .then((res) => {
              console.info(ids.length)
              console.info(ids.item)
              console.info(ids.total)
              if (res.status != 404) {
                if (sceneIds.length == 1) {
                  that.readBlobDown(res, sceneIds, 'application/xml')
                } else {
                  that.readBlobDown(res, 'TestCaseXml', 'application/zip')
                }
                // saveAs(res, '导出文件名称.xml')
                that.$message.success('导出成功', 3)
              }
            })
            .catch((error) => {
              that.$message.error('导出失败', 3)
              reject(error)
            })
        },
        onCancel() { },
      })
    },
    /** 批量导出计划下所有场景操作
     * zip文件提示损坏：https://blog.csdn.net/jhhjkn/article/details/125318805
     */
    handleExportAll() {
      var that = this
      const { projectId } = this
      const project = this.project
      const params = {
        ...that.queryParam,
        projectId
      }
      this.$Modal.confirm({
        title: '是否确认导出?',
        content: '当前为选择计划下所有的数据',
        onOk() {
          return exportScenceAll(params)
            .then((res) => {
              if (res.status != 404) {
                that.readBlobDown(res, project.abbreviate, 'application/zip')
                that.$message.success('导出成功', 3)
              }
            })
            .catch((error) => {
              that.$message.error('导出失败', 3)
              reject(error)
            })
        },
        onCancel() { },
      })
    },
    /**
     * 读取下载的文件流
     */
    readBlobDown(result, filename, filetype) {
      // let url = window.URL.createObjectURL(new Blob([result]))
      let blob = new Blob([result], { type: filetype }) //application/zip就是设置下载类型，需要设置什么类型可在标题二处查看，
      const url = window.URL.createObjectURL(blob) //设置路径
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', filename) //指定下载后的文件名，防跳转
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link) // 下载完成移除元素
      // 释放内存
      window.URL.revokeObjectURL(link.href)
    },
    // 执行场景（单个，多个）
    handleExecut(record,type) {
      // record.key = key
      // console.log(record);
      if (record.sceneId) {
        this.sceneList1 = []
        this.sceneList1.push(record)
        this.$nextTick(() => {
          this.$refs.executScenceForm.handleAdd(record,"1",type)
        })
      } else if (this.queryParam.versionId !== '') {
        this.$refs.executScenceForm.handleAdd(record,"1",type)
      } else {
        this.$message.error('请选择场景版本！')
      }
    },
    async handleExecutAll(record,type) {
      // console.log(record);
      // console.log(key);
      if (this.queryParam.versionId !== '') {
        // this.queryParam.pageSize = 1000
        this.sceneListTitle = '所有场景'
        await this.getList()
        this.$nextTick(() => {
          this.$refs.executScenceForm.handleAdd(record,"1",type)
        })
        this.sceneListTitle = ''
        // setTimeout(() => {
        //   this.$nextTick(() => {
        //     this.$refs.executScenceForm.handleAdd(record, '3')
        //   })
        // }, 1000)
      } else {
        this.$message.error('请选择场景版本！')
      }
    },
    runAsync2(data) {
      var p = new Promise((resolve, reject) => {
        setTimeout(() => {
          window.open(data)
          resolve('随便什么数据2')
        }, 2000)
      })
      return p
    },
    handleExecut2(record) {
      var that = this
      const ids = record.id || this.ids
      const sceneIds = record.sceneId || this.sceneIds
      this.$Modal.confirm({
        title: '是否确认执行?',
        content: '当前选中为' + sceneIds + '的数据',
        onOk() {
          that.runAsync1(ids)
            .then((data) => {
              that.$message.success('执行成功，跳转至Jenkins控制台！', 3)
              return that.runAsync2(data)
            })
            .then((data) => {
              // console.log(data);
              return '直接返回数据'
            })
        },
        onCancel() { }
      })
    },
    // 查看控制台运行日志
    handleConsoleUrl(record) {
      const consoleUrl = this.getTestRecord(record.testRecordList, 'testPlanId').consoleUrl
      if (consoleUrl) {
        this.$message.success('获取运行日志成功！', 3)
        setTimeout(() => {
          window.open(consoleUrl)
        }, 1000)
      } else {
        this.$message.error('获取运行日志失败，请先执行场景！', 3)
      }
    },
    // 查看Jenkins测试报告
    handleTestReportUrl(record) {
      const testReportUrl = this.getTestRecord(record.testRecordList, 'testPlanId').testReportUrl
      if (testReportUrl) {
        this.$message.success('获取测试报告成功！', 3)
        setTimeout(() => {
          window.open(testReportUrl)
        }, 1000)
      } else {
        this.$message.error('获取测试报告失败，请先执行场景！', 3)
      }
    },
    onShowSizeChange(current, pageSize) {
      this.queryParam.pageSize = pageSize
      this.getList()
    },
    onSizeChange(current, size) {
      this.queryParam.pageNum = 1
      this.queryParam.pageSize = size
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
      // this.sceneList = this.selectedRows.map((item) => item)
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
      // console.log(this.sceneList1);
      this.single = selectedRowKeys.length !== 1
      this.multiple = !selectedRowKeys.length
    },
    onClickRow(record) {
      return {
        on: {
          click: () => {
            const keys = []
            keys.push(record.id)
            this.selectedRowKeys = keys
          },
        },
      }
    },
  },
}
</script>

<style lang="less" scoped>
.advanced-table {
  // min-height: calc(100vh - 380px);
}

.container {
  height: calc(100vh - 178px);
  width: 100%;
  position: relative;
}

.fixed-top {
  position: sticky;
  width: 100%;
  top: 0;
}

.scrollable {
  overflow-y: scroll;
  margin-top: 5px;
  // height: 100%;
  // margin-bottom: 5px;
  max-height: calc(100vh - 225px);
}

.case-status {
  padding: 2px 5px;
  color: #fff;
  border-radius: 5%;
}
.table-operations {
  padding: 0px 0px 0px 0px;
  display: flex;
  justify-content: space-between;
}

::v-deep .ant-layout .ant-table-pagination.ant-pagination {
  margin: 10px 0 5px 0;
}
</style>