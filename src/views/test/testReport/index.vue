<template>
  <div>
    <a-tabs v-model="activeKey" class="tab-title" default-active-key="1" type="editable-card" hide-add @edit="onEdit">
      <a-tab-pane key="1" tab="报告列表" :closable="false">
        <a-card :bordered="false" style="height: 100px">
          <SearchControl
            :queryData="queryData"
            :projectOptions="projectOptions"
            :testPlanOptions="testPlanOptions"
            :memberOptions="memberOptions"
            @handleQuery="handleQuery"
            @resetQuery="resetQuery"
          />
        </a-card>
        <a-divider />
        <a-card :bordered="false" class="container">
          <!-- table表格 -->
          <advance-table
            :scroll="{ x: 1500, y: 500 }"
            :columns="columns"
            :data-source="list"
            :loading="loading"
            rowKey="id"
            @refresh="getList"
            :components="isDragTable"
            bordered
            size="middle"
            tableKey="system-project-index-table"
            :format-conditions="true"
            :pagination="{
              current: queryParam.pageNum,
              pageSize: queryParam.pageSize,
              total: total,
              showSizeChanger: true,
              showLessItems: true,
              showQuickJumper: true,
              showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`,
              onChange: changeSize,
              customRow: onClickRow,
              onShowSizeChange: onSizeChange,
            }"
            :row-selection="rowSelection"
            :needTitle="false"
          >
            <div class="table-operations" slot="button">
              <a-space :size="8" style="margin-right: 8px">
                <a-button type="danger" :disabled="multiple" @click="handleExport" v-hasPermi="['test:testReport:export']">
                  <a-icon type="download" />批量导出
                </a-button>
                <a-button type="danger" :disabled="multiple" @click="handleDelete" v-hasPermi="['test:testReport:remove']">
                  <a-icon type="delete" />批量删除
                </a-button>
              </a-space>
            </div>
            <!-- <span slot="status" slot-scope="{ record }">
          <a-switch :checked="Boolean(record.status)" @change="(value) => onchange(record, value)" />
        </span> -->
            <span slot="projectId" slot-scope="{ record }">
              {{ findJsonArray(projectOptions,"id",record.projectId,"name") }}
            </span>
            <span slot="testPlanId" slot-scope="{ record }">
              {{ findJsonArray(testPlanOptions,"id",record.testPlanId,"name") }}
            </span>
            <span slot="triggerMode" slot-scope="{ record }">
              {{ findJsonArray(testReportTriggerModeOptions,"id",record.triggerMode,"name") }}
            </span>
            <span slot="executionMode" slot-scope="{ record }">
              {{ findJsonArray(testReportExecutionModeOptions,"id",record.executionMode,"name") }}
            </span>
            <!-- <span slot="runEnvironment" slot-scope="{ record }">
                  <a-popover>
                    <template #content>
                      <a-descriptions title="产品环境信息" size="small" :column="5" bordered>
                        <a-descriptions-item label="产品名称">{{ record.executeConfig.projectConfig.name }}</a-descriptions-item>
                        <a-descriptions-item label="产品简称">{{ record.executeConfig.projectConfig.abbreviate }}</a-descriptions-item>
                        <a-descriptions-item label="产品版本">{{ record.executeConfig.projectConfig.version.name }}</a-descriptions-item>
                        <a-descriptions-item label="版本描述">{{ record.executeConfig.projectConfig.version.description }}</a-descriptions-item>
                        <a-descriptions-item label="访问域名">
                          <a :href="record.executeConfig.projectConfig.server.domain" target="_blank">{{ findJsonArray(record.executeConfig.projectConfig.server.configList,"paramsName","前端域名","paramsValue") }}</a>
                        </a-descriptions-item>

                        <a-descriptions-item label="环境名称">{{ record.executeConfig.projectConfig.server.description }}</a-descriptions-item>
                        <a-descriptions-item label="IP">{{ record.executeConfig.projectConfig.server.host }}</a-descriptions-item>
                        <a-descriptions-item label="端口">{{ findJsonArray(record.executeConfig.projectConfig.server.configList,"paramsName","前端端口","paramsValue") }}</a-descriptions-item>
                        <a-descriptions-item label="账号">{{ findJsonArray(record.executeConfig.projectConfig.server.configList,"paramsName","前端账号","paramsValue") }}</a-descriptions-item>
                        <a-descriptions-item label="密码">{{ findJsonArray(record.executeConfig.projectConfig.server.configList,"paramsName","前端密码","paramsValue") }}</a-descriptions-item>

                        <a-descriptions-item label="系统类型">{{ record.executeConfig.projectConfig.server.type }}</a-descriptions-item>
                        <a-descriptions-item label="IP">{{ record.executeConfig.projectConfig.server.host }}</a-descriptions-item>
                        <a-descriptions-item label="端口">{{ record.executeConfig.projectConfig.server.port }}</a-descriptions-item>
                        <a-descriptions-item label="账号">{{ record.executeConfig.projectConfig.server.userName }}</a-descriptions-item>
                        <a-descriptions-item label="密码">{{ record.executeConfig.projectConfig.server.passWord }}</a-descriptions-item>
                      </a-descriptions>
                      <a-divider style="padding: ;"/>
                      <a-descriptions title="自动化环境信息" size="small" :column="5" bordered>
                        <a-descriptions-item label="自动化名称">{{ record.executeConfig.automationConfig.name }}</a-descriptions-item>
                        <a-descriptions-item label="自动化描述">{{ record.executeConfig.automationConfig.description }}</a-descriptions-item>
                        <a-descriptions-item label="自动化项目">{{ record.executeConfig.automationConfig.project.name }}</a-descriptions-item>
                        <a-descriptions-item label="Jenkins">
                          <a :href="record.executeConfig.automationConfig.jenkins.url" target="_blank">{{ record.executeConfig.automationConfig.jenkins.url }}</a>
                        </a-descriptions-item>
                        <a-descriptions-item label="浏览器">{{ record.executeConfig.automationConfig.browser.name }}</a-descriptions-item>

                        <a-descriptions-item label="自动化环境">{{ record.executeConfig.automationConfig.environment.description.systemType }}</a-descriptions-item>
                        <a-descriptions-item label="环境名称">{{ record.executeConfig.automationConfig.environment.description.name }}</a-descriptions-item>
                        <a-descriptions-item label="IP">{{ record.executeConfig.automationConfig.environment.name }}</a-descriptions-item>
                        <a-descriptions-item label="账号">{{ record.executeConfig.automationConfig.environment.description.userName }}</a-descriptions-item>
                        <a-descriptions-item label="密码">{{ record.executeConfig.automationConfig.environment.description.passWord }}</a-descriptions-item>
                      </a-descriptions>
                    </template>
                    <a-button type="danger" style="height: 25px;">点击查看</a-button>
                  </a-popover>
            </span> -->
            <!-- <span slot="statisticAnalysis" slot-scope="{ record }">
              <a-popover>
                  <template #content>
                    <div id="chart" style="width: 100%; height: 400px;">
                      <TestReportEcharts></TestReportEcharts>
                    </div>
                  </template>
                  <a-button type="danger" style="height: 25px;">点击查看</a-button>
              </a-popover>
            </span> -->
            <span slot="runTime" slot-scope="{ record }">
              {{ formatDuration(record.runTime) }}
            </span>
            <span slot="status" slot-scope="{ record }">
              <!-- <a-button style="height: 25px;">
                {{ findJsonArray(testReportStatusOptions,"id",record.status,"name") }}
              </a-button> -->
              <a-button v-for="(item, index) in getFilterArray(testReportStatusOptions, (item) => item.id === record.status)" :key="index"
               :style="{ height: '25px', color: 'white', backgroundColor: getButtonStyle(record.status)[0], borderColor: getButtonStyle(record.status)[1] }"
              > {{ item.name }} 
              </a-button>
            </span>
            <span slot="createTime" slot-scope="{ record }">
              {{ parseTime(record.createTime) }}
            </span>
            <span slot="updateTime" slot-scope="{ record }">
              {{ parseTime(record.updateTime) }}
            </span>
            <span slot="operation" slot-scope="{ record }">
              <!-- <a @click="handleUpdate(record)" v-hasPermi="['test:testReport:edit']"> 修改 </a>
              <a-divider type="vertical" v-show="record.id !== '1'" v-hasPermi="['test:testReport:edit']" />
              <a @click="handleDelete(record)" v-show="record.id !== '1'" v-hasPermi="['test:testReport:remove']">删除</a>
              <a-divider type="vertical" v-hasPermi="['test:testReport:remove']" /> -->
              <a-dropdown>
                <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">查看<a-icon type="down" /> </a>
                <a-menu slot="overlay">
                  <a-menu-item>
                    <a @click="handleExecut(record)" v-hasPermi="['test:testReport:query']"> 功能测试报告 </a>
                  </a-menu-item>
                  <a-menu-item>
                    <a @click="handleExecut(record)" v-hasPermi="['test:testReport:query']"> UI自动化测试报告 </a>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
              <!-- <a-divider type="vertical" />
              <a @click="handleEnvironmentConfig(record)" v-hasPermi="['project:environmentConfig:list']"> 环境配置 </a>
              <a-divider type="vertical" />
              <a @click="handleAutomationConfig(record)" v-hasPermi="['project:automationConfig:list']"> 自动化配置 </a> -->
            </span>
          </advance-table>
        </a-card>
      </a-tab-pane>
      <a-tab-pane v-for="(item, index) in panes" :key="(index + 2).toString()" :tab="item.title" :closable="true">
        <TestReport
          ref="testReport"
          :tab7="tab"
          :record="item.record"
          :memberOptions="memberOptions"
          @getList="getList"
          @remove="remove"
        ></TestReport>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import * as api from '@/api/api'
import SearchControl from '../components/SearchControl.vue'
import AdvanceTable from '@/components/pt/table/AdvanceTable'
import TestReportEditForm from './modules/TestReportEditForm'
import TestReportEcharts from './modules/TestReportEcharts.vue'
import TestReport from './modules/TestReport.vue'

import { testReportTriggerModeOptions, testReportExecutionModeOptions, testReportStatusOptions } from '../components/Config'
import * as utils from '@/utils/sakura'
import log from '@/utils/log'

export default {
  name: 'Environment',
  components: { SearchControl, AdvanceTable, TestReportEditForm, TestReportEcharts, TestReport},
  data() {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      loading: false,
      queryParam: {
        pageNum: 1,
        pageSize: 10,
        orderByColumn: 'a.createTime',
        isAsc: 'desc',
      },
      queryData: [
        {
          label: '所属项目',
          value: 'projectId',
        },
        {
          label: '所属计划',
          value: 'testPlanId',
        },
        {
          label: '报告名称',
          value: 'name',
        },
        {
          label: '执行方式',
          value: 'executionMode',
        },
        {
          label: '创建人',
          value: 'createByName',
        },
        {
          label: '创建时间',
        },
      ],
      columns: [
        {
          title: '所属项目',
          width: 250,
          dataIndex: 'projectId',
          scopedSlots: { customRender: 'projectId' },
          ellipsis: true,
          fixed: 'left',
          align: 'center',
        },
        {
          title: '所属计划',
          width: 260,
          dataIndex: 'testPlanId',
          scopedSlots: { customRender: 'testPlanId' },
          ellipsis: true,
          // fixed: 'left',
          align: 'center',
        },
        // {
        //   title: '报告ID',
        //   dataIndex: 'id',
        //   width: 270,
        //   ellipsis: true,
        //   fixed: 'left',
        //   align: 'center'
        // },
        {
          title: '报告名称',
          width: 318,
          dataIndex: 'name',
          ellipsis: true,
          align: 'center',
        },
        // {
        //   title: '报告描述',
        //   width: 250,
        //   dataIndex: 'description',
        //   ellipsis: true,
        //   align: 'center',
        // },
        {
          title: '触发方式',
          width: 80,
          dataIndex: 'triggerMode',
          scopedSlots: { customRender: 'triggerMode' },
          align: 'center',
        },
        {
          title: '执行方式',
          width: 80,
          dataIndex: 'executionMode',
          scopedSlots: { customRender: 'executionMode' },
          align: 'center',
        },
        // {
        //   title: '运行配置',
        //   width: 100,
        //   dataIndex: 'runEnvironment',
        //   scopedSlots: { customRender: 'runEnvironment' },
        //   align: 'center',
        // },
        {
          title: '运行耗时',
          width: 100,
          dataIndex: 'runTime',
          scopedSlots: { customRender: 'runTime' },
          align: 'center',
        },
        {
          title: '报告状态',
          width: 100,
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
          align: 'center',
        },
        // {
        //   title: '统计分析',
        //   dataIndex: 'statisticAnalysis',
        //   width: 150,
        //   ellipsis: true,
        //   scopedSlots: { customRender: 'statisticAnalysis' },
        //   align: 'center',
        // },
        {
          title: '创建人',
          width: 80,
          dataIndex: 'createByName',
          align: 'center',
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: 160,
          ellipsis: true,
          scopedSlots: { customRender: 'createTime' },
          align: 'center',
        },
        {
          title: '更新时间',
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
          width: 150,
          scopedSlots: { customRender: 'operation' },
          align: 'center',
        },
      ],
      panes: [],
      tab: '',
      activeKey: '1',
      projectOptions: [],
      testPlanOptions: [],
      memberOptions: [],
      testReportTriggerModeOptions,
      testReportExecutionModeOptions,
      testReportStatusOptions,
      total: 0,
      list: [],
      ids: [],
      names: [],
      environmentId: '',
      selectedRowKeys: [],
      selectedRows: [],
      statusOptions: [],
      // 高级搜索 展开/关闭
      advanced: false,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      showAddModal: false,
      showEditModal: false,
    }
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
        getCheckboxProps: (record) => ({
          props: {
            disabled: record.id === '1',
            name: record.name,
          },
        }),
      }
    },
    isDragTable() {
      return this.dragTable(this.columns)
    },
  },
  watch: {
    $route(to, from) {
      // console.log('Route changed');
      this.getAllProjectList()
      this.getList()
    },
  },
  created() {
    this.getAllProjectList()
    this.getAllTestPlanList()
    this.getAllUsers()
    this.getList()
  },
  beforeRouteUpdate(to, from, next) {
    this.getAllProjectList()
    this.getList()
    next()
  },
  methods: {
    getFilterArray(array, condition) {
      return array.filter((item) => {
        return condition(item)
      })
    },
    getButtonStyle(status) {
      switch (status) {
        case '0':
          return ['#2f54eb', '#2f54eb']
        case '1':
          return ['#05c878', '#05c878']
        case '2':
          return ['#ff4d4f', '#ff4d4f']
        default:
          return ['#2f54eb', '#2f54eb'];
      }
    },
    calculateWidth(originalWidth, screenWidth) {
      return Math.round((screenWidth / 1920) * originalWidth)
    },
    // 获取所有项目
    getAllProjectList() {
      api.getProjectList().then((response) => {
        this.projectOptions = response.data.list
      })
    },
    // 获取项目名称
    getProjectName(projectId) {
      // console.info(this.findNodeId(this.projectOptions, projectId, 'name'))
      return utils.findNodeId(this.projectOptions, projectId, 'name')
    },
    findJsonArray(jsonArray, targetKey, targetParamsName, targetParamsValue) {
      // console.info(jsonArray, targetKey, targetParamsName, targetParamsValue)
      return utils.findJsonArray(jsonArray, targetKey, targetParamsName, targetParamsValue)
    },
    findJsonArray1(array, condition) {
      return array.filter((item) => {
        return condition(item)
      })
    },
    // 获取系统的所有用户
    getAllUsers() {
      api.getAllUsersOfSystem().then((response) => {
        this.memberOptions = response.data
      })
    },
    // 获取所有的测试计划
    getAllTestPlanList() {
      const queryParam = {
        // pageNum: 1,
        // pageSize: 10
      }
      api.getTestPlanList(queryParam).then((response) => {
        this.testPlanOptions = response.data.list
      })
    },
    getList() {
      this.loading = true
      api.getTestReportList(this.queryParam).then((response) => {
        this.list = response.data.list
        this.total = response.data.total
      }).finally(
        this.loading = false
      )
      this.selectedRowKeys = []
      this.multiple = !this.selectedRowKeys.length
    },
    handleQuery(value) {
      if (value === undefined) {
        this.queryParam = {
          pageNum: 1,
          pageSize: 10,
        }
      } else {
        // console.log(this.queryParam);
        this.queryParam = Object.assign(this.queryParam, value)
        this.queryParam.pageNum = 1
      }
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      // this.selectedRowKeys = []
      // this.multiple = !this.selectedRowKeys.length
      this.queryParam = {
        pageNum: 1,
        pageSize: 10,
        orderByColumn: 'a.project_id, a.name',
        isAsc: 'asc',
      }
      this.handleQuery(this.queryParam)
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
    handleAdd() {
      this.showAddModal = true
      this.$nextTick(() => this.$refs.testReportAddForm.handleAdd())
    },
    handleUpdate(record) {
      this.showAddModal = true
      this.$nextTick(() => this.$refs.testReportAddForm.handleUpdate(record))
    },
    handleDelete(row) {
      var that = this
      row.id ? this.ids.push(row.id) : ''
      const ids = this.ids
      const names = row.name || this.names
      this.$Modal.confirm({
        title: '确认删除所选中数据?',
        content: '当前选中为' + names + '的测试报告',
        onOk() {
          return api
            .deleteTestReport({ ids })
            .then((res) => {
              if (res.code === 200) {
                that.$message.success('删除成功')
                that.getList()
                that.onSelectChange([], [])
              }
            })
            .catch((error) => {
              that.$message.error('删除失败', 3)
              reject(error)
            })
        },
      })
    },
    handleExecut(record) {
      this.tab='UI自动化测试报告'
      var num = false
      var key = 0
      if (this.panes.length > 0) {
        // console.log(this.panes);
        this.panes.forEach((item,index) => {
          if (item.title === record.name) {
            num = true
            key = index+2
            return
          }
        })
        if (num) {
          this.$message.warning('已存在打开的窗口，请先关闭！')
          this.activeKey = key.toString()
        } else {
          this.panes.push({
            title: record.name,
            // title: '报告执行',
            record,
            multiple: true
          })
          this.activeKey = (this.panes.length + 1).toString()
          this.environmentId = ''
        }
      } else {
        this.panes.push({
          title: record.name,
          // title: '报告执行',
          record,
          multiple: true
        })
        this.activeKey = (this.panes.length + 1).toString()
        this.environmentId = ''
      }
    },
    handleImport() {},
    handleExport(row) {
      // var that = this
      // var ids1 = []
      // if (row.id !== undefined) {
      //   ids1.push(row.id)
      // }
      // // row.id ? this.ids.push(row.id) : ''
      // // const ids = row.id || that.ids
      // const ids = ids1.length > 0 ? ids1 : that.ids
      // const names = row.name || that.names
      // // console.info(ids)
      // var param = {
      //   projectId: row.projectId,
      //   ids: ids,
      // }
      // that.$Modal.confirm({
      //   title: '确认导出所选中数据?',
      //   content: '当前选中为' + names + '的测试报告',
      //   onOk() {
      //     return api
      //       .exporttestReport(param)
      //       .then((res) => {
      //         if (res.status != 404) {
      //           that.readBlobDown(res, 'environment.yml', 'application/x-yaml')
      //           that.$message.success('导出成功')
      //         }
      //       })
      //       .catch((error) => {
      //         that.$message.error('导出失败')
      //         reject(error)
      //       })
      //   },
      //   onCancel() {},
      // })
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
    onEdit1(targetKey, action) {
      this[action](targetKey)
    },
    onEdit(targetKey, action) {
      var that = this
      this.$Modal.confirm({
        title: '关闭页面?',
        content: '确认关闭当前页面吗?',
        onOk() {
          return that[action](targetKey)
        },
        onCancel() { }
      })
    },
    remove(targetKey) {
      this.panes.splice(targetKey - 2, 1)
      this.activeKey = '1'
      this.getList()
    },
    // 表格内-状态切换
    onchange(value, { id, projectId }) {
      let params = {
        id,
        projectId,
        status: Number(value),
      }
      // api.updatetestReportStatus(params).then(() => {
      //   this.$message.success('修改成功')
      //   this.getList()
      //   // setTimeout(() => {this.getList()}, 2000)
      // })
    },
  },
}
</script>

<style lang="less" scoped>
.tab-title {
  background-color: white;
  padding: 10px 10px 0 10px;
  font-size: 16px;
  font-weight: 400;
  color: #101010;
}
.title-wrapper {
  padding: 20px 0 0 20px;
  font-size: 16px;
  font-weight: 400;
  color: #101010;
  font-family: 'Microsoft YaHei';
}
.table-operations {
  // padding: 5px 0px 5px 0px;
  padding: 0px 0px 10px 0px;
  // display: flex;
  text-align: right;
  justify-content: space-between;
}

.container {
  width: 100%; /* 当前分辨率为1920x1080时，width为1676px */
  height: calc(100vh - 305px);
  margin-top: -20px;
}

/* 当屏幕宽度小于等于1920px时，根据当前的width自适应相应大小 */
@media (min-width: 1920px) {
  .container {
    width: calc(100% * (1920 / 1920));
    // width: calc(Math.round((1920 / 1920) * 1676));
  }
}
</style>
