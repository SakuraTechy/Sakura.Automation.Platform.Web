<template>
  <div>
    <a-card :bordered="false" class="container">
      <split splitHeight="100%" :leftWidth="leftWidth" :style="{ marginTop: topHeight }">
        <template slot="paneL">
          <div>
            <a-select class="fixed-top" v-model="project.name" placeholder="请选择项目" option-filter-prop="children"
              @change="handleChange" show-search allowClear>
              <a-select-option v-for="(d, index) in projectOptions" :key="index" :value="index">
                {{ d.name }}
              </a-select-option>
            </a-select>
            <tree-list class="scrollable" ref="treeList" @onClick="onClick" @ok="getTreeData" :showAddModal="true"/>
          </div>
          <!-- <div style="position: fixed; top: 110px;width: 270px;margin-bottom: -3px">
            <a-select v-model="project.name" placeholder="请选择项目" style="width: 100%" option-filter-prop="children"
              @change="handleChange" show-search allowClear>
              <a-select-option v-for="(d, index) in projectOptions" :key="index" :value="index">
                {{ d.name }}
              </a-select-option>
            </a-select>
          </div>
          <tree-list style="overflow: auto; margin-top: 28px; max-height: calc(100vh - 170px)" ref="treeList"
            @onClick="onClick" @ok="getTreeData"></tree-list> -->
        </template>
        <template slot="paneR">
          <tab-list style="margin-top: 6px" @changeLeftWidth="changeLeftWidth" @setSceneList="setSceneList" ref="sceneList" :newTitle="newTitle"
            :tab="tab" :projectId="project.id">
            <template slot="table">
              <!-- 条件搜索 -->
              <ui-search ref="uiSearch" :versionOptions="versionOptions" :memberOptions="memberOptions"
                :resultOptions="resultOptions" @handleQuery="handleQuery" @changeParam="changeParam"
                @resetQuery="resetQuery"></ui-search>
              <a-divider style="margin: 10px 0px 0px 0px;"></a-divider>
              <!-- table表格 -->
              <advance-table :scroll="{ x: 1500, y: 420 }" :columns="columns" :data-source="list" title="场景列表"
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
                  <a-button type="danger" :disabled="multiple" @click="handleDelete"
                    v-hasPermi="['ui:automation:remove']">
                    <a-icon type="delete" />批量删除
                  </a-button>
                  <a-button type="danger" :disabled="multiple" @click="handleExports"
                    v-hasPermi="['ui:automation:export']">
                    <a-icon type="download" />批量导出
                  </a-button>
                  <a-button type="primary" @click="handleExportAll" v-hasPermi="['ui:automation:export']">
                    <a-icon type="download" />导出所有
                  </a-button>
                  <a-button type="danger" :disabled="multiple" @click="handleCopy" v-hasPermi="['ui:automation:copy']">
                    <a-icon type="delete" />批量复制
                  </a-button>
                  <a-button type="primary" @click="handleCopyAll" v-hasPermi="['ui:automation:copy']">
                    <a-icon type="delete" />复制所有
                  </a-button>
                  <!-- <a-button type="danger" :disabled="multiple" @click="handleExecut" v-hasPermi="['ui:automation:exec']">
                    <a-icon type="right-circle" />批量执行
                  </a-button> -->
                  <a-dropdown :disabled="multiple">
                      <template #overlay>
                        <a-menu>
                          <a-menu-item v-for="(item) in executionModeOptions" :key="item.id" @click="handleExecuts(item)">
                            {{ item.name }}
                          </a-menu-item>
                        </a-menu>
                      </template>
                      <a-button type="danger" v-hasPermi="['ui:automation:exec']">
                        <a-icon type="right-circle" />批量执行
                      </a-button>
                    </a-dropdown>
                  <!-- <a-button type="primary" @click="handleExecutAll" v-hasPermi="['ui:automation:exec']">
                    <a-icon type="play-circle" />执行所有
                  </a-button> -->
                  <a-dropdown>
                      <template #overlay>
                        <a-menu>
                          <a-menu-item v-for="(item) in executionModeOptions" :key="item.id" @click="handleExecutAll(item)">
                            {{ item.name }}
                          </a-menu-item>
                        </a-menu>
                      </template>
                      <a-button type="primary" v-hasPermi="['ui:automation:exec']">
                        <a-icon type="play-circle" />执行所有
                      </a-button>
                    </a-dropdown>
                </div>
                <!-- <span slot="status" slot-scope="{ record }">
                  {{ findNodeId(statusOptions, record.status, 'label') }}
                </span>
                <span slot="tags" slot-scope="{ record }">
                  {{ getTags(record.tags) }}
                </span>
                <span slot="result" slot-scope="{ record }">
                  <a-badge :status="record.result == '1' ? 'processing' : 'error'" :text="resultTypeFormat(record)" />
                </span>
                <span slot="principalId" slot-scope="{ record }">
                  {{ findNodeId(memberOptions, record.principalId, 'name') }}
                </span> -->
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
                  {{ record.debugRecordList.length>0&&record.debugRecordList[0].executeStatus==='已完成' ? formatDuration(record.debugRecordList[0].duration) : '-' }}
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
                <span slot="result" slot-scope="{ record }">
                  <a-badge :status="record.result == '1' ? 'processing' : 'error'" :text="resultTypeFormat(record)" />
                </span>
                <!-- <span slot="principalId" slot-scope="{ record }">
                  {{ findNodeId(memberOptions, record.principalId, 'name') }}
                </span> -->
                <!-- <span slot="principalId" slot-scope="{ record }">
                  {{ findNodeId(memberOptions, record.principalId, 'name') }}
                </span>
                <span slot="createTime" slot-scope="{ record }">
                  {{ parseTime(record.createTime) }}
                </span>
                <span slot="updateTime" slot-scope="{ record }">
                  {{ parseTime(record.updateTime) }}
                </span>-->
                <span slot="operation" slot-scope="{ record }">
                  <a @click="handleUpdate(record, undefined)" v-hasPermi="['ui:automation:edit']"> 编辑 </a>
                  <a-divider type="vertical" v-hasPermi="['ui:automation:edit']" />
                  <a @click="handleCopy(record)" v-hasPermi="['ui:automation:copy']"> 复制 </a>
                  <a-divider type="vertical" v-hasPermi="['ui:automation:copy']" />
                  <!-- <a @click="handleExecut(record)" v-hasPermi="['ui:automation:exec']"> 执行 </a>  -->
                  <a-dropdown>
                    <template #overlay>
                      <a-menu>
                        <a-menu-item v-for="(item) in executionModeOptions" :key="item.id" @click="handleExecut(record, item)">
                            {{ item.name }}
                        </a-menu-item>
                      </a-menu>
                    </template>
                    <a v-hasPermi="['ui:automation:exec']"> 执行 </a>
                  </a-dropdown>
                  <a-divider type="vertical" v-hasPermi="['ui:automation:exec']" />
                  <a-dropdown>
                    <a class="ant-dropdown-link" @click="e => e.preventDefault()">更多<a-icon type="down" />
                    </a>
                    <a-menu slot="overlay">
                      <a-menu-item>
                        <a @click="handleDelete(record)" v-hasPermi="['ui:automation:remove']"> 删除 </a>
                      </a-menu-item>
                      <a-menu-item>
                        <a @click="handleExport(record)" v-hasPermi="['ui:automation:export']"> 导出 </a>
                      </a-menu-item>
                      <a-menu-item>
                        <a @click="handleConsoleUrl(record)" v-hasPermi="['ui:automation:exec']"> 日志 </a>
                      </a-menu-item>
                      <a-menu-item>
                        <a @click="handleTestReportUrl(record)" v-hasPermi="['ui:automation:exec']"> 报告 </a>
                      </a-menu-item>
                      <a-menu-item>
                        <a @click="handleTestVideoUrl(record)" v-hasPermi="['ui:automation:exec']"> 回放 </a>
                      </a-menu-item>
                    </a-menu>
                  </a-dropdown>
                </span>
              </advance-table>
            </template>
            <template #addForm="info">
              <add-or-edit-form ref="addOrEditForm" :active-id="activeId" :treeData="treeData" :projectId="projectId"
                :scene-info="info.content" :projectOptions="projectOptions" :memberOptions="memberOptions"
                :versionOptions="versionOptions" :version="version" :sceneList="sceneList" @onSave="handleUpdateCase">
              </add-or-edit-form>
            </template>
          </tab-list>
        </template>
      </split>
    </a-card>
    <!-- 复制测试场景弹窗 -->
    <CopyScence ref="copyScenceForm" :projectOptions="projectOptions" :environment_Id="environment_Id"
      :versionOptions="versionOptions" :sceneList="sceneList" @getList="getAllPageList"></CopyScence>
    <!-- 执行测试场景弹窗 -->
    <executScenceForm ref="executScenceForm" :AqueryParam="queryParam" :Aids="ids" :sceneIds="sceneIds"
      :sceneList="sceneList1" @close="close" @getList="getList"></executScenceForm>
  </div>
</template>

<script>
// import TreeList from '@/components/pt/tree/TreeList.vue'
import TreeList from '@/views/ui/automation/components/TreeList.vue'
import Split from '@/components/pt/split/Index'
import AdvanceTable from '@/components/pt/table/AdvanceTable'
import AddOrEditForm from '@/views/ui/automation/modules/AddOrEditForm.vue'
import TabList from '@/components/pt/tab/tabList.vue'
import { findChildItem, findChildId } from '@/utils/sakura'
import { levelOptions, statusOptions, executionModeOptions } from '@/utils/options'
import UiSearch from '@/views/ui/automation/components/UiSearch.vue'
import { columns } from '@/views/ui/autoColumn'
import CopyScence from '@/views/ui/automation/modules/OperationC.vue'
import executScenceForm from '@/views/ui/automation/modules/executScenceForm.vue'
import { start } from '@/utils/test'
import * as projectApis from '@/api/project'

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
import { list } from '@/api/monitor/loginLog'

export default {
  name: 'Element',
  props: {
    tab: {
      type: String,
      default: '场景列表'
    }
  },
  components: {
    TreeList,
    Split,
    AdvanceTable,
    TabList,
    UiSearch,
    AddOrEditForm,
    CopyScence,
    executScenceForm
  },
  // 给下拉列表树提供树形数据
  provide() {
    return {
      // treeData: this.treeData,
      projectOptions: this.projectOptions,
    }
  },
  computed: {
    isDragTable() {
      return this.dragTable(this.columns)
    }
  },
  data() {
    return {
      topHeight: '0px',
      leftWidth: '300', // 左边aside大小
      newTitle: '新建场景',
      // tab: '场景列表111',
      levelOptions,
      statusOptions,
      executionModeOptions,
      memberOptions: [],
      resultOptions: [],
      versionOptions: [],
      project: {
        id: '',
        name: '',
        abbreviate: '',
      },
      projectId: '', // 当前项目id
      project_abbreviate: '',
      environment_Id: '',
      loading: false,
      total: 0,
      statusColor: ['#f25f62', '#5cbc31', '#888c92'], // 控制用例状态颜色
      estateColor: ['#c71218', '#f25f62', '#e69736'], // 控制用例等级颜色
      selectedRowKeys: [],
      selectedRows: [],
      multiple: true,
      names: [],
      projectOptions: [], // 所有项目列表
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
        estate: ''
      },
      columns,
      list: [],
      newTree: {},
      treeData: [],
    }
  },
  created() {
    this.getProjectList()
    this.getAllUsers()
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
  },
  mounted() {
    // console.log(this.tab);
    if(this.tab==='场景列表'){
      this.topHeight='0px'
    }else if(this.tab==='UI自动化测试'){
      this.topHeight='-15px'
    }
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
        moduleIds
      }
      this.loading = true
      try {
        const response = await getSceneList(params);
        this.list = response.data.list
        this.list.forEach((item, index) => {
          item.caseList = item.caseMsg?JSON.parse(item.caseMsg) : []
          item.debugRecordList = item.debugRecord?JSON.parse(item.debugRecord) : []
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
      //     item.debugRecordList = item.debugRecord?JSON.parse(item.debugRecord) : []
      //   })
      //   // console.log(this.list);
      //   this.sceneList = this.list
      //   this.total = response.data.total
      //   this.loading = false
      //   // this.close()
      // })
    },
    // 获取系统的所有用户
    getAllUsers() {
      projectApis.getAllUsersOfSystem().then((response) => {
        this.memberOptions = response.data
      })
    },
    // 获取所有的项目
    getProjectList1() {
      getAllProject().then((response) => {
        this.projectOptions = response.data
        // this.projectId = response.data[0].id
        // this.project.id = response.data[0].id
        // this.project.name = response.data[0].name
        // this.project.abbreviate = response.data[0].abbreviate
        this.projectId = localStorage.getItem('projectId') ? localStorage.getItem('projectId') : response.data[0].id
        this.project.id = localStorage.getItem('projectId') ? localStorage.getItem('projectId') : response.data[0].id
        this.project.name = localStorage.getItem('name') ? localStorage.getItem('name') : response.data[0].name
        this.project.abbreviate = localStorage.getItem('abbreviate') ? localStorage.getItem('abbreviate') : response.data[0].abbreviate
        this.$refs.uiSearch.getAllVersions(this.projectId)
        this.getTreeData()

      })
    },
    getProjectList() {
      const queryParam = {
        // pageNum: 1,
        // pageSize: 10
      }
      projectApis.getProjectList(queryParam).then((response) => {
        this.projectOptions = response.data.list
        this.projectId = localStorage.getItem('projectId') ? localStorage.getItem('projectId') : this.projectOptions[0].id
        this.project.id = localStorage.getItem('projectId') ? localStorage.getItem('projectId') : this.projectOptions[0].id
        this.project.name = localStorage.getItem('name') ? localStorage.getItem('name') : this.projectOptions[0].name
        this.project.abbreviate = localStorage.getItem('abbreviate') ? localStorage.getItem('abbreviate') : this.projectOptions[0].abbreviate
        this.getAllVersions()
      })
    },
    // 获取当前项目环境下的所有版本
    async getAllVersions() {
      const queryParam = {
        projectId: this.projectId
      }
      await projectApis.getEnvironmentList(queryParam).then((response) => {
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
    // 项目选择发生变化
    handleChange(index) {
      this.projectId = this.projectOptions[index].id
      this.project.id = this.projectOptions[index].id
      this.project.name = this.projectOptions[index].name
      this.project.abbreviate = this.projectOptions[index].abbreviate
      localStorage.setItem('projectId', this.projectOptions[index].id);
      localStorage.setItem('name', this.projectOptions[index].name);
      localStorage.setItem('abbreviate', this.projectOptions[index].abbreviate);
      this.$refs.treeList.clearSelectedkeys()
      this.$refs.uiSearch.resetQuery()
      this.getAllVersions()
    },
    getTags(tags) {
      if (!tags) {
        return tags
      } else {
        return JSON.parse(tags).join(',')
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
        getUiNode(this.projectId, this.queryParam.versionId).then((response) => {
          this.treeData = response?.data || {}
          const setting = {
            iconDisabled: true,
          }
          this.treeData = [{ ...this.treeData, ...setting }]
          this.$nextTick(() => {
           this.$refs.treeList.getTreeData(this.treeData, this.projectId, this.queryParam.versionId, this.queryParam.versionName)
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
    close() {
      this.selectedRowKeys = []
      this.sceneList1 = []
      this.multiple = !this.selectedRowKeys.length
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
        executeResult: '',
        executeResultType: 'debug',
        createByName: '',
        principalName: '',
        estate: ''
      }
    },
    //切换tab标签后设置场景信息
    setSceneList(record) {
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
    handleDelete(row) {
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
    /** 批量导出项目下所有场景操作
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
        content: '当前为选择项目下所有的数据',
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
    handleExecuts(type) {
      if (this.queryParam.versionId !== '') {
        this.$refs.executScenceForm.handleAdd(undefined,"1",type)
      } else {
        this.$message.error('请选择场景版本！')
      }
    },
    async handleExecutAll(type) {
      if (this.queryParam.versionId !== '') {
        // this.queryParam.pageSize = 1000
        this.sceneListTitle = '所有场景'
        await this.getList()
        this.$nextTick(() => {
          this.$refs.executScenceForm.handleAdd(undefined,"1",type)
        })
        this.sceneListTitle = ''
      } else {
        this.$message.error('请选择场景版本！')
      }
    },
    // 执行场景（单个，多个）
    handleExecut1(record) {
      var that = this
      const ids = record.id || this.ids
      const sceneIds = record.sceneId || this.sceneIds
      this.$Modal.confirm({
        title: '是否确认执行?',
        content: '当前选中为' + sceneIds + '的数据',
        onOk() {
          return execScence(ids).then((res) => {
            if (res.data.buildNumber > 0 && res.data.consoleUrl != '') {
              that.$message.success('执行成功，跳转至Jenkins控制台！', 3)
              setTimeout(() => {
                window.open(res.data.consoleUrl)
              }, 1000)
            } else {
              this.$message.error('执行失败，请检查个人姓名，邮箱和Jenkins远程节点环境！', 3)
            }
          }).catch((error) => {
            that.$message.error('执行失败，请检查个人姓名，邮箱和Jenkins远程节点环境！', 3)
          })
        },
        onCancel() { },
      })
    },
    // 执行场景（项目对应版本下所有）
    handleExecutAll1() {
      var that = this
      // var projectId = this.projectId
      // var versionId = this.queryParam.versionId
      // const params = {
      //   projectId,
      //   versionId,
      // }
      const { projectId, queryParam } = that
      // that.$delete(this.queryParam,'pageNum')		//删除属性方法
      // that.$delete(this.queryParam,'pageSize')
      const params = {
        ...queryParam,
        projectId,
      }
      this.$Modal.confirm({
        title: '是否确认执行?',
        content: '当前为选择项目版本下所有的场景',
        onOk() {
          return execScenceAll(params).then((res) => {
            if (res.data.buildNumber > 0 && res.data.consoleUrl != '') {
              that.$message.success('执行成功，跳转至Jenkins控制台!', 3)
              setTimeout(() => {
                window.open(res.data.consoleUrl)
              }, 1000)
            } else {
              this.$message.error('执行失败，请检查个人姓名，邮箱和Jenkins远程节点环境！', 3)
            }
          }).catch((error) => {
            that.$message.error('执行失败，请检查个人姓名，邮箱和Jenkins远程节点环境！', 3)
          })
        },
        onCancel() { },
      })
    },
    runAsync1(ids) {
      var p = new Promise((resolve, reject) => {
        setTimeout(() => {
          execScence(ids).then((res) => {
            if (res.status != 404) {
              resolve(res.data.ConsoleURL)
            }
          }).catch((error) => {
            reject(error)
          })
        }, 1000)
      })
      return p
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
    getDebugRecord(jsonArray) {
      // jsonArray.sort((a, b) => b.buildNumber - a.buildNumber);
      // const result = jsonArray.filter(record => record.buildNumber === this.record.buildNumber)[0]
      const result = jsonArray[0]
      // console.log(result);
      return result?result:[]
    },
    // 查看控制台运行日志
    handleConsoleUrl(record) {
      console.log(record);
      const consoleUrl = this.getDebugRecord(record.debugRecordList).consoleUrl
      if (consoleUrl) {
        this.$message.success('获取运行日志成功！', 3)
        setTimeout(() => {
          window.open(consoleUrl)
        }, 500)
      } else {
        this.$message.error('获取运行日志失败，请先执行场景！', 3)
      }
    },
    // 查看Jenkins测试报告
    handleTestReportUrl(record) {
      const testReportUrl = this.getDebugRecord(record.debugRecordList).testReportUrl
      if (testReportUrl) {
        this.$message.success('获取测试报告成功！', 3)
        setTimeout(() => {
          window.open(testReportUrl)
        }, 500)
      } else {
        this.$message.error('获取测试报告失败，请先执行场景！', 3)
      }
    },
    // 查看Jenkins测试回放视频
    handleTestVideoUrl(record) {
      const testReportUrl = this.getDebugRecord(record.debugRecordList).testReportUrl
      if (testReportUrl) {
        this.$message.success('获取测试视频成功！', 3)
        setTimeout(() => {
          window.open(testReportUrl.replace('/index.html', '/video/'+record.sceneId+'.mp4'))
        }, 500)
      } else {
        this.$message.error('获取测试视频失败，请先执行场景！', 3)
      }
    },
    // 查看控制台运行日志
    handleConsoleUrl1(record) {
      const id = record.id
      return getScenceInfo(id).then((res) => {
        console.info(res.data.consoleUrl)
        if (res.data.buildNumber > 0 && res.data.consoleUrl !== undefined) {
          this.$message.success('获取运行日志成功！', 3)
          setTimeout(() => {
            window.open(res.data.consoleUrl)
          }, 1000)
        } else {
          this.$message.error('获取运行日志失败，请先执行场景！', 3)
        }
      }).catch((error) => {
        this.$message.error('接口请求失败，请稍后重试！', 3)
      })
    },
    // 查看Jenkins测试报告
    handleTestReportUrl1(record) {
      const id = record.id
      return getScenceInfo(id).then((res) => {
        if (res.data.buildNumber > 0 && res.data.testReportUrl !== undefined) {
          this.$message.success('获取测试报告成功！', 3)
          setTimeout(() => {
            window.open(res.data.testReportUrl)
          }, 1000)
        } else {
          this.$message.error('获取测试报告失败，请先执行场景！', 3)
        }
      }).catch((error) => {
        this.$message.error('接口请求失败，请稍后重试！', 3)
      })
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
      // this.sceneList1 = this.selectedRows.map((item) => item)
      // console.log(this.sceneList1);
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
.container {
  position: relative;
  height: calc(100vh - 111px) !important
}

.advanced-table {
  min-height: calc(100vh - 380px);
}

.fixed-top {
  position: sticky;
  width: 100%;
  top: 0;
}

.scrollable {
  overflow-y: scroll;
  margin-top: 5px;
  max-height: calc(100vh - 160px);
}

.case-status {
  padding: 2px 5px;
  color: #fff;
  border-radius: 5%;
}

::v-deep .advanced-table .header-bar.middle{
  padding: 20px 15px;
}

</style>
