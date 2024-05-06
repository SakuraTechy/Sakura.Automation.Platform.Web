<template>
  <div>
    <a-card :bordered="false" class="container">
          <SearchControl
            :queryData="queryData"
            :testPlanOptions="testPlanOptions"
            :memberOptions="memberOptions"
            @handleQuery="handleQuery"
            @resetQuery="resetQuery"
          />
        <a-divider style="margin: 16px 0px; "/>
          <!-- table表格 -->
          <advance-table style="margin-top: -12px"
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
              <a-space :size="8" style="margin-right: 8px">
                <!-- <a-button type="primary" @click="handleImport" v-hasPermi="['test:timedTask:export']">
                  <a-icon type="upload" />批量导入
                </a-button>
                <a-button
                  type="danger"
                  :disabled="multiple"
                  @click="handleExport"
                  v-hasPermi="['test:timedTask:export']"
                >
                  <a-icon type="download" />批量导出
                </a-button> -->
                <a-button
                  type="danger"
                  :disabled="multiple"
                  @click="handleDelete"
                  v-hasPermi="['test:timedTask:remove']"
                >
                  <a-icon type="delete" />批量删除
                </a-button>
                <a-button
                  type="primary"
                  @click="handleDeleteAll"
                  v-hasPermi="['test:timedTask:remove']"
                >
                  <a-icon type="delete" />清空所有
                </a-button>
              </a-space>
            </div>
            <span slot="testPlanId" slot-scope="{ record }">
              {{ gettestPlanName(record.testPlanId) }}
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
              {{ record.cronExpression }}
            </span>
            <span slot="status" slot-scope="{ record }">
              <a-button v-for="(item, index) in getFilterArray(timedTaskExecStatusOptions, (item) => item.id === record.status)" :key="index"
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
              <a @click="handleDelete(record)" v-hasPermi="['test:timedTask:remove']">删除</a>
            </span>
          </advance-table>
    </a-card>
  </div>
</template>

<script>
import * as api from '@/api/api'
import AdvanceTable from '@/components/pt/table/AdvanceTable'
import SearchControl from '@/views/test/components/SearchControl'
import { timedTaskTypeOptions, timedTaskExecStatusOptions } from '@/views/test/components/Config'

export default {
  name: 'Environment',
  components: { SearchControl, AdvanceTable },
  props: {
    record: {
      type: Object,
    },
    testPlanOptions: {
      type: Array,
    },
  },
  data() {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      loading: false,
      queryParam: {
        pageNum: 1,
        pageSize: 10,
        name: '',
        orderByColumn: 'a.testPlanId, b.createTime',
        isAsc: 'desc',
      },
      queryData: [
        {
          label: 'ID',
          value: 'id',
        },
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
          label: '执行状态',
          value: 'status',
        },
        {
          label: '执行时间',
        },
      ],
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
          width: 100,
          ellipsis: true,
          // fixed: 'left',
          align: 'center'
        },
        {
          title: '所属计划',
          width: 300,
          dataIndex: 'testPlanId',
          scopedSlots: { customRender: 'testPlanId' },
          ellipsis: true,
          // fixed: 'left',
          align: 'center',
        },
        {
          title: '任务类型',
          width: 100,
          dataIndex: 'type',
          scopedSlots: { customRender: 'type' },
          align: 'center',
        },
        {
          title: '任务名称',
          width: 486,
          dataIndex: 'name',
          ellipsis: true,
          align: 'center',
        },
        {
          title: '运行规则',
          width: 130,
          dataIndex: 'cronExpression',
          ellipsis: true,
          scopedSlots: { customRender: 'cronExpression' },
          align: 'center',
        },
        {
          title: '执行状态',
          width: 100,
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
          align: 'center',
        },
        {
          title: '执行时间',
          width: 160,
          ellipsis: true,
          dataIndex: 'createTime',
          scopedSlots: { customRender: 'createTime' },
          align: 'center',
        },
        // {
        //   title: '创建人',
        //   width: 80,
        //   dataIndex: 'createByName',
        //   align: 'center',
        // },
        // {
        //   title: '创建时间',
        //   dataIndex: 'createTime',
        //   width: 160,
        //   ellipsis: true,
        //   scopedSlots: { customRender: 'createTime' },
        //   align: 'center',
        // },
        // {
        //   title: '更新时间',
        //   dataIndex: 'updateTime',
        //   width: 160,
        //   ellipsis: true,
        //   scopedSlots: { customRender: 'updateTime' },
        //   align: 'center',
        // },
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
      // testPlanOptions: [],
      memberOptions: [],
      timedTaskTypeOptions,
      timedTaskExecStatusOptions,
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
            disabled: record.id === '0',
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
      // this.getAllTestPlanList()
      // this.getList()
    },
    queryParam: {
      handler(newVal, oldVal) {
        // console.info(newVal, oldVal)
        // this.handleQuery()
      },
      deep: true
    }
  },
  created() {
    // console.log('Created method called');
    // this.getAllTestPlanList()
    // this.getAllUsers()
    // this.getList()
  },
  beforeRouteUpdate(to, from, next) {
    console.log('Route parameter changed');
    // this.getAllTestPlanList()
    this.getList()
    next()
  },
  methods: {
    // 获取测试计划名称
    gettestPlanName(testPlanId) {
      // console.info(this.findNodeId(this.testPlanOptions, testPlanId, 'name'))
      return this.findNodeId(this.testPlanOptions, testPlanId, 'name')
    },
    getButtonStyle(status) {
      switch (status) {
        case '0':
          return ['#05c878', '#05c878']
        case '1':
          return ['#ff4d4f', '#ff4d4f']
        case '2':
          return ['#909399', '#909399']
        default:
          return ['#909399', '#909399'];
      }
    },
    getFilterArray(array, condition) {
      return array.filter((item) => {
        return condition(item)
      })
    },
    getList() {
      this.loading = true
      this.record ? this.queryParam.name = this.record.name : ''
      api.getTimedTaskLogList(this.queryParam).then((response) => {
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
    /** 删除按钮操作 */
    handleDelete (row) {
      var that = this
      const jobLogIds = row.id || this.ids
      this.$Modal.confirm({
        title: '确认删除所选中数据?',
        content: '当前选中日志编号为' + jobLogIds + '的数据',
        onOk () {
          return api.delJobLog(jobLogIds)
            .then(() => {
              that.getList()
              that.$message.success('删除成功')
          })
        },
        onCancel () {}
      })
    },
    /** 清空按钮操作 */
    handleDeleteAll () {
      var that = this
      this.$Modal.confirm({
        title: '是否确认清空?',
        content: '此操作将会清空所有调度日志数据项',
        onOk () {
          return api.cleanJobLog()
            .then(() => {
              that.getList()
              that.$message.success('清空成功')
          })
        },
        onCancel () {}
      })
    },
    handleImport() {},
    handleExport() {},
  },
}
</script>

<style lang="less" scoped>
.table-operations {
  // padding: 5px 0px 5px 0px;
  padding: 0px 0px 10px 0px;
  display: flex;
  justify-content: flex-end;
}
.container {
  width: 100%; /* 当前分辨率为1920x1080时，width为1676px */
  height: calc(100vh - 176px);
  margin-top: 0px;
}
/* 当屏幕宽度小于等于1920px时，根据当前的width自适应相应大小 */
@media (min-width: 1920px) {
  .container {
    width: calc(100% * (1920 / 1920));
    // width: calc(Math.round((1920 / 1920) * 1676));
  }
}
</style>
