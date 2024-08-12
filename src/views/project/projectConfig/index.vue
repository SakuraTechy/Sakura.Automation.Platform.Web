<template>
  <div>
    <a-card :bordered="false" style="width: 100%;height: 160px;margin-bottom: 16px">
      <div class="title-wrapper">项目列表</div>
      <SearchControl :queryData="queryData" @handleQuery="handleQuery" @resetQuery="resetQuery" />
    </a-card>
    <!-- <a-card :bordered="false" class="table-card" style="height: 100px"> -->
    <a-card :bordered="false" class="container">
      <!-- table表格 -->
      <advance-table :scroll="{ x: 1500, y: 500 }" :columns="columns" :data-source="list" :loading="loading" rowKey="id"
        @refresh="getList" :components="isDragTable" bordered size="middle" tableKey="system-project-index-table"
        :format-conditions="true" :pagination="{
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
          }" :row-selection="rowSelection" :needTitle="false">
        <div class="table-operations" slot="button">
          <a-button type="primary" @click="handleAdd()" v-hasPermi="['project:projectConfig:add']">
            <a-icon type="plus-square" />新建项目
          </a-button>
          <a-space :size="8" style="margin-right: 8px">
            <a-button type="primary" @click="handleImport" v-hasPermi="['project:projectConfig:export']">
              <a-icon type="upload" />批量导入
            </a-button>
            <a-button type="danger" :disabled="multiple" @click="handleExport"
              v-hasPermi="['project:projectConfig:export']">
              <a-icon type="download" />批量导出
            </a-button>
            <a-button type="danger" :disabled="multiple" @click="handleDelete"
              v-hasPermi="['project:projectConfig:remove']">
              <a-icon type="delete" />批量删除
            </a-button>
          </a-space>
        </div>
        <span slot="status" slot-scope="{ record }">
          <a-switch :checked="Boolean(record.status)" @change="(value) => onchange(record, value)" />
        </span>
        <span slot="members" slot-scope="{ record }">
          <div v-if="record.memberList && record.memberList.length === 0">暂无成员</div>
          <a-popover v-else title="项目成员">
            <template slot="content">
              <p v-for="member in record.memberList" :key="member.key">{{ member.name }}</p>
            </template>
            <a>查看</a>
          </a-popover>
        </span>
        <span slot="createTime" slot-scope="{ record }">
          {{ parseTime(record.createTime) }}
        </span>
        <span slot="updateTime" slot-scope="{ record }">
          {{ parseTime(record.updateTime) }}
        </span>
        <span slot="operation" slot-scope="{ record }">
          <a @click="handleUpdate(record)" v-hasPermi="['project:projectConfig:edit']"> 修改 </a>
          <a-divider type="vertical" v-show="record.id !== '1'" v-hasPermi="['project:projectConfig:remove']" />
          <a @click="handleDelete(record)" v-show="record.id !== '1'" v-hasPermi="['project:projectConfig:remove']"> 删除
          </a>
          <a-divider type="vertical" />
          <a @click="handleEnvironmentConfig(record)" v-hasPermi="['project:environmentConfig:list']"> 环境配置 </a>
          <a-divider type="vertical"/>
          <a @click="handleAutomationConfig(record)" v-hasPermi="['project:automationConfig:list']"> 自动化配置 </a>
        </span>
      </advance-table>
      <!-- 增加 -->
      <project-add-form v-if="showAddModal" ref="projectAddForm" :statusOptions="statusOptions" @ok="getList"
        @close="showAddModal = false" />
      <!-- 修改 -->
      <project-edit-form v-if="showEditModal" ref="projectEditForm" :statusOptions="statusOptions" @ok="getList"
        @close="showEditModal = false" />
    </a-card>
  </div>
</template>

<script>
import Vue from 'vue'
import ProjectAddForm from './modules/ProjectAddForm'
import ProjectEditForm from './modules/ProjectEditForm'
import AdvanceTable from '@/components/pt/table/AdvanceTable'
import SearchControl from '../components/SearchControl.vue'
import { getProjectList, deleteProject, exportProject, updateProjectConfigStatus } from '@/api/project'

export default {
  name: 'Project',
  components: { AdvanceTable, ProjectAddForm, ProjectEditForm, SearchControl },
  data() {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      loading: false,
      queryParam: {
        pageNum: 1,
        pageSize: 10,
        orderByColumn: 'a.id, a.name',
        isAsc: 'asc'
      },
      columns: [
        {
          title: '项目ID',
          dataIndex: 'id',
          width: 270,
          ellipsis: true,
          fixed: 'left',
          align: 'center'
        },
        {
          title: '项目名称',
          dataIndex: 'name',
          width: 300,
          ellipsis: true,
          fixed: 'left',
          align: 'center'
        },
        {
          title: '项目简称',
          width: 113,
          dataIndex: 'abbreviate',
          ellipsis: true,
          fixed: 'left',
          align: 'center'
        },
        {
          title: '项目域名',
          width: 250,
          dataIndex: 'lastDomain',
          ellipsis: true,
          align: 'center'
        },
        {
          title: '主线版本',
          dataIndex: 'lastVersion',
          width: 150,
          align: 'center'
        },
        {
          title: '项目成员',
          width: 100,
          scopedSlots: { customRender: 'members' },
          align: 'center'
        },
        {
          title: '启用状态',
          width: 100,
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
          align: 'center'
        },
        {
          title: '创建人',
          width: 80,
          dataIndex: 'createByName',
          align: 'center'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: 160,
          ellipsis: true,
          scopedSlots: { customRender: 'createTime' },
          align: 'center'
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime',
          width: 160,
          ellipsis: true,
          scopedSlots: { customRender: 'updateTime' },
          align: 'center'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          fixed: 'right',
          width: 300,
          scopedSlots: { customRender: 'operation' },
          align: 'center'
        }
      ],
      list: [],
      showAddModal: false,
      showEditModal: false,
      total: 0,
      ids: [],
      names: [],
      selectedRowKeys: [],
      selectedRows: [],
      statusOptions: [],
      // 高级搜索 展开/关闭
      advanced: false,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      queryData: [
        {
          label: '项目ID',
          value: 'id',
        },
        {
          label: '项目名称',
          value: 'name',
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
            disabled: record.id === '1',
            name: record.name
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
    getList() {
      this.showAddModal = false
      this.showEditModal = false
      this.loading = true
      getProjectList(this.queryParam).then(response => {
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
        // if (value.status === 2) {
        //   Vue.delete(value, 'status')
        // }
        // Vue.set(value,'status',value.status)
        this.queryParam = Object.assign(this.queryParam, value)
        this.queryParam.pageNum = 1
      }
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParam = {
        pageNum: 1,
        pageSize: 10,
      }
      this.handleQuery()
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
      this.ids = this.selectedRows.map(item => item.id)
      this.names = this.selectedRows.map(item => item.name)
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
    handleAdd() {
      this.showAddModal = true
      this.$nextTick(() => (
        this.$refs.projectAddForm.handleAdd()
      ))
    },
    handleUpdate(record) {
      this.showAddModal = true
      this.$nextTick(() => (
        this.$refs.projectAddForm.handleUpdate(record)
      ))
    },
    handleDelete(row) {
      var that = this
      row.id ? this.ids.push(row.id) : ''
      const ids = this.ids
      const names = row.name || this.names
      this.$Modal.confirm({
        title: '确认删除所选中数据?',
        content: '当前选中为' + names + '的项目',
        onOk() {
          return deleteProject({ ids })
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
    handleEnvironmentConfig(record) {
      // console.info(record)
      // this.showSettingModal = true
      // this.$nextTick(() => (
      //   this.$refs.projectSettingForm.handleSetting(record, ids)
      // ))
      this.$router.push({
        // path: '/project/environmentConfig',
        // query: {status: '1111'},
        name: 'EnvironmentConfig',
        params:{
          projectId: record.id
        }
      })
    },
    handleAutomationConfig(record) {
      this.$router.push({
        name: 'AutomationConfig',
        params:{
          type: 'web'
        }
      })
    },
    handleImport() {
    },
    handleExport(row) {
      var that = this
      const ids = row.id || this.ids
      const names = row.name || this.names
      this.$Modal.confirm({
        title: '确认导出所选中数据?',
        content: '当前选中为' + names + '的项目',
        onOk() {
          return exportProject(ids)
            .then((res) => {
              console.info(res)
              if (res.size > 0) {
                that.$message.success('导出成功')
                that.onSelectChange([], [])
              }
            })
            .catch((error) => {
              that.$message.error('导出失败', 3)
              reject(error)
            })
        }
      })
    },
    // 表格内-状态切换
    onchange({ id }, value) {
      let params = {
        id,
        status: Number(value)
      }
      updateProjectConfigStatus(params).then(() => {
        this.$message.success('修改成功')
        this.getList()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.title-wrapper {
  padding: 15px 0 0 15px;
  font-size: 16px;
  font-weight: 400;
  // font-family: 'Microsoft YaHei';
  color: #101010;
}

.container {
  width: 100%; /* 当前分辨率为1920x1080时，width为1676px */
  height: calc(100vh - 287px);
  // margin-top: -20px;
}

.table-operations {
  padding: 5px 0px 5px 0px;
  display: flex;
  justify-content: space-between;
}
</style>
