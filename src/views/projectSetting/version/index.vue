<template>
  <div>
    <a-card :bordered="false" style="margin-bottom: 10px">
      <div class="table-page-search-wrapper">
        <a-form :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-row :gutter="48">
            <a-col :md="6" :sm="24">
              <a-form-item label="版本名称">
                <a-input v-model="queryParam.versionName" placeholder="请输入版本名称" allow-clear />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="所属项目" prop="projectId">
                <a-select v-model="queryParam.projectId" placeholder="请选择项目" option-filter-prop="children" allow-clear>
                  <a-select-option v-for="(d, index) in projectOptions" :key="index" :value="d.id">
                    {{ d.projectName }}
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
      <!-- 增加 -->
      <version-add-form
        v-if="showAddModal"
        ref="versionAddForm"
        @ok="getList"
        :projectOptions="projectOptions"
        @close="showAddModal = false"
      />
      <!-- 修改 -->
      <version-edit-form
        v-if="showEditModal"
        ref="versionEditForm"
        :projectOptions="projectOptions"
        @ok="getList"
        @close="showEditModal = false"
      />
      <!-- table表格 -->
      <advance-table
        :scroll="{ x: 1500, y: 500 }"
        :columns="columns"
        :data-source="list"
        title="版本管理"
        :loading="loading"
        rowKey="id"
        @refresh="getList"
        :components="isDragTable"
        bordered
        size="middle"
        tableKey="system-project-index-table"
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
          <a-button type="primary" size="small" @click="handleAdd()" v-hasPermi="['projectSetting:version:add']">
            <a-icon type="plus" />创建版本
          </a-button>
          <a-button
            type="danger"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['projectSetting:version:delete']"
          >
            <a-icon type="delete" />删除
          </a-button>
        </div>
        <span slot="status" slot-scope="{ record }">
          <a-switch
            :checked="record.status === '0' ? true : false"
            @change="onChangeStatus(record)"
            :disabled="record.isLatest === '0' ? true : false"
          />
        </span>
        <span slot="isLatest" slot-scope="{ record }">
          <a-switch
            :checked="record.isLatest === '0' ? true : false"
            :disabled="record.isLatest === '0' ? true : false"
            @change="onChangeCurrentStatus(record)"
          />
        </span>
        <span slot="projectId" slot-scope="{ record }">
          {{ findNodeId(projectOptions, record.projectId, 'projectName') }}
        </span>
        <span slot="createTime" slot-scope="{ record }">
          {{ parseTime(record.createTime) }}
        </span>
        <span slot="publishTime" slot-scope="{ record }">
          {{ parseTime(record.publishTime) }}
        </span>
        <span slot="startTime" slot-scope="{ record }">
          {{ parseTime(record.startTime) }}
        </span>
        <span slot="endTime" slot-scope="{ record }">
          {{ parseTime(record.endTime) }}
        </span>
        <span slot="operation" slot-scope="{ record }">
          <a @click="handleUpdate(record, undefined)" v-hasPermi="['projectSetting:version:edit']"> 编辑 </a>
          <a-divider type="vertical" v-hasPermi="['projectSetting:version:delete']" v-show="record.isLatest !== '0'" />
          <a
            @click="handleDelete(record)"
            v-show="record.isLatest !== '0'"
            v-hasPermi="['projectSetting:version:delete']"
          >
            删除
          </a>
        </span>
      </advance-table>
    </a-card>
  </div>
</template>

<script>
import AdvanceTable from '@/components/pt/table/AdvanceTable'
import VersionAddForm from './modules/VersionAddForm.vue'
import VersionEditForm from './modules/VersionEditForm.vue'
import { getVersionList, getAllProject, deleteVersion, changeVersionStatus, setLatestVersion } from '@/api/project'
export default {
  name: 'Version',
  components: { AdvanceTable, VersionAddForm, VersionEditForm },
  data() {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      loading: false,
      queryParam: {
        pageNum: 1,
        pageSize: 10,
        versionName: '',
        projectId: '',
      },
      columns: [
         {
          title: '所属项目',
          dataIndex: 'projectId',
          ellipsis: true,
          scopedSlots: { customRender: 'projectId' },
          width:250,
          align: 'center',
        },
        {
          title: '版本',
          dataIndex: 'versionName',
          width:200,
          ellipsis: true,
          align: 'center',
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
          width:160,
          align: 'center',
        },
        {
          title: '最新版',
          dataIndex: 'isLatest',
          width:200,
          scopedSlots: { customRender: 'isLatest' },
          align: 'center',
        },
        {
          title: '开始时间',
          dataIndex: 'startTime',
          width:200,
          ellipsis: true,
          scopedSlots: { customRender: 'startTime' },
          align: 'center',
        },
        {
          title: '结束时间',
          dataIndex: 'endTime',
          width:200,
          ellipsis: true,
          scopedSlots: { customRender: 'endTime' },
          align: 'center',
        },
        {
          title: '发布时间',
          dataIndex: 'publishTime',
          width:200,
          ellipsis: true,
          scopedSlots: { customRender: 'publishTime' },
          align: 'center',
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width:200,
          ellipsis: true,
          scopedSlots: { customRender: 'createTime' },
          align: 'center',
        },
        {
          title: '创建人',
          dataIndex: 'createByName',
          width:160,
          align: 'center',
        },
        {
          title: '操作',
          dataIndex: 'operation',
          width:200,
          fixed: 'right',
          align: 'center',
          scopedSlots: { customRender: 'operation' },
        },
      ],
      list: [],
      showAddModal: false,
      showEditModal: false,
      total: 0,
      selectedRowKeys: [],
      selectedRows: [],
      versions: [],
      // 高级搜索 展开/关闭
      advanced: false,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      ids: [],
      projectOptions: [],
    }
  },
  created() {
    this.getAllProjectList()
    this.getList()
  },
  
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
        getCheckboxProps: (record) => ({
          props: {
            disabled: record.isLatest === '0', // Column configuration not to be checked
            name: record.versionName,
          },
        }),
      }
    },
    isDragTable() {
      return this.dragTable(this.columns)
    }
  },
  methods: {
    getList() {
      this.showAddModal = false
      this.showEditModal = false
      this.loading = true
      getVersionList(this.queryParam).then((response) => {
        this.list = response.data.list
        this.total = response.data.total
      }).finally(
        this.loading = false
      )
    },
    // 获取所有项目
    getAllProjectList() {
      getAllProject().then((response) => {
        this.projectOptions = response.data
      })
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      this.ids = this.selectedRows.map((item) => item.id)
      this.versions = this.selectedRows.map((item) => item.versionName)
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
    // 改变版本开启关闭状态
    onChangeStatus(record) {
      // 调用后台接口改变版本状态
      changeVersionStatus(record.id).then((response) => {
        this.$message.success('修改成功')
        this.getList()
      })
    },
    // 是否开启最新版
    onChangeCurrentStatus(record) {
      const {projectId,versionName,id} = record
      const data = {
        projectId,
        versionName,
        id
      }
      // 调用接口改变版本是否为最新版本
      setLatestVersion(data).then((response) => {
        this.$message.success('设置成功')
        this.getList()
      })
    },
    // 创建版本
    handleAdd(record) {
      this.showAddModal = true
      this.$nextTick(() => this.$refs.versionAddForm.handleAdd(record))
    },
    // 更新版本
    handleUpdate(record) {
      this.showEditModal = true
      this.$nextTick(() => this.$refs.versionEditForm.handleUpdate(record))
    },
    handleDelete(row) {
      var that = this
      const ids = row.id || this.ids
      const versions = row.versionName || this.versions
      this.$Modal.confirm({
        title: '确认删除所选中数据?',
        content: '当前选中为' + versions + '的数据',
        onOk() {
          return deleteVersion(ids).then(() => {
            that.getList()
            that.$message.success('删除成功')
          })
        },
        onCancel() {},
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
        version: '',
      }
      this.handleQuery()
    },
  },
}
</script>

<style lang="less" scoped>
.advanced-table {
  min-height: calc(94vh - 240px);
}
</style>
