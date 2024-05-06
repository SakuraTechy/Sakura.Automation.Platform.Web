<template>
  <div>
    <a-card :bordered="false" style="margin-bottom: 10px">
      <div class="table-page-search-wrapper">
        <a-form :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-row :gutter="48">
            <a-col :md="6" :sm="24">
              <a-form-item label="环境名称">
                <a-input v-model="queryParam.environmentName" placeholder="请输入环境名称" allow-clear />
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
      <!-- 增加 -->
      <environment-add-form
        v-if="showAddModal"
        ref="environmentAddForm"
        :statusOptions="statusOptions"
        @ok="getList"
        @close="showAddModal = false"
      />
      <!-- 修改 -->
      <environment-edit-form
        v-if="showEditModal"
        ref="environmentEditForm"
        :statusOptions="statusOptions"
        @ok="getList"
        @close="showEditModal = false"
      />
      <!-- table表格 -->
      <advance-table
      :scroll="{ x: 1500, y: 500 }"
        :columns="columns"
        :data-source="list"
        title="环境管理"
        :loading="loading"
        rowKey="id"
        @refresh="getList"
        :components="isDragTable"
        bordered
        size="middle"
        tableKey="system-environment-index-table"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
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
          <a-button type="primary" size="small" @click="handleAdd()" v-hasPermi="['projectSetting:environment:add']">
            <a-icon type="plus" />新建环境
          </a-button>
          <a-button type="danger" :disabled="multiple" @click="handleDelete" v-hasPermi="['projectSetting:environment:delete']">
            <a-icon type="delete" />删除
          </a-button>
        </div>
        <span slot="sysProjectList" slot-scope="{ record }">
          {{ getProjectName(record.sysProjectList) }}
        </span>
        <span slot="createTime" slot-scope="{ record }">
          {{ parseTime(record.createTime) }}
        </span>
        <span slot="updateTime" slot-scope="{ record }">
          {{ parseTime(record.updateTime) }}
        </span>
        <span slot="operation" slot-scope="{ record }">
          <a @click="handleUpdate(record, undefined)" v-hasPermi="['projectSetting:environment:edit']"> 修改 </a>
          <a-divider type="vertical" v-hasPermi="['projectSetting:environment:delete']" />
          <a @click="handleDelete(record)" v-hasPermi="['projectSetting:environment:delete']"> 删除 </a>
        </span>
      </advance-table>
    </a-card>
  </div>
</template>

<script>
import EnvironmentEditForm from './modules/EnvironmentEditForm'
import EnvironmentAddForm from './modules/EnvironmentAddForm'
import { getEnvironmentList, deleteEnvironment,getAllProject } from '@/api/project'
import AdvanceTable from '@/components/pt/table/AdvanceTable'
export default {
  name: 'Environment',
  components: { AdvanceTable, EnvironmentEditForm, EnvironmentAddForm },
  data() {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      loading: false,
      queryParam: {
        pageNum: 1,
        pageSize: 10,
        environmentName: ''
      },
      columns: [
        {
          title: '所属项目',
          dataIndex: 'sysProjectList',
          ellipsis: true,
          width:200,
          scopedSlots: { customRender: 'sysProjectList' },
          align: 'center'
        },
        {
          title: '环境名称',
          width:200,
          dataIndex: 'environmentName',
          ellipsis: true,
          align: 'center'
        },
         {
          title: '环境域名',
          width:200,
          dataIndex: 'environmentDomain',
          align: 'center',
          ellipsis: true
        },
        {
          title: '创建人',
          width:160,
          dataIndex: 'createByName',
          align: 'center'
        },
        {
          title: '创建时间',
          width:200,
          dataIndex: 'createTime',
          ellipsis: true,
          scopedSlots: { customRender: 'createTime' },
          align: 'center'
        },
        {
          title: '更新时间',
          width:200,
          dataIndex: 'updateTime',
          ellipsis: true,
          scopedSlots: { customRender: 'updateTime' },
          align: 'center'
        },
        {
          title: '操作',
          dataIndex: 'operation',
           fixed:'right',
          width:200,
          scopedSlots: { customRender: 'operation' },
          align: 'center'
        }
      ],
      list: [],
      showAddModal: false,
      showEditModal: false,
      projectOptions:[],
      total: 0,
      selectedRowKeys: [],
      selectedRows: [],
      environmentNames: [],
      statusOptions: [],
      // 高级搜索 展开/关闭
      advanced: false,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      ids: []
    }
  },
  computed:{
    isDragTable() {
      return this.dragTable(this.columns)
    }
  },
  created() {
    this.getAllProjectList()
    this.getList()
  },
  methods: {
    getList () {
      this.showAddModal = false
      this.showEditModal = false
      this.loading = true
      getEnvironmentList(this.queryParam).then(response => {
          this.list = response.data.list
          this.total = response.data.total
          this.loading = false
        }
      )
    },
    // 获取所有项目
    getAllProjectList() {
      getAllProject().then((response) => {
        this.projectOptions = response.data
      })
    },
  //  获取项目名称
   getProjectName(projectList) {
    let arr = []
    projectList.map((item,index) => {
      arr.push(this.findNodeId(this.projectOptions,item.id,'projectName'))
    })
    return arr.join(',')
   },
   handleQuery () {
      this.queryParam.pageNum = 1
      this.getList()
    },
   /** 重置按钮操作 */
    resetQuery () {
      this.dateRange = []
      this.queryParam = {
       pageNum: 1,
       pageSize: 10,
       environmentName: ''
      }
      this.handleQuery()
    },
     onShowSizeChange (current, pageSize) {
      this.queryParam.pageSize = pageSize
      this.getList()
    },
    onSizeChange (current, size) {
      this.queryParam.pageNum = 1
      this.queryParam.pageSize = size
      this.getList()
    },
    changeSize (current, pageSize) {
      this.queryParam.pageNum = current
      this.queryParam.pageSize = pageSize
      this.getList()
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      this.ids = this.selectedRows.map(item => item.id)
      this.environmentNames = this.selectedRows.map(item => item.environmentName)
      this.single = selectedRowKeys.length !== 1
      this.multiple = !selectedRowKeys.length
    },
    onClickRow (record) {
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
    handleUpdate (record, ids) {
      this.showEditModal = true
      this.$nextTick(() => (
        this.$refs.environmentEditForm.handleUpdate(record, ids)
      ))
    },
    handleDelete (row) {
      var that = this
      const ids = row.id || this.ids
      const environmentNames = row.environmentName || this.environmentNames
      this.$Modal.confirm({
        title: '确认删除所选中数据?',
        content: '当前选中为' + environmentNames + '的数据',
        onOk () {
          return deleteEnvironment(ids).then(() => {
            that.getList()
            that.$message.success(
                '删除成功',
              )
          })
        },
        onCancel () {}
      })
    },
    handleAdd (record) {
      this.showAddModal = true
      this.$nextTick(() => (
        this.$refs.environmentAddForm.handleAdd(record)
      ))
    },
    handleExport() {}
  }
}
</script>

<style lang="less" scoped>
</style>
