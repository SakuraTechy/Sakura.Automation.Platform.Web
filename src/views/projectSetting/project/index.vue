<template>
  <div>
    <a-card :bordered="false" style="margin-bottom: 10px">
      <div class="title-wrapper">项目列表</div>
      <SearchControl :queryData="queryData" @handleQuery="handleQuery" @resetQuery="resetQuery"  />
    </a-card>
    <a-card :bordered="false" class="table-card">
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
        :needTitle="false"
      >
        <div class="table-operations" slot="button">
          <div>
            <a-button type="primary" size="small" @click="handleAdd()" style="margin-right: 16px; " v-hasPermi="['projectSetting:project:add']">
              <a-icon type="plus" />新建
            </a-button>
            <a-button size="small" @click="handleImport" v-hasPermi="['projectSetting:project:add']">
              <a-icon type="upload" />批量导入
            </a-button>
          </div>
          <a-button size="small" @click="handleExport" v-hasPermi="['projectSetting:project:add']">
            <a-icon type="download" />下载
          </a-button>
        </div>
        <span slot="createTime" slot-scope="{ record }">
          {{ parseTime(record.createTime) }}
        </span>
         <span slot="members" slot-scope="{ record }">
            <div v-if="record.memberList && record.memberList.length === 0">暂无成员</div>
            <a v-else>查看</a>
        </span>
        <span slot="updateTime" slot-scope="{ record }">
          {{ parseTime(record.updateTime) }}
        </span>
        <span slot="operation" slot-scope="{ record }">
          <a @click="handleUpdate(record)" v-hasPermi="['projectSetting:project:edit']"> 修改 </a>
          <a-divider type="vertical" v-show="record.id!=='1'" v-hasPermi="['projectSetting:project:delete']" />
          <a @click="handleDelete(record)" v-show="record.id!=='1'" v-hasPermi="['projectSetting:project:delete']"> 删除 </a>
          <a-divider type="vertical" v-hasPermi="['projectSetting:project:config']" />
          <a @click="handleSetting(record, undefined)" v-hasPermi="['projectSetting:project:config']"> 环境配置 </a>
          <a-divider type="vertical" v-hasPermi="['projectSetting:project:config']" />
          <a @click="handleSetting(record, undefined)" v-hasPermi="['projectSetting:project:config']"> 自动化配置 </a>
        </span>
      </advance-table>
      <!-- 增加 -->
      <project-add-form
        v-if="showAddModal"
        ref="projectAddForm"
        :statusOptions="statusOptions"
        @ok="getList"
        @close="showAddModal = false"
      />
      <!-- 修改 -->
      <project-edit-form
        v-if="showEditModal"
        ref="projectEditForm"
        :statusOptions="statusOptions"
        @ok="getList"
        @close="showEditModal = false"
      />
      <project-setting-form
        v-if="showSettingModal"
        ref="projectSettingForm"
        :statusOptions="statusOptions"
        @ok="getList"
        @close="showSettingModal = false"
      />
    </a-card>
  </div>
</template>

<script>
import ProjectEditForm from './modules/ProjectEditForm'
import { getProjectList,deleteProject } from '@/api/project'
import ProjectAddForm from './modules/ProjectAddForm'
import ProjectSettingForm from './modules/ProjectSettingForm.vue'
import AdvanceTable from '@/components/pt/table/AdvanceTable'
import SearchControl from '../components/SearchControl.vue'
export default {
  name: 'Project',
  components: { AdvanceTable, ProjectEditForm, ProjectAddForm, ProjectSettingForm, SearchControl },
  data() {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      loading: false,
      queryParam: {
        pageNum: 1,
        pageSize: 10,
      },
      columns: [
        {
          title: '名称',
          dataIndex: 'projectName',
          width:250,
          ellipsis: true,
          align: 'center'
        },
        {
          title: '项目名称',
          dataIndex: 'name',
          width:200,
          ellipsis: true,
          align: 'center'
        },
        {
          title: '项目简称',
          width:200,
          dataIndex: 'abbreviate',
          ellipsis: true,
          align: 'center'
        },
        {
          title: '项目域名',
          width:200,
          dataIndex: 'lastDomain',
          ellipsis: true,
          align: 'center'
        },
        {
          title: '项目版本',
          dataIndex: 'lastVersion',
          width:160,
          align: 'center'
        },
        {
          title: '成员',
          width: 120,
          scopedSlots: { customRender: 'members' },
          align: 'center'
        },
        {
          title: '创建人',
          width:100,
          dataIndex: 'createByName',
          align: 'center'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width:200,
          ellipsis: true,
          scopedSlots: { customRender: 'createTime' },
          align: 'center'
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime',
          width:200,
          ellipsis: true,
          scopedSlots: { customRender: 'updateTime' },
          align: 'center'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          fixed:'right',
          width:280,
          scopedSlots: { customRender: 'operation' },
          align: 'center'
        }
      ],
      list: [],
      showAddModal: false,
      showEditModal: false,
      showSettingModal: false,
      total: 0,
      selectedRowKeys: [],
      selectedRows: [],
      projectNames: [],
      statusOptions: [],
      // 高级搜索 展开/关闭
      advanced: false,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      ids: [],
      queryData: [
        {
          label: '项目ID',
          value: 'id',
        },
        {
          label: '项目名称',
          value: 'projectName',
        },
        {
          label: '项目简称',
          value: 'abbreviate',
        },
        {
          label: '启用状态',
          value: 'status',
        },
        {
          label: '创建人',
          value: 'createByName',
        },
        {
          label: '创建时间',
        }
      ]
    }
  },
  computed: {
     rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
        getCheckboxProps: record => ({
          props: {
            disabled: record.id === '1', // Column configuration not to be checked
            name: record.projectName
          }
        })
      }
     },
      isDragTable() {
      return this.dragTable(this.columns)
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList () {
      this.showAddModal = false
      this.showEditModal = false
      this.loading = true
      getProjectList(this.queryParam).then(response => {
        this.list = response.data.list
        console.log(this.list,'list');
        this.total = response.data.total
      }).finally(
        this.loading = false
      )
    },
   handleQuery (value) {
      if(value === undefined){
        this.queryParam = {
          pageNum: 1,
          pageSize: 10,
        }
        this.getList()
      } else {
        this.queryParam = Object.assign(this.queryParam, value)
        this.queryParam.pageNum = 1
        this.getList()
      }
    },
   /** 重置按钮操作 */
    resetQuery () {
      this.queryParam = {
       pageNum: 1,
       pageSize: 10,
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
      this.projectNames = this.selectedRows.map(item => item.projectName)
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
    handleUpdate (record) {
      this.showAddModal = true
      this.$nextTick(() => (
        this.$refs.projectAddForm.handleUpdate(record)
      ))
    },
    handleSetting(record, ids) {
      this.showSettingModal = true
      this.$nextTick(() => (
        this.$refs.projectSettingForm.handleSetting(record, ids)
      ))
    },
    handleDelete (row) {
      var that = this
      const ids = row.id || this.ids
      console.log(ids);
      const projectNames = row.name || this.projectNames
      this.$Modal.confirm({
        title: '确认删除所选中数据?',
        content: '当前选中为' + projectNames + '的项目',
        onOk () {
          return deleteProject(ids).then(() => {
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
        this.$refs.projectAddForm.handleAdd(record)
      ))
    },
    handleExport() {},
    handleImport() {}
  }
}
</script>

<style lang="less" scoped>
.title-wrapper {
  padding: 20px 0 0 20px;
  font-size: 16px;
  font-weight: 400;
  color: #101010;
}
.table-operations {
  display: flex;
  justify-content: space-between;
}
</style>
