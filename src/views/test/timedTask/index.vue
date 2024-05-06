<template>
  <div>
    <a-tabs v-model="activeKey" class="tab-title" default-active-key="1" type="editable-card" hide-add @edit="onEdit">
      <a-tab-pane key="1" tab="任务列表" :closable="false">
        <a-card :bordered="false" style="height: 100px">
          <SearchControl
            ref="search"
            :queryData="queryData"
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
            tableKey="system-testPlan-index-table"
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
              <a-button type="primary" @click="handleAdd()" v-hasPermi="['test:timedTask:add']">
                <a-icon type="plus-square" />新建任务
              </a-button>
              <a-space :size="8" style="margin-right: 8px">
                <a-button type="primary" @click="handleImport" v-hasPermi="['test:timedTask:export']">
                  <a-icon type="upload" />批量导入
                </a-button>
                <a-button
                  type="danger"
                  :disabled="multiple"
                  @click="handleExport"
                  v-hasPermi="['test:timedTask:export']"
                >
                  <a-icon type="download" />批量导出
                </a-button>
                <a-button
                  type="danger"
                  :disabled="multiple"
                  @click="handleDelete"
                  v-hasPermi="['test:timedTask:remove']"
                >
                  <a-icon type="delete" />批量删除
                </a-button>
                <a-button type="primary" @click="handleTimedTaskLog" v-hasPermi="['test:timedTask:list']">
                  <a-icon type="snippets" />执行日志
                </a-button>
              </a-space>
            </div>
            <span slot="testPlanId" slot-scope="{ record }">
              {{ getTestPlanName(record.testPlanId) }}
            </span>
            <span slot="type" slot-scope="{ record }">
              <div
                v-for="(item, index) in getFilterArray(timedTaskTypeOptions, (item) => item.id === record.type)"
                :key="index"
              >
                {{ item.name }}
              </div>
            </span>
            <span slot="cronExpression" slot-scope="{ record }">
              <a-popover title="最近5次运行时间" placement="bottomLeft">
                <template slot="content">
                  <p v-for="nextExecTime in record.nextExecTimeList" :key="nextExecTime.key">{{ nextExecTime }}</p>
                </template>
                <a>{{ record.cronExpression }}</a>
              </a-popover>
            </span>
            <span slot="status" slot-scope="{ record }">
              <!-- <a-button v-for="(item, index) in getFilterArray(timedTaskStatusOptions, (item) => item.id === record.status)" :key="index"
               :style="{ height: '25px', color: 'white', backgroundColor: getButtonStyle(record.status)[0], borderColor: getButtonStyle(record.status)[1] }"
              > {{ item.name }} 
              </a-button> -->
              <a-popconfirm
                ok-text="是"
                cancel-text="否"
                @confirm="confirmHandleStatus(record)"
                @cancel="cancelHandleStatus(record)"
              >
                <span slot="title"
                  >确认
                  <b>{{ record.status === '1' ? '开启' : '关闭' }}</b>
                  吗?
                </span>
                <a-switch
                  style="width: 50px"
                  checked-children="开"
                  un-checked-children="关"
                  :checked="record.status == 0"
                />
              </a-popconfirm>
            </span>
            <span slot="createTime" slot-scope="{ record }">
              {{ parseTime(record.createTime) }}
            </span>
            <span slot="updateTime" slot-scope="{ record }">
              {{ parseTime(record.updateTime) }}
            </span>
            <span slot="operation" slot-scope="{ record }">
              <a @click="handleUpdate(record)" v-hasPermi="['test:timedTask:edit']">修改</a>
              <a-divider type="vertical" v-show="record.id !== '1'" v-hasPermi="['test:timedTask:edit']" />
              <a @click="handleCopy(record)" v-hasPermi="['test:timedTask:add']">复制</a>
              <a-divider type="vertical" v-show="record.id !== '1'" v-hasPermi="['test:timedTask:add']" />
              <a @click="handleDelete(record)" v-show="record.id !== '1'" v-hasPermi="['test:timedTask:remove']"
                >删除</a
              >
              <a-divider type="vertical" v-show="record.id !== '1'" v-hasPermi="['test:timedTask:remove']" />
              <a @click="handleTimedTaskLog(record)" v-show="record.id !== '1'" v-hasPermi="['test:timedTask:edit']"
                >日志</a
              >
              <!-- <a-dropdown>
                <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">更多<a-icon type="down" /> </a>
                <a-menu slot="overlay">
                  <a-menu-item>
                    <a @click="handleDelete(record)" v-show="record.id !== '1'" v-hasPermi="['test:timedTask:remove']">删除</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a @click="handleTestReport(record)" v-hasPermi="['test:timedTask:edit']"> 报告 </a>
                  </a-menu-item>
                </a-menu>
              </a-dropdown> -->
              <!-- <a-divider type="vertical" v-hasPermi="['test:timedTask:remove']" /> -->
              <!-- <a-divider type="vertical" />
              <a @click="handleEnvironmentConfig(record)" v-hasPermi="['testPlan:environmentConfig:list']"> 环境配置 </a>
              <a-divider type="vertical" />
              <a @click="handleAutomationConfig(record)" v-hasPermi="['testPlan:automationConfig:list']"> 自动化配置 </a> -->
            </span>
          </advance-table>
          <!-- 增加 -->
          <TimedTaskAddForm
            v-if="showAddModal"
            ref="timedTaskAddForm"
            :testPlanOptions="testPlanOptions"
            :memberOptions="memberOptions"
            @ok="getList"
            @close="showAddModal = false"
          />
        </a-card>
      </a-tab-pane>
      <a-tab-pane v-for="(item, index) in panes" :key="(index + 2).toString()" :tab="item.title" :closable="true">
        <TimedTaskLog
          ref="TimedTaskLog"
          :tab="tab"
          :record="item.record"
          :testPlanOptions="testPlanOptions"
          @getList="getList"
          @remove="remove"
        ></TimedTaskLog>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import * as api from '@/api/api'
import AdvanceTable from '@/components/pt/table/AdvanceTable'
import SearchControl from '@/views/test/components/SearchControl'
import { timedTaskTypeOptions, timedTaskStatusOptions } from '@/views/test/components/Config'
import TimedTaskAddForm from './modules/TimedTaskAddForm'
import TimedTaskLog from './modules/TimedTaskLog.vue'

import log from '@/log/log'

export default {
  name: 'Environment',
  components: { SearchControl, AdvanceTable, TimedTaskAddForm, TimedTaskLog },
  data() {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      loading: false,
      queryParam: {
        pageNum: 1,
        pageSize: 10,
        orderByColumn: 'a.testPlanId, a.createTime',
        isAsc: 'desc',
      },
      queryData: [
        {
          label: '所属计划',
          value: 'testPlanId',
        },
        {
          label: '任务类型',
          value: 'type',
        },
        {
          label: '任务名称',
          value: 'name',
        },
        {
          label: '任务状态',
          value: 'status',
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
          title: '所属计划',
          width: 300,
          dataIndex: 'testPlanId',
          scopedSlots: { customRender: 'testPlanId' },
          ellipsis: true,
          fixed: 'left',
          align: 'center',
        },
        {
          title: '任务类型',
          width: 100,
          dataIndex: 'type',
          scopedSlots: { customRender: 'type' },
          align: 'center',
        },
        // {
        //   title: '任务ID',
        //   dataIndex: 'id',
        //   width: 270,
        //   ellipsis: true,
        //   fixed: 'left',
        //   align: 'center'
        // },
        {
          title: '任务名称',
          width: 357,
          dataIndex: 'name',
          ellipsis: true,
          align: 'center',
        },
        // {
        //   title: '任务简称',
        //   width: 113,
        //   dataIndex: 'abbreviate',
        //   ellipsis: true,
        //   fixed: 'left',
        //   align: 'center'
        // },
        // {
        //   title: '任务描述',
        //   width: 250,
        //   dataIndex: 'description',
        //   ellipsis: true,
        //   align: 'center',
        // },
        // {
        //   title: '任务成员',
        //   width: 100,
        //   dataIndex: 'members',
        //   scopedSlots: { customRender: 'members' },
        //   align: 'center',
        // },
        // {
        //   title: '任务负责人',
        //   width: 100,
        //   dataIndex: 'principals',
        //   scopedSlots: { customRender: 'principals' },
        //   align: 'center',
        // },
        // {
        //   title: '测试进度',
        //   width: 120,
        //   dataIndex: 'testProgress',
        //   scopedSlots: { customRender: 'testProgress' },
        //   align: 'center',
        // },
        {
          title: '运行规则',
          width: 120,
          dataIndex: 'cronExpression',
          ellipsis: true,
          scopedSlots: { customRender: 'cronExpression' },
          align: 'center',
        },
        {
          title: '下次执行时间',
          width: 160,
          ellipsis: true,
          dataIndex: 'nextExecTime',
          scopedSlots: { customRender: 'nextExecTime' },
          align: 'center',
        },
        {
          title: '任务状态',
          width: 90,
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
          align: 'center',
        },
        // {
        //   title: '任务开始时间',
        //   dataIndex: 'plannedStartTime',
        //   width: 150,
        //   ellipsis: true,
        //   scopedSlots: { customRender: 'plannedStartTime' },
        //   align: 'center',
        // },
        // {
        //   title: '任务结束时间',
        //   dataIndex: 'plannedEndTime',
        //   width: 150,
        //   ellipsis: true,
        //   scopedSlots: { customRender: 'plannedEndTime' },
        //   align: 'center',
        // },
        // {
        //   title: '实际开始时间',
        //   dataIndex: 'actualStartTime',
        //   width: 150,
        //   ellipsis: true,
        //   scopedSlots: { customRender: 'actualStartTime' },
        //   align: 'center',
        // },
        // {
        //   title: '实际结束时间',
        //   dataIndex: 'actualEndTime',
        //   width: 150,
        //   ellipsis: true,
        //   scopedSlots: { customRender: 'actualEndTime' },
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
          width: 200,
          scopedSlots: { customRender: 'operation' },
          align: 'center',
        },
      ],
      panes: [],
      tab: '',
      activeKey: '1',
      testPlanOptions: [],
      memberOptions: [],
      timedTaskTypeOptions,
      timedTaskStatusOptions,
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
      this.getAllTestPlanList()
      this.getList()
    },
    activeKey: {
      handler(key) {
        // console.log('key: ' + key)
        if (key !== '1') {
          this.$nextTick(() => {
            if (this.$refs.TimedTaskLog[key - 2].getList() !== undefined) {
              this.$refs.TimedTaskLog[key - 2].getList()
            }
          })
        } else {
          this.getList()
        }
      },
    },
  },
  created() {
    // console.log('Created method called');
    this.getAllTestPlanList()
    this.getAllUsers()
    this.getList()
  },
  beforeRouteUpdate(to, from, next) {
    console.log('Route parameter changed')
    this.getAllTestPlanList()
    this.getList()
    next()
  },
  methods: {
    calculateWidth(originalWidth, screenWidth) {
      return Math.round((screenWidth / 1920) * originalWidth)
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
    // 获取测试计划名称
    getTestPlanName(testPlanId) {
      // console.info(this.findNodeId(this.testPlanOptions, testPlanId, 'name'))
      return this.findNodeId(this.testPlanOptions, testPlanId, 'name')
    },
    // 获取系统的所有用户
    getAllUsers() {
      api.getAllUsersOfSystem().then((response) => {
        this.memberOptions = response.data
      })
    },
    getButtonStyle(status) {
      switch (status) {
        case '0':
          return ['#909399', '#909399']
        case '1':
          return ['#ff4d4f', '#ff4d4f']
        case '2':
          return ['#05c878', '#05c878']
        default:
          return ['#909399', '#909399']
      }
    },
    getFilterArray(array, condition) {
      return array.filter((item) => {
        return condition(item)
      })
    },
    getList() {
      this.loading = true
      api.getTimedTaskList(this.queryParam).then((response) => {
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
        orderByColumn: 'a.testPlanId, a.name',
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
      this.$nextTick(() => this.$refs.timedTaskAddForm.handleAdd())
    },
    handleUpdate(record) {
      this.showAddModal = true
      this.$nextTick(() => this.$refs.timedTaskAddForm.handleUpdate(record))
    },
    handleCopy(record) {
      this.showAddModal = true
      this.$nextTick(() => this.$refs.timedTaskAddForm.handleCopy(record))
    },
    handleDelete(row) {
      var that = this
      row.id ? this.ids.push(row.id) : ''
      const ids = this.ids
      const names = row.name || this.names
      this.$Modal.confirm({
        title: '确认删除所选中数据?',
        content: '当前选中为' + names + '的测试任务',
        onOk() {
          return api
            .deleteTimedTask({ ids })
            .then((res) => {
              if (res.code === 200) {
                that.$message.success('删除成功')
                that.getList()
                // that.onSelectChange([], [])
              }
            })
            .catch((error) => {
              that.$message.error('删除失败', 3)
              reject(error)
            })
        },
      })
      this.ids = []
    },
    handleExecut1(record) {
      this.tab = '功能测试'
    },
    handleTimedTaskLog1(record) {
      console.log(record.name)
      var num = false
      var key = 0
      if (this.panes.length > 0) {
        // console.log(this.panes);
        this.panes.forEach((item, index) => {
          if (item.title === record.name + '_执行日志') {
            num = true
            key = index + 2
            return
          }
        })
        if (num) {
          // this.$message.info('已存在打开的窗口，请先关闭！')
          this.activeKey = key.toString()
        } else {
          this.panes.push({
            title: record.name ? record.name + '_执行日志' : '执行日志',
            record: record.name ? record : undefined,
            multiple: true,
          })
          this.activeKey = (this.panes.length + 1).toString()
        }
      } else {
        this.panes.push({
          title: record.name ? record.name + '_执行日志' : '执行日志',
          record: record.name ? record : undefined,
          multiple: true,
        })
        this.activeKey = (this.panes.length + 1).toString()
      }
    },
    handleTimedTaskLog(record) {
      const existingPaneIndex = this.panes.findIndex(pane => pane.title === (record.name ? `${record.name}_执行日志` : '执行日志'));
      // console.log(existingPaneIndex);
      if (existingPaneIndex !== -1) {
        this.activeKey = (existingPaneIndex + 2).toString()
      } else {
        const title = record.name ? `${record.name}_执行日志` : '执行日志'
        const newPane = { title, record: record.name ? record : undefined, multiple: true }
        this.panes.push(newPane)
        this.activeKey = (this.panes.length + 1).toString()
      }
    },
    handleTimedTask(record) {
      this.$router.push({
        name: 'TimedTask',
        params: {
          name: record.name,
        },
      })
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
      //   testPlanId: row.testPlanId,
      //   ids: ids,
      // }
      // that.$Modal.confirm({
      //   title: '确认导出所选中数据?',
      //   content: '当前选中为' + names + '的测试任务',
      //   onOk() {
      //     return api
      //       .exporttimedTask(param)
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
        onCancel() {},
      })
    },
    remove(targetKey) {
      this.panes.splice(targetKey - 2, 1)
      this.activeKey = '1'
      this.getList()
    },
    // 表格内-状态切换
    onchange(row) {
      api.updateTimedTask(row).then(() => {
        this.$message.success('修改成功')
        this.getList()
        // setTimeout(() => {this.getList()}, 2000)
      })
    },
    /* 任务状态修改 */
    confirmHandleStatus(row) {
      const text = row.status === '1' ? '开启' : '关闭'
      row.status = row.status === '0' ? '1' : '0'
      api
        .updateTimedTask(row)
        .then(() => {
          this.$message.success(text + '成功', 3)
          this.getList()
        })
        .catch(function () {
          this.$message.error(text + '发生异常', 3)
        })
    },
    cancelHandleStatus(row) {},
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
  display: flex;
  justify-content: space-between;
}

.container {
  width: 100%; /* 当前分辨率为1920x1080时，width为1676px */
  height: calc(100vh - 305px);
  margin-top: -20px;
}

.ant-progress-line {
  padding: 0px 5px 0px 0px;
}

/* 当屏幕宽度小于等于1920px时，根据当前的width自适应相应大小 */
@media (min-width: 1920px) {
  .container {
    width: calc(100% * (1920 / 1920));
    // width: calc(Math.round((1920 / 1920) * 1676));
  }
}
</style>
