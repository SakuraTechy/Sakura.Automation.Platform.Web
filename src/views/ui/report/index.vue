<template>
  <div>
    <a-card :bordered="false" style="margin-bottom: 10px">
      <div class="table-page-search-wrapper">
        <a-form :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-row :gutter="48">
            <a-col :md="6" :sm="24">
              <a-form-item label="报告名称">
                <a-input v-model="queryParam.report" placeholder="请输入报告名称" allow-clear />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="所属项目" prop="projectId">
                <a-select v-model="queryParam.projectId" placeholder="请选择项目" option-filter-prop="children">
                  <a-select-option v-for="(d, index) in projectOptions" :key="index" :value="d.id">
                    {{ d.project }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col>
              <span class="table-page-search-submitButtons" style="float: right">
                <a-button type="primary" @click="handleQuery"><a-icon type="search" />查询</a-button>
                <a-button style="margin-left: 8px" @click="resetQuery"><a-icon type="redo" />重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-card :bordered="false" class="table-card">
      <!-- table表格 -->
      <advance-table
        :columns="columns"
        :data-source="list"
        title="报告管理"
        :loading="loading"
        rowKey="id"
        @refresh="getList"
        size="middle"
        tableKey="ui-report-index-table"
        :row-selection="rowSelection"
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
      >
        <div class="table-operations" slot="button">
          <a-button
            type="danger"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['projectSetting:project:delete']"
          >
            <a-icon type="delete" />删除
          </a-button>
        </div>
        <span slot="report" slot-scope="{ record }">
          <span>{{ record.report }}</span>
          <a-tooltip placement="topLeft">
            <template slot="title">
              <span>重命名报告</span>
            </template>
            <a-icon type="form" style="margin-left: 10px" @click="editName(record)" />
          </a-tooltip>
        </span>
        <span slot="projectId" slot-scope="{ record }">
          {{ findNodeId(projectOptions, record.projectId, 'project') }}
        </span>
        <span slot="createTime" slot-scope="{ record }">
          {{ parseTime(record.createTime) }}
        </span>
        <span slot="endTime" slot-scope="{ record }">
          {{ parseTime(record.endTime) }}
        </span>
        <!-- <span
          slot="status"
          slot-scope="{ record }"
          class="report-status"
          :style="{ backgroundColor: statusColor[record.status] }"
        >
          {{ findNodeId(reportStatusOptions, record.status, 'label') }}
        </span> -->
        <span slot="operation" slot-scope="{ record }">
          <a @click="handleReportInfo(record, undefined)" v-hasPermi="['projectSetting:version:edit']"> 报告详情 </a>
          <a-divider type="vertical" v-hasPermi="['projectSetting:version:delete']" />
          <a @click="handleDelete(record)" v-hasPermi="['projectSetting:version:delete']"> 删除 </a>
        </span>
      </advance-table>
      <!-- 重命名报告 -->
      <ant-modal
        :visible="showEditNameModal"
        modal-title="重命名报告"
        :adjust-size="false"
        modalWidth="640"
        @cancel="cancel"
        modalHeight="180"
      >
        <a-form-model
          ref="reForm"
          :model="reForm"
          slot="content"
          layout="vertical"
          :labelCol="{ span: 2 }"
          :wrapperCol="{ span: 20 }"
        >
          <a-form-model-item label="名称" prop="report">
            <a-input v-model="reForm.report" placeholder="请输入" />
          </a-form-model-item>
        </a-form-model>
        <template slot="footer">
          <a-button @click="cancel"> 取消 </a-button>
          <a-button type="primary" @click="submitReportName"> 确 定 </a-button>
        </template>
      </ant-modal>
    </a-card>
  </div>
</template>

<script>
import AdvanceTable from '@/components/pt/table/AdvanceTable'
import AntModal from '@/components/pt/dialog/AntModal'
// import { reportStatusOptions } from '@/utils/options'
export default {
  name: 'Report',
  components: { AdvanceTable, AntModal },
  data() {
    return {
      // reportStatusOptions,
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      statusColor: ['#5cbc31', '#f25f62', '#888c92'], // 控制用例状态颜色
      loading: false,
      reForm: {
        report: ''
      },
      showEditNameModal: false,
      queryParam: {
        pageNum: 1,
        pageSize: 10,
        report: '',
        projectId: '1'
      },
      columns: [
        {
          title: '报告名称',
          dataIndex: 'report',
          scopedSlots: { customRender: 'report' },
          ellipsis: true,
          align: 'center'
        },
        {
          title: '所属项目',
          dataIndex: 'projectId',
          scopedSlots: { customRender: 'projectId' },
          align: 'center'
        },
        {
          title: '创建人',
          dataIndex: 'createBy',
          align: 'center'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          ellipsis: true,
          scopedSlots: { customRender: 'createTime' },
          align: 'center'
        },
        {
          title: '结束时间',
          dataIndex: 'endTime',
          ellipsis: true,
          scopedSlots: { customRender: 'endTime' },
          align: 'center'
        },
        {
          title: '触发方式',
          dataIndex: 'touchWay',
          ellipsis: true,
          align: 'center'
        },
        {
          title: '状态',
          dataIndex: 'status',
          ellipsis: true,
          scopedSlots: { customRender: 'status' },
          align: 'center'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          width: '100',
          align: 'center',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      list: [],
      showAddModal: false,
      showEditModal: false,
      total: 0,
      selectedRowKeys: [],
      selectedRows: [],
      reports: [],
      // 高级搜索 展开/关闭
      advanced: false,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      ids: [],
      projectOptions: [
        {
          id: '1',
          project: '测试项目1'
        },
        {
          id: '2',
          project: '测试项目2'
        }
      ]
    }
  },
  created() {
    this.getList()
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  methods: {
    getList() {
      this.loading = true
      this.$http.get('/ui/report').then((response) => {
        this.list = response.result.list
        this.list.map((item) => {
          item.operation = item.remark
        })
        this.total = response.result.total
        this.loading = false
      })
    },
    // 重命名
    editName(record) {
      this.showEditNameModal = true
      this.reForm.report = record.report
    },
    cancel() {
      this.showEditNameModal = false
    },
    // 提交重命名表单
    submitReportName() {
      this.$message.success('修改成功')
      this.showEditNameModal = false
      this.getList()
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      this.ids = this.selectedRows.map((item) => item.id)
      this.reports = this.selectedRows.map((item) => item.report)
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
          }
        }
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
    handleReportInfo(record) {
      this.$router.push({
        name: 'reportInfo',
        query: {
          id: record.id,
          aliveFrom: 'Report',
          title: '测试报告详情'
        }
      })
    },
    handleDelete(row) {
      var that = this
      // const projectids = row.id || this.ids
      const reports = row.report || this.reports
      this.$Modal.confirm({
        title: '确认删除所选中数据?',
        content: '当前选中为' + reports + '的数据',
        onOk() {
          return that.$message.success('删除成功', 3)
        },
        onCancel() {}
      })
    },
    handleQuery() {
      this.queryParam.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParam = {
        pageNum: 1,
        pageSize: 10,
        version: ''
      }
      this.handleQuery()
    }
  }
}
</script>

<style lang="less" scoped>
.report-status {
  padding: 2px 5px;
  color: #fff;
  border-radius: 5%;
}
</style>
