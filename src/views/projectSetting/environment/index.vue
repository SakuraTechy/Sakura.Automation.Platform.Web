<template>
  <div>
  <a-card :bordered="false">
    <a-tabs v-model="activeKey" default-active-key="1" type="editable-card" hide-add @edit="onEdit">
      <a-tab-pane key="1" tab="环境列表" :closable="false">
        <div class="title-wrapper">环境列表</div>
        <SearchControl :queryData="queryData" @handleQuery="handleQuery" @resetQuery="resetQuery"  />
        <a-divider></a-divider>
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
          tableKey="system-environment-index-table"
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
              <a-button type="primary" size="small" @click="handleAdd()" style="margin-right: 16px; " v-hasPermi="['projectSetting:environment:add']">
                <a-icon type="plus" />新建
              </a-button>
              <a-button size="small" @click="handleImport" v-hasPermi="['projectSetting:environment:add']">
                <a-icon type="upload" />批量导入
              </a-button>
            </div>
            <a-button size="small" @click="handleExport" v-hasPermi="['projectSetting:environment:add']">
              <a-icon type="download" />下载
            </a-button>
          </div>
          <span slot="sysProjectList" slot-scope="{ record }">
            {{ getProjectName(record.sysProjectList) }}
          </span>
          <span slot="status" slot-scope="{ record }">
            <a-switch :default-checked="Boolean(record.status)" />
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
            <a-divider type="vertical" v-hasPermi="['projectSetting:environment:edit']" />
            <a @click="handleUpdate(record)" v-hasPermi="['projectSetting:environment:edit']"> 查看 </a>
            <a-divider type="vertical" v-hasPermi="['projectSetting:environment:edit']" />
            <a @click="handleUpdate(record)" v-hasPermi="['projectSetting:environment:edit']"> 下载 </a>
          </span>
        </advance-table>
      </a-tab-pane>
      <a-tab-pane v-for="(item, index) in panes" :key="(index + 2).toString()" :tab="item.title" :closable="true">
        <EnvConfig></EnvConfig>
      </a-tab-pane>
    </a-tabs>
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
  </a-card>
  </div>
</template>

<script>
import EnvironmentEditForm from './modules/EnvironmentEditForm'
import EnvironmentAddForm from './modules/EnvironmentAddForm'
import { getEnvironmentList, deleteEnvironment,getAllProject } from '@/api/project'
import AdvanceTable from '@/components/pt/table/AdvanceTable'
import SearchControl from '../components/SearchControl.vue'
import EnvConfig from './modules/EnvConfig.vue'
export default {
  name: 'Environment',
  components: { AdvanceTable, EnvironmentEditForm, EnvironmentAddForm, SearchControl, EnvConfig },
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
          title: '所属项目',
          dataIndex: 'sysProjectList',
          ellipsis: true,
          width:250,
          scopedSlots: { customRender: 'sysProjectList' },
          align: 'center'
        },
        {
          title: '环境名称',
          width:160,
          dataIndex: 'name',
          ellipsis: true,
          align: 'center'
        },
        {
          title: '所属项目',
          dataIndex: 'sysProjectList',
          ellipsis: true,
          width:160,
          // scopedSlots: { customRender: 'sysProjectList' },
          align: 'center'
        },
         {
          title: '环境域名',
          width:200,
          dataIndex: 'domains',
          align: 'center',
          ellipsis: true
        },
        {
          title: '环境版本',
          width:160,
          dataIndex: 'version',
          align: 'center'
        },
        {
          title: '启用状态',
          width:160,
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
          align: 'center'
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
      ids: [],
      queryData: [
        {
          label: '环境ID',
          value: 'id',
        },
        {
          label: '环境名称',
          value: 'environmentName',
        },
        {
          label: '所属项目',
          value: 'projectId',
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
      ],
      panes: [
      { title: '新增环境配置'},
      { title: '新增环境配置'},
      ],
      activeKey: '2'
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
      this.panes.push({title: '新增环境配置'})
      this.activeKey = (this.panes.length + 1).toString()
    },
    handleExport() {},
    handleImport() {},
    onEdit(targetKey, action){
      this[action](targetKey);
    },
    remove(targetKey){
      console.log(targetKey,'name');
      console.log(typeof targetKey,'targetKey');
      this.panes.splice(targetKey - 2, 1)
      this.activeKey = '1'
    }
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
