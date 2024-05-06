<template>
  <div>
    <a-card :bordered="false" style="margin-bottom: 10px">
        <div class="table-page-search-wrapper">
        <a-form :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-row :gutter="48">
            <a-col :md="6" :sm="24">
              <a-form-item label="配置名称">
                <a-input v-model="queryParam.configName" placeholder="请输入配置名称" allow-clear />
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
      <advance-table
      :scroll="{ x: 1500, y: 500 }"
        :columns="columns"
        :data-source="list"
        title="配置管理"
        :loading="loading"
        rowKey="id"
        @refresh="getList"
        :components="isDragTable"
        bordered
        size="middle"
        tableKey="system-config-manage-index-table"
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
          <a-button type="primary" size="small" @click="handleAdd()">
            <a-icon type="plus" />新建配置
          </a-button>
          <a-button type="danger" :disabled="multiple" @click="handleDelete">
            <a-icon type="delete" />删除
          </a-button>
        </div>
        <span slot="createTime" slot-scope="{ record }">
          {{ parseTime(record.createTime) }}
        </span>
        <span slot="updateTime" slot-scope="{ record }">
          {{ parseTime(record.updateTime) }}
        </span>
        <span slot="operation" slot-scope="{ record }">
          <a @click="handleUpdate(record, undefined)"> 修改 </a>
          <a-divider type="vertical"/>
          <a @click="handleDelete(record)"> 删除 </a>
        </span>
      </advance-table>
        <!-- 增加 -->
      <config-add-form
        v-if="showAddModal"
        ref="configAddForm"
        @ok="getList"
        @close="showAddModal = false"
      />
      <!-- 修改 -->
      <config-edit-form
        v-if="showEditModal"
        ref="configEditForm"
        @ok="getList"
        @close="showEditModal = false"
      />
     </a-card>
  </div>
</template>

<script>
import AdvanceTable from '@/components/pt/table/AdvanceTable'
import ConfigAddForm from './modules/ConfigAddForm.vue'
import ConfigEditForm from './modules/ConfigEditForm.vue'
import {getConfigurationList,deleteConfiguration} from '@/api/project'
export default {
  name: 'ConfigManage',
  components: { AdvanceTable,ConfigAddForm,ConfigEditForm},
  data() {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      loading: false,
      queryParam: {
        pageNum: 1,
        pageSize: 10,
        configName: ''
      },
      columns: [
        {
          title: '配置名称',
          dataIndex: 'configName',
          ellipsis: true,
          width:200,
          align: 'center'
        },
         {
          title: '参数名称',
          dataIndex: 'paramsName',
          align: 'center',
           width:200,
          ellipsis: true
        },
         {
          title: '参数值',
           width:200,
          dataIndex: 'paramsValue',
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
           width:200,
           fixed:'right',
          scopedSlots: { customRender: 'operation' },
          align: 'center'
        }
      ],
      list: [],
      showAddModal: false,
      showEditModal: false,
      total: 0,
      selectedRowKeys: [],
      selectedRows: [],
      configNames: [],
      // 高级搜索 展开/关闭
      advanced: false,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      ids: []
    }
  },
  created() {
    this.getList()
  },
   computed:{
    isDragTable() {
      return this.dragTable(this.columns)
    }
  },
  methods: {
    getList () {
      this.showAddModal = false
      this.showEditModal = false
      this.loading = true
      getConfigurationList(this.queryParam).then(response => {
          this.list = response.data.list
          this.total = response.data.total
          this.loading = false
        }
      )
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
       configName: ''
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
      this.configNames = this.selectedRows.map(item => item.configName)
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
        this.$refs.configEditForm.handleUpdate(record, ids)
      ))
    },
    handleDelete (row) {
      var that = this
      const ids = row.id || this.ids
      const configNames = row.configName || this.configNames
      this.$Modal.confirm({
        title: '确认删除所选中数据?',
        content: '当前选中为' + configNames + '的数据',
        onOk () {
          return deleteConfiguration(ids).then(() => {
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
        this.$refs.configAddForm.handleAdd(record)
      ))
    },
    handleExport() {}
  }
}
</script>

<style lang="less" scoped>
</style>
